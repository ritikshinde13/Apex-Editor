import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useUIStore } from '@/store/useUIStore';
import { VideoAdjustments } from '@/types/timeline';
import { Sparkles, Check } from 'lucide-react';

interface EffectPreset {
  id: VideoAdjustments['filterPreset'];
  name: string;
  description: string;
  adjustments: Partial<VideoAdjustments>;
}

const EFFECT_PRESETS: EffectPreset[] = [
  {
    id: 'none',
    name: 'Normal (Clean)',
    description: 'Natural original colors without modification',
    adjustments: { brightness: 0, contrast: 0, saturation: 0, blur: 0, vignette: 0, filterPreset: 'none' },
  },
  {
    id: 'cinematic',
    name: 'Cinematic Drama',
    description: 'Boosted contrast, rich shadows and vivid highlights',
    adjustments: { brightness: 5, contrast: 25, saturation: 15, vignette: 30, filterPreset: 'cinematic' },
  },
  {
    id: 'bw',
    name: 'Monochrome B&W',
    description: 'High contrast black and white film look',
    adjustments: { brightness: 0, contrast: 30, saturation: -100, vignette: 20, filterPreset: 'bw' },
  },
  {
    id: 'vintage',
    name: 'Vintage 70s',
    description: 'Warm sepia tones with soft nostalgic fade',
    adjustments: { brightness: 5, contrast: -10, saturation: -20, temperature: 35, vignette: 40, filterPreset: 'vintage' },
  },
  {
    id: 'warm',
    name: 'Golden Hour',
    description: 'Warm sunset radiance with enhanced glow',
    adjustments: { brightness: 10, contrast: 10, saturation: 20, temperature: 45, vignette: 10, filterPreset: 'warm' },
  },
  {
    id: 'cool',
    name: 'Nordic Chill',
    description: 'Desaturated cyan-shifted moody grade',
    adjustments: { brightness: -5, contrast: 15, saturation: -15, temperature: -40, vignette: 25, filterPreset: 'cool' },
  },
];

export const EffectsLibrary: React.FC = () => {
  const { clips, selectedClipId, updateClipAdjustments } = useEditorStore();
  const { showToast } = useUIStore();

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  const applyEffect = (preset: EffectPreset) => {
    if (!selectedClipId) {
      showToast({
        type: 'warning',
        title: 'No Clip Selected',
        message: 'Select a video or image on the timeline to apply this effect.',
      });
      return;
    }

    updateClipAdjustments(selectedClipId, preset.adjustments);
    showToast({
      type: 'success',
      title: 'Effect Applied',
      message: `Applied "${preset.name}" to selected clip.`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-editor-panel p-3 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-editor-border">
        <span className="text-xs font-semibold text-editor-text uppercase tracking-wider">
          Visual FX & Grades
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
        {!selectedClip && (
          <div className="p-3 bg-editor-surface/60 border border-editor-border rounded-xl text-xs text-editor-dim text-center mb-2">
            Select a clip on the timeline to apply visual effects
          </div>
        )}

        {EFFECT_PRESETS.map((preset) => {
          const isActive = selectedClip?.adjustments.filterPreset === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => applyEffect(preset)}
              className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-accent-cyan/10 border-accent-cyan text-editor-text shadow-glow-cyan'
                  : 'bg-editor-surface hover:bg-editor-hover border-editor-border text-editor-subtext hover:text-editor-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-accent-cyan text-black' : 'bg-editor-panel text-accent-cyan'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-editor-text">{preset.name}</h4>
                  <p className="text-[10px] text-editor-dim mt-0.5">{preset.description}</p>
                </div>
              </div>

              {isActive && <Check className="w-4 h-4 text-accent-cyan shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
