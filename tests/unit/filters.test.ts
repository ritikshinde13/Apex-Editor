import { describe, it, expect, beforeEach } from 'vitest';
import {
  FILTERS,
  FILTER_CATEGORIES,
  getFilterById,
  computeFilterCSS,
} from '../../src/core/filters/filterDefinitions';
import { useEditorStore } from '../../src/store/useEditorStore';
import { TimelineClip } from '../../src/types/timeline';

describe('Filter Definitions Registry', () => {
  it('contains at least 35 professional filter presets', () => {
    expect(FILTERS.length).toBeGreaterThanOrEqual(35);
  });

  it('covers all major categories: basic, cinematic, vintage, bw, mood, color', () => {
    const categories = new Set(FILTERS.map((f) => f.category));
    expect(categories.has('basic')).toBe(true);
    expect(categories.has('cinematic')).toBe(true);
    expect(categories.has('vintage')).toBe(true);
    expect(categories.has('bw')).toBe(true);
    expect(categories.has('mood')).toBe(true);
    expect(categories.has('color')).toBe(true);
  });

  it('provides category bar configurations including all, favorites, and recent', () => {
    const categoryIds = FILTER_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain('all');
    expect(categoryIds).toContain('favorites');
    expect(categoryIds).toContain('recent');
    expect(categoryIds).toContain('cinematic');
  });

  it('returns exact filter by ID or falls back to original for invalid ID', () => {
    const tealOrange = getFilterById('teal-orange');
    expect(tealOrange.id).toBe('teal-orange');
    expect(tealOrange.name).toBe('Teal & Orange');

    const invalid = getFilterById('non-existent-filter-id');
    expect(invalid.id).toBe('original');
    expect(invalid.name).toBe('Original');
  });
});

describe('Filter CSS and Intensity Interpolation Engine', () => {
  it('computes CSS filter at 100% intensity for monochrome B&W filter', () => {
    const result = computeFilterCSS('noir', 100);
    expect(result.cssFilterString).toContain('grayscale(100%)');
    expect(result.cssFilterString).toContain('contrast(');
  });

  it('interpolates filter intensity down to 0% returning clean original footage', () => {
    const atZero = computeFilterCSS('noir', 0);
    expect(atZero.cssFilterString).toBe('none');
    expect(atZero.colorOverlay).toBeUndefined();
    expect(atZero.vignette).toBe(0);
  });

  it('interpolates filter adjustments linearly at 50% intensity', () => {
    // contrast filter has adjustments: { contrast: 38, saturation: 10 }
    // at 50% factor: contrast delta = 19 (119%), saturation delta = 5 (105%)
    const result50 = computeFilterCSS('contrast', 50);
    expect(result50.cssFilterString).toContain('contrast(119%)');
    expect(result50.cssFilterString).toContain('saturate(105%)');
  });

  it('merges user base adjustments seamlessly with filter preset deltas', () => {
    const baseAdjustments = {
      brightness: 10,
      contrast: 5,
      saturation: 0,
      exposure: 0,
      temperature: 0,
      blur: 0,
      vignette: 15,
      filterPreset: 'bright',
      filterIntensity: 100,
    };

    // bright filter adds brightness: 18, contrast: 8, saturation: 12
    // with base: brightness = 10 + 18 = 28 -> 128%, contrast = 5 + 8 = 13 -> 113%
    const result = computeFilterCSS('bright', 100, baseAdjustments);
    expect(result.cssFilterString).toContain('brightness(128%)');
    expect(result.cssFilterString).toContain('contrast(113%)');
    expect(result.cssFilterString).toContain('saturate(112%)');
  });

  it('scales color overlay opacity according to filter intensity', () => {
    // romantic has colorOverlay: 'rgba(251, 113, 133, 0.15)'
    const result100 = computeFilterCSS('romantic', 100);
    expect(result100.colorOverlay).toBeDefined();
    expect(result100.colorOverlay).toContain('rgba(251, 113, 133');

    const result50 = computeFilterCSS('romantic', 50);
    expect(result50.colorOverlay).toBeDefined();
    // 0.15 * 0.5 = 0.075
    expect(result50.colorOverlay).toContain('0.075');
  });
});

describe('Timeline Filter State Management', () => {
  const testClip1: TimelineClip = {
    id: 'clip-test-1',
    trackId: 'track-v1',
    type: 'video',
    title: 'Clip 1',
    startTimeOnTimeline: 0,
    duration: 5,
    inPoint: 0,
    sourceDuration: 10,
    speed: 1,
    transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      temperature: 0,
      blur: 0,
      vignette: 0,
      filterPreset: 'original',
      filterIntensity: 100,
    },
    audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
  };

  const testClip2: TimelineClip = {
    id: 'clip-test-2',
    trackId: 'track-v1',
    type: 'video',
    title: 'Clip 2',
    startTimeOnTimeline: 5,
    duration: 5,
    inPoint: 0,
    sourceDuration: 10,
    speed: 1,
    transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      temperature: 0,
      blur: 0,
      vignette: 0,
      filterPreset: 'original',
      filterIntensity: 100,
    },
    audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
  };

  beforeEach(() => {
    useEditorStore.setState({
      clips: [JSON.parse(JSON.stringify(testClip1)), JSON.parse(JSON.stringify(testClip2))],
      selectedClipId: 'clip-test-1',
    });
  });

  it('applies a filter preset and intensity to a specific clip', () => {
    useEditorStore.getState().applyFilterToClip('clip-test-1', 'cinematic-warm', 85);
    const clip = useEditorStore.getState().clips.find((c) => c.id === 'clip-test-1');
    expect(clip?.adjustments.filterPreset).toBe('cinematic-warm');
    expect(clip?.adjustments.filterIntensity).toBe(85);

    // Other clip should remain unchanged
    const otherClip = useEditorStore.getState().clips.find((c) => c.id === 'clip-test-2');
    expect(otherClip?.adjustments.filterPreset).toBe('original');
  });

  it('updates intensity of an existing filter', () => {
    useEditorStore.getState().applyFilterToClip('clip-test-1', 'vintage-polaroid', 100);
    useEditorStore.getState().setFilterIntensity('clip-test-1', 45);

    const clip = useEditorStore.getState().clips.find((c) => c.id === 'clip-test-1');
    expect(clip?.adjustments.filterIntensity).toBe(45);
  });

  it('resets clip filter back to original without resetting other transforms', () => {
    useEditorStore.getState().updateClipTransform('clip-test-1', { scale: 1.5 });
    useEditorStore.getState().applyFilterToClip('clip-test-1', 'mood-cyberpunk', 90);

    useEditorStore.getState().resetClipFilter('clip-test-1');

    const clip = useEditorStore.getState().clips.find((c) => c.id === 'clip-test-1');
    expect(clip?.adjustments.filterPreset).toBe('original');
    expect(clip?.adjustments.filterIntensity).toBe(100);
    expect(clip?.transform.scale).toBe(1.5);
  });

  it('applies a filter preset and intensity to all media clips across tracks', () => {
    useEditorStore.getState().applyFilterToAllClips('cinematic-teal-orange', 75);

    const clips = useEditorStore.getState().clips;
    for (const clip of clips) {
      expect(clip.adjustments.filterPreset).toBe('cinematic-teal-orange');
      expect(clip.adjustments.filterIntensity).toBe(75);
    }
  });
});
