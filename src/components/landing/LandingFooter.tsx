import React from 'react';
import { BRANDING } from '@/branding';
import { useUIStore } from '@/store/useUIStore';
import {
  Video,
  CheckCircle,
} from 'lucide-react';

import { LandingSection } from './LandingSidebar';

export interface LandingFooterProps {
  onSelectSection?: (section: LandingSection) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onSelectSection }) => {
  const { showToast, setCurrentPage } = useUIStore();

  const handleLaunchEditor = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#editor';
    setCurrentPage('editor');
  };

  const handleLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    showToast({
      type: 'info',
      title: `${title}`,
      message: `${title} is fully integrated directly inside Apex Studio.`,
    });
  };

  const handleNav = (section: LandingSection, fallbackId?: string) => {
    if (onSelectSection) {
      onSelectSection(section);
      window.location.hash = `#${section}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (fallbackId) {
      const el = document.getElementById(fallbackId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Col (5 cols on Desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#00C9A7] p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {BRANDING.appName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern, all-in-one browser video editor. Trim footage, overlay animated text, sync soundtrack beats, and export in 4K — without downloading anything.
            </p>

            {/* In-Browser Privacy Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
              <span>100% Private Client-Side Processing</span>
            </div>
          </div>

          {/* Col 1: Product (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={handleLaunchEditor}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Online Video Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('features', 'features')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Multi-Track Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Subtitle Generator')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Subtitle Generator
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Audio Merger')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Audio Mixer & FX
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Aspect Ratio Auto-Frame')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Social Resizer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Tools (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('tools', 'tools')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  WEBM Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('tools', 'tools')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  TikTok Video Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('tools', 'tools')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Instagram Reels Maker
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('tools', 'tools')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  YouTube Video Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('tools', 'tools')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  MP4 Video Cutter
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about', 'about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('resources', 'resources')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Creator Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq', 'faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Help & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Release Notes')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Changelog v{BRANDING.version}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Privacy Policy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Terms of Service')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Cookie Preferences')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'Client-Side Security')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Security Guarantee
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <p className="text-slate-500">
              © {new Date().getFullYear()} {BRANDING.appName}. All rights reserved.
            </p>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-[#00C9A7]" />
              <span>WASM Engine Active</span>
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apex Editor on Twitter"
              className="p-1.5 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apex Editor on YouTube"
              className="p-1.5 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apex Editor on GitHub"
              className="p-1.5 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Apex Editor on Instagram"
              className="p-1.5 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
