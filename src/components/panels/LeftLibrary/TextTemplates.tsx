import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { useUIStore } from '@/store/useUIStore';
import { TimelineClip } from '@/types/timeline';
import { Plus } from 'lucide-react';

interface TextPreset {
  name: string;
  category: string;
  previewText: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: '300' | '400' | '600' | '700' | '800';
  color: string;
  backgroundColor?: string;
  shadowBlur: number;
  shadowColor: string;
}

const TEXT_PRESETS: TextPreset[] = [
  {
    name: 'Cinematic Title',
    category: 'Titles',
    previewText: 'VELOCITY',
    fontSize: 72,
    fontFamily: 'Inter',
    fontWeight: '800',
    color: '#ffffff',
    shadowBlur: 16,
    shadowColor: 'rgba(0, 229, 255, 0.6)',
  },
  {
    name: 'Modern Subtitle',
    category: 'Captions',
    previewText: 'Clean descriptive text',
    fontSize: 36,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    shadowBlur: 4,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
  },
  {
    name: 'Electric Lower Third',
    category: 'Lower Thirds',
    previewText: 'PRESENTER NAME',
    fontSize: 42,
    fontFamily: 'JetBrains Mono',
    fontWeight: '700',
    color: '#00e5ff',
    backgroundColor: 'rgba(18, 20, 26, 0.9)',
    shadowBlur: 10,
    shadowColor: 'rgba(0, 229, 255, 0.4)',
  },
  {
    name: 'Bold Callout',
    category: 'Graphics',
    previewText: 'WATCH THIS!',
    fontSize: 64,
    fontFamily: 'Inter',
    fontWeight: '800',
    color: '#facc15',
    shadowBlur: 12,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
  },
];

export const TextTemplates: React.FC = () => {
  const { tracks, addClip } = useEditorStore();
  const { currentTime } = usePlaybackStore();
  const { showToast } = useUIStore();

  const handleAddText = (preset: TextPreset) => {
    // Find text track or default to first track
    const textTrack = tracks.find((t) => t.type === 'text') || tracks[0];

    const newClip: TimelineClip = {
      id: `clip-text-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      trackId: textTrack.id,
      type: 'text',
      title: preset.name,
      startTimeOnTimeline: currentTime,
      duration: 4.0, // 4 seconds duration
      inPoint: 0,
      sourceDuration: 4.0,
      speed: 1.0,
      transform: {
        x: 0,
        y: preset.category === 'Lower Thirds' ? 320 : 0,
        scale: 1.0,
        rotation: 0,
        opacity: 1.0,
        cropTop: 0,
        cropBottom: 0,
        cropLeft: 0,
        cropRight: 0,
      },
      adjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        temperature: 0,
        blur: 0,
        vignette: 0,
        filterPreset: 'none',
      },
      audio: {
        volume: 1.0,
        isMuted: true,
        fadeIn: 0,
        fadeOut: 0,
        pan: 0,
      },
      text: {
        content: preset.previewText,
        fontSize: preset.fontSize,
        fontFamily: preset.fontFamily,
        fontWeight: preset.fontWeight,
        color: preset.color,
        backgroundColor: preset.backgroundColor,
        textAlign: 'center',
        letterSpacing: 1,
        shadowBlur: preset.shadowBlur,
        shadowColor: preset.shadowColor,
      },
    };

    addClip(newClip);
    showToast({
      type: 'success',
      title: 'Text Added',
      message: `"${preset.name}" placed on timeline at ${currentTime.toFixed(1)}s`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-editor-panel p-3 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-editor-border">
        <span className="text-xs font-semibold text-editor-text uppercase tracking-wider">
          Typography Presets
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {TEXT_PRESETS.map((preset) => (
          <div
            key={preset.name}
            className="group p-3 bg-editor-surface hover:bg-editor-hover border border-editor-border hover:border-editor-muted rounded-xl transition-all shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-editor-subtext uppercase tracking-wider">
                {preset.category}
              </span>
              <button
                onClick={() => handleAddText(preset)}
                className="px-2.5 py-1 rounded-lg bg-accent-cyan/15 hover:bg-accent-cyan text-accent-cyan hover:text-black text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" /> Add
              </button>
            </div>

            {/* Typography Preview Canvas Block */}
            <div className="h-16 rounded-lg bg-black/60 border border-editor-border/60 flex items-center justify-center overflow-hidden p-2">
              <span
                style={{
                  fontFamily: preset.fontFamily,
                  fontWeight: preset.fontWeight,
                  color: preset.color,
                  backgroundColor: preset.backgroundColor,
                  padding: preset.backgroundColor ? '4px 10px' : '0',
                  borderRadius: '4px',
                  textShadow: preset.shadowBlur ? `0 0 ${preset.shadowBlur}px ${preset.shadowColor}` : 'none',
                }}
                className="text-base tracking-wide truncate max-w-full"
              >
                {preset.previewText}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-editor-dim">
              <span>{preset.name}</span>
              <span>{preset.fontFamily} • {preset.fontSize}px</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
