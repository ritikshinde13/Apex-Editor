import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../../src/store/useUIStore';
import * as fs from 'fs';
import * as path from 'path';

describe('Auth & Login Page Integration', () => {
  beforeEach(() => {
    useUIStore.getState().setCurrentPage('editor');
  });

  it('initializes with currentPage', () => {
    expect(['editor', 'login']).toContain(useUIStore.getState().currentPage);
  });

  it('updates currentPage to login and back to editor', () => {
    useUIStore.getState().setCurrentPage('login');
    expect(useUIStore.getState().currentPage).toBe('login');

    useUIStore.getState().setCurrentPage('editor');
    expect(useUIStore.getState().currentPage).toBe('editor');
  });

  it('manages currentUser session state properly', () => {
    expect(useUIStore.getState().currentUser).toBeNull();

    useUIStore.getState().setCurrentUser({
      name: 'Ritik Shinde',
      email: 'ritik@apexeditor.local',
      isLoggedIn: true,
    });

    expect(useUIStore.getState().currentUser).toEqual({
      name: 'Ritik Shinde',
      email: 'ritik@apexeditor.local',
      isLoggedIn: true,
    });

    // Logging out clears currentUser
    useUIStore.getState().setCurrentUser(null);
    expect(useUIStore.getState().currentUser).toBeNull();
  });

  it('standalone public/login.html exists and fulfills all requirements', () => {
    const filePath = path.resolve(__dirname, '../../public/login.html');
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf-8');

    // Styling requirements
    expect(content).toContain('#0d0d0f'); // Near-black background
    expect(content).toContain('#161618'); // Card background
    expect(content).toContain('#00D2FF'); // Electric blue accent
    expect(content).toContain('#6C5CE7'); // Electric violet accent
    expect(content).toContain('fonts.googleapis.com'); // Google Fonts import
    expect(content).toContain('Inter'); // Geometric font

    // Brand and logo
    expect(content).toContain('Apex');
    expect(content).toContain('Editor');

    // Input fields
    expect(content).toContain('Email or username');
    expect(content).toContain('password');

    // Status indicator requirements
    expect(content).toContain('Not logged in');
    expect(content).toContain('status-badge');
    expect(content).toContain('status-dot');

    // Button requirements with icon
    expect(content).toContain('Log in');
    expect(content).toContain('btn-primary');
    expect(content).toContain('btnIcon');

    // Strict constraint: No skip or guest options
    expect(content).not.toContain('Continue as Guest');
    expect(content).not.toContain('Enter as Guest');
    expect(content).not.toContain('Skip for now');

    // Accessibility and focus state
    expect(content).toContain(':focus-visible');
  });
});
