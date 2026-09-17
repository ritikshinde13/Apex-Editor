import { create } from 'zustand';

export type LeftDockTab = 'media' | 'audio' | 'text' | 'filters' | 'fx' | 'transitions';
export type ActiveTool = 'select' | 'razor';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
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

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

interface UIState {
  activeTab: LeftDockTab;
  activeTool: ActiveTool;
  isExportModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  isComparingBeforeAfter: boolean;
  isChatBotOpen: boolean;
  currentPage: 'editor' | 'login';
  currentUser: UserProfile | null;
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
  setChatBotOpen: (open: boolean) => void;
  toggleChatBot: () => void;
  setCurrentPage: (page: 'editor' | 'login') => void;
  setCurrentUser: (user: UserProfile | null) => void;
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  openConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;
}

const getInitialUser = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem('apex_user');
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore error
  }
  return null;
};

const getInitialPage = (): 'editor' | 'login' => {
  const user = getInitialUser();
  // An account is strictly required to enter the editor
  if (!user || !user.isLoggedIn) return 'login';
  if (typeof window !== 'undefined' && window.location.hash === '#login') return 'login';
  return 'editor';
};

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'media',
  activeTool: 'select',
  isExportModalOpen: false,
  isSettingsModalOpen: false,
  isShortcutsModalOpen: false,
  isComparingBeforeAfter: false,
  isChatBotOpen: false,
  currentPage: getInitialPage(),
  currentUser: getInitialUser(),
  toasts: [],
  confirmDialog: null,

  setActiveTab: (tab: LeftDockTab) => set({ activeTab: tab }),
  setActiveTool: (tool: ActiveTool) => set({ activeTool: tool }),
  setExportModalOpen: (open: boolean) => set({ isExportModalOpen: open }),
  setSettingsModalOpen: (open: boolean) => set({ isSettingsModalOpen: open }),
  setShortcutsModalOpen: (open: boolean) => set({ isShortcutsModalOpen: open }),
  setIsComparingBeforeAfter: (comparing: boolean) => set({ isComparingBeforeAfter: comparing }),
  toggleComparingBeforeAfter: () => set((state) => ({ isComparingBeforeAfter: !state.isComparingBeforeAfter })),
  setChatBotOpen: (open: boolean) => set({ isChatBotOpen: open }),
  toggleChatBot: () => set((state) => ({ isChatBotOpen: !state.isChatBotOpen })),
  setCurrentPage: (page: 'editor' | 'login') => set({ currentPage: page }),
  setCurrentUser: (user: UserProfile | null) => {
    if (user) {
      try {
        localStorage.setItem('apex_user', JSON.stringify(user));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem('apex_user');
      } catch {
        // ignore
      }
    }
    set({ currentUser: user });
  },

  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { ...toast, id };

    set((state) => {
      // Keep at most 2 existing toasts so max 3 are visible at once
      const recent = state.toasts.slice(-2);
      return { toasts: [...recent, newToast] };
    });

    const autoDuration = toast.duration || 2800;
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, autoDuration + 300);
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
