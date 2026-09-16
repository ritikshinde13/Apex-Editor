import { create } from 'zustand';

interface PlaybackState {
  currentTime: number;
  isPlaying: boolean;
  playbackRate: number;
  volume: number;
  isMuted: boolean;

  // Actions
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  stepFrames: (deltaFrames: number, fps?: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  currentTime: 0,
  isPlaying: false,
  playbackRate: 1.0,
  volume: 1.0,
  isMuted: false,

  setCurrentTime: (time: number) => {
    set({ currentTime: Math.max(0, time) });
  },

  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  seek: (time: number) => {
    set({ currentTime: Math.max(0, time) });
  },

  stepFrames: (deltaFrames: number, fps: number = 30) => {
    const { currentTime } = get();
    const frameDuration = 1 / fps;
    const newTime = Math.max(0, currentTime + deltaFrames * frameDuration);
    set({ currentTime: newTime, isPlaying: false });
  },

  setPlaybackRate: (rate: number) => {
    set({ playbackRate: Math.max(0.25, Math.min(8.0, rate)) });
  },

  setVolume: (vol: number) => {
    set({ volume: Math.max(0, Math.min(1.0, vol)) });
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },
}));
