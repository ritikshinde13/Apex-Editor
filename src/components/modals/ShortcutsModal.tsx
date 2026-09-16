import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { HelpCircle, X } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useUIStore();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', description: 'Play / Pause toggle' },
    { key: 'S or Ctrl+B', description: 'Split selected clip at playhead' },
    { key: 'Del / Backspace', description: 'Delete selected clip' },
    { key: 'Ctrl+Z / Cmd+Z', description: 'Undo last action' },
    { key: 'Ctrl+Y / Ctrl+Shift+Z', description: 'Redo previously undone action' },
    { key: 'Left Arrow', description: 'Step back 1 frame' },
    { key: 'Right Arrow', description: 'Step forward 1 frame' },
    { key: 'Shift + Left / Right', description: 'Step 5 frames back / forward' },
    { key: '+ / -', description: 'Zoom timeline in / out' },
    { key: 'Home', description: 'Seek to start (00:00:00:00)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-editor-panel border border-editor-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-editor-border">
          <div className="flex items-center gap-2 text-accent-cyan">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-bold text-editor-text text-base">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1 rounded-lg hover:bg-editor-surface text-editor-dim hover:text-editor-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-editor-border/60 my-4 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-editor-subtext">{sc.description}</span>
              <kbd className="px-2 py-1 bg-editor-surface border border-editor-border rounded font-mono font-semibold text-editor-text text-[11px] shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-editor-surface hover:bg-editor-hover border border-editor-border text-editor-text transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
