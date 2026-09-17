import { create } from 'zustand';
import { TimelineClip, TimelineTrack, TrackType, TransformProperties, VideoAdjustments, AudioAdjustments, TextProperties } from '@/types/timeline';
import { historyManager } from './history';

interface EditorState {
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  selectedClipId: string | null;
  pixelsPerSecond: number;
  snappingEnabled: boolean;
  rippleEnabled: boolean;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  setZoom: (pixelsPerSecond: number) => void;
  toggleSnapping: () => void;
  toggleRipple: () => void;
  setSelectedClipId: (clipId: string | null) => void;

  // Track manipulation
  addTrack: (type: TrackType) => void;
  deleteTrack: (trackId: string) => void;
  toggleMuteTrack: (trackId: string) => void;
  toggleLockTrack: (trackId: string) => void;
  toggleHideTrack: (trackId: string) => void;

  // Clip manipulation
  addClip: (clip: TimelineClip) => void;
  removeClip: (clipId: string) => void;
  moveClip: (clipId: string, targetTrackId: string, targetStartTime: number) => void;
  trimClip: (clipId: string, side: 'left' | 'right', newDuration: number, newStartTime?: number, newInPoint?: number) => void;
  splitClip: (clipId: string, playheadTime: number) => void;
  syncClipDurationsWithMedia: (mediaId: string, duration: number) => void;
  zoomToFit: (viewportWidth?: number) => void;

  // Inspector property updates
  updateClipTransform: (clipId: string, transform: Partial<TransformProperties>) => void;
  updateClipAdjustments: (clipId: string, adjustments: Partial<VideoAdjustments>) => void;
  applyFilterToClip: (clipId: string, filterId: string, intensity?: number) => void;
  setFilterIntensity: (clipId: string, intensity: number) => void;
  resetClipFilter: (clipId: string) => void;
  applyFilterToAllClips: (filterId: string, intensity?: number) => void;
  updateClipAudio: (clipId: string, audio: Partial<AudioAdjustments>) => void;
  updateClipText: (clipId: string, text: Partial<TextProperties>) => void;
  updateClipSpeed: (clipId: string, speed: number) => void;

  // History
  undo: () => void;
  redo: () => void;

  // Project state
  loadProjectData: (tracks: TimelineTrack[], clips: TimelineClip[]) => void;
  resetProject: () => void;
}

const DEFAULT_TRACKS: TimelineTrack[] = [
  { id: 'track-text-1', type: 'text', index: 0, name: 'Text 1', isMuted: false, isLocked: false, isHidden: false, volume: 1 },
  { id: 'track-video-2', type: 'video', index: 1, name: 'Video 2 (Overlay)', isMuted: false, isLocked: false, isHidden: false, volume: 1 },
  { id: 'track-video-1', type: 'video', index: 2, name: 'Video 1 (Main)', isMuted: false, isLocked: false, isHidden: false, volume: 1 },
  { id: 'track-audio-1', type: 'audio', index: 3, name: 'Audio 1 (FX)', isMuted: false, isLocked: false, isHidden: false, volume: 1 },
  { id: 'track-audio-2', type: 'audio', index: 4, name: 'Audio 2 (Music)', isMuted: false, isLocked: false, isHidden: false, volume: 1 },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  tracks: DEFAULT_TRACKS,
  clips: [],
  selectedClipId: null,
  pixelsPerSecond: 60, // 60px = 1 second
  snappingEnabled: true,
  rippleEnabled: false,
  canUndo: false,
  canRedo: false,

  setZoom: (pixelsPerSecond: number) => {
    const clamped = Math.max(10, Math.min(300, pixelsPerSecond));
    set({ pixelsPerSecond: clamped });
  },

  toggleSnapping: () => set((state) => ({ snappingEnabled: !state.snappingEnabled })),
  toggleRipple: () => set((state) => ({ rippleEnabled: !state.rippleEnabled })),
  setSelectedClipId: (clipId: string | null) => set({ selectedClipId: clipId }),

  addTrack: (type: TrackType) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, `Add ${type} track`);
    const newTrack: TimelineTrack = {
      id: `track-${type}-${Date.now()}`,
      type,
      index: tracks.length,
      name: `${type.toUpperCase()} ${tracks.filter((t) => t.type === type).length + 1}`,
      isMuted: false,
      isLocked: false,
      isHidden: false,
      volume: 1,
    };
    set({
      tracks: [...tracks, newTrack],
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  deleteTrack: (trackId: string) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, 'Delete track');
    set({
      tracks: tracks.filter((t) => t.id !== trackId),
      clips: clips.filter((c) => c.trackId !== trackId),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  toggleMuteTrack: (trackId: string) => {
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === trackId ? { ...t, isMuted: !t.isMuted } : t)),
    }));
  },

  toggleLockTrack: (trackId: string) => {
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === trackId ? { ...t, isLocked: !t.isLocked } : t)),
    }));
  },

  toggleHideTrack: (trackId: string) => {
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === trackId ? { ...t, isHidden: !t.isHidden } : t)),
    }));
  },

  addClip: (clip: TimelineClip) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, 'Add clip');
    set({
      clips: [...clips, clip],
      selectedClipId: clip.id,
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  removeClip: (clipId: string) => {
    const { tracks, clips, selectedClipId } = get();
    historyManager.recordState(tracks, clips, 'Delete clip');
    set({
      clips: clips.filter((c) => c.id !== clipId),
      selectedClipId: selectedClipId === clipId ? null : selectedClipId,
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  moveClip: (clipId: string, targetTrackId: string, targetStartTime: number) => {
    const { tracks, clips } = get();
    const clampedTime = Math.max(0, targetStartTime);
    historyManager.recordState(tracks, clips, 'Move clip');

    set({
      clips: clips.map((clip) =>
        clip.id === clipId
          ? { ...clip, trackId: targetTrackId, startTimeOnTimeline: clampedTime }
          : clip
      ),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  trimClip: (
    clipId: string,
    _side: 'left' | 'right',
    newDuration: number,
    newStartTime?: number,
    newInPoint?: number
  ) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, 'Trim clip');

    set({
      clips: clips.map((clip) => {
        if (clip.id !== clipId) return clip;
        return {
          ...clip,
          duration: Math.max(0.1, newDuration),
          startTimeOnTimeline: newStartTime !== undefined ? Math.max(0, newStartTime) : clip.startTimeOnTimeline,
          inPoint: newInPoint !== undefined ? Math.max(0, newInPoint) : clip.inPoint,
        };
      }),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  splitClip: (clipId: string, playheadTime: number) => {
    const { tracks, clips } = get();
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    const clipEnd = clip.startTimeOnTimeline + clip.duration;
    // Ensure playhead strictly intersects the clip
    if (playheadTime <= clip.startTimeOnTimeline + 0.05 || playheadTime >= clipEnd - 0.05) {
      return;
    }

    historyManager.recordState(tracks, clips, 'Split clip');

    const firstDuration = playheadTime - clip.startTimeOnTimeline;
    const secondDuration = clip.duration - firstDuration;
    const mediaOffsetDelta = firstDuration * clip.speed;

    const firstClip: TimelineClip = {
      ...clip,
      duration: firstDuration,
    };

    const secondClip: TimelineClip = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      startTimeOnTimeline: playheadTime,
      duration: secondDuration,
      inPoint: clip.inPoint + mediaOffsetDelta,
    };

    set({
      clips: clips.map((c) => (c.id === clipId ? firstClip : c)).concat(secondClip),
      selectedClipId: secondClip.id,
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  syncClipDurationsWithMedia: (mediaId: string, duration: number) => {
    if (!isFinite(duration) || duration <= 0) return;
    const { clips } = get();
    let changed = false;

    const newClips = clips.map((clip) => {
      if (clip.mediaId !== mediaId) return clip;
      const oldSourceDur = clip.sourceDuration || 0;
      if (duration > oldSourceDur) {
        changed = true;
        // Expand if clip was at previous default or untrimmed
        const shouldExpand =
          clip.inPoint === 0 &&
          (clip.duration === oldSourceDur || clip.duration <= 30);
        return {
          ...clip,
          sourceDuration: duration,
          duration: shouldExpand ? duration : clip.duration,
        };
      }
      return clip;
    });

    if (changed) {
      set({ clips: newClips });
    }
  },

  zoomToFit: (viewportWidth: number = 1000) => {
    const { clips } = get();
    if (clips.length === 0) {
      set({ pixelsPerSecond: 60 });
      return;
    }
    const maxEnd = Math.max(...clips.map((c) => c.startTimeOnTimeline + c.duration));
    const totalSec = Math.max(10, maxEnd + 5);
    const targetPx = Math.max(10, Math.min(300, Math.floor((viewportWidth - 100) / totalSec)));
    set({ pixelsPerSecond: targetPx });
  },

  updateClipTransform: (clipId: string, transform: Partial<TransformProperties>) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? { ...clip, transform: { ...clip.transform, ...transform } }
          : clip
      ),
    }));
  },

  updateClipAdjustments: (clipId: string, adjustments: Partial<VideoAdjustments>) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? { ...clip, adjustments: { ...clip.adjustments, ...adjustments } }
          : clip
      ),
    }));
  },

  applyFilterToClip: (clipId: string, filterId: string, intensity: number = 100) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, `Apply filter ${filterId}`);
    set({
      clips: clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              adjustments: {
                ...clip.adjustments,
                filterPreset: filterId,
                filterIntensity: Math.max(0, Math.min(100, intensity)),
              },
            }
          : clip
      ),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  setFilterIntensity: (clipId: string, intensity: number) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              adjustments: {
                ...clip.adjustments,
                filterIntensity: Math.max(0, Math.min(100, intensity)),
              },
            }
          : clip
      ),
    }));
  },

  resetClipFilter: (clipId: string) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, 'Reset filter');
    set({
      clips: clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              adjustments: {
                ...clip.adjustments,
                filterPreset: 'original',
                filterIntensity: 100,
              },
            }
          : clip
      ),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  applyFilterToAllClips: (filterId: string, intensity: number = 100) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, `Apply filter ${filterId} to all`);
    set({
      clips: clips.map((clip) =>
        clip.type === 'video' || clip.type === 'image'
          ? {
              ...clip,
              adjustments: {
                ...clip.adjustments,
                filterPreset: filterId,
                filterIntensity: Math.max(0, Math.min(100, intensity)),
              },
            }
          : clip
      ),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  updateClipAudio: (clipId: string, audio: Partial<AudioAdjustments>) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? { ...clip, audio: { ...clip.audio, ...audio } }
          : clip
      ),
    }));
  },

  updateClipText: (clipId: string, text: Partial<TextProperties>) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId && clip.text
          ? { ...clip, text: { ...clip.text, ...text } }
          : clip
      ),
    }));
  },

  updateClipSpeed: (clipId: string, speed: number) => {
    const { tracks, clips } = get();
    historyManager.recordState(tracks, clips, 'Change speed');
    const clampedSpeed = Math.max(0.25, Math.min(8.0, speed));
    set({
      clips: clips.map((clip) => {
        if (clip.id !== clipId) return clip;
        const oldSpeed = clip.speed || 1.0;
        const ratio = oldSpeed / clampedSpeed;
        const newDuration = Math.max(0.2, clip.duration * ratio);
        return {
          ...clip,
          speed: clampedSpeed,
          duration: newDuration,
        };
      }),
      canUndo: historyManager.canUndo(),
      canRedo: historyManager.canRedo(),
    });
  },

  undo: () => {
    const { tracks, clips } = get();
    const snapshot = historyManager.undo(tracks, clips);
    if (snapshot) {
      set({
        tracks: snapshot.tracks,
        clips: snapshot.clips,
        selectedClipId: null,
        canUndo: historyManager.canUndo(),
        canRedo: historyManager.canRedo(),
      });
    }
  },

  redo: () => {
    const { tracks, clips } = get();
    const snapshot = historyManager.redo(tracks, clips);
    if (snapshot) {
      set({
        tracks: snapshot.tracks,
        clips: snapshot.clips,
        selectedClipId: null,
        canUndo: historyManager.canUndo(),
        canRedo: historyManager.canRedo(),
      });
    }
  },

  loadProjectData: (tracks: TimelineTrack[], clips: TimelineClip[]) => {
    historyManager.clear();
    set({
      tracks,
      clips,
      selectedClipId: null,
      canUndo: false,
      canRedo: false,
    });
  },

  resetProject: () => {
    historyManager.clear();
    set({
      tracks: DEFAULT_TRACKS,
      clips: [],
      selectedClipId: null,
      canUndo: false,
      canRedo: false,
    });
  },
}));
