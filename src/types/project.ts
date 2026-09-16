import { TimelineClip, TimelineTrack } from './timeline';

export interface ProjectSettings {
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  sampleRate: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' | '21:9';
  createdAt: number;
  updatedAt: number;
}

export interface ProjectExportData {
  version: string;
  settings: ProjectSettings;
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  // Store media references with metadata only, NEVER huge raw binaries inside JSON!
  mediaManifest: {
    id: string;
    name: string;
    type: string;
    sizeBytes: number;
    duration: number;
  }[];
}

export const ASPECT_RATIOS: Record<ProjectSettings['aspectRatio'], { width: number; height: number; label: string }> = {
  '16:9': { width: 1920, height: 1080, label: '16:9 (YouTube, Cinema)' },
  '9:16': { width: 1080, height: 1920, label: '9:16 (Shorts, Reels, TikTok)' },
  '1:1': { width: 1080, height: 1080, label: '1:1 (Square, Instagram)' },
  '4:5': { width: 1080, height: 1350, label: '4:5 (Portrait Social)' },
  '21:9': { width: 2560, height: 1080, label: '21:9 (Ultrawide)' },
};
