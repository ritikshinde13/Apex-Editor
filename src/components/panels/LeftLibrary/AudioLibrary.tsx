import React, { useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { useUIStore } from '@/store/useUIStore';
import { TimelineClip } from '@/types/timeline';
import { Play, Pause, Plus } from 'lucide-react';

interface AudioPreset {
  id: string;
  title: string;
  category: 'Cinematic' | 'Beats' | 'Ambient' | 'SFX';
  duration: number; // in seconds
  synthType: 'sine' | 'square' | 'triangle';
  frequency: number;
}

const AUDIO_PRESETS: AudioPreset[] = [
  { id: 'audio-cinematic-rise', title: 'Cinematic Risers', category: 'Cinematic', duration: 4.0, synthType: 'sine', frequency: 220 },
  { id: 'audio-cyber-beat', title: 'Cyberwave Synth Beat', category: 'Beats', duration: 8.0, synthType: 'triangle', frequency: 440 },
  { id: 'audio-ambient-space', title: 'Deep Space Drone', category: 'Ambient', duration: 10.0, synthType: 'sine', frequency: 110 },
  { id: 'audio-whoosh-sfx', title: 'Fast Whoosh Impact', category: 'SFX', duration: 1.5, synthType: 'triangle', frequency: 880 },
];

export const AudioLibrary: React.FC = () => {
  const { tracks, addClip } = useEditorStore();
  const { currentTime } = usePlaybackStore();
  const { showToast } = useUIStore();

  const [auditioningId, setAuditioningId] = useState<string | null>(null);

  const toggleAudition = (preset: AudioPreset) => {
    if (auditioningId === preset.id) {
      setAuditioningId(null);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = preset.synthType;
      osc.frequency.setValueAtTime(preset.frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      setAuditioningId(preset.id);
      setTimeout(() => {
        setAuditioningId(null);
        ctx.close().catch(() => {});
      }, 1200);
    } catch {
      setAuditioningId(null);
    }
  };

  const handleAddAudioToTimeline = (preset: AudioPreset) => {
    // Find audio track
    const audioTrack = tracks.find((t) => t.type === 'audio') || tracks[tracks.length - 1];

    const newClip: TimelineClip = {
      id: `clip-audio-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      trackId: audioTrack.id,
      type: 'audio',
      title: preset.title,
      startTimeOnTimeline: currentTime,
      duration: preset.duration,
      inPoint: 0,
      sourceDuration: preset.duration,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 },
      adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, blur: 0, vignette: 0, filterPreset: 'none' },
      audio: {
        volume: 1.0,
        isMuted: false,
        fadeIn: 0.5,
        fadeOut: 0.5,
        pan: 0,
      },
    };

    addClip(newClip);
    showToast({
      type: 'success',
      title: 'Audio Added',
      message: `"${preset.title}" placed on ${audioTrack.name} at ${currentTime.toFixed(1)}s`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-editor-panel p-3 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-editor-border">
        <span className="text-xs font-semibold text-editor-text uppercase tracking-wider">
          Audio & Sound Effects
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {AUDIO_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-3 bg-editor-surface hover:bg-editor-hover border border-editor-border hover:border-editor-muted rounded-xl transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleAudition(preset)}
                className="w-8 h-8 rounded-lg bg-accent-purple/20 hover:bg-accent-purple text-accent-purple hover:text-white flex items-center justify-center transition-colors"
                title="Audition Sound"
              >
                {auditioningId === preset.id ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div>
                <h4 className="text-xs font-semibold text-editor-text">{preset.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-editor-dim mt-0.5">
                  <span className="text-accent-purple font-medium">{preset.category}</span>
                  <span>•</span>
                  <span>{preset.duration}s</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAddAudioToTimeline(preset)}
              className="p-1.5 rounded-lg bg-accent-cyan/15 hover:bg-accent-cyan text-accent-cyan hover:text-black transition-colors"
              title="Add to Timeline"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
