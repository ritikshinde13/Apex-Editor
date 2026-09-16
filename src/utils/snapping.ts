import { TimelineClip } from '@/types/timeline';

export interface SnapTarget {
  time: number;
  type: 'clip-start' | 'clip-end' | 'playhead';
}

/**
 * Calculates magnetic snap position if within threshold pixels
 */
export function calculateSnapPoint(
  targetTime: number,
  clips: TimelineClip[],
  excludeClipId: string | null,
  playheadTime: number,
  pixelsPerSecond: number,
  thresholdPixels: number = 10
): { snappedTime: number; hasSnapped: boolean } {
  const thresholdSeconds = thresholdPixels / pixelsPerSecond;
  let closestTime = targetTime;
  let minDiff = Infinity;

  const snapTargets: SnapTarget[] = [
    { time: 0, type: 'clip-start' },
    { time: playheadTime, type: 'playhead' },
  ];

  for (const clip of clips) {
    if (clip.id === excludeClipId) continue;
    snapTargets.push({ time: clip.startTimeOnTimeline, type: 'clip-start' });
    snapTargets.push({ time: clip.startTimeOnTimeline + clip.duration, type: 'clip-end' });
  }

  for (const target of snapTargets) {
    const diff = Math.abs(target.time - targetTime);
    if (diff <= thresholdSeconds && diff < minDiff) {
      minDiff = diff;
      closestTime = target.time;
    }
  }

  return {
    snappedTime: closestTime,
    hasSnapped: minDiff !== Infinity,
  };
}
