/**
 * High-precision timecode calculation utilities for non-linear video editing.
 */

export function secondsToFrames(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}

export function framesToSeconds(frames: number, fps: number): number {
  return frames / fps;
}

/**
 * Formats time in seconds to standard SMPTE timecode (HH:MM:SS:FF)
 */
export function formatTimecode(seconds: number, fps: number = 30): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;

  const totalFrames = Math.floor(seconds * fps);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(seconds);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

/**
 * Formats time in seconds to a compact display (MM:SS.SS)
 */
export function formatCompactTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;

  const totalSeconds = Math.floor(seconds);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60);
  const ms = Math.round((seconds % 1) * 100) % 100;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(m)}:${pad(s)}.${pad(ms)}`;
}

/**
 * Parses SMPTE timecode string back to seconds
 */
export function parseTimecode(tc: string, fps: number = 30): number {
  const parts = tc.split(':').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(isNaN)) {
    return 0;
  }
  const [h, m, s, f] = parts;
  return h * 3600 + m * 60 + s + f / fps;
}
