import { describe, it, expect } from 'vitest';
import { parseMp4DurationFromBuffer } from '../../src/utils/mediaDuration';
import { useMediaStore } from '../../src/store/useMediaStore';
import { useEditorStore } from '../../src/store/useEditorStore';
import { formatTimecode, formatCompactTime } from '../../src/utils/timecode';
import { TimelineClip } from '../../src/types/timeline';

describe('MP4 Box Duration Parsing', () => {
  it('correctly parses duration from synthetic MP4 mvhd version 0 box', () => {
    // Build a minimal synthetic moov -> mvhd box
    // mvhd structure (version 0):
    // 4 bytes size, 4 bytes 'mvhd', 1 byte version (0), 3 bytes flags,
    // 4 bytes creation_time, 4 bytes mod_time, 4 bytes timescale, 4 bytes duration
    const timescale = 1000;
    const duration = 110000; // 110 seconds = 1 min 50 sec

    const mvhdData = new Uint8Array(32);
    const mvhdView = new DataView(mvhdData.buffer);
    mvhdView.setUint32(0, 32); // size = 32
    mvhdData.set([0x6d, 0x76, 0x68, 0x64], 4); // 'mvhd'
    mvhdView.setUint8(8, 0); // version 0
    mvhdView.setUint32(12, 0); // creation time
    mvhdView.setUint32(16, 0); // mod time
    mvhdView.setUint32(20, timescale); // timescale = 1000
    mvhdView.setUint32(24, duration); // duration = 110000

    // moov box enclosing mvhd:
    // 4 bytes size (8 + 32 = 40), 4 bytes 'moov', followed by mvhd
    const moovData = new Uint8Array(40);
    const moovView = new DataView(moovData.buffer);
    moovView.setUint32(0, 40);
    moovData.set([0x6d, 0x6f, 0x6f, 0x76], 4); // 'moov'
    moovData.set(mvhdData, 8);

    const parsed = parseMp4DurationFromBuffer(moovData.buffer);
    expect(parsed).toBe(110.0);
  });

  it('correctly parses duration from synthetic MP4 mvhd version 1 (64-bit) box', () => {
    const timescale = 600;
    const duration = 66000; // 110 seconds (1m50s) * 600 = 66000

    // mvhd structure (version 1):
    // 4 bytes size, 4 bytes 'mvhd', 1 byte version (1), 3 bytes flags,
    // 8 bytes creation, 8 bytes mod, 4 bytes timescale, 8 bytes duration
    const mvhdData = new Uint8Array(44);
    const mvhdView = new DataView(mvhdData.buffer);
    mvhdView.setUint32(0, 44);
    mvhdData.set([0x6d, 0x76, 0x68, 0x64], 4);
    mvhdView.setUint8(8, 1); // version 1
    // creation (8 bytes at 12) + mod (8 bytes at 20) -> timescale at 28
    mvhdView.setUint32(28, timescale);
    // duration (8 bytes at 32: high 32 bits at 32, low 32 bits at 36)
    mvhdView.setUint32(32, 0);
    mvhdView.setUint32(36, duration);

    const moovData = new Uint8Array(52);
    const moovView = new DataView(moovData.buffer);
    moovView.setUint32(0, 52);
    moovData.set([0x6d, 0x6f, 0x6f, 0x76], 4);
    moovData.set(mvhdData, 8);

    const parsed = parseMp4DurationFromBuffer(moovData.buffer);
    expect(parsed).toBe(110.0);
  });

  it('returns null safely for corrupt or non-mp4 buffers', () => {
    const randomData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(parseMp4DurationFromBuffer(randomData.buffer)).toBeNull();
  });
});

describe('Store Duration Self-Healing for Long Videos (1m50s)', () => {
  it('updates media item duration in useMediaStore when true duration is discovered', () => {
    const store = useMediaStore.getState();
    store.loadPersistedManifest([
      {
        id: 'media-test-1',
        name: 'sample_1m50s.mp4',
        type: 'video',
        mimeType: 'video/mp4',
        sizeBytes: 15000000,
        duration: 10, // Initial defaulted duration
        width: 1920,
        height: 1080,
        dateAdded: Date.now(),
      },
    ]);

    // Update with real 110s (1m50s) duration
    store.updateMediaDuration('media-test-1', 110.0);

    const item = useMediaStore.getState().items.find((i) => i.id === 'media-test-1');
    expect(item?.duration).toBe(110.0);
  });

  it('syncs clip duration and sourceDuration on timeline when video duration is resolved', () => {
    const editor = useEditorStore.getState();
    const clipId = 'clip-test-1';
    const mediaId = 'media-test-1';

    const initialClip: TimelineClip = {
      id: clipId,
      trackId: 'track-video-1',
      mediaId: mediaId,
      type: 'video',
      title: 'sample_1m50s.mp4',
      startTimeOnTimeline: 0,
      duration: 10.0, // Initially defaulted to 10s
      inPoint: 0,
      sourceDuration: 10.0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 },
      adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, blur: 0, vignette: 0, filterPreset: 'none' },
      audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
    };

    editor.loadProjectData(editor.tracks, [initialClip]);

    // Self-healing trigger when video element loads 110s
    editor.syncClipDurationsWithMedia(mediaId, 110.0);

    const updated = useEditorStore.getState().clips.find((c) => c.id === clipId);
    expect(updated?.sourceDuration).toBe(110.0);
    expect(updated?.duration).toBe(110.0);
  });

  it('formats 110 seconds accurately as 00:01:50:00 (1 min 50 sec)', () => {
    expect(formatTimecode(110, 30)).toBe('00:01:50:00');
    expect(formatCompactTime(110)).toBe('01:50.00');
  });

  it('calculates zoom to fit for a 110s video timeline', () => {
    const editor = useEditorStore.getState();
    editor.zoomToFit(1200); // 1200px wide timeline container
    // For 110s + 5s = 115s total, (1200 - 100) / 115 ~= 9.5 -> clamped to min 10 px/sec
    expect(useEditorStore.getState().pixelsPerSecond).toBeGreaterThanOrEqual(10);
  });

  it('scales clip duration proportionally when changing clip speed to 2x or 1.5x without lagging', () => {
    const editor = useEditorStore.getState();
    const clipId = 'clip-speed-test';

    const testClip: TimelineClip = {
      id: clipId,
      trackId: 'track-video-1',
      type: 'video',
      title: 'clip_speed.mp4',
      startTimeOnTimeline: 0,
      duration: 10.0,
      inPoint: 0,
      sourceDuration: 10.0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 },
      adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, blur: 0, vignette: 0, filterPreset: 'none' },
      audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
    };

    editor.loadProjectData(editor.tracks, [testClip]);

    // Speed up to 2x -> duration should become 5s
    editor.updateClipSpeed(clipId, 2.0);
    let clip = useEditorStore.getState().clips.find((c) => c.id === clipId);
    expect(clip?.speed).toBe(2.0);
    expect(clip?.duration).toBe(5.0);

    // Speed up to 1.5x from 2x -> duration should become 5.0 * (2.0 / 1.5) = 6.67s
    editor.updateClipSpeed(clipId, 1.5);
    clip = useEditorStore.getState().clips.find((c) => c.id === clipId);
    expect(clip?.speed).toBe(1.5);
    expect(clip?.duration).toBeCloseTo(6.67, 1);
  });
});
