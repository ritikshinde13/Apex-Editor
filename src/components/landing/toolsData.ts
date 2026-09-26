import React from 'react';
import {
  FileVideo,
  Smartphone,
  Laptop,
  Video,
  Scissors,
  Music,
  Maximize2,
  Gauge,
  Type,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

export interface ToolItem {
  id: string;
  title: string;
  category: 'platform' | 'format' | 'device';
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DEFAULT_TOOLS: ToolItem[] = [
  {
    id: 'webm-editor',
    title: 'WEBM Editor',
    category: 'format',
    badge: 'Popular',
    description: 'Cut, splice, and compress lightweight WebM video files without re-encoding quality loss.',
    icon: FileVideo,
  },
  {
    id: 'wmv-editor',
    title: 'WMV Editor',
    category: 'format',
    badge: 'Windows',
    description: 'Edit and convert legacy Windows Media Video footage straight into modern MP4 streams.',
    icon: FileVideo,
  },
  {
    id: 'tiktok-editor',
    title: 'TikTok Video Editor',
    category: 'platform',
    badge: '9:16 Vertical',
    description: 'Craft viral vertical TikTok clips with trending sound sync, speed ramps, and bold subtitles.',
    icon: Smartphone,
  },
  {
    id: 'instagram-editor',
    title: 'Instagram Video Editor',
    category: 'platform',
    badge: 'Reels & Feed',
    description: 'Perfect 1:1 square feeds and 9:16 Reels with custom color grading and animated text overlays.',
    icon: Share2,
  },
  {
    id: 'youtube-editor',
    title: 'YouTube Video Editor',
    category: 'platform',
    badge: '16:9 4K',
    description: 'Assemble multi-track long-form YouTube episodes with chapter markers and B-roll overlays.',
    icon: Video,
  },
  {
    id: 'mac-editor',
    title: 'Video Editor for Mac',
    category: 'device',
    badge: 'macOS & Safari',
    description: 'Optimized for Apple Silicon M1/M2/M3 with smooth hardware-accelerated playback in Safari.',
    icon: Laptop,
  },
  {
    id: 'windows-editor',
    title: 'Video Editor for Windows',
    category: 'device',
    badge: 'DirectX / GPU',
    description: 'Full multi-track timeline editing with keyboard shortcut bindings for Windows 10 & 11 PCs.',
    icon: Laptop,
  },
  {
    id: 'mp4-cutter',
    title: 'MP4 Video Cutter',
    category: 'format',
    badge: 'Fast Trim',
    description: 'Slice off unwanted intros, pauses, and bloopers with instant razor splitting.',
    icon: Scissors,
  },
  {
    id: 'audio-merger',
    title: 'Audio & Music Merger',
    category: 'format',
    badge: 'Waveforms',
    description: 'Layer background music tracks, adjust voiceover balance, and add smooth volume transitions.',
    icon: Music,
  },
  {
    id: 'pip-maker',
    title: 'Picture-in-Picture Maker',
    category: 'platform',
    badge: 'Reaction Cam',
    description: 'Create multi-window gameplay commentary and reaction videos with floating camera boxes.',
    icon: Layers,
  },
  {
    id: 'speed-controller',
    title: 'Video Speed Controller',
    category: 'format',
    badge: '0.25x – 4x',
    description: 'Speed up footage into dynamic timelapses or slow down for dramatic cinematic motion.',
    icon: Gauge,
  },
  {
    id: 'subtitle-editor',
    title: 'Video Subtitle Editor',
    category: 'platform',
    badge: 'Typography',
    description: 'Burn eye-catching styled subtitles and titles directly onto your video with custom fonts.',
    icon: Type,
  },
  {
    id: 'mobile-editor',
    title: 'Video Editor for iPhone & Android',
    category: 'device',
    badge: 'Mobile Web',
    description: 'Touch-optimized mobile timeline UI that runs smoothly on mobile Safari and Chrome.',
    icon: Smartphone,
  },
  {
    id: 'meme-maker',
    title: 'Meme Video Generator',
    category: 'platform',
    badge: 'Social',
    description: 'Add top/bottom text bars, hilarious audio effects, and split screens for viral social sharing.',
    icon: Sparkles,
  },
  {
    id: 'aspect-resizer',
    title: 'Video Aspect Resizer',
    category: 'format',
    badge: 'Auto-Frame',
    description: 'Repurpose one video across all social platforms in seconds with 1-click aspect ratio presets.',
    icon: Maximize2,
  },
];
