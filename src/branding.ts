/**
 * Centralized Branding & Design Configuration for Apex Editor.
 * Rebranding is a simple configuration update in this file.
 */

export const BRANDING = {
  appName: 'Apex Editor',
  tagline: 'Professional Creative Video Suite',
  version: '1.0.0',
  logo: {
    // Original bespoke SVG monogram: "A" styled with precision geometric apex peak
    svgPath: 'M12 2L2 21H7.5L12 12.5L16.5 21H22L12 2ZM12 8L15 14.5H9L12 8Z',
    gradient: {
      from: '#00e5ff',
      to: '#8b5cf6',
    },
  },
  theme: {
    darkBg: '#0a0b0e',
    panelBg: '#12141a',
    accentColor: '#00e5ff',
    secondaryAccent: '#8b5cf6',
    playheadColor: '#ff3366',
  },
  defaultProject: {
    name: 'Untitled Project',
    width: 1920,
    height: 1080,
    fps: 30,
    sampleRate: 48000,
  },
} as const;

export type BrandingConfig = typeof BRANDING;
