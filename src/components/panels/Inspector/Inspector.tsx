import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import {
  Sliders,
  Move,
  Palette,
  Gauge,
  Volume2,
  Type,
  RotateCcw,
} from 'lucide-react';

export const Inspector: React.FC = () => {
  const {
    clips,
    selectedClipId,
    updateClipTransform,
    updateClipAdjustments,
    updateClipAudio,
    updateClipText,
    updateClipSpeed,
  } = useEditorStore();

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  if (!selectedClip) {
    return (
      <aside className="w-80 h-full bg-editor-panel border-l border-editor-border p-6 flex flex-col items-center justify-center text-center select-none shrink-0 z-10">
        <div className="w-12 h-12 rounded-2xl bg-editor-surface border border-editor-border flex items-center justify-center mb-3 text-editor-dim">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-semibold text-editor-text uppercase tracking-wider">
          Properties Inspector
        </h3>
        <p className="text-xs text-editor-dim mt-1.5 leading-relaxed">
          Select any clip on the timeline to configure transforms, color grades, speed, and audio.
        </p>
      </aside>
    );
  }

  const { transform, adjustments, audio, text, speed } = selectedClip;

  return (
    <aside className="w-80 h-full bg-editor-panel border-l border-editor-border flex flex-col select-none shrink-0 z-10">
      {/* Header */}
      <div className="p-3 border-b border-editor-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs font-semibold text-editor-text truncate max-w-[160px]">
            {selectedClip.title}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-editor-surface text-editor-subtext border border-editor-border">
          {selectedClip.type}
        </span>
      </div>

      {/* Scrollable Inspector Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TEXT STYLING (Only if text clip) */}
        {selectedClip.type === 'text' && text && (
          <div className="bg-editor-surface/80 border border-editor-border rounded-xl p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent-cyan pb-1 border-b border-editor-border/60">
              <Type className="w-3.5 h-3.5" /> Text Properties
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-editor-subtext">Content</label>
              <textarea
                rows={2}
                value={text.content}
                onChange={(e) => updateClipText(selectedClip.id, { content: e.target.value })}
                className="w-full bg-editor-panel border border-editor-border rounded-lg p-2 text-xs text-editor-text focus:outline-none focus:border-accent-cyan/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-editor-dim">Font Size ({text.fontSize}px)</label>
                <input
                  type="range"
                  min={16}
                  max={120}
                  value={text.fontSize}
                  onChange={(e) => updateClipText(selectedClip.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-editor-dim">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={text.color}
                    onChange={(e) => updateClipText(selectedClip.id, { color: e.target.value })}
                    className="w-7 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-editor-subtext">{text.color}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSFORM SECTION (Video, Image, Text) */}
        <div className="bg-editor-surface/80 border border-editor-border rounded-xl p-3 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-editor-border/60">
            <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
              <Move className="w-3.5 h-3.5" /> Transform
            </span>
            <button
              onClick={() =>
                updateClipTransform(selectedClip.id, {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                })
              }
              title="Reset Transform"
              className="p-1 hover:text-editor-text text-editor-dim transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Scale Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-editor-subtext">Scale</span>
              <span className="text-editor-text font-mono">{(transform.scale * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={3.0}
              step={0.05}
              value={transform.scale}
              onChange={(e) => updateClipTransform(selectedClip.id, { scale: parseFloat(e.target.value) })}
              className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>

          {/* Position X & Y */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-editor-dim">X Position ({transform.x}px)</span>
              <input
                type="range"
                min={-600}
                max={600}
                value={transform.x}
                onChange={(e) => updateClipTransform(selectedClip.id, { x: parseInt(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-editor-dim">Y Position ({transform.y}px)</span>
              <input
                type="range"
                min={-400}
                max={400}
                value={transform.y}
                onChange={(e) => updateClipTransform(selectedClip.id, { y: parseInt(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
          </div>

          {/* Rotation & Opacity */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-editor-dim">Rotation ({transform.rotation}°)</span>
              <input
                type="range"
                min={-180}
                max={180}
                value={transform.rotation}
                onChange={(e) => updateClipTransform(selectedClip.id, { rotation: parseInt(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-editor-dim">Opacity ({Math.round(transform.opacity * 100)}%)</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={transform.opacity}
                onChange={(e) => updateClipTransform(selectedClip.id, { opacity: parseFloat(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
          </div>
        </div>

        {/* COLOR ADJUSTMENTS SECTION (Video & Image) */}
        {(selectedClip.type === 'video' || selectedClip.type === 'image') && (
          <div className="bg-editor-surface/80 border border-editor-border rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-editor-border/60">
              <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
                <Palette className="w-3.5 h-3.5" /> Visual Adjustments
              </span>
              <button
                onClick={() =>
                  updateClipAdjustments(selectedClip.id, {
                    brightness: 0,
                    contrast: 0,
                    saturation: 0,
                    blur: 0,
                    vignette: 0,
                  })
                }
                title="Reset Colors"
                className="p-1 hover:text-editor-text text-editor-dim transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-editor-subtext">Brightness</span>
                <span className="text-editor-text font-mono">{adjustments.brightness}</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={adjustments.brightness}
                onChange={(e) => updateClipAdjustments(selectedClip.id, { brightness: parseInt(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-editor-subtext">Contrast</span>
                <span className="text-editor-text font-mono">{adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={adjustments.contrast}
                onChange={(e) => updateClipAdjustments(selectedClip.id, { contrast: parseInt(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-editor-subtext">Saturation</span>
                <span className="text-editor-text font-mono">{adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={adjustments.saturation}
                onChange={(e) => updateClipAdjustments(selectedClip.id, { saturation: parseInt(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>

            {/* Blur & Vignette */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-editor-dim">Blur ({adjustments.blur}px)</span>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={adjustments.blur}
                  onChange={(e) => updateClipAdjustments(selectedClip.id, { blur: parseInt(e.target.value) })}
                  className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-editor-dim">Vignette ({adjustments.vignette}%)</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={adjustments.vignette}
                  onChange={(e) => updateClipAdjustments(selectedClip.id, { vignette: parseInt(e.target.value) })}
                  className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>
          </div>
        )}

        {/* SPEED CONTROL SECTION */}
        <div className="bg-editor-surface/80 border border-editor-border rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-editor-border/60">
            <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
              <Gauge className="w-3.5 h-3.5" /> Playback Speed
            </span>
            <span className="text-xs font-mono font-bold text-accent-purple">{speed}x</span>
          </div>

          <div className="flex justify-between gap-1 pt-1">
            {[0.5, 1.0, 1.5, 2.0, 4.0].map((s) => (
              <button
                key={s}
                onClick={() => updateClipSpeed(selectedClip.id, s)}
                className={`flex-1 py-1 rounded text-[10px] font-semibold transition-colors ${
                  speed === s
                    ? 'bg-accent-cyan text-black'
                    : 'bg-editor-panel text-editor-subtext hover:text-editor-text'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0.25}
            max={8.0}
            step={0.25}
            value={speed}
            onChange={(e) => updateClipSpeed(selectedClip.id, parseFloat(e.target.value))}
            className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan mt-1"
          />
        </div>

        {/* AUDIO SECTION (Video & Audio clips) */}
        {(selectedClip.type === 'video' || selectedClip.type === 'audio') && (
          <div className="bg-editor-surface/80 border border-editor-border rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-editor-border/60">
              <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
                <Volume2 className="w-3.5 h-3.5" /> Audio & Fades
              </span>
              <button
                onClick={() => updateClipAudio(selectedClip.id, { isMuted: !audio.isMuted })}
                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                  audio.isMuted
                    ? 'bg-accent-danger/20 text-accent-danger'
                    : 'bg-editor-panel text-editor-subtext hover:text-editor-text'
                }`}
              >
                {audio.isMuted ? 'Muted' : 'Mute'}
              </button>
            </div>

            {/* Volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-editor-subtext">Volume</span>
                <span className="text-editor-text font-mono">{Math.round(audio.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={2.0}
                step={0.05}
                value={audio.volume}
                onChange={(e) => updateClipAudio(selectedClip.id, { volume: parseFloat(e.target.value) })}
                className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>

            {/* Fade In & Out */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-editor-dim">Fade In ({audio.fadeIn}s)</span>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.2}
                  value={audio.fadeIn}
                  onChange={(e) => updateClipAudio(selectedClip.id, { fadeIn: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-editor-dim">Fade Out ({audio.fadeOut}s)</span>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.2}
                  value={audio.fadeOut}
                  onChange={(e) => updateClipAudio(selectedClip.id, { fadeOut: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-editor-border rounded appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
