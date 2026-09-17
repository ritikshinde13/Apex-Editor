/**
 * Ultra-robust multi-strategy video & audio duration extraction utilities.
 * Solves Chromium's Blob URL `video.duration === Infinity` bug, fragmented MP4
 * lack of duration headers, and WebM unindexed streams.
 */

/**
 * Parses the ISO Base Media File Format (MP4 / QuickTime MOV / M4V)
 * to extract the exact duration directly from the movie header (`mvhd`) box.
 * Runs synchronously in ~1ms without relying on browser video decoders.
 */
export function parseMp4DurationFromBuffer(buffer: ArrayBuffer): number | null {
  try {
    const view = new DataView(buffer);
    const length = buffer.byteLength;
    let offset = 0;

    while (offset + 8 <= length) {
      let size = view.getUint32(offset);
      const type = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7)
      );

      let headerSize = 8;
      if (size === 1) {
        if (offset + 16 > length) break;
        const high = view.getUint32(offset + 8);
        const low = view.getUint32(offset + 12);
        size = high * 2 ** 32 + low;
        headerSize = 16;
      } else if (size === 0) {
        size = length - offset;
      }

      if (size < headerSize) break;

      if (type === 'moov') {
        const moovEnd = Math.min(length, offset + size);
        let subOffset = offset + headerSize;

        while (subOffset + 8 <= moovEnd) {
          let subSize = view.getUint32(subOffset);
          const subType = String.fromCharCode(
            view.getUint8(subOffset + 4),
            view.getUint8(subOffset + 5),
            view.getUint8(subOffset + 6),
            view.getUint8(subOffset + 7)
          );

          let subHeader = 8;
          if (subSize === 1) {
            if (subOffset + 16 > moovEnd) break;
            const high = view.getUint32(subOffset + 8);
            const low = view.getUint32(subOffset + 12);
            subSize = high * 2 ** 32 + low;
            subHeader = 16;
          } else if (subSize === 0) {
            subSize = moovEnd - subOffset;
          }

          if (subType === 'mvhd') {
            const mvhdDataOffset = subOffset + subHeader;
            if (mvhdDataOffset + 20 <= moovEnd) {
              const version = view.getUint8(mvhdDataOffset);
              let timescale = 0;
              let duration = 0;

              if (version === 0) {
                // version(1) + flags(3) + creation(4) + mod(4) = 12 bytes
                timescale = view.getUint32(mvhdDataOffset + 12);
                duration = view.getUint32(mvhdDataOffset + 16);
              } else if (version === 1) {
                // version(1) + flags(3) + creation(8) + mod(8) = 20 bytes
                timescale = view.getUint32(mvhdDataOffset + 20);
                const high = view.getUint32(mvhdDataOffset + 24);
                const low = view.getUint32(mvhdDataOffset + 28);
                duration = high * 2 ** 32 + low;
              }

              if (timescale > 0 && duration > 0) {
                const durationSeconds = duration / timescale;
                if (isFinite(durationSeconds) && durationSeconds > 0) {
                  return durationSeconds;
                }
              }
            }
          }

          if (subSize <= 0) break;
          subOffset += subSize;
        }
      }

      offset += size;
    }
  } catch (err) {
    console.warn('MP4 box parse internal error:', err);
  }

  return null;
}

/**
 * Extracts MP4 duration from File by checking both head and tail slices
 * (handles files where `moov` atom is at the end of the file).
 */
export async function parseMp4DurationFromFile(file: File): Promise<number | null> {
  try {
    // 1. Check head first (up to 4MB)
    const headSize = Math.min(file.size, 4 * 1024 * 1024);
    const headBuffer = await file.slice(0, headSize).arrayBuffer();
    const headDuration = parseMp4DurationFromBuffer(headBuffer);
    if (headDuration !== null && headDuration > 0) {
      return headDuration;
    }

    // 2. If moov was not in the head, check tail (last 4MB)
    if (file.size > headSize) {
      const tailStart = Math.max(0, file.size - 4 * 1024 * 1024);
      const tailBuffer = await file.slice(tailStart, file.size).arrayBuffer();
      const tailDuration = parseMp4DurationFromBuffer(tailBuffer);
      if (tailDuration !== null && tailDuration > 0) {
        return tailDuration;
      }
    }
  } catch (err) {
    console.warn('Failed parsing MP4 file duration:', err);
  }
  return null;
}

/**
 * Decodes the audio track using Web Audio API to obtain the mathematically exact duration.
 */
export async function extractAudioTrackDuration(file: File): Promise<number | null> {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      if (audioBuffer && isFinite(audioBuffer.duration) && audioBuffer.duration > 0) {
        return audioBuffer.duration;
      }
    } finally {
      ctx.close().catch(() => {});
    }
  } catch {
    // Video may have no audio or unsupported audio codec
  }
  return null;
}

/**
 * Resolves HTML5 video element duration by performing Chromium Infinity EOF seek if needed.
 */
export function resolveVideoElementDuration(
  video: HTMLVideoElement,
  timeoutMs: number = 3000
): Promise<number> {
  return new Promise((resolve) => {
    if (isFinite(video.duration) && video.duration > 0) {
      resolve(video.duration);
      return;
    }

    let resolved = false;
    const finish = (dur: number) => {
      if (resolved) return;
      resolved = true;
      video.removeEventListener('durationchange', onCheck);
      video.removeEventListener('timeupdate', onCheck);
      video.removeEventListener('seeked', onCheck);
      resolve(isFinite(dur) && dur > 0 ? dur : 0);
    };

    const onCheck = () => {
      if (isFinite(video.duration) && video.duration > 0) {
        finish(video.duration);
      }
    };

    video.addEventListener('durationchange', onCheck);
    video.addEventListener('timeupdate', onCheck);
    video.addEventListener('seeked', onCheck);

    // Force Chromium to compute duration by seeking towards Infinity
    try {
      video.currentTime = 1e101;
    } catch {
      // Ignored if seek throws
    }

    setTimeout(() => {
      finish(video.duration);
    }, timeoutMs);
  });
}
