import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { BRANDING } from '@/branding';
import { Menu, X, ArrowRight, Video, User, LogOut } from 'lucide-react';
import { LandingSection } from './LandingSidebar';

export interface LandingNavbarProps {
  activeSection?: LandingSection;
  onSelectSection?: (section: LandingSection) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  activeSection = 'home',
  onSelectSection,
}) => {
  const { currentUser, setCurrentUser, setCurrentPage, showToast } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setMobileMenuOpen(false);
    if (currentUser?.isLoggedIn) {
      window.location.hash = '#editor';
      setCurrentPage('editor');
    } else {
      window.location.hash = '#login';
      setCurrentPage('login');
    }
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    window.location.hash = '#login';
    setCurrentPage('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out of your account.',
    });
  };

  const handleNav = (section: LandingSection, fallbackId?: string) => {
    setMobileMenuOpen(false);
    if (onSelectSection) {
      onSelectSection(section);
      window.location.hash = `#${section}`;
    } else if (fallbackId) {
      const element = document.getElementById(fallbackId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      data-active-section={activeSection}
      className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -m-1"
            >
              {/* Logo Icon with Blue & Mint Gradient */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] via-blue-600 to-[#00C9A7] p-[1.5px] shadow-sm group-hover:shadow-md transition-shadow">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      d={BRANDING.logo.svgPath}
                      fill="url(#navbar-logo-grad)"
                    />
                    <defs>
                      <linearGradient id="navbar-logo-grad" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6" />
                        <stop offset="1" stopColor="#00C9A7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                    {BRANDING.appName}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00C9A7]/10 text-[#00A88B] border border-[#00C9A7]/20">
                    Online
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Right: Auth & CTA actions (Desktop & Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser?.isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-[10px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{currentUser.name}</span>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="p-1 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleLoginClick}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Mobile Account / Menu Toggle (only if needed for logged in account management) */}
            {currentUser?.isLoggedIn && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Account Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Account & Profile actions only) */}
      {mobileMenuOpen && currentUser?.isLoggedIn && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="pt-2 flex flex-col gap-2.5">
            {currentUser?.isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-500 font-medium hover:underline"
                  >
                    Log out
                  </button>
                </div>
                <button
                  onClick={handleGetStarted}
                  className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md text-sm transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Open Video Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGetStarted}
                  className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md text-sm transition-all"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLoginClick}
                  className="w-full py-2.5 px-4 text-center rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Log in to account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
