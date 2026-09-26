import React from 'react';
import {
  Home,
  User,
  Sparkles,
  Wrench,
  HelpCircle,
  Smartphone,
  BookOpen,
  ArrowRight,
  Video,
  CheckCircle2,
} from 'lucide-react';
import { BRANDING } from '@/branding';
import { useUIStore } from '@/store/useUIStore';

export type LandingSection = 'home' | 'about' | 'features' | 'tools' | 'faq' | 'app' | 'resources';

export interface LandingSidebarProps {
  activeSection: LandingSection;
  onSelectSection: (section: LandingSection) => void;
}

interface SidebarItem {
  id: LandingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: 'blue' | 'teal' | 'purple';
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home & Overview',
    icon: Home,
  },
  {
    id: 'about',
    label: 'About Me & Website',
    icon: User,
    badge: 'Profile',
    badgeColor: 'teal',
  },
  {
    id: 'features',
    label: 'Core Features',
    icon: Sparkles,
  },
  {
    id: 'tools',
    label: 'Tools & Formats',
    icon: Wrench,
    badge: '15+',
    badgeColor: 'blue',
  },
  {
    id: 'faq',
    label: 'FAQ & Questions',
    icon: HelpCircle,
  },
  {
    id: 'app',
    label: 'Mobile App Sync',
    icon: Smartphone,
    badge: 'iOS/Android',
    badgeColor: 'purple',
  },
  {
    id: 'resources',
    label: 'Resources & Guides',
    icon: BookOpen,
  },
];

export const LandingSidebar: React.FC<LandingSidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const { currentUser, setCurrentPage } = useUIStore();

  const handleLaunchStudio = () => {
    if (currentUser?.isLoggedIn) {
      window.location.hash = '#editor';
      setCurrentPage('editor');
    } else {
      window.location.hash = '#login';
      setCurrentPage('login');
    }
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-64 xl:w-72 bg-slate-50/70 border-r border-slate-200/80 shrink-0 select-none sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto"
      aria-label="Section Navigation"
    >
      {/* Top Sidebar Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/70 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
            <span className="text-xs font-bold text-slate-800">Sections</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">
            Single View
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5" aria-label="Landing Page Sections">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer text-left group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 translate-x-1'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/60 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor === 'teal'
                      ? 'bg-[#00C9A7]/15 text-[#00A88B]'
                      : item.badgeColor === 'purple'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Sidebar Call-to-Action Card */}
      <div className="p-4 pt-2 border-t border-slate-200/80 space-y-3 bg-white/50">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-sm border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold">{BRANDING.appName}</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            Ready to edit? Launch the multi-track video studio directly in your browser.
          </p>

          <button
            onClick={handleLaunchStudio}
            className="w-full py-2 px-3 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Creator Attribution */}
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-[#00A88B]">
            <CheckCircle2 className="w-3 h-3" />
            <span>WASM 4K Engine</span>
          </span>
          <span>By Ritik Shinde</span>
        </div>
      </div>
    </aside>
  );
};
