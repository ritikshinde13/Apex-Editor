import { VideoAdjustments } from '@/types/timeline';

export type FilterCategory = 'all' | 'favorites' | 'recent' | 'basic' | 'cinematic' | 'vintage' | 'bw' | 'mood' | 'color';

export interface FilterDefinition {
  id: string;
  name: string;
  category: 'basic' | 'cinematic' | 'vintage' | 'bw' | 'mood' | 'color';
  description: string;
  thumbnailGradient: string;
  adjustments: {
    brightness?: number;   // -100 to 100
    contrast?: number;     // -100 to 100
    saturation?: number;   // -100 to 100
    exposure?: number;     // -100 to 100
    temperature?: number;  // -100 to 100
    sepia?: number;        // 0 to 100%
    grayscale?: number;    // 0 to 100%
    hueRotate?: number;    // -180 to 180 degrees
    blur?: number;         // 0 to 20px
    vignette?: number;     // 0 to 100%
    colorOverlay?: string; // RGBA color tint
    blendMode?: GlobalCompositeOperation;
  };
}

export const FILTER_CATEGORIES: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'recent', label: 'Recent' },
  { id: 'basic', label: 'Basic' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'bw', label: 'Black & White' },
  { id: 'mood', label: 'Mood' },
  { id: 'color', label: 'Color' },
];

export const FILTERS: FilterDefinition[] = [
  // ================= BASIC =================
  {
    id: 'original',
    name: 'Original',
    category: 'basic',
    description: 'Clean natural footage without modification',
    thumbnailGradient: 'linear-gradient(135deg, #374151, #111827)',
    adjustments: {},
  },
  {
    id: 'bright',
    name: 'Bright',
    category: 'basic',
    description: 'Elevated exposure and vibrant clarity',
    thumbnailGradient: 'linear-gradient(135deg, #fef08a, #ca8a04)',
    adjustments: { brightness: 18, contrast: 8, saturation: 12 },
  },
  {
    id: 'contrast',
    name: 'Contrast',
    category: 'basic',
    description: 'Punchy shadows and crisp high dynamic range',
    thumbnailGradient: 'linear-gradient(135deg, #ffffff, #000000)',
    adjustments: { contrast: 38, saturation: 10 },
  },
  {
    id: 'saturated',
    name: 'Saturated',
    category: 'basic',
    description: 'Deep vivid primary colors and enhanced richness',
    thumbnailGradient: 'linear-gradient(135deg, #f43f5e, #3b82f6)',
    adjustments: { saturation: 50, contrast: 10 },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    category: 'basic',
    description: 'Commercial punch with boosted midtone colors',
    thumbnailGradient: 'linear-gradient(135deg, #06b6d4, #10b981)',
    adjustments: { brightness: 6, contrast: 22, saturation: 35 },
  },
  {
    id: 'warm',
    name: 'Warm',
    category: 'basic',
    description: 'Soft sunlight radiance and warm skin tones',
    thumbnailGradient: 'linear-gradient(135deg, #f59e0b, #b45309)',
    adjustments: { sepia: 22, temperature: 32, saturation: 18, brightness: 4 },
  },
  {
    id: 'cool',
    name: 'Cool',
    category: 'basic',
    description: 'Nordic glacial cold cast with refined tones',
    thumbnailGradient: 'linear-gradient(135deg, #38bdf8, #1e40af)',
    adjustments: { temperature: -35, hueRotate: 180, saturation: -12, contrast: 14 },
  },
  {
    id: 'fade',
    name: 'Fade',
    category: 'basic',
    description: 'Low contrast washed matte film finish',
    thumbnailGradient: 'linear-gradient(135deg, #9ca3af, #4b5563)',
    adjustments: { contrast: -20, brightness: 12, saturation: -18 },
  },

  // ================= CINEMATIC =================
  {
    id: 'cinematic',
    name: 'Cinematic',
    category: 'cinematic',
    description: 'Blockbuster cinema grade with deep contrast',
    thumbnailGradient: 'linear-gradient(135deg, #0f172a, #0284c7)',
    adjustments: { contrast: 32, saturation: 16, vignette: 30, brightness: 2 },
  },
  {
    id: 'movie',
    name: 'Movie',
    category: 'cinematic',
    description: 'Anamorphic film print color timing',
    thumbnailGradient: 'linear-gradient(135deg, #1e293b, #0d9488)',
    adjustments: { contrast: 26, exposure: 6, saturation: 14, colorOverlay: 'rgba(13, 148, 136, 0.15)', vignette: 25 },
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    category: 'cinematic',
    description: 'Classic dual-tone grade: cyan shadows, amber highlights',
    thumbnailGradient: 'linear-gradient(135deg, #ea580c, #06b6d4)',
    adjustments: { contrast: 36, saturation: 22, sepia: 12, hueRotate: -8, colorOverlay: 'rgba(6, 182, 212, 0.18)', vignette: 32 },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    category: 'cinematic',
    description: 'High intensity tension with moody shadows',
    thumbnailGradient: 'linear-gradient(135deg, #450a0a, #000000)',
    adjustments: { contrast: 48, brightness: -10, saturation: -8, vignette: 38 },
  },
  {
    id: 'film',
    name: 'Film',
    category: 'cinematic',
    description: 'Kodak 35mm motion picture negative emulation',
    thumbnailGradient: 'linear-gradient(135deg, #78350f, #1e3a8a)',
    adjustments: { sepia: 20, contrast: 24, saturation: 12, vignette: 22 },
  },
  {
    id: 'hollywood',
    name: 'Hollywood',
    category: 'cinematic',
    description: 'Golden hour luxury studio grading',
    thumbnailGradient: 'linear-gradient(135deg, #f59e0b, #4338ca)',
    adjustments: { contrast: 22, saturation: 26, temperature: 24, brightness: 5, vignette: 20 },
  },

  // ================= VINTAGE =================
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'vintage',
    description: 'Nostalgic 1970s warm chemical paper print',
    thumbnailGradient: 'linear-gradient(135deg, #92400e, #d97706)',
    adjustments: { sepia: 48, contrast: -6, saturation: -14, temperature: 35, vignette: 35 },
  },
  {
    id: 'retro',
    name: 'Retro',
    category: 'vintage',
    description: 'Vibrant neon synthwave 1980s aesthetic',
    thumbnailGradient: 'linear-gradient(135deg, #c026d3, #2563eb)',
    adjustments: { contrast: 28, hueRotate: 16, saturation: 28, vignette: 25 },
  },
  {
    id: 'eighties',
    name: '80s',
    category: 'vintage',
    description: 'Bright nostalgic tape with pastel tint',
    thumbnailGradient: 'linear-gradient(135deg, #ec4899, #06b6d4)',
    adjustments: { exposure: 10, contrast: 20, saturation: 32, hueRotate: 10, vignette: 20 },
  },
  {
    id: 'nineties',
    name: '90s',
    category: 'vintage',
    description: 'Early handheld camcorder video look',
    thumbnailGradient: 'linear-gradient(135deg, #10b981, #f59e0b)',
    adjustments: { contrast: 16, saturation: 22, brightness: 6 },
  },
  {
    id: 'vhs',
    name: 'VHS',
    category: 'vintage',
    description: 'Analog video magnetic tape distortion look',
    thumbnailGradient: 'linear-gradient(135deg, #84cc16, #d946ef)',
    adjustments: { contrast: 26, saturation: 18, hueRotate: -6, vignette: 42, colorOverlay: 'rgba(217, 70, 239, 0.12)' },
  },
  {
    id: 'old-film',
    name: 'Old Film',
    category: 'vintage',
    description: '1920s historical projection print',
    thumbnailGradient: 'linear-gradient(135deg, #713f12, #292524)',
    adjustments: { sepia: 75, contrast: 36, saturation: -35, brightness: -4, vignette: 52 },
  },

  // ================= BLACK & WHITE =================
  {
    id: 'bw',
    name: 'Black & White',
    category: 'bw',
    description: 'Timeless pure monochrome cinema',
    thumbnailGradient: 'linear-gradient(135deg, #9ca3af, #111827)',
    adjustments: { grayscale: 100, contrast: 18 },
  },
  {
    id: 'noir',
    name: 'Noir',
    category: 'bw',
    description: 'Classic detective film noir with deep ink blacks',
    thumbnailGradient: 'linear-gradient(135deg, #4b5563, #000000)',
    adjustments: { grayscale: 100, contrast: 55, brightness: -8, vignette: 46 },
  },
  {
    id: 'mono',
    name: 'Mono',
    category: 'bw',
    description: 'Balanced silver gelatin photo grading',
    thumbnailGradient: 'linear-gradient(135deg, #d1d5db, #374151)',
    adjustments: { grayscale: 100, contrast: 8, brightness: 4 },
  },
  {
    id: 'high-contrast-bw',
    name: 'High Contrast B&W',
    category: 'bw',
    description: 'Stark graphic monochrome with brilliant highlights',
    thumbnailGradient: 'linear-gradient(135deg, #ffffff, #18181b)',
    adjustments: { grayscale: 100, contrast: 75, exposure: 10 },
  },

  // ================= MOOD =================
  {
    id: 'moody',
    name: 'Moody',
    category: 'mood',
    description: 'Subdued tones for emotional storytelling',
    thumbnailGradient: 'linear-gradient(135deg, #1e293b, #475569)',
    adjustments: { contrast: 32, saturation: -26, brightness: -12, vignette: 36 },
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    category: 'mood',
    description: 'Ethereal bloom with glowing soft highlights',
    thumbnailGradient: 'linear-gradient(135deg, #fbcfe8, #bae6fd)',
    adjustments: { blur: 1, brightness: 14, contrast: -12, saturation: 22 },
  },
  {
    id: 'soft',
    name: 'Soft',
    category: 'mood',
    description: 'Gentle low-contrast pastel tone',
    thumbnailGradient: 'linear-gradient(135deg, #fed7aa, #fef08a)',
    adjustments: { contrast: -22, brightness: 12, saturation: -6 },
  },
  {
    id: 'dark',
    name: 'Dark',
    category: 'mood',
    description: 'Nocturnal mystery with crushed highlights',
    thumbnailGradient: 'linear-gradient(135deg, #09090b, #27272a)',
    adjustments: { brightness: -25, contrast: 26, saturation: -16, vignette: 42 },
  },
  {
    id: 'romantic',
    name: 'Romantic',
    category: 'mood',
    description: 'Blush pink and warm candlelit atmosphere',
    thumbnailGradient: 'linear-gradient(135deg, #fb7185, #f43f5e)',
    adjustments: { sepia: 16, saturation: 22, contrast: 12, colorOverlay: 'rgba(251, 113, 133, 0.15)', brightness: 4 },
  },
  {
    id: 'sunset-mood',
    name: 'Sunset',
    category: 'mood',
    description: 'Twilight crimson and purple dusk horizon',
    thumbnailGradient: 'linear-gradient(135deg, #f97316, #7c3aed)',
    adjustments: { contrast: 26, saturation: 36, colorOverlay: 'rgba(249, 115, 22, 0.2)', vignette: 28 },
  },

  // ================= COLOR =================
  {
    id: 'golden',
    name: 'Golden',
    category: 'color',
    description: '24k gilded golden hour glow',
    thumbnailGradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
    adjustments: { temperature: 42, saturation: 36, brightness: 8, colorOverlay: 'rgba(251, 191, 36, 0.18)' },
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    category: 'color',
    description: 'Vibrant fiery orange solar wash',
    thumbnailGradient: 'linear-gradient(135deg, #ef4444, #f59e0b)',
    adjustments: { contrast: 22, saturation: 38, hueRotate: -6, colorOverlay: 'rgba(239, 68, 68, 0.2)' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'color',
    description: 'Deep aquamarine and sea glass cyan',
    thumbnailGradient: 'linear-gradient(135deg, #0284c7, #0d9488)',
    adjustments: { hueRotate: 160, contrast: 22, saturation: 26, colorOverlay: 'rgba(14, 165, 233, 0.18)' },
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'color',
    description: 'Deep emerald pine and organic foliage tones',
    thumbnailGradient: 'linear-gradient(135deg, #15803d, #047857)',
    adjustments: { saturation: 32, contrast: 22, colorOverlay: 'rgba(21, 128, 61, 0.16)' },
  },
  {
    id: 'purple',
    name: 'Purple',
    category: 'color',
    description: 'Electric violet cyberpunk neon wash',
    thumbnailGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    adjustments: { hueRotate: 260, contrast: 26, saturation: 38, colorOverlay: 'rgba(139, 92, 246, 0.2)' },
  },
  {
    id: 'pink-glow',
    name: 'Pink Glow',
    category: 'color',
    description: 'Soft dreamy magenta radiance',
    thumbnailGradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
    adjustments: { brightness: 8, saturation: 42, colorOverlay: 'rgba(244, 114, 182, 0.2)', vignette: 22 },
  },
];

/**
 * Retrieve filter definition by ID (returns 'original' if not found)
 */
export function getFilterById(filterId?: string): FilterDefinition {
  if (!filterId || filterId === 'none' || filterId === 'original') {
    return FILTERS[0]; // Original
  }
  return FILTERS.find((f) => f.id === filterId) || FILTERS[0];
}

/**
 * Computes interpolated CSS filter string and color overlay based on intensity (0 - 100).
 * At intensity 0, output is neutral (pure original).
 * At intensity 100, full filter adjustments are applied.
 */
export function computeFilterCSS(
  filterId: string | undefined,
  intensity: number = 100,
  baseAdjustments?: Partial<VideoAdjustments>
): {
  cssFilterString: string;
  colorOverlay?: string;
  blendMode?: GlobalCompositeOperation;
  vignette: number;
} {
  const filter = getFilterById(filterId);
  const factor = Math.max(0, Math.min(100, intensity)) / 100;

  const baseB = baseAdjustments?.brightness || 0;
  const baseC = baseAdjustments?.contrast || 0;
  const baseS = baseAdjustments?.saturation || 0;
  const baseBlur = baseAdjustments?.blur || 0;
  const baseVig = baseAdjustments?.vignette || 0;

  if (filter.id === 'original' || factor === 0) {
    const filters: string[] = [];
    if (baseB !== 0) filters.push(`brightness(${100 + baseB}%)`);
    if (baseC !== 0) filters.push(`contrast(${100 + baseC}%)`);
    if (baseS !== 0) filters.push(`saturate(${100 + baseS}%)`);
    if (baseBlur > 0) filters.push(`blur(${baseBlur}px)`);

    return {
      cssFilterString: filters.length > 0 ? filters.join(' ') : 'none',
      colorOverlay: undefined,
      blendMode: undefined,
      vignette: baseVig,
    };
  }

  const adj = filter.adjustments;
  const filters: string[] = [];

  // Brightness
  const effectiveB = baseB + (adj.brightness || 0) * factor;
  if (effectiveB !== 0) filters.push(`brightness(${100 + effectiveB}%)`);

  // Contrast
  const effectiveC = baseC + (adj.contrast || 0) * factor;
  if (effectiveC !== 0) filters.push(`contrast(${100 + effectiveC}%)`);

  // Saturation
  const effectiveS = baseS + (adj.saturation || 0) * factor;
  if (effectiveS !== 0) filters.push(`saturate(${100 + effectiveS}%)`);

  // Grayscale
  if (adj.grayscale) {
    filters.push(`grayscale(${Math.round(adj.grayscale * factor)}%)`);
  }

  // Sepia
  if (adj.sepia) {
    filters.push(`sepia(${Math.round(adj.sepia * factor)}%)`);
  }

  // Hue Rotate
  if (adj.hueRotate) {
    filters.push(`hue-rotate(${Math.round(adj.hueRotate * factor)}deg)`);
  }

  // Blur
  const effectiveBlur = baseBlur + (adj.blur || 0) * factor;
  if (effectiveBlur > 0) {
    filters.push(`blur(${effectiveBlur.toFixed(1)}px)`);
  }

  // Vignette
  const effectiveVig = Math.min(100, Math.max(baseVig, (adj.vignette || 0) * factor));

  // Color Overlay
  let overlay: string | undefined = undefined;
  if (adj.colorOverlay && factor > 0) {
    // Scale alpha channel by intensity factor
    overlay = scaleRgbaAlpha(adj.colorOverlay, factor);
  }

  return {
    cssFilterString: filters.length > 0 ? filters.join(' ') : 'none',
    colorOverlay: overlay,
    blendMode: adj.blendMode || 'soft-light',
    vignette: effectiveVig,
  };
}

function scaleRgbaAlpha(rgbaString: string, factor: number): string {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgbaString;
  const r = match[1];
  const g = match[2];
  const b = match[3];
  const a = match[4] ? parseFloat(match[4]) : 1.0;
  return `rgba(${r}, ${g}, ${b}, ${(a * factor).toFixed(3)})`;
}
