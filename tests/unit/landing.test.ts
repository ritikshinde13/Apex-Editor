import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../../src/store/useUIStore';
import { DEFAULT_TOOLS } from '../../src/components/landing/toolsData';
import { BRANDING } from '../../src/branding';

describe('Marketing Landing Page Integration & Data Contracts', () => {
  beforeEach(() => {
    useUIStore.getState().setCurrentPage('landing');
  });

  it('initializes and navigates across landing, login, and editor states', () => {
    expect(useUIStore.getState().currentPage).toBe('landing');

    useUIStore.getState().setCurrentPage('login');
    expect(useUIStore.getState().currentPage).toBe('login');

    useUIStore.getState().setCurrentPage('editor');
    expect(useUIStore.getState().currentPage).toBe('editor');

    useUIStore.getState().setCurrentPage('landing');
    expect(useUIStore.getState().currentPage).toBe('landing');
  });

  it('contains all required format- and platform-specific tools in DEFAULT_TOOLS', () => {
    const titles = DEFAULT_TOOLS.map((t) => t.title);

    // Prompt requirements:
    // WEBM Editor, WMV Editor, TikTok Video Editor, Instagram Video Editor,
    // YouTube Video Editor, Video Editor for Mac, Video Editor for Windows
    expect(titles).toContain('WEBM Editor');
    expect(titles).toContain('WMV Editor');
    expect(titles).toContain('TikTok Video Editor');
    expect(titles).toContain('Instagram Video Editor');
    expect(titles).toContain('YouTube Video Editor');
    expect(titles).toContain('Video Editor for Mac');
    expect(titles).toContain('Video Editor for Windows');
    expect(titles).toContain('MP4 Video Cutter');
    expect(titles).toContain('Audio & Music Merger');
    expect(titles).toContain('Picture-in-Picture Maker');

    expect(DEFAULT_TOOLS.length).toBeGreaterThanOrEqual(10);
  });

  it('each tool item in the array has required metadata fields', () => {
    DEFAULT_TOOLS.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(tool.title).toBeTruthy();
      expect(['platform', 'format', 'device']).toContain(tool.category);
      expect(tool.description).toBeTruthy();
      expect(tool.icon).toBeDefined();
    });
  });

  it('branding contains configured appName and logo specifications', () => {
    expect(BRANDING.appName).toBe('Apex Editor');
    expect(BRANDING.logo.svgPath).toBeTruthy();
  });
});
