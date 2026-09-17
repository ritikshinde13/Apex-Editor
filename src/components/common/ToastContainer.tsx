import React, { useState, useEffect } from 'react';
import { useUIStore, ToastNotification } from '@/store/useUIStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const duration = toast.duration || 2600;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 220);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const handleManualClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 220);
  };

  const icons = {
    success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
    info: <Info className="w-3.5 h-3.5 text-accent-cyan shrink-0" />,
  };

  const badgeStyles = {
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    error: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    info: 'bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan',
  };

  const pillBorders = {
    success: 'border-emerald-500/40 shadow-emerald-500/10',
    error: 'border-rose-500/40 shadow-rose-500/10',
    warning: 'border-amber-500/40 shadow-amber-500/10',
    info: 'border-accent-cyan/40 shadow-cyan-500/10',
  };

  const progressColors = {
    success: 'bg-emerald-400',
    error: 'bg-rose-400',
    warning: 'bg-amber-400',
    info: 'bg-accent-cyan',
  };

  return (
    <div
      onClick={() => handleManualClose()}
      title="Click to dismiss"
      className={`pointer-events-auto relative overflow-hidden flex items-center gap-2.5 px-3 py-1.5 bg-editor-panel/95 backdrop-blur-xl rounded-full border shadow-xl transition-all cursor-pointer select-none group hover:scale-102 hover:border-white/30 ${
        pillBorders[toast.type]
      } ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      style={{ minWidth: '180px', maxWidth: '360px' }}
    >
      {/* Icon Badge */}
      <div className={`p-1 rounded-full border shrink-0 ${badgeStyles[toast.type]}`}>
        {icons[toast.type]}
      </div>

      {/* Text Message */}
      <div className="flex-1 min-w-0 pr-1 flex items-center gap-1.5">
        <span className="text-xs font-semibold text-white whitespace-nowrap">
          {toast.title}
        </span>
        {toast.message && (
          <>
            <span className="text-editor-dim text-[10px]">•</span>
            <span className="text-[11px] text-editor-subtext truncate max-w-[200px]">
              {toast.message}
            </span>
          </>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleManualClose}
        className="text-editor-dim hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors shrink-0 ml-0.5"
        title="Dismiss notification"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Auto-dismiss progress bar indicator */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1.5px] opacity-60 animate-toast-progress ${progressColors[toast.type]}`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none transition-all">
      {toasts.slice(-3).map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};
