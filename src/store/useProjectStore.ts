import { create } from 'zustand';
import { ProjectSettings } from '@/types/project';
import { BRANDING } from '@/branding';

interface ProjectState {
  project: ProjectSettings;
  isExporting: boolean;
  exportProgress: number; // 0 to 100
  isDirty: boolean;

  // Actions
  setProjectName: (name: string) => void;
  setDimensions: (width: number, height: number, aspectRatio: ProjectSettings['aspectRatio']) => void;
  setFps: (fps: number) => void;
  setExportProgress: (progress: number) => void;
  setIsExporting: (isExporting: boolean) => void;
  markDirty: (dirty?: boolean) => void;
  loadProjectSettings: (settings: ProjectSettings) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: {
    id: `proj-${Date.now()}`,
    name: BRANDING.defaultProject.name,
    width: BRANDING.defaultProject.width,
    height: BRANDING.defaultProject.height,
    fps: BRANDING.defaultProject.fps,
    sampleRate: BRANDING.defaultProject.sampleRate,
    aspectRatio: '16:9',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  isExporting: false,
  exportProgress: 0,
  isDirty: false,

  setProjectName: (name: string) => {
    set((state) => ({
      project: { ...state.project, name, updatedAt: Date.now() },
      isDirty: true,
    }));
  },

  setDimensions: (width: number, height: number, aspectRatio: ProjectSettings['aspectRatio']) => {
    set((state) => ({
      project: { ...state.project, width, height, aspectRatio, updatedAt: Date.now() },
      isDirty: true,
    }));
  },

  setFps: (fps: number) => {
    set((state) => ({
      project: { ...state.project, fps, updatedAt: Date.now() },
      isDirty: true,
    }));
  },

  setExportProgress: (progress: number) => {
    set({ exportProgress: Math.min(100, Math.max(0, progress)) });
  },

  setIsExporting: (isExporting: boolean) => {
    set({ isExporting });
  },

  markDirty: (dirty: boolean = true) => {
    set({ isDirty: dirty });
  },

  loadProjectSettings: (settings: ProjectSettings) => {
    set({ project: settings, isDirty: false });
  },
}));
