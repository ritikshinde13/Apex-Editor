import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-accent-success shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-accent-danger shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-accent-warning shrink-0" />,
          info: <Info className="w-5 h-5 text-accent-cyan shrink-0" />,
        };

        const borderColors = {
          success: 'border-accent-success/40',
          error: 'border-accent-danger/40',
          warning: 'border-accent-warning/40',
          info: 'border-accent-cyan/40',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-editor-panel/95 backdrop-blur-md rounded-xl border ${borderColors[toast.type]} shadow-2xl text-editor-text transition-all transform translate-y-0`}
          >
            {icons[toast.type]}
            <div className="flex-1 pr-2">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              {toast.message && <p className="text-xs text-editor-subtext mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-editor-dim hover:text-editor-text transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
