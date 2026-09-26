import React, { useRef } from 'react';
import { TimelineClip } from '@/types/timeline';
import { useEditorStore } from '@/store/useEditorStore';
import { useMediaStore } from '@/store/useMediaStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { useUIStore } from '@/store/useUIStore';
import { calculateSnapPoint } from '@/utils/snapping';
import { Film, Music, Type, Image as ImageIcon } from 'lucide-react';

interface ClipBlockProps {
  clip: TimelineClip;
  pixelsPerSecond: number;
}

export const ClipBlock: React.FC<ClipBlockProps> = ({ clip, pixelsPerSecond }) => {
  const {
    clips,
    selectedClipId,
    setSelectedClipId,
    moveClip,
    trimClip,
    splitClip,
    snappingEnabled,
  } = useEditorStore();

  const { items } = useMediaStore();
  const { currentTime } = usePlaybackStore();
  const { activeTool } = useUIStore();

  const isSelected = selectedClipId === clip.id;
  const media = items.find((m) => m.id === clip.mediaId);

  const blockRef = useRef<HTMLDivElement>(null);

  const xPos = clip.startTimeOnTimeline * pixelsPerSecond;
  const widthPx = Math.max(15, clip.duration * pixelsPerSecond);

  // Handle Drag Move
  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'razor') {
      // Cut directly at click position
      const rect = blockRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = e.clientX - rect.left;
        const splitTime = clip.startTimeOnTimeline + clickX / pixelsPerSecond;
        splitClip(clip.id, splitTime);
      }
      return;
    }

    e.stopPropagation();
    setSelectedClipId(clip.id);

    const startX = e.clientX;
    const initialStartTime = clip.startTimeOnTimeline;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newStartTime = Math.max(0, initialStartTime + deltaX / pixelsPerSecond);

      if (snappingEnabled) {
        const snap = calculateSnapPoint(
          newStartTime,
          clips,
          clip.id,
          currentTime,
          pixelsPerSecond
        );
        newStartTime = snap.snappedTime;
      }

      moveClip(clip.id, clip.trackId, newStartTime);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Handle Left Edge Trim
  const handleLeftTrim = (e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const origStartTime = clip.startTimeOnTimeline;
    const origDuration = clip.duration;
    const origInPoint = clip.inPoint;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaSeconds = (moveEvent.clientX - startX) / pixelsPerSecond;
      const maxDelta = origDuration - 0.2; // Don't shrink to zero
      const clampedDelta = Math.max(-origInPoint, Math.min(maxDelta, deltaSeconds));

      const newStartTime = origStartTime + clampedDelta;
      const newDuration = origDuration - clampedDelta;
      const newInPoint = origInPoint + clampedDelta * clip.speed;

      trimClip(clip.id, 'left', newDuration, newStartTime, newInPoint);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Handle Right Edge Trim
  const handleRightTrim = (e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const origDuration = clip.duration;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaSeconds = (moveEvent.clientX - startX) / pixelsPerSecond;
      let newDuration = Math.max(0.2, origDuration + deltaSeconds);

      if (clip.sourceDuration > 0) {
        const maxAllowed = (clip.sourceDuration - clip.inPoint) / clip.speed;
        newDuration = Math.min(newDuration, maxAllowed);
      }

      trimClip(clip.id, 'right', newDuration);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Track coloring & style with Frosted Glassmorphic gradients
  const getClipStyle = () => {
    switch (clip.type) {
      case 'video':
        return 'backdrop-blur-md bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-blue-900/30 border-cyan-500/40 text-cyan-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]';
      case 'audio':
        return 'backdrop-blur-md bg-gradient-to-r from-emerald-950/40 via-teal-900/40 to-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]';
      case 'text':
        return 'backdrop-blur-md bg-gradient-to-r from-purple-950/40 via-indigo-900/40 to-purple-950/30 border-purple-500/40 text-purple-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]';
      case 'image':
        return 'backdrop-blur-md bg-gradient-to-r from-cyan-950/40 via-sky-900/40 to-cyan-950/30 border-sky-400/40 text-sky-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]';
    }
  };

  return (
    <div
      ref={blockRef}
      onPointerDown={handlePointerDown}
      style={{
        left: `${xPos}px`,
        width: `${widthPx}px`,
      }}
      className={`absolute top-1.5 bottom-1.5 rounded-xl border flex flex-col justify-between overflow-hidden cursor-move transition-all ${getClipStyle()} ${
        isSelected
          ? 'ring-2 ring-accent-cyan border-accent-cyan shadow-glow-cyan z-20 scale-[1.01]'
          : 'hover:border-white/40 z-10 hover:shadow-glass-sm'
      }`}
    >
      {/* Left Trim Handle */}
      <div
        onPointerDown={handleLeftTrim}
        className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/10 hover:bg-accent-cyan/90 cursor-ew-resize z-30 transition-colors group"
      >
        <div className="w-[2px] h-3 bg-white/60 mx-auto mt-3 rounded group-hover:bg-black" />
      </div>

      {/* Content Label & Icon */}
      <div className="flex items-center gap-1.5 px-3 pt-1 pointer-events-none select-none">
        {clip.type === 'video' && <Film className="w-3 h-3 shrink-0 text-cyan-300 drop-shadow-[0_0_4px_rgba(0,229,255,0.5)]" />}
        {clip.type === 'audio' && <Music className="w-3 h-3 shrink-0 text-emerald-300" />}
        {clip.type === 'text' && <Type className="w-3 h-3 shrink-0 text-purple-300" />}
        {clip.type === 'image' && <ImageIcon className="w-3 h-3 shrink-0 text-sky-300" />}

        <span className="text-[11px] font-semibold truncate leading-tight drop-shadow-sm">
          {clip.type === 'text' && clip.text ? clip.text.content : clip.title}
        </span>
      </div>

      {/* Audio Waveform visualization if audio clip */}
      {clip.type === 'audio' && media?.waveformPeaks && (
        <div className="h-4 px-3 flex items-end gap-[1px] pointer-events-none pb-0.5">
          {media.waveformPeaks.map((peak, idx) => (
            <div
              key={idx}
              style={{ height: `${Math.max(15, peak * 100)}%` }}
              className="w-1 bg-emerald-400/70 rounded-t-sm"
            />
          ))}
        </div>
      )}

      {/* Speed Badge if not 1x */}
      {clip.speed !== 1.0 && (
        <span className="absolute bottom-1 right-3 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded-full text-accent-cyan font-bold pointer-events-none border border-white/10">
          {clip.speed}x
        </span>
      )}

      {/* Right Trim Handle */}
      <div
        onPointerDown={handleRightTrim}
        className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/10 hover:bg-accent-cyan/90 cursor-ew-resize z-30 transition-colors group"
      >
        <div className="w-[2px] h-3 bg-white/60 mx-auto mt-3 rounded group-hover:bg-black" />
      </div>
    </div>
  );
};
