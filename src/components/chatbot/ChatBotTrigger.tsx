import React, { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Sparkles } from 'lucide-react';

export const ChatBotTrigger: React.FC = () => {
  const { isChatBotOpen, toggleChatBot } = useUIStore();

  // Keyboard shortcut Ctrl+J or Cmd+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleChatBot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleChatBot]);

  if (isChatBotOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleChatBot}
        title="Open AI Video Editing Co-Pilot (Ctrl+J)"
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-editor-surface/90 hover:bg-editor-surface text-editor-text border border-accent-cyan/40 hover:border-accent-cyan shadow-glow-cyan hover:scale-105 transition-all duration-200 backdrop-blur-md"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center p-0.5">
          <div className="w-full h-full bg-editor-bg rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent-cyan group-hover:rotate-12 transition-transform" />
          </div>
        </div>
        <span className="text-xs font-bold tracking-tight bg-gradient-to-r from-white to-editor-subtext bg-clip-text text-transparent">
          AI Co-Pilot
        </span>
        <kbd className="hidden sm:inline-block text-[9px] font-mono text-editor-dim bg-editor-panel px-1.5 py-0.5 rounded border border-editor-border">
          Ctrl+J
        </kbd>
      </button>
    </div>
  );
};
