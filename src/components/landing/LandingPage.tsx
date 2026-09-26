import React, { useState, useEffect } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingSidebar, LandingSection } from './LandingSidebar';
import { LandingHero } from './LandingHero';
import { LandingValueProp } from './LandingValueProp';
import { LandingAbout } from './LandingAbout';
import { LandingFeatures } from './LandingFeatures';
import { LandingToolGrid } from './LandingToolGrid';
import { LandingFAQ } from './LandingFAQ';
import { LandingAppBanner } from './LandingAppBanner';
import { LandingResources } from './LandingResources';
import { LandingFooter } from './LandingFooter';
import { ToastContainer } from '../common/ToastContainer';
import {
  Home,
  User,
  Sparkles,
  Wrench,
  HelpCircle,
  Smartphone,
  BookOpen,
} from 'lucide-react';

const getInitialSection = (): LandingSection => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash === 'about') return 'about';
    if (hash === 'features') return 'features';
    if (hash === 'tools') return 'tools';
    if (hash === 'faq') return 'faq';
    if (hash === 'app') return 'app';
    if (hash === 'resources') return 'resources';
  }
  return 'home';
};

const MOBILE_PILLS: Array<{
  id: LandingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'app', label: 'App', icon: Smartphone },
  { id: 'resources', label: 'Guides', icon: BookOpen },
];

export const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<LandingSection>(getInitialSection);

  // Sync hash changes with activeSection
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (
        hash === 'about' ||
        hash === 'features' ||
        hash === 'tools' ||
        hash === 'faq' ||
        hash === 'app' ||
        hash === 'resources'
      ) {
        setActiveSection(hash);
      } else if (hash === 'home' || hash === 'landing' || hash === '') {
        setActiveSection('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectSection = (section: LandingSection) => {
    setActiveSection(section);
    if (window.location.hash !== `#${section}`) {
      window.location.hash = `#${section}`;
    }
    // Scroll container to top smoothly on section switch
    const scrollContainer = document.getElementById('landing-main-content');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-slate-900 overflow-hidden flex flex-col font-sans antialiased selection:bg-[#3B82F6] selection:text-white">
      {/* 1. Top Sticky Navbar */}
      <LandingNavbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* 2. Main Flex Layout: Left Sidebar + Right Active Section Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side Navigation Bar (Desktop) */}
        <LandingSidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {/* Right Side Main Area: Displays ONLY the active section */}
        <div
          id="landing-main-content"
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex flex-col justify-between scroll-smooth"
        >
          {/* Mobile / Tablet Horizontal Tab Bar */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
            {MOBILE_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isActive = activeSection === pill.id;

              return (
                <button
                  key={pill.id}
                  onClick={() => handleSelectSection(pill.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content (Only ONE section renders at a time) */}
          <main className="flex-1">
            {activeSection === 'home' && (
              <div className="animate-in fade-in duration-200">
                <LandingHero />
                <LandingValueProp />
              </div>
            )}

            {activeSection === 'about' && (
              <div className="animate-in fade-in duration-200">
                <LandingAbout />
              </div>
            )}

            {activeSection === 'features' && (
              <div className="animate-in fade-in duration-200">
                <LandingFeatures />
              </div>
            )}

            {activeSection === 'tools' && (
              <div className="animate-in fade-in duration-200">
                <LandingToolGrid />
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="animate-in fade-in duration-200">
                <LandingFAQ />
              </div>
            )}

            {activeSection === 'app' && (
              <div className="animate-in fade-in duration-200">
                <LandingAppBanner />
              </div>
            )}

            {activeSection === 'resources' && (
              <div className="animate-in fade-in duration-200">
                <LandingResources />
              </div>
            )}
          </main>

          {/* Footer at bottom of the active section */}
          <LandingFooter onSelectSection={handleSelectSection} />
        </div>

      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default LandingPage;
