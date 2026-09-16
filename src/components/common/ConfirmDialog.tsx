import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useUIStore();

  if (!confirmDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-editor-panel border border-editor-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-editor-border/60">
          <div className="flex items-center gap-2 text-accent-warning">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-editor-text">{confirmDialog.title}</h3>
          </div>
          <button
            onClick={closeConfirmDialog}
            className="text-editor-dim hover:text-editor-text p-1 rounded-lg hover:bg-editor-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-editor-subtext my-4 leading-relaxed">
          {confirmDialog.message}
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => {
              if (confirmDialog.onCancel) confirmDialog.onCancel();
              closeConfirmDialog();
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-editor-subtext hover:text-editor-text bg-editor-surface hover:bg-editor-hover border border-editor-border transition-colors"
          >
            {confirmDialog.cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirmDialog();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-md ${
              confirmDialog.isDestructive
                ? 'bg-accent-danger hover:bg-red-600 shadow-accent-danger/20'
                : 'bg-accent-cyan hover:bg-cyan-400 text-black font-semibold'
            }`}
          >
            {confirmDialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
