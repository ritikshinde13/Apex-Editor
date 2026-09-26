import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineRuler } from './TimelineRuler';
import { TrackHeader } from './TrackHeader';
import { ClipBlock } from './ClipBlock';
import { Playhead } from './Playhead';

export const Timeline: React.FC = () => {
  const {
    tracks,
    clips,
    pixelsPerSecond,
    selectedClipId,
    splitClip,
    removeClip,
    undo,
    redo,
    setSelectedClipId,
    zoomToFit,
  } = useEditorStore();

  const { currentTime, togglePlay, stepFrames } = usePlaybackStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Compute total timeline duration
  const totalDuration = useMemo(() => {
    if (clips.length === 0) return 30.0;
    const maxEnd = Math.max(...clips.map((c) => c.startTimeOnTimeline + c.duration));
    return Math.max(30.0, maxEnd + 15.0);
  }, [clips]);

  const timelineContentWidth = Math.max(1200, totalDuration * pixelsPerSecond + 400);

  // Keep scrollLeft state updated
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Space: Play / Pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }

      // Left Arrow: Step back 1 frame
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrames(e.shiftKey ? -5 : -1);
      }

      // Right Arrow: Step forward 1 frame
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrames(e.shiftKey ? 5 : 1);
      }

      // Delete or Backspace: Delete selected clip
      if (e.code === 'Delete' || e.code === 'Backspace') {
        if (selectedClipId) {
          e.preventDefault();
          removeClip(selectedClipId);
        }
      }

      // Split clip: 'S' or Ctrl+B / Cmd+B
      if (e.code === 'KeyS' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyB')) {
        if (selectedClipId) {
          e.preventDefault();
          splitClip(selectedClipId, currentTime);
        }
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyZ')
      ) {
        e.preventDefault();
        redo();
      }

      // Zoom to fit timeline: Ctrl+0 / Cmd+0
      if ((e.ctrlKey || e.metaKey) && e.code === 'Digit0') {
        e.preventDefault();
        zoomToFit(scrollContainerRef.current?.clientWidth || 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedClipId,
    currentTime,
    togglePlay,
    stepFrames,
    removeClip,
    splitClip,
    undo,
    redo,
    zoomToFit,
  ]);

  // Deselect clip on clicking empty timeline background
  const handleTimelineBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedClipId(null);
    }
  };

  const timelineHeight = tracks.length * 56 + 32;

  return (
    <div className="h-72 backdrop-blur-2xl bg-editor-panel/75 border-t border-white/[0.08] flex flex-col select-none relative z-20 shadow-glass specular-border">
      {/* Top Controls Toolbar */}
      <TimelineToolbar />

      {/* Timeline Workspace (Track Headers + Scrollable Lanes) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Frozen Column: Track Headers */}
        <div className="w-48 backdrop-blur-xl bg-black/40 border-r border-white/[0.08] flex flex-col shrink-0 z-30 shadow-glass-sm">
          {/* Ruler offset spacer */}
          <div className="h-7 backdrop-blur-md bg-white/[0.02] border-b border-white/[0.08] flex items-center px-3 text-[10px] uppercase font-bold text-editor-dim tracking-wider">
            Tracks
          </div>

          {/* Track Headers */}
          <div className="flex-1 overflow-hidden">
            {tracks.map((track) => (
              <TrackHeader key={track.id} track={track} />
            ))}
          </div>
        </div>

        {/* Right Scrollable Area: Ruler, Playhead, Track Lanes */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-black/25 backdrop-blur-sm timeline-grid-pattern"
        >
          <div style={{ width: `${timelineContentWidth}px` }} className="relative">
            {/* Dynamic Time Ruler */}
            <TimelineRuler
              totalDuration={totalDuration}
              pixelsPerSecond={pixelsPerSecond}
              scrollLeft={scrollLeft}
            />

            {/* Playhead Needle */}
            <Playhead
              currentTime={currentTime}
              pixelsPerSecond={pixelsPerSecond}
              timelineHeight={timelineHeight}
            />

            {/* Track Lanes */}
            <div
              onClick={handleTimelineBackgroundClick}
              className="flex flex-col"
            >
              {tracks.map((track) => (
                <div
                  key={track.id}
                  style={{ width: `${timelineContentWidth}px` }}
                  className={`h-14 border-b border-white/[0.05] relative hover:bg-white/[0.015] transition-colors ${
                    track.isLocked ? 'bg-black/60 pointer-events-none opacity-50' : ''
                  }`}
                >
                  {/* Render clips residing on this track */}
                  {clips
                    .filter((clip) => clip.trackId === track.id)
                    .map((clip) => (
                      <ClipBlock
                        key={clip.id}
                        clip={clip}
                        pixelsPerSecond={pixelsPerSecond}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
