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
    <div className="h-10 bg-editor-panel border-b border-editor-border px-3 flex items-center justify-between select-none shrink-0">
      {/* Left Editing Tools */}
      <div className="flex items-center gap-1.5">
        {/* Pointer / Select Tool */}
        <button
          onClick={() => setActiveTool('select')}
          title="Selection Tool (V)"
          className={`p-1.5 rounded-lg border transition-all ${
            activeTool === 'select'
              ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40 shadow-glow-cyan'
              : 'bg-editor-surface text-editor-dim border-editor-border hover:text-editor-text'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
        </button>

        {/* Razor / Split Tool */}
        <button
          onClick={() => setActiveTool('razor')}
          title="Razor Cut Tool (C)"
          className={`p-1.5 rounded-lg border transition-all ${
            activeTool === 'razor'
              ? 'bg-accent-danger/20 text-accent-danger border-accent-danger/40'
              : 'bg-editor-surface text-editor-dim border-editor-border hover:text-editor-text'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-editor-border mx-1" />

        {/* Split Selected at Playhead Action */}
        <button
          onClick={handleSplit}
          disabled={!selectedClipId}
          title="Split Selected Clip at Playhead (S or Ctrl+B)"
          className="px-2.5 py-1 rounded-lg bg-editor-surface hover:bg-editor-hover text-editor-subtext hover:text-editor-text border border-editor-border disabled:opacity-30 disabled:pointer-events-none text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Scissors className="w-3 h-3 text-accent-cyan" />
          <span>Split</span>
        </button>

        {/* Delete Selected Action */}
        <button
          onClick={handleDelete}
          disabled={!selectedClipId}
          title="Delete Selected Clip (Del / Backspace)"
          className="px-2.5 py-1 rounded-lg bg-editor-surface hover:bg-accent-danger/20 text-editor-subtext hover:text-accent-danger border border-editor-border disabled:opacity-30 disabled:pointer-events-none text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>

        <div className="h-4 w-[1px] bg-editor-border mx-1" />

        {/* Snapping Toggle */}
        <button
          onClick={toggleSnapping}
          title={snappingEnabled ? 'Snapping (ON)' : 'Snapping (OFF)'}
          className={`p-1.5 rounded-lg border transition-all ${
            snappingEnabled
              ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40'
              : 'bg-editor-surface text-editor-dim border-editor-border hover:text-editor-text'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>

        {/* Ripple Mode Toggle */}
        <button
          onClick={toggleRipple}
          title={rippleEnabled ? 'Ripple Edit (ON)' : 'Ripple Edit (OFF)'}
          className={`p-1.5 rounded-lg border transition-all ${
            rippleEnabled
              ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/40'
              : 'bg-editor-surface text-editor-dim border-editor-border hover:text-editor-text'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Zoom & Add Track Tools */}
      <div className="flex items-center gap-2">
        {/* Add Track Buttons */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => addTrack('video')}
            className="px-2 py-0.5 rounded bg-editor-surface hover:bg-editor-hover border border-editor-border text-[11px] text-editor-subtext hover:text-editor-text flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-accent-cyan" /> Video Track
          </button>
          <button
            onClick={() => addTrack('audio')}
            className="px-2 py-0.5 rounded bg-editor-surface hover:bg-editor-hover border border-editor-border text-[11px] text-editor-subtext hover:text-editor-text flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-accent-purple" /> Audio Track
          </button>
        </div>

        <div className="h-4 w-[1px] bg-editor-border mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(pixelsPerSecond - 15)}
            title="Zoom Out (-)"
            className="p-1 rounded hover:bg-editor-surface text-editor-dim hover:text-editor-text transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min={15}
            max={200}
            value={pixelsPerSecond}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="w-20 h-1 bg-editor-surface rounded appearance-none cursor-pointer accent-accent-cyan"
          />

          <button
            onClick={() => setZoom(pixelsPerSecond + 15)}
            title="Zoom In (+)"
            className="p-1 rounded hover:bg-editor-surface text-editor-dim hover:text-editor-text transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom(60)}
            title="Reset Zoom (Fit)"
            className="p-1 rounded hover:bg-editor-surface text-editor-dim hover:text-editor-text transition-colors ml-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
