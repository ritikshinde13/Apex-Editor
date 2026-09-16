import React, { useRef } from 'react';
import { usePlaybackStore } from '@/store/usePlaybackStore';

interface PlayheadProps {
  currentTime: number;
  pixelsPerSecond: number;
  timelineHeight: number;
}

export const Playhead: React.FC<PlayheadProps> = ({
  currentTime,
  pixelsPerSecond,
  timelineHeight,
}) => {
  const { seek } = usePlaybackStore();
  const handleRef = useRef<HTMLDivElement>(null);

  const xPos = currentTime * pixelsPerSecond;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialTime = currentTime;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newTime = Math.max(0, initialTime + deltaX / pixelsPerSecond);
      seek(newTime);
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
      style={{ left: `${xPos}px` }}
      className="absolute top-0 bottom-0 pointer-events-none z-40 -ml-[1px]"
    >
      {/* Needle Line */}
      <div
        style={{ height: `${timelineHeight}px` }}
        className="w-[2px] bg-accent-danger shadow-[0_0_8px_rgba(239,68,68,0.8)] relative"
      >
        {/* Playhead Top Scrub Handle */}
        <div
          ref={handleRef}
          onPointerDown={handlePointerDown}
          className="pointer-events-auto absolute -top-0 -left-[6px] w-[14px] h-[16px] bg-accent-danger rounded-b-sm cursor-ew-resize shadow-md flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <div className="w-[2px] h-2 bg-white/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
