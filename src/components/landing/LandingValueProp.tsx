import React from 'react';
import { Layers, Music, Monitor, Sparkles, CheckCircle2, Shield, Zap } from 'lucide-react';

export const LandingValueProp: React.FC = () => {
  return (
    <section id="value-prop" className="py-16 sm:py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/20 text-xs font-bold text-[#00A88B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNIFIED CREATIVE SUITE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Your all-in-one online video editor
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Never switch between five separate tools again. Apex Editor combines multi-track timeline editing, audio soundtrack layering, text titles, and color adjustments into one seamless, distraction-free screen designed for both desktop power users and mobile creators.
          </p>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Multi-Track Timeline */}
          <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="w-13 h-13 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Multi-Track Timeline Editing
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
              Arrange multiple video layers, insert reaction picture-in-picture windows, stack titles, and slice clips with sub-frame accuracy using our intuitive magnetic snapping timeline.
            </p>

            <ul className="space-y-2.5 pt-4 border-t border-slate-200/60 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Infinite video & audio tracks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Razor blade cut tool (C key)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Drag-and-drop clip rearrangement</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Adding Music & Sound */}
          <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-[#00C9A7] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="w-13 h-13 rounded-2xl bg-[#00C9A7]/10 text-[#00A88B] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Music & Audio Mastering
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
              Import favorite tunes, sound effects, or microphone recordings. Balance dialogue against background music with individual track volume sliders, and apply smooth fade-ins and fade-outs.
            </p>

            <ul className="space-y-2.5 pt-4 border-t border-slate-200/60 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>MP3, WAV, AAC & OGG audio import</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Visual audio waveform display</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Volume ducking & fade controls</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Unified Single Screen */}
          <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="w-13 h-13 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              All in One Fluid Screen
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
              Your media library, preview monitor, timeline, property inspector, and export panel all live harmoniously together. Inspect changes in real-time with zero render waiting delays.
            </p>

            <ul className="space-y-2.5 pt-4 border-t border-slate-200/60 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Instant real-time video playback</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Side-by-side Before/After inspection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
                <span>Responsive mobile-first layout</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Feature Stat Highlights Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">Instant Export</p>
              <p className="text-xs text-slate-400">Zero waiting in remote server queues</p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-slate-700" />

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#00C9A7]/20 text-[#00C9A7] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">100% Private</p>
              <p className="text-xs text-slate-400">Footage stays secure on your local device</p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-slate-700" />

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold">Zero Watermarks</p>
              <p className="text-xs text-slate-400">Export clean, unbranded video anytime</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
