import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { useUIStore } from '@/store/useUIStore';
import {
  Scissors,
  Trash2,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Magnet,
  Layers,
  Plus,
} from 'lucide-react';

export const TimelineToolbar: React.FC = () => {
  const {
    selectedClipId,
    splitClip,
    removeClip,
    pixelsPerSecond,
    setZoom,
    snappingEnabled,
    toggleSnapping,
    rippleEnabled,
    toggleRipple,
    addTrack,
    zoomToFit,
  } = useEditorStore();

  const { currentTime } = usePlaybackStore();
  const { activeTool, setActiveTool, showToast } = useUIStore();

  const handleSplit = () => {
    if (!selectedClipId) {
      showToast({
        type: 'warning',
        title: 'No Clip Selected',
        message: 'Select a clip under the playhead to split.',
      });
      return;
    }
    splitClip(selectedClipId, currentTime);
  };

  const handleDelete = () => {
    if (selectedClipId) {
      removeClip(selectedClipId);
    }
  };

  return (
    <div className="h-11 backdrop-blur-2xl bg-editor-panel/75 border-b border-white/[0.08] px-4 flex items-center justify-between select-none shrink-0 specular-border">
      {/* Left Editing Tools */}
      <div className="flex items-center gap-2">
        {/* Tool Select Group */}
        <div className="flex items-center glass-pill rounded-full p-0.5 border border-white/10">
          {/* Pointer / Select Tool */}
          <button
            onClick={() => setActiveTool('select')}
            title="Selection Tool (V)"
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              activeTool === 'select'
                ? 'bg-accent-cyan text-black shadow-glow-cyan'
                : 'text-editor-subtext hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>

          {/* Razor / Split Tool */}
          <button
            onClick={() => setActiveTool('razor')}
            title="Razor Cut Tool (C)"
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              activeTool === 'razor'
                ? 'bg-accent-danger text-white shadow-[0_0_10px_#ef4444]'
                : 'text-editor-subtext hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

        {/* Split Selected at Playhead Action */}
        <button
          onClick={handleSplit}
          disabled={!selectedClipId}
          title="Split Selected Clip at Playhead (S or Ctrl+B)"
          className="px-3 py-1 rounded-full glass-pill hover:border-accent-cyan/40 text-editor-subtext hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-glass-sm"
        >
          <Scissors className="w-3 h-3 text-accent-cyan" />
          <span>Split</span>
        </button>

        {/* Delete Selected Action */}
        <button
          onClick={handleDelete}
          disabled={!selectedClipId}
          title="Delete Selected Clip (Del / Backspace)"
          className="px-3 py-1 rounded-full glass-pill hover:bg-rose-500/15 hover:border-rose-500/40 text-editor-subtext hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-glass-sm"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

        {/* Snapping Toggle */}
        <button
          onClick={toggleSnapping}
          title={snappingEnabled ? 'Snapping (ON)' : 'Snapping (OFF)'}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            snappingEnabled
              ? 'glass-pill-active'
              : 'glass-pill text-editor-dim hover:text-editor-text'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>

        {/* Ripple Mode Toggle */}
        <button
          onClick={toggleRipple}
          title={rippleEnabled ? 'Ripple Edit (ON)' : 'Ripple Edit (OFF)'}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            rippleEnabled
              ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40 shadow-glow-purple'
              : 'glass-pill text-editor-dim hover:text-editor-text'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Zoom & Add Track Tools */}
      <div className="flex items-center gap-3">
        {/* Add Track Buttons in Glass Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => addTrack('video')}
            className="px-3 py-1 rounded-full glass-pill hover:border-accent-cyan/40 text-[11px] font-semibold text-editor-subtext hover:text-white flex items-center gap-1.5 cursor-pointer transition-all shadow-glass-sm"
          >
            <Plus className="w-3 h-3 text-accent-cyan" /> Video Track
          </button>
          <button
            onClick={() => addTrack('audio')}
            className="px-3 py-1 rounded-full glass-pill hover:border-accent-purple/40 text-[11px] font-semibold text-editor-subtext hover:text-white flex items-center gap-1.5 cursor-pointer transition-all shadow-glass-sm"
          >
            <Plus className="w-3 h-3 text-accent-purple" /> Audio Track
          </button>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

        {/* Zoom Controls in Frosted Capsule */}
        <div className="flex items-center gap-1.5 glass-pill px-2.5 py-0.5 rounded-full border border-white/10">
          <button
            onClick={() => setZoom(pixelsPerSecond - 15)}
            title="Zoom Out (-)"
            className="p-1 rounded-full hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min={15}
            max={200}
            value={pixelsPerSecond}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent-cyan"
          />

          <button
            onClick={() => setZoom(pixelsPerSecond + 15)}
            title="Zoom In (+)"
            className="p-1 rounded-full hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => zoomToFit(window.innerWidth - 300)}
            title="Fit to Timeline (Ctrl+0 / Cmd+0)"
            className="p-1 rounded-full hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-colors ml-0.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
