import { TimelineClip, TimelineTrack } from '@/types/timeline';
import { MediaItem } from '@/types/media';
import { useMediaStore } from '@/store/useMediaStore';
import { useEditorStore } from '@/store/useEditorStore';

export class AudioMixer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private trackGains: Map<string, GainNode> = new Map();
  private activeSources: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Ensure track gain node exists
   */
  private getTrackGain(trackId: string): GainNode {
    this.initContext();
    let gain = this.trackGains.get(trackId);
    if (!gain) {
      gain = this.ctx!.createGain();
      gain.connect(this.masterGain!);
      this.trackGains.set(trackId, gain);
    }
    return gain;
  }

  /**
   * Synchronize audio sources at playhead time
   */
  public syncAudio(
    currentTime: number,
    tracks: TimelineTrack[],
    clips: TimelineClip[],
    mediaItems: MediaItem[],
    isPlaying: boolean,
    masterVolume: number,
    isMasterMuted: boolean,
    playbackRate: number = 1.0
  ) {
    this.initContext();

    if (this.masterGain) {
      this.masterGain.gain.value = isMasterMuted ? 0 : masterVolume;
    }

    // Identify active audio and video clips that have sound
    const audibleClips = clips.filter((clip) => {
      if (clip.type !== 'audio' && clip.type !== 'video') return false;
      const track = tracks.find((t) => t.id === clip.trackId);
      if (!track || track.isMuted) return false;
      if (clip.audio.isMuted || clip.audio.volume === 0) return false;

      const clipEnd = clip.startTimeOnTimeline + clip.duration;
      return currentTime >= clip.startTimeOnTimeline && currentTime < clipEnd;
    });

    const activeClipIds = new Set(audibleClips.map((c) => c.id));

    // Pause and clean up inactive clips
    this.activeSources.forEach((audio, clipId) => {
      if (!activeClipIds.has(clipId) || !isPlaying) {
        if (!audio.paused) {
          audio.pause();
        }
      }
    });

    if (!isPlaying) return;

    // Play and align active clips
    for (const clip of audibleClips) {
      const media = mediaItems.find((m) => m.id === clip.mediaId);
      if (!media?.blobUrl) continue;

      let audio = this.activeSources.get(clip.id);
      if (!audio) {
        const audioEl = new Audio(media.blobUrl);
        audioEl.preload = 'auto';

        const syncDur = () => {
          if (isFinite(audioEl.duration) && audioEl.duration > 0) {
            useMediaStore.getState().updateMediaDuration(media.id, audioEl.duration);
            useEditorStore.getState().syncClipDurationsWithMedia(media.id, audioEl.duration);
          }
        };
        audioEl.addEventListener('loadedmetadata', syncDur);
        audioEl.addEventListener('durationchange', syncDur);

        audio = audioEl;
        this.activeSources.set(clip.id, audio);

        const trackGain = this.getTrackGain(clip.trackId);
        const sourceNode = this.ctx!.createMediaElementSource(audio);
        const clipGain = this.ctx!.createGain();

        sourceNode.connect(clipGain);
        clipGain.connect(trackGain);
      }

      const clipLocalTime = (currentTime - clip.startTimeOnTimeline) * clip.speed + clip.inPoint;
      const maxAudioDuration =
        isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : clip.sourceDuration > 0
          ? clip.sourceDuration
          : Infinity;

      const targetAudioTime = Math.max(0, Math.min(clipLocalTime, maxAudioDuration));
      const targetRate = Math.max(0.25, Math.min(8.0, clip.speed * playbackRate));

      // Match audio playback rate with pitch preservation
      if (Math.abs(audio.playbackRate - targetRate) > 0.01) {
        audio.playbackRate = targetRate;
      }
      audio.preservesPitch = true;

      if (clipLocalTime >= maxAudioDuration) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        // Only resync during active playback if drift is severe (> 0.35s)
        if (!audio.seeking && Math.abs(audio.currentTime - targetAudioTime) > 0.35) {
          audio.currentTime = targetAudioTime;
        }

        if (audio.paused) {
          audio.play().catch(() => {});
        }
      }

      // Handle Fade In / Fade Out calculations
      let currentVol = clip.audio.volume ?? 1.0;
      const elapsed = currentTime - clip.startTimeOnTimeline;
      const remaining = clip.startTimeOnTimeline + clip.duration - currentTime;

      if (clip.audio.fadeIn > 0 && elapsed < clip.audio.fadeIn) {
        currentVol *= elapsed / clip.audio.fadeIn;
      }
      if (clip.audio.fadeOut > 0 && remaining < clip.audio.fadeOut) {
        currentVol *= remaining / clip.audio.fadeOut;
      }

      audio.volume = Math.max(0, Math.min(1.0, currentVol));
    }
  }

  /**
   * Stop all playing audio streams
   */
  public stopAll() {
    this.activeSources.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }

  /**
   * Read instantaneous audio peak level for volume meter (0.0 to 1.0)
   */
  public getPeakLevel(): number {
    if (!this.analyser) return 0;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return Math.min(1.0, sum / (data.length * 180));
  }

  public dispose() {
    this.stopAll();
    this.activeSources.clear();
    this.trackGains.clear();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}
