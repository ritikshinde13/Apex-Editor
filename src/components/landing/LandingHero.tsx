import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { BRANDING } from '@/branding';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  Scissors,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Laptop,
  Music,
  Type,
  Image as ImageIcon,
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { currentUser, setCurrentPage } = useUIStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38); // percentage 0-100

  // Playhead scrubber animation for live mockup demo
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 5;
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGetStarted = () => {
    if (currentUser?.isLoggedIn) {
      window.location.hash = '#editor';
      setCurrentPage('editor');
    } else {
      window.location.hash = '#login';
      setCurrentPage('login');
    }
  };

  const formattedTimecode = `00:${Math.floor((progress / 100) * 15)
    .toString()
    .padStart(2, '0')}.${Math.floor(((progress / 100) * 99) % 99)
    .toString()
    .padStart(2, '0')} / 00:15.00`;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Subtle background ambient radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-teal-100/50 rounded-full blur-3xl -z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Top Eyebrow Badge */}
        <div className="flex justify-center mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C9A7] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C9A7]" />
            </span>
            <span>Next-Gen In-Browser Video Studio</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-normal">v{BRANDING.version}</span>
          </div>
        </div>

        {/* Centered Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Create your own video and edit it in any way —{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-blue-600 to-[#00C9A7]">
                on both your phone and computer
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The powerful, all-in-one browser video editor. Trim multi-track footage, overlay motion titles, blend music tracks, and export in crisp 4K — with zero software downloads.
          </p>

          {/* Large Blue Rounded CTA Button */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Trust points underneath CTA */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00C9A7]" />
              <span>100% In-Browser Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              <span>Mac & Windows</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>iOS & Android</span>
            </div>
          </div>
        </div>

        {/* HERO ILLUSTRATION:
            Phone Mockup with Video-Editor Timeline UI next to "My Media" Panel with Thumbnail Grid */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="relative max-w-5xl mx-auto">
            {/* Soft decorative shadow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-[#00C9A7]/10 rounded-3xl blur-2xl -z-10" />

            {/* Main Mockup Container Card */}
            <div className="bg-slate-900 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl border border-slate-800 text-white">
              
              {/* Top Bar of the Studio Showcase */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-slate-400 font-semibold hidden sm:inline">
                    {BRANDING.appName} • Project: Sunset_Vlog_Master.mp4
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
                    1080 × 1920 (9:16)
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[#00C9A7] font-semibold text-[11px] bg-[#00C9A7]/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Live Scrubber
                  </span>
                </div>
              </div>

              {/* Showcase Body: Grid with Phone Mockup & "My Media" Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* 1. PHONE MOCKUP (Left on Desktop, Main on Mobile) */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  
                  {/* Outer Phone Shell */}
                  <div className="w-full max-w-[340px] sm:max-w-[370px] bg-slate-950 rounded-[44px] p-3 sm:p-3.5 shadow-2xl border-[5px] border-slate-700/80 relative">
                    
                    {/* Phone Top Dynamic Island / Speaker Pill */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
                      <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                    </div>

                    {/* Phone Screen Display */}
                    <div className="bg-slate-900 rounded-[34px] overflow-hidden border border-slate-800 relative flex flex-col">
                      
                      {/* Video Preview Canvas */}
                      <div className="relative aspect-[9/10] bg-slate-950 overflow-hidden group">
                        {/* Simulated high-quality video footage scene */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
                          style={{
                            backgroundImage: `radial-gradient(circle at 60% 40%, rgba(59, 130, 246, 0.4), transparent 60%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #064e3b 100%)`
                          }}
                        >
                          {/* Stylized Beach & Sunset SVG Visual */}
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 400" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff7e5f" />
                                <stop offset="40%" stopColor="#feb47b" />
                                <stop offset="70%" stopColor="#6a11cb" />
                                <stop offset="100%" stopColor="#2575fc" />
                              </linearGradient>
                              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00c6ff" />
                                <stop offset="100%" stopColor="#0072ff" />
                              </linearGradient>
                            </defs>
                            <rect width="360" height="400" fill="url(#skyGrad)" opacity="0.85" />
                            {/* Glowing Sun */}
                            <circle cx="180" cy="190" r="50" fill="#fff" opacity="0.9" filter="drop-shadow(0 0 25px #ffeedd)" />
                            {/* Sea Water Waves */}
                            <path d="M0 240 Q 90 220 180 240 T 360 240 L 360 400 L 0 400 Z" fill="url(#waterGrad)" opacity="0.75" />
                            <path d="M0 270 Q 90 255 180 270 T 360 270 L 360 400 L 0 400 Z" fill="#03254c" opacity="0.6" />
                            {/* Palm Tree Silhouette */}
                            <path d="M320 400 C 310 320, 290 260, 260 220 C 270 210, 290 215, 300 225 M 260 220 C 240 200, 210 205, 200 215 M 260 220 C 260 190, 250 180, 235 185 M 260 220 C 280 190, 310 195, 315 210" stroke="#111827" strokeWidth="4" fill="none" strokeLinecap="round" />
                          </svg>

                          {/* Text Overlay element rendered on top of the video */}
                          <div className="absolute top-12 inset-x-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 text-white font-extrabold text-sm sm:text-base tracking-wider drop-shadow-md">
                              SUMMER IN PARADISE 🌊
                            </span>
                          </div>

                          {/* Mini Picture-in-Picture window overlay */}
                          <div className="absolute top-4 right-4 w-16 h-20 rounded-xl overflow-hidden border-2 border-[#00C9A7] shadow-lg bg-slate-800">
                            <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-700 flex flex-col items-center justify-center p-1 text-[8px] text-center">
                              <span className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse mb-1" />
                              <span className="font-bold text-white">PiP Cam</span>
                            </div>
                          </div>
                        </div>

                        {/* Centered Play / Pause overlay pill */}
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10 cursor-pointer"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>

                        {/* Video Timecode Tag */}
                        <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white/90">
                          {formattedTimecode}
                        </div>
                      </div>

                      {/* Video Editor Timeline UI Inside Phone */}
                      <div className="bg-slate-950 p-3 flex flex-col border-t border-slate-800">
                        
                        {/* Transport Controls Bar */}
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setProgress(0)}
                              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                              title="Rewind"
                            >
                              <SkipBack className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
                              title={isPlaying ? 'Pause' : 'Play'}
                            >
                              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                            </button>
                            <button
                              onClick={() => setProgress(95)}
                              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                              title="Skip to end"
                            >
                              <SkipForward className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-medium">
                              <Scissors className="w-3 h-3 text-red-400" />
                              <span>Split</span>
                            </button>
                            <span className="text-[10px] font-mono text-slate-400">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </div>

                        {/* Multitrack Timeline Area with Moving Playhead */}
                        <div className="relative bg-slate-900/90 rounded-xl p-2 border border-slate-800 space-y-1.5 overflow-hidden">
                          
                          {/* Vertical Red Playhead Line */}
                          <div
                            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20 pointer-events-none transition-all duration-75"
                            style={{ left: `${progress}%` }}
                          >
                            {/* Scrubber Knob */}
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full -ml-[4px] -mt-0.5 shadow-md shadow-red-500/50" />
                          </div>

                          {/* Track 1: Text Overlay */}
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 text-[9px] font-mono text-slate-500">T1</span>
                            <div className="flex-1 h-5 bg-slate-800/80 rounded-md relative overflow-hidden flex items-center px-2">
                              <div
                                className="absolute left-[10%] w-[65%] h-full bg-purple-600/80 border border-purple-400/50 rounded flex items-center px-1.5 text-[9px] font-semibold text-white truncate"
                              >
                                <Type className="w-2.5 h-2.5 mr-1 shrink-0" />
                                Summer In Paradise
                              </div>
                            </div>
                          </div>

                          {/* Track 2: Main Video Clips with Thumbnails */}
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 text-[9px] font-mono text-slate-500">V1</span>
                            <div className="flex-1 h-7 bg-slate-800/80 rounded-md relative overflow-hidden flex items-center gap-1 px-1">
                              {/* Clip A */}
                              <div className="w-[55%] h-[22px] bg-blue-600/70 border border-blue-400/60 rounded flex items-center justify-between px-1.5 text-[9px] font-bold text-white shadow-sm">
                                <span className="truncate">sunset_drone.mp4</span>
                                <span className="text-[8px] opacity-80">0:08</span>
                              </div>
                              {/* Clip B */}
                              <div className="w-[40%] h-[22px] bg-emerald-600/70 border border-emerald-400/60 rounded flex items-center justify-between px-1.5 text-[9px] font-bold text-white shadow-sm">
                                <span className="truncate">surf_wave.mp4</span>
                                <span className="text-[8px] opacity-80">0:07</span>
                              </div>
                            </div>
                          </div>

                          {/* Track 3: Audio Waveform Track */}
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 text-[9px] font-mono text-slate-500">A1</span>
                            <div className="flex-1 h-5 bg-slate-800/80 rounded-md relative overflow-hidden flex items-center px-2">
                              <div className="w-[90%] h-full bg-[#00C9A7]/30 border border-[#00C9A7]/50 rounded flex items-center px-2 justify-between">
                                <div className="flex items-center gap-1 text-[8px] font-semibold text-[#00E5FF]">
                                  <Music className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">Chill_Lofi_Beat.mp3</span>
                                </div>
                                {/* Waveform bars visualization */}
                                <div className="flex items-center gap-0.5 h-3">
                                  <span className="w-0.5 h-2 bg-[#00C9A7] rounded-full" />
                                  <span className="w-0.5 h-3 bg-[#00C9A7] rounded-full" />
                                  <span className="w-0.5 h-1.5 bg-[#00C9A7] rounded-full" />
                                  <span className="w-0.5 h-2.5 bg-[#00C9A7] rounded-full" />
                                  <span className="w-0.5 h-1 bg-[#00C9A7] rounded-full" />
                                  <span className="w-0.5 h-2.5 bg-[#00C9A7] rounded-full" />
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 text-center">
                    📱 Mobile View: Multi-track timeline & gesture controls
                  </p>
                </div>

                {/* 2. "MY MEDIA" PANEL (Right on Desktop, Stacked on Mobile) */}
                <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-950/80 rounded-2xl p-5 border border-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <h3 className="font-bold text-sm text-white">My Media Pool</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                        4 files
                      </span>
                    </div>

                    <button
                      onClick={handleGetStarted}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00C9A7] hover:bg-[#00B294] text-slate-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Upload</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal">
                    Import videos, audio tracks, voice notes, and images directly from your device storage or Google Drive.
                  </p>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* Media Item 1 */}
                    <div className="group relative bg-slate-900 hover:bg-slate-850 rounded-xl p-2 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-tr from-amber-600 to-orange-400 rounded-lg overflow-hidden relative flex items-center justify-center">
                        <Play className="w-4 h-4 text-white drop-shadow" />
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono font-medium text-white">
                          0:24
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-blue-400">
                          ocean_sunset.mp4
                        </p>
                        <p className="text-[9px] text-slate-500">1080p • 24MB</p>
                      </div>
                    </div>

                    {/* Media Item 2 */}
                    <div className="group relative bg-slate-900 hover:bg-slate-850 rounded-xl p-2 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-tr from-blue-600 to-indigo-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                        <Play className="w-4 h-4 text-white drop-shadow" />
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono font-medium text-white">
                          0:48
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-blue-400">
                          tokyo_night_drone.mov
                        </p>
                        <p className="text-[9px] text-slate-500">4K • 72MB</p>
                      </div>
                    </div>

                    {/* Media Item 3 */}
                    <div className="group relative bg-slate-900 hover:bg-slate-850 rounded-xl p-2 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-tr from-teal-800 to-emerald-950 rounded-lg overflow-hidden relative flex items-center justify-center">
                        <Music className="w-4 h-4 text-[#00C9A7]" />
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono font-medium text-white">
                          2:15
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-[#00C9A7]">
                          chill_lofi_beat.mp3
                        </p>
                        <p className="text-[9px] text-slate-500">Audio • 4.2MB</p>
                      </div>
                    </div>

                    {/* Media Item 4 */}
                    <div className="group relative bg-slate-900 hover:bg-slate-850 rounded-xl p-2 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer">
                      <div className="aspect-video bg-gradient-to-tr from-purple-800 to-pink-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-purple-300" />
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono font-medium text-white">
                          PNG
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-purple-400">
                          watermark_logo.png
                        </p>
                        <p className="text-[9px] text-slate-500">Overlay • 450KB</p>
                      </div>
                    </div>
                  </div>

                  {/* Drag and Drop Prompt */}
                  <div className="mt-2 p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 flex items-center gap-3 text-slate-400 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-300">Drag & Drop into Timeline</p>
                      <p className="text-[10px] text-slate-500">Snap tracks with magnetic alignment</p>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <button
                    onClick={handleGetStarted}
                    className="w-full mt-1 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Try With Sample Video</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
