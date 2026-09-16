import { ExportOptions, IExportEngine } from './IExportEngine';
import { TimelineClip, TimelineTrack } from '@/types/timeline';
import { MediaItem } from '@/types/media';
import { Compositor } from '../engine/Compositor';

export class StreamExporter implements IExportEngine {
  private isCancelled: boolean = false;
  private recorder: MediaRecorder | null = null;
  private tracks: TimelineTrack[];
  private clips: TimelineClip[];
  private mediaItems: MediaItem[];
  private duration: number;

  constructor(
    tracks: TimelineTrack[],
    clips: TimelineClip[],
    mediaItems: MediaItem[],
    duration: number
  ) {
    this.tracks = tracks;
    this.clips = clips;
    this.mediaItems = mediaItems;
    this.duration = Math.max(1.0, duration);
  }

  public cancelExport(): void {
    this.isCancelled = true;
    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
  }

  public async startExport(
    options: ExportOptions,
    onProgress: (percent: number) => void
  ): Promise<Blob> {
    this.isCancelled = false;

    // Create offscreen export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = options.width;
    exportCanvas.height = options.height;

    const compositor = new Compositor(exportCanvas);

    // Audio stream destination
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioCtx();
    const dest = audioCtx.createMediaStreamDestination();

    // Determine mimeType
    const mimeCandidates = [
      options.format === 'mp4' ? 'video/mp4;codecs=avc1,mp4a.40.2' : '',
      options.format === 'mp4' ? 'video/mp4' : '',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ].filter(Boolean);

    let selectedMime = 'video/webm';
    for (const mime of mimeCandidates) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    const videoStream = exportCanvas.captureStream(options.fps);
    const combinedTracks = [...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()];
    const combinedStream = new MediaStream(combinedTracks);

    const bitrateMap = {
      low: 2_500_000,
      medium: 6_000_000,
      high: 16_000_000,
    };

    const recordedChunks: Blob[] = [];

    this.recorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: bitrateMap[options.quality] || 6_000_000,
    });

    this.recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    return new Promise(async (resolve, reject) => {
      this.recorder!.onstop = () => {
        audioCtx.close().catch(() => {});
        compositor.dispose();

        if (this.isCancelled) {
          reject(new Error('Export was cancelled by user.'));
        } else {
          const finalBlob = new Blob(recordedChunks, { type: selectedMime });
          resolve(finalBlob);
        }
      };

      this.recorder!.onerror = (err) => {
        audioCtx.close().catch(() => {});
        compositor.dispose();
        reject(err);
      };

      this.recorder!.start(100);

      // Render timeline frame by frame at requested FPS
      const totalFrames = Math.ceil(this.duration * options.fps);
      const frameDelta = 1 / options.fps;

      for (let f = 0; f <= totalFrames; f++) {
        if (this.isCancelled) {
          this.recorder!.stop();
          return;
        }

        const currentTime = f * frameDelta;
        compositor.renderFrame(currentTime, this.tracks, this.clips, this.mediaItems, true);

        const progressPercent = Math.round((f / totalFrames) * 100);
        onProgress(progressPercent);

        // Yield execution loop slightly so the browser doesn't freeze
        await new Promise((r) => setTimeout(r, Math.max(2, 1000 / options.fps / 2)));
      }

      // Small delay to ensure all buffers flush
      setTimeout(() => {
        if (this.recorder && this.recorder.state !== 'inactive') {
          this.recorder.stop();
        }
      }, 300);
    });
  }
}
