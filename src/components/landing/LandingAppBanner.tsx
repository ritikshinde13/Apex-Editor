import React from 'react';
import { BRANDING } from '@/branding';
import { useUIStore } from '@/store/useUIStore';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingAppBanner: React.FC = () => {
  const { currentUser, setCurrentPage } = useUIStore();

  const handleLaunch = () => {
    if (currentUser?.isLoggedIn) {
      window.location.hash = '#editor';
      setCurrentPage('editor');
    } else {
      window.location.hash = '#login';
      setCurrentPage('login');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
          
          {/* Subtle Ambient Background Mesh Glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 rounded-full bg-[#00C9A7]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00C9A7]" />
              <span>CROSS-DEVICE SYNC</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Get {BRANDING.appName} for iPhone & Android
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Start editing on your phone during your morning commute and polish the final master on your desktop with zero manual file transfers. Your timeline state syncs seamlessly across all your devices.
            </p>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Zero app storage footprint</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Touch-optimized mobile timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Works directly in Mobile Safari & Chrome</span>
              </div>
            </div>

            {/* App Store & Google Play Badges + Web Launch Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              
              {/* Apple App Store Badge */}
              <a
                href="#editor"
                onClick={(e) => {
                  e.preventDefault();
                  handleLaunch();
                }}
                className="inline-flex items-center gap-3 bg-black hover:bg-slate-900 border border-slate-700/80 px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer text-left"
              >
                {/* Apple Logo SVG */}
                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.9.04-2 .6-2.65 1.34-.56.63-.97 1.7-1.01 2.76 1.01.08 2.03-.5 2.65-1.25z" />
                </svg>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium leading-none">Download on the</p>
                  <p className="text-sm font-bold text-white tracking-wide leading-tight">App Store</p>
                </div>
              </a>

              {/* Google Play Store Badge */}
              <a
                href="#editor"
                onClick={(e) => {
                  e.preventDefault();
                  handleLaunch();
                }}
                className="inline-flex items-center gap-3 bg-black hover:bg-slate-900 border border-slate-700/80 px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer text-left"
              >
                {/* Google Play Triangle Logo SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.61 1.81L13.88 12 3.61 22.19c-.36-.37-.61-.92-.61-1.6V3.41c0-.68.25-1.23.61-1.6z" />
                  <path fill="#FBBC04" d="M17.3 8.6L13.88 12l3.42 3.4 3.9-2.22c1.11-.63 1.11-1.67 0-2.31L17.3 8.6z" />
                  <path fill="#EA4335" d="M13.88 12L3.61 1.81c.54-.56 1.44-.6 2.37-.08l11.32 6.87L13.88 12z" />
                  <path fill="#34A853" d="M13.88 12l3.42 3.4-11.32 6.87c-.93.52-1.83.48-2.37-.08L13.88 12z" />
                </svg>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium leading-none">GET IT ON</p>
                  <p className="text-sm font-bold text-white tracking-wide leading-tight">Google Play</p>
                </div>
              </a>

              {/* Instant Web App Launch */}
              <button
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch Web Studio Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
