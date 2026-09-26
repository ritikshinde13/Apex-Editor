import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { BRANDING } from '@/branding';
import { Menu, X, ArrowRight, Video, User, LogOut } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
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

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('tools')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection('value-prop')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Resources
            </button>
          </nav>

          {/* Right: Auth & CTA actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser?.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700">
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
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Open Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoginClick}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Hamburger button for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => scrollToSection('features')}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
            >
              <span>Features</span>
              <span className="text-xs text-slate-400">All tools & FX</span>
            </button>
            <button
              onClick={() => scrollToSection('tools')}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
            >
              <span>Format & Platform Tools</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">15+</span>
            </button>
            <button
              onClick={() => scrollToSection('value-prop')}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
            >
              <span>How It Works</span>
              <span className="text-xs text-slate-400">Timeline & Audio</span>
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
            >
              <span>FAQ</span>
              <span className="text-xs text-slate-400">Common questions</span>
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
            >
              <span>Resources & Guides</span>
              <span className="text-xs text-slate-400">Tutorials</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
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
