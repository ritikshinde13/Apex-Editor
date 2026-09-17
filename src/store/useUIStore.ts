import { create } from 'zustand';

export type LeftDockTab = 'media' | 'audio' | 'text' | 'filters' | 'fx' | 'transitions';
export type ActiveTool = 'select' | 'razor';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UIState {
  activeTab: LeftDockTab;
  activeTool: ActiveTool;
  isExportModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  isComparingBeforeAfter: boolean;
  toasts: ToastNotification[];
  confirmDialog: ConfirmDialogOptions | null;

  // Actions
  setActiveTab: (tab: LeftDockTab) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setExportModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setIsComparingBeforeAfter: (comparing: boolean) => void;
  toggleComparingBeforeAfter: () => void;
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  openConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'media',
  activeTool: 'select',
  isExportModalOpen: false,
  isSettingsModalOpen: false,
  isShortcutsModalOpen: false,
  isComparingBeforeAfter: false,
  toasts: [],
  confirmDialog: null,

  setActiveTab: (tab: LeftDockTab) => set({ activeTab: tab }),
  setActiveTool: (tool: ActiveTool) => set({ activeTool: tool }),
  setExportModalOpen: (open: boolean) => set({ isExportModalOpen: open }),
  setSettingsModalOpen: (open: boolean) => set({ isSettingsModalOpen: open }),
  setShortcutsModalOpen: (open: boolean) => set({ isShortcutsModalOpen: open }),
  setIsComparingBeforeAfter: (comparing: boolean) => set({ isComparingBeforeAfter: comparing }),
  toggleComparingBeforeAfter: () => set((state) => ({ isComparingBeforeAfter: !state.isComparingBeforeAfter })),

  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { ...toast, id };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  openConfirmDialog: (options: ConfirmDialogOptions) => {
    set({ confirmDialog: options });
  },

  closeConfirmDialog: () => {
    set({ confirmDialog: null });
  },
}));
