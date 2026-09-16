import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useUIStore } from '@/store/useUIStore';
import { TransitionEffect } from '@/types/timeline';
import { Shuffle, ArrowRight, ArrowLeft, Sun } from 'lucide-react';

interface TransitionPreset {
  id: TransitionEffect['type'];
  name: string;
  description: string;
  icon: React.ReactNode;
}

const TRANSITIONS: TransitionPreset[] = [
  { id: 'fade', name: 'Fade to Black', description: 'Smooth cinematic opacity fade', icon: <Sun className="w-4 h-4" /> },
  { id: 'dissolve', name: 'Cross Dissolve', description: 'Soft blend between adjoining frames', icon: <Shuffle className="w-4 h-4" /> },
  { id: 'slideLeft', name: 'Slide Left', description: 'Horizontal wipe slide toward the left', icon: <ArrowLeft className="w-4 h-4" /> },
  { id: 'slideRight', name: 'Slide Right', description: 'Horizontal wipe slide toward the right', icon: <ArrowRight className="w-4 h-4" /> },
];

export const TransitionsLibrary: React.FC = () => {
  const { clips, selectedClipId, updateClipTransform } = useEditorStore();
  const { showToast } = useUIStore();

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  const applyTransition = (trans: TransitionPreset, side: 'in' | 'out') => {
    if (!selectedClipId || !selectedClip) {
      showToast({
        type: 'warning',
        title: 'No Clip Selected',
        message: 'Select a clip on the timeline to apply a transition.',
      });
      return;
    }

    const transition: TransitionEffect = {
      type: trans.id,
      duration: 1.0, // 1 second duration
    };

    if (side === 'in') {
      selectedClip.transitionIn = transition;
    } else {
      selectedClip.transitionOut = transition;
    }

    // Trigger state update
    updateClipTransform(selectedClipId, { opacity: selectedClip.transform.opacity });

    showToast({
      type: 'success',
      title: 'Transition Added',
      message: `Added ${trans.name} (${side.toUpperCase()}) to "${selectedClip.title}"`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-editor-panel p-3 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-editor-border">
        <span className="text-xs font-semibold text-editor-text uppercase tracking-wider">
          Transitions
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
        {!selectedClip && (
          <div className="p-3 bg-editor-surface/60 border border-editor-border rounded-xl text-xs text-editor-dim text-center mb-2">
            Select a clip on the timeline to apply transitions
          </div>
        )}

        {TRANSITIONS.map((trans) => (
          <div
            key={trans.id}
            className="p-3 bg-editor-surface hover:bg-editor-hover border border-editor-border hover:border-editor-muted rounded-xl transition-all shadow-sm flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-editor-panel text-accent-cyan flex items-center justify-center">
                {trans.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-editor-text">{trans.name}</h4>
                <p className="text-[10px] text-editor-dim mt-0.5">{trans.description}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => applyTransition(trans, 'in')}
                className="flex-1 py-1 rounded-lg bg-editor-panel hover:bg-accent-cyan/15 text-[11px] font-semibold text-editor-subtext hover:text-accent-cyan border border-editor-border transition-colors"
              >
                Apply In (1s)
              </button>
              <button
                onClick={() => applyTransition(trans, 'out')}
                className="flex-1 py-1 rounded-lg bg-editor-panel hover:bg-accent-cyan/15 text-[11px] font-semibold text-editor-subtext hover:text-accent-cyan border border-editor-border transition-colors"
              >
                Apply Out (1s)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
