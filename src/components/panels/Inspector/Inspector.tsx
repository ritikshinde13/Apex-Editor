import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useUIStore } from '@/store/useUIStore';
import { getFilterById } from '@/core/filters/filterDefinitions';
import {
  Sliders,
  Move,
  Box,
  Palette,
  Gauge,
  Volume2,
  Type,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { PRESETS_3D } from '@/core/engine/Spatial3D';

export const Inspector: React.FC = () => {
  const {
    clips,
    selectedClipId,
    updateClipTransform,
    updateClipAdjustments,
    updateClipAudio,
    updateClipText,
    updateClipSpeed,
    setFilterIntensity,
    resetClipFilter,
  } = useEditorStore();

  const setActiveTab = useUIStore((state) => state.setActiveTab);

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  if (!selectedClip) {
    return (
      <aside className="w-80 h-full backdrop-blur-2xl bg-editor-panel/70 border-l border-white/[0.08] shadow-glass p-6 flex flex-col items-center justify-center text-center select-none shrink-0 z-10 specular-border">
        <div className="w-14 h-14 rounded-2xl glass-card border border-white/10 flex items-center justify-center mb-3 text-editor-dim shadow-glass-sm">
          <Sliders className="w-6 h-6 text-accent-cyan/80" />
        </div>
        <h3 className="text-xs font-bold text-editor-text uppercase tracking-wider drop-shadow-sm">
          Properties Inspector
        </h3>
        <p className="text-xs text-editor-dim mt-1.5 leading-relaxed">
          Select any clip on the timeline to configure 3D spatial transforms, color grades, and audio.
        </p>
      </aside>
    );
  }

  const { transform, adjustments, audio, text, speed } = selectedClip;
  const activeFilterPreset = adjustments.filterPreset || 'original';
  const activeFilterDef = getFilterById(activeFilterPreset);
  const hasFilter = activeFilterPreset !== 'original' && activeFilterPreset !== 'none';

  return (
    <aside className="w-80 h-full backdrop-blur-2xl bg-editor-panel/70 border-l border-white/[0.08] shadow-glass flex flex-col select-none shrink-0 z-10 specular-border">
      {/* Header */}
      <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs font-bold text-editor-text truncate max-w-[160px]">
            {selectedClip.title}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full glass-pill text-accent-cyan border border-accent-cyan/30">
          {selectedClip.type}
        </span>
      </div>

      {/* Scrollable Inspector Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* TEXT STYLING (Only if text clip) */}
        {selectedClip.type === 'text' && text && (
          <div className="glass-card rounded-2xl p-3.5 space-y-3 shadow-glass-sm border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent-cyan pb-1 border-b border-white/[0.08]">
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
        <div className="glass-card rounded-2xl p-3.5 space-y-3 shadow-glass-sm border border-white/[0.08]">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
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
              className="p-1 hover:text-white text-editor-dim transition-colors cursor-pointer"
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
              className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
          </div>
        </div>

        {/* 3D SPATIAL & DEPTH TRANSFORM SECTION (Video, Image, Text) */}
        {selectedClip.type !== 'audio' && (
          <div className="glass-card rounded-2xl p-3.5 space-y-3 shadow-glass-sm border border-white/[0.08]">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
                <Box className="w-3.5 h-3.5" /> 3D Spatial & Depth
              </span>
              <button
                onClick={() =>
                  updateClipTransform(selectedClip.id, {
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    z: 0,
                    perspective: 1000,
                    depthShadow: false,
                  })
                }
                title="Reset 3D Transform"
                className="p-1 hover:text-white text-editor-dim transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Interactive 3D Mini Wireframe Visualizer */}
            <div className="h-28 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center relative overflow-hidden [perspective:500px] shadow-inner">
              {/* Background 3D grid plane */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(0, 229, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.4) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                  transform: 'rotateX(60deg) translateY(20px)',
                }}
              />

              {/* 3D Oriented Mini-Screen */}
              <div
                style={{
                  transform: `rotateX(${transform.rotateX || 0}deg) rotateY(${transform.rotateY || 0}deg) rotateZ(${
                    (transform.rotateZ || 0) + (transform.rotation || 0)
                  }deg) translateZ(${(transform.z || 0) * 0.15}px)`,
                  transition: 'transform 0.08s ease-out',
                  boxShadow: transform.depthShadow
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 0 18px rgba(0, 229, 255, 0.4)'
                    : '0 4px 16px rgba(0, 0, 0, 0.6)',
                }}
                className="w-24 h-16 rounded-xl bg-gradient-to-tr from-accent-cyan/30 via-slate-900/80 to-accent-purple/30 border border-accent-cyan/70 flex flex-col items-center justify-center relative p-1 backdrop-blur-md select-none shadow-glow-cyan/20"
              >
                <span className="text-[9px] font-mono font-bold text-accent-cyan tracking-wider uppercase drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]">
                  3D PLANE
                </span>
                <span className="text-[8px] text-editor-dim font-mono">
                  {transform.rotateX || 0}°X • {transform.rotateY || 0}°Y
                </span>
                {/* 3D Axis Indicator */}
                <div className="absolute top-1 left-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_4px_#f87171]" title="X-Axis (Pitch)" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" title="Y-Axis (Yaw)" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_#60a5fa]" title="Z-Axis (Depth)" />
                </div>
              </div>

              <div className="absolute bottom-1.5 right-2.5 text-[9px] font-mono text-editor-dim">
                Z: {transform.z || 0}px
              </div>
            </div>

            {/* Quick 3D Presets Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-editor-dim font-medium">Spatial Presets</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS_3D.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      updateClipTransform(selectedClip.id, {
                        rotateX: preset.rotateX,
                        rotateY: preset.rotateY,
                        rotateZ: preset.rotateZ,
                        z: preset.z,
                        perspective: preset.perspective,
                        depthShadow: preset.depthShadow ?? false,
                      })
                    }
                    className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] text-editor-subtext hover:text-accent-cyan hover:border-accent-cyan/40 transition-all cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Pitch (X) & 3D Yaw (Y) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-editor-dim">Pitch X (Tilt)</span>
                  <span className="text-editor-text font-mono">{transform.rotateX || 0}°</span>
                </div>
                <input
                  type="range"
                  min={-85}
                  max={85}
                  value={transform.rotateX || 0}
                  onChange={(e) => updateClipTransform(selectedClip.id, { rotateX: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-editor-dim">Yaw Y (Turn)</span>
                  <span className="text-editor-text font-mono">{transform.rotateY || 0}°</span>
                </div>
                <input
                  type="range"
                  min={-85}
                  max={85}
                  value={transform.rotateY || 0}
                  onChange={(e) => updateClipTransform(selectedClip.id, { rotateY: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>

            {/* 3D Roll (Z) & Depth (Z Position) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-editor-dim">Roll Z</span>
                  <span className="text-editor-text font-mono">{transform.rotateZ || 0}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={transform.rotateZ || 0}
                  onChange={(e) => updateClipTransform(selectedClip.id, { rotateZ: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-editor-dim">Depth Z</span>
                  <span className="text-editor-text font-mono">{transform.z || 0}px</span>
                </div>
                <input
                  type="range"
                  min={-500}
                  max={500}
                  step={10}
                  value={transform.z || 0}
                  onChange={(e) => updateClipTransform(selectedClip.id, { z: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>

            {/* Camera Perspective & Dynamic 3D Shadow */}
            <div className="space-y-2 pt-1 border-t border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-editor-dim">Camera Perspective</span>
                  <span className="text-editor-text font-mono">{transform.perspective || 1000}px</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={2500}
                  step={50}
                  value={transform.perspective || 1000}
                  onChange={(e) => updateClipTransform(selectedClip.id, { perspective: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={!!transform.depthShadow}
                  onChange={(e) => updateClipTransform(selectedClip.id, { depthShadow: e.target.checked })}
                  className="rounded bg-slate-900 border-white/20 text-accent-cyan focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] text-editor-subtext font-medium select-none">
                  Cast 3D Depth Shadow on Floor
                </span>
              </label>
            </div>
          </div>
        )}

        {/* COLOR ADJUSTMENTS SECTION (Video & Image) */}
        {(selectedClip.type === 'video' || selectedClip.type === 'image') && (
          <div className="glass-card rounded-2xl p-3.5 space-y-3 shadow-glass-sm border border-white/[0.08]">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
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
                    filterPreset: 'original',
                    filterIntensity: 100,
                  })
                }
                title="Reset All Adjustments & Filters"
                className="p-1 hover:text-white text-editor-dim transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Active Filter Preset & Intensity */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-6 h-6 rounded-lg shadow-inner shrink-0 border border-white/20"
                    style={{ background: activeFilterDef.thumbnailGradient }}
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-editor-text block truncate leading-none">
                      {activeFilterDef.name}
                    </span>
                    <span className="text-[9px] text-editor-dim">Filter Preset</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {hasFilter && (
                    <button
                      onClick={() => resetClipFilter(selectedClip.id)}
                      title="Reset Filter to Original"
                      className="text-[10px] text-editor-dim hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('filters')}
                    title="Open Filters Library"
                    className="flex items-center gap-1 text-[10px] font-semibold text-accent-cyan hover:text-white px-2.5 py-1 rounded-full glass-pill border border-accent-cyan/30 transition-all cursor-pointer shadow-glow-cyan/20"
                  >
                    <span>Browse</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Intensity Slider if filter is applied */}
              {hasFilter && (
                <div className="space-y-1 pt-1.5 border-t border-white/[0.08]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-editor-subtext">Filter Intensity</span>
                    <span className="text-editor-text font-mono text-accent-cyan">
                      {adjustments.filterIntensity ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={adjustments.filterIntensity ?? 100}
                    onChange={(e) => setFilterIntensity(selectedClip.id, parseInt(e.target.value))}
                    className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                  />
                </div>
              )}
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>
          </div>
        )}

        {/* SPEED CONTROL SECTION */}
        <div className="glass-card rounded-2xl p-3.5 space-y-2.5 shadow-glass-sm border border-white/[0.08]">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
            <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
              <Gauge className="w-3.5 h-3.5" /> Playback Speed
            </span>
            <span className="text-xs font-mono font-bold text-accent-purple drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]">
              {speed}x
            </span>
          </div>

          <div className="flex justify-between gap-1.5 pt-1">
            {[0.5, 1.0, 1.5, 2.0, 4.0].map((s) => (
              <button
                key={s}
                onClick={() => updateClipSpeed(selectedClip.id, s)}
                className={`flex-1 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                  speed === s
                    ? 'glass-pill-active'
                    : 'glass-pill text-editor-subtext hover:text-white'
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
            className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan mt-1"
          />
        </div>

        {/* AUDIO SECTION (Video & Audio clips) */}
        {(selectedClip.type === 'video' || selectedClip.type === 'audio') && (
          <div className="glass-card rounded-2xl p-3.5 space-y-3 shadow-glass-sm border border-white/[0.08]">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <span className="flex items-center gap-2 text-xs font-semibold text-accent-cyan">
                <Volume2 className="w-3.5 h-3.5" /> Audio & Fades
              </span>
              <button
                onClick={() => updateClipAudio(selectedClip.id, { isMuted: !audio.isMuted })}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
                  audio.isMuted
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'glass-pill text-editor-subtext hover:text-white'
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
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
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
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
