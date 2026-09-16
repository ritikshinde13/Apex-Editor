export type TrackType = 'video' | 'audio' | 'text';
export type ClipType = 'video' | 'audio' | 'text' | 'image';

export interface TransformProperties {
  x: number;          // Pixel translation X from center
  y: number;          // Pixel translation Y from center
  scale: number;      // 1.0 = 100%
  rotation: number;   // In degrees (-180 to 180)
  opacity: number;    // 0.0 to 1.0
  cropTop: number;    // Percentage (0 - 100)
  cropBottom: number;
  cropLeft: number;
  cropRight: number;
}

export interface VideoAdjustments {
  brightness: number;  // -100 to 100 (default 0)
  contrast: number;    // -100 to 100 (default 0)
  saturation: number;  // -100 to 100 (default 0)
  exposure: number;    // -100 to 100 (default 0)
  temperature: number; // -100 to 100 (default 0)
  blur: number;        // 0 to 50px
  vignette: number;    // 0 to 100%
  filterPreset: 'none' | 'cinematic' | 'bw' | 'warm' | 'cool' | 'vintage';
}

export interface AudioAdjustments {
  volume: number;      // 0.0 to 2.0 (1.0 = 100%)
  isMuted: boolean;
  fadeIn: number;      // Duration in seconds
  fadeOut: number;     // Duration in seconds
  pan: number;         // -1.0 (left) to 1.0 (right)
}

export interface TextProperties {
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: '300' | '400' | '600' | '700' | '800';
  color: string;
  backgroundColor?: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  shadowBlur: number;
  shadowColor: string;
  animation?: 'none' | 'fadeIn' | 'slideUp' | 'typewriter';
}

export interface TransitionEffect {
  type: 'fade' | 'dissolve' | 'slideLeft' | 'slideRight' | 'wipe';
  duration: number; // In seconds
}

export interface TimelineClip {
  id: string;
  trackId: string;
  mediaId?: string; // Reference to media stored in IndexedDB/MediaStore (never embedded raw binary)
  type: ClipType;
  title: string;

  // Non-destructive timing coordinates (in seconds)
  startTimeOnTimeline: number; // When clip starts on timeline
  duration: number;            // Current visible duration on timeline
  inPoint: number;             // Offset in the source media where playback starts
  sourceDuration: number;      // Total raw duration of underlying source media
  speed: number;               // 0.25x to 8.0x playback speed

  transform: TransformProperties;
  adjustments: VideoAdjustments;
  audio: AudioAdjustments;
  text?: TextProperties;

  transitionIn?: TransitionEffect;
  transitionOut?: TransitionEffect;
}

export interface TimelineTrack {
  id: string;
  type: TrackType;
  index: number;
  name: string;
  isMuted: boolean;
  isLocked: boolean;
  isHidden: boolean;
  volume: number; // Track master volume (0.0 to 1.0)
}
