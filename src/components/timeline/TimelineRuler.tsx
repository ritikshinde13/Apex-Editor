import React, { useRef } from 'react';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { formatCompactTime } from '@/utils/timecode';

interface TimelineRulerProps {
  totalDuration: number;
  pixelsPerSecond: number;
  scrollLeft: number;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  totalDuration,
  pixelsPerSecond,
  scrollLeft,
}) => {
  const { seek } = usePlaybackStore();
  const rulerRef = useRef<HTMLDivElement>(null);

  // Dynamic tick step based on zoom factor
  let stepSeconds = 1;
  if (pixelsPerSecond < 25) stepSeconds = 10;
  else if (pixelsPerSecond < 50) stepSeconds = 5;
  else if (pixelsPerSecond < 100) stepSeconds = 2;
  else stepSeconds = 1;

  const totalWidth = Math.max(1200, totalDuration * pixelsPerSecond + 400);
  const totalSteps = Math.ceil(totalDuration / stepSeconds) + 10;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!rulerRef.current) return;

    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + scrollLeft;
    const time = Math.max(0, clickX / pixelsPerSecond);
    seek(time);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const moveX = moveEvent.clientX - rect.left + scrollLeft;
      const movedTime = Math.max(0, moveX / pixelsPerSecond);
      seek(movedTime);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      ref={rulerRef}
      onPointerDown={handlePointerDown}
      style={{ width: `${totalWidth}px` }}
      className="h-7 bg-editor-panel/90 border-b border-editor-border relative select-none cursor-pointer overflow-hidden"
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const time = i * stepSeconds;
        const xPos = time * pixelsPerSecond;

        return (
          <div
            key={i}
            style={{ left: `${xPos}px` }}
            className="absolute top-0 bottom-0 flex flex-col justify-end pointer-events-none"
          >
            {/* Major tick mark & text */}
            <span className="text-[10px] font-mono text-editor-dim font-medium pl-1 leading-none mb-1">
              {formatCompactTime(time)}
            </span>
            <div className="w-[1px] h-2.5 bg-editor-border" />
          </div>
        );
      })}
    </div>
  );
};
