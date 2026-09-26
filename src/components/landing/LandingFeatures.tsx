import React, { useState } from 'react';
import { LandingFeatureBlock } from './LandingFeatureBlock';
import {
  Type,
  Maximize2,
  Sliders,
  Palette,
  Volume2,
  Gauge,
  Sun,
  Contrast,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

export const LandingFeatures: React.FC = () => {
  // Interactive state for Feature 1 (Text customizer)
  const [selectedFont, setSelectedFont] = useState<'Inter' | 'Poppins' | 'Syne'>('Inter');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textSize, setTextSize] = useState(38);

  // Interactive state for Feature 3 (Aspect ratio presets)
  const [activeRatio, setActiveRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('9:16');

  // Interactive state for Feature 4 (Settings sliders)
  const [speed, setSpeed] = useState(1.5);
  const [volume, setVolume] = useState(85);
  const [brightness, setBrightness] = useState(15);
  const [contrast, setContrast] = useState(10);

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C9A7]" />
            <span>POWERFUL CREATIVE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Designed for effortless, studio-quality edits
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Professional video creation without the steep learning curve. Explore the intuitive tools that make editing fast, flexible, and fun.
          </p>
        </div>

        {/* Feature 1: Add text to your video */}
        <LandingFeatureBlock
          badge="Typography & Titles"
          badgeColor="purple"
          title="Add text to your video"
          description="Transform raw clips into engaging content with custom title cards, subtitles, lower-thirds, and callout text. Style your words with Google Fonts, custom color palettes, background highlight banners, and smooth fade animations."
          bullets={[
            'Rich typography: Inter, Poppins, Syne, Roboto & Monospace',
            'Full color picker with hex values, opacity, and borders',
            'Position text anywhere with drag-and-drop handles',
            'Synchronize title duration seamlessly on the timeline',
          ]}
          reversed={false}
          visual={
            <div className="space-y-4">
              {/* Photo preview with stylized text overlay */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-inner bg-slate-900 flex items-center justify-center p-4">
                {/* Background scenic photo simulation */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), radial-gradient(circle at center, #f59e0b 0%, #d97706 30%, #4338ca 70%, #0f172a 100%)`
                  }}
                />

                {/* Live customized text overlay */}
                <div 
                  className="relative z-10 px-5 py-2.5 rounded-xl border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-200 text-center"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    color: textColor,
                    fontSize: `${textSize}px`,
                    fontFamily: selectedFont,
                  }}
                >
                  <p className="font-extrabold tracking-tight drop-shadow-lg leading-tight">
                    GOLDEN HOUR IN TOKYO
                  </p>
                  <p className="text-xs tracking-widest uppercase opacity-90 font-mono mt-1 text-[#00C9A7]">
                    EPISODE 04 • 4K ULTRA HD
                  </p>
                </div>

                {/* Subtitle tag */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white/90 font-mono">
                  Text Layer #01
                </div>
              </div>

              {/* Floating Typography Inspector Controls */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-600" />
                    <span>Font Family</span>
                  </span>
                  <div className="flex gap-1.5">
                    {(['Inter', 'Poppins', 'Syne'] as const).map((font) => (
                      <button
                        key={font}
                        onClick={() => setSelectedFont(font)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedFont === font
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    <span>Color Tone</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {[
                      { hex: '#FFFFFF', name: 'White' },
                      { hex: '#00C9A7', name: 'Teal' },
                      { hex: '#3B82F6', name: 'Blue' },
                      { hex: '#F59E0B', name: 'Amber' },
                      { hex: '#EC4899', name: 'Pink' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setTextColor(c.hex)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          textColor === c.hex
                            ? 'scale-125 border-slate-900 shadow-sm'
                            : 'border-slate-300 hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Select ${c.name} color`}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-semibold">Font Scale</span>
                    <span className="font-mono text-purple-600 font-bold">{textSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="56"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          }
        />

        {/* Feature 2: Make picture-in-picture and split-screen videos */}
        <LandingFeatureBlock
          badge="Multi-Layer Compositing"
          badgeColor="teal"
          title="Make picture-in-picture and split-screen videos"
          description="Stack multiple camera angles, facecam commentary, gameplay feeds, or side-by-side comparisons on top of each other. Freely scale, reposition, crop, and round video borders with pixel precision for YouTube reactions and tutorials."
          bullets={[
            'Drag-and-drop Picture-in-Picture window overlay',
            'Side-by-side 50/50 split screen and 4-way grid layouts',
            'Rounded corner masks and customizable border shadows',
            'Independent volume and playback sync per video track',
          ]}
          reversed={true}
          visual={
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-slate-950 p-2 sm:p-3">
              {/* Main background video (e.g. gameplay or landscape) */}
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
                
                {/* Stylized Game/Vlog Background Graphics */}
                <div className="absolute inset-0 opacity-80">
                  <svg className="w-full h-full" viewBox="0 0 500 320" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>
                    <rect width="500" height="320" fill="url(#gridGrad)" />
                    {/* Perspective grid lines */}
                    <line x1="250" y1="0" x2="0" y2="320" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="250" y1="0" x2="100" y2="320" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="250" y1="0" x2="250" y2="320" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="250" y1="0" x2="400" y2="320" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="250" y1="0" x2="500" y2="320" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>

                <div className="text-center z-10">
                  <p className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold">
                    Primary Track (V1)
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                    Gameplay / Main Video Feed
                  </p>
                </div>

                {/* Picture-in-Picture Floating Window Overlay (Top-Right) */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-32 sm:w-44 aspect-video rounded-xl bg-slate-900 border-2 border-[#00C9A7] shadow-2xl overflow-hidden flex flex-col z-20 transition-transform hover:scale-105">
                  <div className="bg-[#00C9A7]/20 px-2 py-0.5 flex items-center justify-between text-[10px] text-white">
                    <span className="flex items-center gap-1 font-bold text-[#00E5FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7] animate-ping" />
                      Reaction Cam (V2)
                    </span>
                    <Maximize2 className="w-2.5 h-2.5 text-slate-300" />
                  </div>
                  <div className="flex-1 bg-gradient-to-tr from-emerald-950 to-slate-900 flex items-center justify-center p-2 text-center">
                    <p className="text-[11px] font-bold text-emerald-300">
                      Creator Facecam 🎙️
                    </p>
                  </div>
                </div>

                {/* Split Screen Control Badge */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs text-white">
                  <Layers className="w-3.5 h-3.5 text-[#00C9A7]" />
                  <span>Dual Track Compositor Active</span>
                </div>
              </div>
            </div>
          }
        />

        {/* Feature 3: Aspect Ratio Presets */}
        <LandingFeatureBlock
          badge="Social Resizing"
          badgeColor="blue"
          title="Aspect Ratio Presets"
          description="Never fight with awkward black bars or manual crop math again. Switch between square, vertical, landscape, and ultrawide formats in a single click with intelligent canvas auto-framing."
          bullets={[
            '9:16 Vertical for TikTok, Instagram Reels & YouTube Shorts',
            '16:9 Landscape for YouTube, TV & Vimeo',
            '1:1 Square & 4:5 Portrait for Instagram feed posts',
            '21:9 Cinematic Ultrawide for narrative films',
          ]}
          reversed={false}
          visual={
            <div className="space-y-4">
              {/* Interactive Ratio Preset Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '9:16', label: '9:16 Vertical', app: 'TikTok / Reels' },
                  { id: '16:9', label: '16:9 Wide', app: 'YouTube' },
                  { id: '1:1', label: '1:1 Square', app: 'Instagram' },
                  { id: '4:5', label: '4:5 Feed', app: 'Facebook' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActiveRatio(preset.id as any)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      activeRatio === preset.id
                        ? 'bg-blue-50 border-blue-500 shadow-sm text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-extrabold text-xs">{preset.id}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{preset.app}</p>
                  </button>
                ))}
              </div>

              {/* Aspect Ratio Canvas Frame Showcase */}
              <div className="h-56 bg-slate-900 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 rounded-xl shadow-2xl flex flex-col items-center justify-center p-3 text-white transition-all duration-300 relative border-2 border-white/20"
                  style={{
                    aspectRatio:
                      activeRatio === '9:16'
                        ? '9/16'
                        : activeRatio === '16:9'
                        ? '16/9'
                        : activeRatio === '1:1'
                        ? '1/1'
                        : '4/5',
                    height: activeRatio === '16:9' ? 'auto' : '90%',
                    width: activeRatio === '16:9' ? '85%' : 'auto',
                  }}
                >
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-teal-200">
                    {activeRatio} Preview
                  </p>
                  <p className="text-sm font-extrabold text-center mt-1">
                    {activeRatio === '9:16' && 'Optimized for TikTok & Shorts'}
                    {activeRatio === '16:9' && 'Full HD 1920 × 1080 (YouTube)'}
                    {activeRatio === '1:1' && '1080 × 1080 Square Post'}
                    {activeRatio === '4:5' && '1080 × 1350 Feed Portrait'}
                  </p>
                </div>

                {/* Aspect Badge */}
                <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                  Target: {activeRatio}
                </div>
              </div>
            </div>
          }
        />

        {/* Feature 4: Different Settings */}
        <LandingFeatureBlock
          badge="Precision Controls"
          badgeColor="amber"
          title="Different Settings"
          description="Take command of clip speed, sound dynamics, and visual grading. Speed up action up to 4x for dynamic timelapses, slow down to 0.25x for dramatic highlights, and dial in volume, brightness, contrast, and saturation."
          bullets={[
            'Speed ramping: 0.25x slow-mo to 4.0x hyperlapse',
            'Independent volume booster up to 200% with mute toggle',
            'Color grading: Brightness, Contrast, Saturation, and Warmth',
            'Non-destructive live preview with zero lag',
          ]}
          reversed={true}
          visual={
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Clip Settings & Color Grade</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                  Clip #01 Selected
                </span>
              </div>

              {/* Slider 1: Playback Speed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Playback Speed</span>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.25x (Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>4.0x (Fast)</span>
                </div>
              </div>

              {/* Slider 2: Audio Volume */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Volume2 className="w-3.5 h-3.5 text-[#00C9A7]" />
                    <span>Clip Volume</span>
                  </span>
                  <span className="font-mono text-[#00C9A7] font-bold">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-[#00C9A7] cursor-pointer"
                />
              </div>

              {/* Slider 3: Brightness & Contrast */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-yellow-400" />
                      <span>Brightness</span>
                    </span>
                    <span className="font-mono text-xs">{brightness > 0 ? `+${brightness}` : brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Contrast className="w-3 h-3 text-cyan-400" />
                      <span>Contrast</span>
                    </span>
                    <span className="font-mono text-xs">{contrast > 0 ? `+${contrast}` : contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          }
        />

        {/* Feature 5: Completely Online */}
        <LandingFeatureBlock
          badge="100% In-Browser"
          badgeColor="teal"
          title="Completely Online"
          description="Forget downloading gigabytes of heavy installers or waiting through endless server rendering queues. Apex Editor executes entirely in modern web browsers using high-performance client-side WebAssembly, ensuring your footage remains 100% confidential and safe on your hardware."
          bullets={[
            'No software installations or system admin rights required',
            'Zero media file uploads to remote cloud servers',
            'Instant startup in Chrome, Safari, Edge, and Firefox',
            'Works offline once loaded via progressive web caching',
          ]}
          reversed={false}
          visual={
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white space-y-4">
              
              {/* Browser Window Chrome Top Bar */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                {/* Browser URL bar with security padlock */}
                <div className="flex-1 bg-slate-950 rounded-lg px-3 py-1 text-xs text-slate-300 font-mono flex items-center justify-between border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">🔒</span>
                    <span>https://apexeditor.app/studio</span>
                  </div>
                  <span className="text-[10px] text-[#00C9A7] font-sans font-bold">Client-Side Engine</span>
                </div>
              </div>

              {/* Architecture Badges */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <p className="text-xs text-slate-400">Rendering Engine</p>
                  <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <span>WebAssembly (WASM)</span>
                    <span className="w-2 h-2 rounded-full bg-[#00C9A7]" />
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <p className="text-xs text-slate-400">Media Privacy</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span>Zero Cloud Uploads</span>
                    <Check className="w-3.5 h-3.5" />
                  </p>
                </div>
              </div>

              {/* Supported Platforms */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Compatible with:</span>
                <div className="flex items-center gap-3 font-semibold text-slate-300">
                  <span>Chrome</span>
                  <span>•</span>
                  <span>Safari</span>
                  <span>•</span>
                  <span>Edge</span>
                  <span>•</span>
                  <span>Firefox</span>
                </div>
              </div>

            </div>
          }
        />

      </div>
    </section>
  );
};
