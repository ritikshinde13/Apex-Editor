import { TimelineClip, TimelineTrack } from '@/types/timeline';
import { MediaItem } from '@/types/media';
import { computeFilterCSS } from '../filters/filterDefinitions';
import { useMediaStore } from '@/store/useMediaStore';
import { useEditorStore } from '@/store/useEditorStore';

export class Compositor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;

  private videoCache: Map<string, HTMLVideoElement> = new Map();
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private lastFrameCache: Map<string, HTMLCanvasElement> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Failed to obtain 2D canvas context for Compositor.');
    }
    this.ctx = ctx;

    // Double-buffering offscreen canvas to completely eliminate flickering/tearing
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = canvas.width;
    this.offscreenCanvas.height = canvas.height;
    const offCtx = this.offscreenCanvas.getContext('2d', { alpha: false });
    if (!offCtx) {
      throw new Error('Failed to obtain offscreen 2D canvas context.');
    }
    this.offscreenCtx = offCtx;
  }

  /**
   * Resize internal rendering canvas buffers
   */
  public setSize(width: number, height: number) {
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    if (this.offscreenCanvas.width !== width || this.offscreenCanvas.height !== height) {
      this.offscreenCanvas.width = width;
      this.offscreenCanvas.height = height;
    }
  }

  /**
   * Preload or retrieve video element for a given media item
   */
  public getVideoElement(mediaId: string, url: string): HTMLVideoElement {
    let video = this.videoCache.get(mediaId);
    if (!video) {
      const videoEl = document.createElement('video');
      videoEl.src = url;
      videoEl.crossOrigin = 'anonymous';
      videoEl.preload = 'auto';
      videoEl.muted = true; // Audio is handled via Web Audio API AudioMixer
      videoEl.playsInline = true;

      // Real-time duration discovery and self-healing for long videos
      const checkAndSyncDuration = () => {
        if (isFinite(videoEl.duration) && videoEl.duration > 0) {
          useMediaStore.getState().updateMediaDuration(mediaId, videoEl.duration);
          useEditorStore.getState().syncClipDurationsWithMedia(mediaId, videoEl.duration);
        } else if (videoEl.duration === Infinity) {
          try {
            videoEl.currentTime = 1e101;
            const onSeeked = () => {
              videoEl.removeEventListener('seeked', onSeeked);
              videoEl.currentTime = 0;
              if (isFinite(videoEl.duration) && videoEl.duration > 0) {
                useMediaStore.getState().updateMediaDuration(mediaId, videoEl.duration);
                useEditorStore.getState().syncClipDurationsWithMedia(mediaId, videoEl.duration);
              }
            };
            videoEl.addEventListener('seeked', onSeeked, { once: true });
          } catch {
            // Ignored
          }
        }
      };

      videoEl.addEventListener('loadedmetadata', checkAndSyncDuration);
      videoEl.addEventListener('durationchange', checkAndSyncDuration);

      video = videoEl;
      this.videoCache.set(mediaId, video);
    }
    return video;
  }

  /**
   * Preload or retrieve image element for a given media item
   */
  public getImageElement(mediaId: string, url: string): HTMLImageElement {
    let img = this.imageCache.get(mediaId);
    if (!img) {
      img = new Image();
      img.src = url;
      img.crossOrigin = 'anonymous';
      this.imageCache.set(mediaId, img);
    }
    return img;
  }

  /**
   * Master render method: Composites all active tracks and layers onto an offscreen buffer,
   * then paints in a single atomic draw call to the visible canvas.
   */
  public renderFrame(
    time: number,
    tracks: TimelineTrack[],
    clips: TimelineClip[],
    mediaItems: MediaItem[],
    isPlaying: boolean,
    bypassFilters: boolean = false,
    playbackRate: number = 1.0
  ) {
    const { width, height } = this.offscreenCanvas;
    const ctx = this.offscreenCtx;

    // Pause any cached video elements that are not currently active on the timeline
    const activeMediaIds = new Set(
      clips
        .filter((c) => {
          if (c.type !== 'video') return false;
          const track = tracks.find((t) => t.id === c.trackId);
          if (track?.isHidden) return false;
          const clipEnd = c.startTimeOnTimeline + c.duration;
          return time >= c.startTimeOnTimeline && time < clipEnd;
        })
        .map((c) => c.mediaId)
        .filter(Boolean)
    );

    this.videoCache.forEach((vid, mId) => {
      if (!activeMediaIds.has(mId) || !isPlaying) {
        if (!vid.paused) {
          vid.pause();
        }
      }
    });

    // 1. Clear offscreen buffer with deep cinema black
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Sort tracks from bottom to top (highest index = lowest visual layer, index 0 = topmost overlay)
    const sortedTracks = [...tracks].sort((a, b) => b.index - a.index);

    for (const track of sortedTracks) {
      if (track.isHidden) continue;

      // Find clips on this track that are active at time T
      const activeClips = clips.filter((clip) => {
        if (clip.trackId !== track.id) return false;
        const clipEnd = clip.startTimeOnTimeline + clip.duration;
        return time >= clip.startTimeOnTimeline && time < clipEnd;
      });

      for (const clip of activeClips) {
        this.renderClip(ctx, clip, time, mediaItems, isPlaying, width, height, bypassFilters, playbackRate);
      }
    }

    ctx.restore();

    // 3. Atomically transfer composed offscreen buffer to visible canvas
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
  }

  /**
   * Render individual clip with its transform matrix, crop, opacity, and filters
   */
  private renderClip(
    ctx: CanvasRenderingContext2D,
    clip: TimelineClip,
    currentTime: number,
    mediaItems: MediaItem[],
    isPlaying: boolean,
    width: number,
    height: number,
    bypassFilters: boolean = false,
    playbackRate: number = 1.0
  ) {
    const media = mediaItems.find((m) => m.id === clip.mediaId);
    const mediaUrl = media?.blobUrl;

    ctx.save();

    // Calculate elapsed time within clip
    const clipLocalTime = (currentTime - clip.startTimeOnTimeline) * clip.speed + clip.inPoint;

    // Apply global clip opacity
    ctx.globalAlpha = clip.transform.opacity ?? 1.0;

    // Handle Transition In
    if (clip.transitionIn && clip.transitionIn.duration > 0) {
      const elapsed = currentTime - clip.startTimeOnTimeline;
      if (elapsed < clip.transitionIn.duration) {
        const progress = Math.max(0, Math.min(1, elapsed / clip.transitionIn.duration));
        if (clip.transitionIn.type === 'fade' || clip.transitionIn.type === 'dissolve') {
          ctx.globalAlpha *= progress;
        }
      }
    }

    // Handle Transition Out
    if (clip.transitionOut && clip.transitionOut.duration > 0) {
      const remaining = clip.startTimeOnTimeline + clip.duration - currentTime;
      if (remaining < clip.transitionOut.duration) {
        const progress = Math.max(0, Math.min(1, remaining / clip.transitionOut.duration));
        if (clip.transitionOut.type === 'fade' || clip.transitionOut.type === 'dissolve') {
          ctx.globalAlpha *= progress;
        }
      }
    }

    // Dynamic Filter & Intensity Computation
    const effectiveFilterId = bypassFilters ? 'original' : (clip.adjustments.filterPreset || 'original');
    const effectiveIntensity = bypassFilters ? 0 : (clip.adjustments.filterIntensity ?? 100);
    const { cssFilterString, colorOverlay, blendMode, vignette: filterVignette } = computeFilterCSS(
      effectiveFilterId,
      effectiveIntensity,
      clip.adjustments
    );

    ctx.filter = cssFilterString;

    // Position center & apply transform matrix
    const centerX = width / 2 + clip.transform.x;
    const centerY = height / 2 + clip.transform.y;
    ctx.translate(centerX, centerY);

    if (clip.transform.rotation !== 0) {
      ctx.rotate((clip.transform.rotation * Math.PI) / 180);
    }

    const scale = clip.transform.scale || 1.0;
    ctx.scale(scale, scale);

    // Render by type
    if (clip.type === 'video' && mediaUrl) {
      const video = this.getVideoElement(clip.mediaId!, mediaUrl);

      const maxVideoDuration =
        isFinite(video.duration) && video.duration > 0
          ? video.duration
          : clip.sourceDuration > 0
          ? clip.sourceDuration
          : Infinity;

      // Bound clipLocalTime so we never seek past media duration
      const targetTime = Math.max(0, Math.min(clipLocalTime, maxVideoDuration));
      const targetRate = Math.max(0.25, Math.min(8.0, clip.speed * playbackRate));

      // Smart seek and hardware-accelerated playback synchronization
      if (isPlaying) {
        // Match hardware playback rate so video decodes natively at 1.5x / 2.0x!
        if (Math.abs(video.playbackRate - targetRate) > 0.01) {
          video.playbackRate = targetRate;
        }

        if (clipLocalTime >= maxVideoDuration) {
          if (!video.paused) {
            video.pause();
          }
        } else {
          if (video.paused) {
            video.play().catch(() => {});
          }
          // Only resync during active playback if drift is severe (> 0.4s) and browser is not already seeking
          if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.4) {
            video.currentTime = targetTime;
          }
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
        if (Math.abs(video.playbackRate - clip.speed) > 0.01) {
          video.playbackRate = clip.speed;
        }
        // When paused, do not re-trigger seek if browser is already in seeking state!
        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.04) {
          video.currentTime = targetTime;
        }
      }

      const renderW = width;
      const renderH = height;
      let cached = this.lastFrameCache.get(clip.mediaId!);

      // If video has a decoded frame ready, draw it and update the persistent frame cache
      if (video.readyState >= 2 && video.videoWidth > 0) {
        if (!cached) {
          cached = document.createElement('canvas');
          this.lastFrameCache.set(clip.mediaId!, cached);
        }
        if (cached.width !== video.videoWidth || cached.height !== video.videoHeight) {
          cached.width = video.videoWidth;
          cached.height = video.videoHeight;
        }
        const cCtx = cached.getContext('2d');
        if (cCtx) {
          cCtx.drawImage(video, 0, 0);
        }

        ctx.drawImage(video, -renderW / 2, -renderH / 2, renderW, renderH);
      } else if (cached && cached.width > 0) {
        // While video is seeking or decoding, fall back to last known frame (ZERO BLINKING)
        ctx.drawImage(cached, -renderW / 2, -renderH / 2, renderW, renderH);
      }
    } else if (clip.type === 'image' && mediaUrl) {
      const img = this.getImageElement(clip.mediaId!, mediaUrl);
      if (img.complete && img.naturalWidth > 0) {
        // Maintain aspect ratio fit
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = width / height;
        let drawW = width;
        let drawH = height;
        if (imgAspect > canvasAspect) {
          drawH = width / imgAspect;
        } else {
          drawW = height * imgAspect;
        }
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      }
    } else if (clip.type === 'text' && clip.text) {
      this.renderTextClip(ctx, clip.text);
    }

    // Apply color overlay tint if filter defines one
    if (colorOverlay) {
      ctx.save();
      ctx.filter = 'none';
      ctx.globalCompositeOperation = blendMode || 'soft-light';
      ctx.fillStyle = colorOverlay;
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
    }

    ctx.restore();

    // Vignette overlay if applicable (either manual adjustment or from filter)
    const effectiveVignette = Math.max(clip.adjustments.vignette || 0, filterVignette || 0);
    if (effectiveVignette > 0) {
      this.renderVignette(ctx, width, height, effectiveVignette);
    }
  }

  /**
   * Render custom stylized text element
   */
  private renderTextClip(ctx: CanvasRenderingContext2D, textProps: NonNullable<TimelineClip['text']>) {
    ctx.font = `${textProps.fontWeight || '600'} ${textProps.fontSize || 48}px ${textProps.fontFamily || 'Inter'}`;
    ctx.textAlign = textProps.textAlign || 'center';
    ctx.textBaseline = 'middle';

    const text = textProps.content || 'Sample Text';

    // Background highlight box
    if (textProps.backgroundColor) {
      const metrics = ctx.measureText(text);
      const paddingH = 20;
      const paddingV = 10;
      const boxW = metrics.width + paddingH * 2;
      const boxH = (textProps.fontSize || 48) + paddingV * 2;

      ctx.save();
      ctx.fillStyle = textProps.backgroundColor;
      ctx.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);
      ctx.restore();
    }

    // Shadow
    if (textProps.shadowBlur > 0) {
      ctx.shadowColor = textProps.shadowColor || 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = textProps.shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    ctx.fillStyle = textProps.color || '#ffffff';
    ctx.fillText(text, 0, 0);
  }

  /**
   * Render subtle or dramatic vignette radial gradient
   */
  private renderVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
    ctx.save();
    const radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    const gradient = ctx.createRadialGradient(width / 2, height / 2, radius * 0.4, width / 2, height / 2, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${Math.min(0.95, intensity / 100)})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  /**
   * Pause all active video streams
   */
  public pauseAllVideos() {
    this.videoCache.forEach((video) => {
      if (!video.paused) {
        video.pause();
      }
    });
  }

  /**
   * Clean up all cached DOM media elements and listeners
   */
  public dispose() {
    this.pauseAllVideos();
    this.videoCache.clear();
    this.imageCache.clear();
    this.lastFrameCache.clear();
  }
}
