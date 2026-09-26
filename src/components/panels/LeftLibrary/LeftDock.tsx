import React from 'react';
import { useUIStore, LeftDockTab } from '@/store/useUIStore';
import { MediaLibrary } from './MediaLibrary';
import { AudioLibrary } from './AudioLibrary';
import { TextTemplates } from './TextTemplates';
import { EffectsLibrary } from './EffectsLibrary';
import { TransitionsLibrary } from './TransitionsLibrary';
import { FilterPanel } from './Filters/FilterPanel';
import { Film, Music, Type, Sparkles, Shuffle, SlidersHorizontal } from 'lucide-react';

export const LeftDock: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();

  const tabs: { id: LeftDockTab; label: string; icon: React.ReactNode }[] = [
    { id: 'media', label: 'Media', icon: <Film className="w-5 h-5" /> },
    { id: 'audio', label: 'Audio', icon: <Music className="w-5 h-5" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { id: 'filters', label: 'Filters', icon: <SlidersHorizontal className="w-5 h-5" /> },
    { id: 'fx', label: 'FX', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'transitions', label: 'Transitions', icon: <Shuffle className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-80 h-full backdrop-blur-2xl bg-editor-panel/70 border-r border-white/[0.08] shadow-glass flex flex-row select-none shrink-0 z-10 specular-border">
      {/* Icon Tab Strip */}
      <div className="w-16 h-full backdrop-blur-xl bg-black/30 border-r border-white/[0.06] flex flex-col items-center py-4 gap-2.5 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/40 shadow-glow-cyan scale-105 backdrop-blur-md'
                  : 'text-editor-dim hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="text-[9px] font-semibold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel with frosted backdrop */}
      <div className="flex-1 h-full overflow-hidden bg-black/15 backdrop-blur-md">
        {activeTab === 'media' && <MediaLibrary />}
        {activeTab === 'audio' && <AudioLibrary />}
        {activeTab === 'text' && <TextTemplates />}
        {activeTab === 'filters' && <FilterPanel />}
        {activeTab === 'fx' && <EffectsLibrary />}
        {activeTab === 'transitions' && <TransitionsLibrary />}
      </div>
    </aside>
  );
};
