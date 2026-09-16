import React from 'react';
import { useUIStore, LeftDockTab } from '@/store/useUIStore';
import { MediaLibrary } from './MediaLibrary';
import { AudioLibrary } from './AudioLibrary';
import { TextTemplates } from './TextTemplates';
import { EffectsLibrary } from './EffectsLibrary';
import { TransitionsLibrary } from './TransitionsLibrary';
import { Film, Music, Type, Sparkles, Shuffle } from 'lucide-react';

export const LeftDock: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();

  const tabs: { id: LeftDockTab; label: string; icon: React.ReactNode }[] = [
    { id: 'media', label: 'Media', icon: <Film className="w-5 h-5" /> },
    { id: 'audio', label: 'Audio', icon: <Music className="w-5 h-5" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { id: 'fx', label: 'FX', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'transitions', label: 'Transitions', icon: <Shuffle className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-80 h-full bg-editor-panel border-r border-editor-border flex flex-row select-none shrink-0 z-10">
      {/* Icon Tab Strip */}
      <div className="w-16 h-full bg-editor-bg border-r border-editor-border flex flex-col items-center py-3 gap-2 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-glow-cyan'
                  : 'text-editor-dim hover:text-editor-text hover:bg-editor-surface'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="text-[9px] font-medium tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="flex-1 h-full overflow-hidden">
        {activeTab === 'media' && <MediaLibrary />}
        {activeTab === 'audio' && <AudioLibrary />}
        {activeTab === 'text' && <TextTemplates />}
        {activeTab === 'fx' && <EffectsLibrary />}
        {activeTab === 'transitions' && <TransitionsLibrary />}
      </div>
    </aside>
  );
};
