import { describe, it, expect } from 'vitest';
import { formatTimecode, formatCompactTime, parseTimecode, secondsToFrames, framesToSeconds } from '../../src/utils/timecode';
import { calculateSnapPoint } from '../../src/utils/snapping';
import { TimelineClip } from '../../src/types/timeline';
import { historyManager } from '../../src/store/history';

describe('Timecode and Frame Calculations', () => {
  it('converts seconds to frames and back accurately at 30 fps', () => {
    const fps = 30;
    const seconds = 2.5;
    const frames = secondsToFrames(seconds, fps);
    expect(frames).toBe(75);
    expect(framesToSeconds(frames, fps)).toBe(2.5);
  });

  it('formats SMPTE timecode correctly for standard durations', () => {
    expect(formatTimecode(0, 30)).toBe('00:00:00:00');
    expect(formatTimecode(1.0, 30)).toBe('00:00:01:00');
    expect(formatTimecode(65.5, 30)).toBe('00:01:05:15');
    expect(formatTimecode(3661.1, 30)).toBe('01:01:01:03');
  });

  it('formats compact time accurately', () => {
    expect(formatCompactTime(0)).toBe('00:00.00');
    expect(formatCompactTime(12.34)).toBe('00:12.34');
    expect(formatCompactTime(75.5)).toBe('01:15.50');
  });

  it('parses SMPTE timecode back to seconds', () => {
    const originalSeconds = 65.5; // 00:01:05:15 at 30fps
    const tc = formatTimecode(originalSeconds, 30);
    const parsed = parseTimecode(tc, 30);
    expect(parsed).toBeCloseTo(originalSeconds, 2);
  });
});

describe('Magnetic Snapping Math', () => {
  const mockClips: TimelineClip[] = [
    {
      id: 'clip-1',
      trackId: 'track-1',
      type: 'video',
      title: 'Intro',
      startTimeOnTimeline: 2.0,
      duration: 5.0, // Ends at 7.0
      inPoint: 0,
      sourceDuration: 10.0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 },
      adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, blur: 0, vignette: 0, filterPreset: 'none' },
      audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
    },
  ];

  it('magnetically snaps within threshold distance', () => {
    const pixelsPerSecond = 50;
    // 7.0 is clip end. 7.1s is 5px away (threshold is 10px = 0.2s)
    const targetTime = 7.1;
    const snap = calculateSnapPoint(targetTime, mockClips, null, 0, pixelsPerSecond, 10);
    expect(snap.hasSnapped).toBe(true);
    expect(snap.snappedTime).toBe(7.0);
  });

  it('does not snap if outside threshold distance', () => {
    const pixelsPerSecond = 50;
    // 7.5s is 25px away (> 10px threshold)
    const targetTime = 7.5;
    const snap = calculateSnapPoint(targetTime, mockClips, null, 0, pixelsPerSecond, 10);
    expect(snap.snappedTime).toBe(7.5);
  });
});

describe('Undo / Redo History Ring Buffer', () => {
  it('records state and successfully restores previous state on undo', () => {
    historyManager.clear();

    const trackA = [{ id: 't1', type: 'video' as const, index: 0, name: 'V1', isMuted: false, isLocked: false, isHidden: false, volume: 1 }];
    const clipsA: TimelineClip[] = [];

    // Action 1: Add Clip
    historyManager.recordState(trackA, clipsA, 'Add Clip');

    const clipsB: TimelineClip[] = [
      {
        id: 'c1',
        trackId: 't1',
        type: 'video',
        title: 'Clip 1',
        startTimeOnTimeline: 0,
        duration: 4,
        inPoint: 0,
        sourceDuration: 10,
        speed: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 },
        adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, blur: 0, vignette: 0, filterPreset: 'none' },
        audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
      },
    ];

    expect(historyManager.canUndo()).toBe(true);

    // Perform Undo
    const undone = historyManager.undo(trackA, clipsB);
    expect(undone).not.toBeNull();
    expect(undone!.clips.length).toBe(0);

    // Perform Redo
    expect(historyManager.canRedo()).toBe(true);
    const redone = historyManager.redo(trackA, clipsA);
    expect(redone).not.toBeNull();
    expect(redone!.clips.length).toBe(1);
    expect(redone!.clips[0].id).toBe('c1');
  });
});
