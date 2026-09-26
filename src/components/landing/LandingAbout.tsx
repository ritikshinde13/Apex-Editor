import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Code2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Palette,
  Volume2,
  VolumeX,
  Maximize2,
  Zap,
  Play,
  Pause,
  Film,
  Scissors,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Monitor,
  Eye,
  Video,
  Layers,
} from 'lucide-react';
import { BRANDING } from '@/branding';
import { useUIStore } from '@/store/useUIStore';

interface DemoProject {
  id: string;
  title: string;
  badge: string;
  videoSrc: string;
  defaultRatio: '16:9' | '9:16' | '1:1';
  description: string;
  tags: string[];
  edits: string[];
}

const DEMO_PROJECTS: DemoProject[] = [
  {
    id: '3d-animation',
    title: '3D CGI Animated Cartoon & Spatial Scene',
    badge: '3D Animation • Spatial Engine',
    videoSrc: '/samples/demo_3d_animation.webm',
    defaultRatio: '16:9',
    description:
      'High-energy 3D animated cartoon character scene rendered in full 3D spatial perspective with live real-time camera rotations, dynamic depth shadows, and cinematic color LUTs.',
    tags: ['3D Animated', 'Spatial 3D', 'CGI Cartoon', 'Color LUTs'],
    edits: [
      'Rendered with full Spatial 3D depth & perspective',
      'Enhanced with Cyberpunk & Vibrant 32-bit color grade',
      'Dynamic 3D camera pan & tilt-shift effect',
      'Frame-accurate cut splicing on multi-track timeline',
    ],
  },
  {
    id: 'nature',
    title: 'Cinematic Nature & Travel Master',
    badge: 'Landscape 16:9 • 4K HDR',
    videoSrc: '/samples/demo_nature.mp4',
    defaultRatio: '16:9',
    description:
      'Raw camera footage enhanced with cinematic contrast, warm color temperature grading, and audio synchronization.',
    tags: ['Color LUTs', '4K UHD', 'Spatial Audio', 'Transitions'],
    edits: [
      'Applied "Vibrant Pop" 32-bit LUT color grade',
      'Precision frame trimming & smooth intro fade',
      'Ambient audio normalization & frequency EQ',
      'Exported uncompressed at 60 FPS',
    ],
  },
  {
    id: 'vlog',
    title: 'Urban Lifestyle & Vertical Shorts',
    badge: 'Vertical 9:16 • TikTok & Reels',
    videoSrc: '/samples/demo_vlog.mp4',
    defaultRatio: '9:16',
    description:
      'Formatted for high-engagement mobile viewing with vertical auto-crop, speed ramping, and lower-third typography.',
    tags: ['Reels / Shorts', 'Speed Ramp', 'Animated Text', 'Social Crop'],
    edits: [
      'One-click 9:16 vertical social re-framing',
      'Kinetic title overlay & animated watermark',
      'High-contrast pop saturation curve',
      'Instant WebM / MP4 export without cloud upload',
    ],
  },
];

interface FilterPreset {
  id: string;
  name: string;
  css: string;
  badge: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { id: 'vibrant', name: 'Vibrant Pop', css: 'saturate(1.75) contrast(1.18)', badge: 'Most Popular' },
  { id: 'cyberpunk', name: 'Cyberpunk Teal', css: 'contrast(1.3) saturate(1.4) hue-rotate(18deg)', badge: 'Stylized' },
  { id: 'sunset', name: 'Warm Sunset', css: 'sepia(0.35) saturate(1.5) contrast(1.1) brightness(1.04)', badge: 'Golden Hour' },
  { id: 'noir', name: 'Cinematic Noir', css: 'grayscale(1) contrast(1.4) brightness(0.95)', badge: 'B&W Film' },
  { id: 'raw', name: 'Raw (Unedited)', css: 'none', badge: 'Original' },
];

interface Spatial3DPreset {
  id: string;
  name: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  z: number;
  perspective: number;
}

const SPATIAL_3D_PRESETS: Spatial3DPreset[] = [
  { id: 'floating', name: 'Floating 3D Card', rotateX: 14, rotateY: -18, rotateZ: 2, z: 120, perspective: 1100 },
  { id: 'isometric', name: 'Isometric 3D', rotateX: 24, rotateY: -32, rotateZ: 0, z: 40, perspective: 1200 },
  { id: 'cinematic', name: 'Cinematic Tilt', rotateX: 28, rotateY: 0, rotateZ: 0, z: 60, perspective: 950 },
  { id: 'popout', name: 'Dramatic Pop-Out', rotateX: -12, rotateY: 20, rotateZ: -4, z: 180, perspective: 750 },
  { id: 'flat', name: 'Flat 2D View', rotateX: 0, rotateY: 0, rotateZ: 0, z: 0, perspective: 1000 },
];

export const LandingAbout: React.FC = () => {
  const { setCurrentPage } = useUIStore();

  // Active Project & Player State
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [selectedFilterId, setSelectedFilterId] = useState('vibrant');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showRawBefore, setShowRawBefore] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  const [durationStr, setDurationStr] = useState('00:00');

  // 3D Spatial Animation State
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [selected3DPresetId, setSelected3DPresetId] = useState('floating');
  const [orbitRotX, setOrbitRotX] = useState(14);
  const [orbitRotY, setOrbitRotY] = useState(-18);
  const [orbitZ, setOrbitZ] = useState(100);

  const videoRef = useRef<HTMLVideoElement>(null);

  const activeProject = DEMO_PROJECTS[activeProjectIdx];
  const activeFilter = FILTER_PRESETS.find((f) => f.id === selectedFilterId) || FILTER_PRESETS[0];
  const active3DPreset = SPATIAL_3D_PRESETS.find((p) => p.id === selected3DPresetId) || SPATIAL_3D_PRESETS[0];

  // 3D Auto-Orbit animation loop
  useEffect(() => {
    if (!isAutoOrbit) return;
    let animId: number;

    const loop = () => {
      const time = Date.now() / 1000;
      const rotY = Math.sin(time * 0.8) * 16;
      const rotX = 12 + Math.cos(time * 0.7) * 7;
      const zDepth = 90 + Math.sin(time * 1.2) * 35;

      setOrbitRotX(rotX);
      setOrbitRotY(rotY);
      setOrbitZ(zDepth);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isAutoOrbit]);

  const formatSecs = (sec: number): string => {
    if (isNaN(sec) || !isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setProgress((cur / dur) * 100);
      setCurrentTimeStr(formatSecs(cur));
      setDurationStr(formatSecs(dur));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current && videoRef.current.duration) {
      const targetTime = (val / 100) * videoRef.current.duration;
      videoRef.current.currentTime = targetTime;
      setProgress(val);
    }
  };

  const handleSelectProject = (idx: number) => {
    setActiveProjectIdx(idx);
    setAspectRatio(DEMO_PROJECTS[idx].defaultRatio);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSelect3DPreset = (presetId: string) => {
    setSelected3DPresetId(presetId);
    setIsAutoOrbit(false);
  };

  const handleOpenStudio = () => {
    window.location.hash = '#editor';
    setCurrentPage('editor');
  };

  // Autoplay attempt when project changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeProjectIdx]);

  // Video filter calculation
  const computedFilterStyle = showRawBefore ? 'none' : activeFilter.css;

  // 3D Transform Calculation
  const computed3DTransform = isAutoOrbit
    ? `perspective(1100px) rotateX(${orbitRotX.toFixed(2)}deg) rotateY(${orbitRotY.toFixed(2)}deg) translateZ(${orbitZ.toFixed(2)}px)`
    : `perspective(${active3DPreset.perspective}px) rotateX(${active3DPreset.rotateX}deg) rotateY(${active3DPreset.rotateY}deg) rotateZ(${active3DPreset.rotateZ}deg) translateZ(${active3DPreset.z}px)`;

  const techStack = [
    { name: 'React 19', role: 'UI Framework' },
    { name: 'TypeScript', role: 'Type Safety' },
    { name: 'Spatial3D Engine', role: '3D Projections' },
    { name: 'Tailwind CSS', role: 'Design System' },
    { name: 'WebAssembly (WASM)', role: 'Client Engine' },
    { name: 'Web Audio API', role: '3D Sound Mixing' },
    { name: 'HTML5 Canvas', role: 'Compositor' },
    { name: 'Zustand + Immer', role: 'State Engine' },
    { name: 'Vite 8', role: 'Build Tool' },
  ];

  const whatYouCanDo = [
    {
      icon: Layers,
      title: 'Spatial 3D Video & Scene Transforms',
      desc: 'Rotate videos in full 3D space with Pitch (X), Yaw (Y), Roll (Z), perspective camera depth, and dynamic floor cast shadows powered by our built-in Spatial3D engine.',
    },
    {
      icon: Palette,
      title: '36+ Cinematic LUT Color Grading',
      desc: 'Enhance raw 3D animated renders or live footage with instant professional color grades, saturation curves, exposure balance, and real-time split preview.',
    },
    {
      icon: Scissors,
      title: 'Precision Slicing & Multi-Track Cut',
      desc: 'Split clips at the exact millisecond with "S" key shortcut, ripple-delete gaps, and splice multi-layered video, audio, and text tracks seamlessly.',
    },
    {
      icon: Volume2,
      title: '3D Spatial Audio & Multi-Track Sound',
      desc: 'Position soundtracks, voiceovers, and sound effects in 360-degree binaural stereo space with independent volume sliders and audio ducking.',
    },
    {
      icon: Smartphone,
      title: 'Multi-Platform Social Auto-Framing',
      desc: 'Instantly re-frame any video for YouTube (16:9), TikTok & Reels (9:16), or Instagram (1:1 & 4:5) with dynamic responsive centering.',
    },
    {
      icon: ShieldCheck,
      title: '100% Private In-Browser Export',
      desc: 'Render crystal-clear 4K / 60FPS videos using WebAssembly hardware acceleration directly on your CPU/GPU without cloud uploads.',
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-20 bg-white border-y border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C9A7]" />
            <span>ANIMATED 3D VIDEO & PROJECT DEMO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            About {BRANDING.appName}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Experience our animated 3D video demonstration, explore real in-browser video editing capabilities, and meet the developer.
          </p>
        </div>

        {/* 🎬 FEATURED INTERACTIVE ANIMATED 3D VIDEO DEMO SHOWCASE */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          {/* Subtle glow accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            
            {/* Showcase Header & Project Switcher Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
                  <Film className="w-4 h-4" />
                  <span>Animated 3D Video Showcase</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Animated 3D Video & What You Can Do
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real 3D animated CGI video playing inside an interactive Spatial 3D floating canvas with live color grades and camera perspectives.
                </p>
              </div>

              {/* Sample Project Tabs */}
              <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 shrink-0">
                {DEMO_PROJECTS.map((proj, idx) => (
                  <button
                    key={proj.id}
                    onClick={() => handleSelectProject(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeProjectIdx === idx
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {idx === 0 ? '🎬 3D Animation' : proj.title.split(' ')[0] + ' ' + proj.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Player + 3D Editing Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Interactive 3D Video Viewport (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] p-2 perspective-[1400px]">
                
                {/* 3D Animated Wrapper Frame with Dynamic Pitch/Yaw/Depth */}
                <div
                  style={{
                    transform: computed3DTransform,
                    transformStyle: 'preserve-3d',
                    transition: isAutoOrbit ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 45px rgba(59, 130, 246, 0.3)',
                  }}
                  className={`w-full max-w-full relative rounded-2xl overflow-hidden bg-black border border-slate-700/80 flex items-center justify-center ${
                    aspectRatio === '9:16'
                      ? 'max-w-[300px] aspect-[9/16]'
                      : aspectRatio === '1:1'
                      ? 'max-w-[400px] aspect-square'
                      : 'w-full aspect-video'
                  }`}
                >
                  {/* HTML5 Video Element with Dynamic CSS Filter */}
                  <video
                    ref={videoRef}
                    src={activeProject.videoSrc}
                    playsInline
                    muted={isMuted}
                    loop
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                    style={{
                      filter: computedFilterStyle,
                      transition: 'filter 0.25s ease-out',
                    }}
                    className="w-full h-full object-cover cursor-pointer"
                  />

                  {/* Top Overlay Badges: Status & Filter Mode */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {activeProject.badge}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md ${
                        showRawBefore
                          ? 'bg-amber-500/90 text-slate-950 border border-amber-400'
                          : 'bg-blue-600/90 text-white border border-blue-400/50'
                      }`}
                    >
                      {showRawBefore ? 'RAW BEFORE' : `EDITED: ${activeFilter.name}`}
                    </span>
                  </div>

                  {/* Center Play Overlay Icon (when paused) */}
                  {!isPlaying && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer z-30"
                      aria-label="Play Video"
                    >
                      <Play className="w-8 h-8 translate-x-0.5 fill-white" />
                    </button>
                  )}

                  {/* Bottom Video HUD Controls Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 space-y-2">
                    {/* Scrub Timeline Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-300 w-10 text-right">
                        {currentTimeStr}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-teal-400 transition-all"
                        aria-label="Video timeline progress"
                      />
                      <span className="text-[11px] font-mono text-slate-400 w-10">
                        {durationStr}
                      </span>
                    </div>

                    {/* Bottom HUD Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={togglePlay}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                        </button>
                        <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                          {activeProject.title}
                        </span>
                      </div>

                      {/* Before / After Hold Toggle */}
                      <button
                        onMouseDown={() => setShowRawBefore(true)}
                        onMouseUp={() => setShowRawBefore(false)}
                        onTouchStart={() => setShowRawBefore(true)}
                        onTouchEnd={() => setShowRawBefore(false)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                          showRawBefore
                            ? 'bg-amber-500 text-slate-950 scale-95'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        title="Hold to see original unedited video"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hold for Raw</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* 3D Auto-Orbit Status Badge */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => setIsAutoOrbit(!isAutoOrbit)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isAutoOrbit
                        ? 'bg-blue-600/30 text-[#00E5FF] border border-blue-500/50 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isAutoOrbit ? 'bg-[#00E5FF] animate-ping' : 'bg-slate-500'}`} />
                    <span>{isAutoOrbit ? '🔄 3D Auto-Orbit: Active' : '⏸️ 3D Auto-Orbit: Paused'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                    Pitch: {orbitRotX.toFixed(0)}° • Yaw: {orbitRotY.toFixed(0)}° • Depth: {orbitZ.toFixed(0)}px
                  </span>
                </div>
              </div>

              {/* Right Column: 3D Presets & Live Controls (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 1. Spatial 3D Perspective Presets */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#00E5FF]" />
                      <span>Spatial 3D Camera Angles</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Powered by Spatial3D</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SPATIAL_3D_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelect3DPreset(preset.id)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          !isAutoOrbit && selected3DPresetId === preset.id
                            ? 'bg-blue-600/30 border-blue-500 text-white font-bold ring-1 ring-blue-500'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate font-semibold">{preset.name}</div>
                        <div className="text-[10px] opacity-75 font-mono">
                          {preset.rotateX}° / {preset.rotateY}°
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Real-time Color Filter Switcher */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#00C9A7]" />
                      <span>Real-Time Color LUT Presets</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">WebGL Color Grading</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FILTER_PRESETS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFilterId(f.id)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          selectedFilterId === f.id
                            ? 'bg-blue-600/30 border-blue-500 text-white font-bold ring-1 ring-blue-500'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate font-semibold">{f.name}</div>
                        <div className="text-[10px] opacity-75 truncate">{f.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Format & Social Aspect Ratio Framing */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-[#00E5FF]" />
                      <span>Aspect Ratio Auto-Cropping</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Social Framing</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`p-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        aspectRatio === '16:9'
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-4 h-4 mx-auto mb-1" />
                      <div>16:9</div>
                      <div className="text-[10px] text-slate-400">YouTube</div>
                    </button>

                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`p-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        aspectRatio === '9:16'
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1" />
                      <div>9:16</div>
                      <div className="text-[10px] text-slate-400">Reels / Shorts</div>
                    </button>

                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`p-2 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        aspectRatio === '1:1'
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Film className="w-4 h-4 mx-auto mb-1" />
                      <div>1:1</div>
                      <div className="text-[10px] text-slate-400">Square</div>
                    </button>
                  </div>
                </div>

                {/* 4. Edits Applied In This Demo */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Edits Applied To This Clip:
                  </h4>
                  <div className="space-y-1.5">
                    {activeProject.edits.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00C9A7] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Action: Try Editing this in Studio */}
                <button
                  onClick={handleOpenStudio}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-[#00C9A7] hover:from-blue-500 hover:to-[#00D8B4] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>Open Video In Full Editor Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* 🛠️ WHAT YOU CAN DO WITH THIS PROJECT: Core Creative Capabilities */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What You Can Do With {BRANDING.appName}
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Everything you need to produce studio-grade 3D animated & cinematic videos directly in your browser without downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouCanDo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 👤 2-Column Section: About Me (Creator) & Technical Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: About Me (Creator Card) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Gradient Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-100/60 to-teal-100/40 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              
              {/* Creator Header with Avatar Badge */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B82F6] via-blue-600 to-[#00C9A7] p-[2px] shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                    <User className="w-8 h-8 text-[#00E5FF]" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/30 text-[11px] font-bold text-[#00A88B] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7] animate-pulse" />
                    <span>Creator & Developer</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Ritik Shinde
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Full-Stack Software Developer
                  </p>
                </div>
              </div>

              {/* Short Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Short Bio
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Passionate software developer and creator dedicated to building fast, intuitive, client-side web tools that empower content creators, vloggers, and editors worldwide to bring their creative vision to life without barriers.
                </p>
              </div>

              {/* Why I Built This Website */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Why I Built This Website</span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  I created {BRANDING.appName} to eliminate the friction in modern video editing. Traditional desktop software requires gigabyte-sized installers and powerful dedicated GPUs, while cloud editors compromise privacy and make you wait in rendering queues. {BRANDING.appName} provides a professional, multi-track editor that runs 100% in your browser—private, free, and instantly accessible on both phone and computer.
                </p>
              </div>

            </div>

            {/* Contact Details Card */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-3 relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Get In Touch
              </h4>

              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                {/* Email */}
                <a
                  href="mailto:ritikshinde24@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 transition-all group shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-semibold truncate">ritikshinde24@gmail.com</span>
                </a>

                {/* Contact Number */}
                <a
                  href="tel:7894515345"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#00C9A7] hover:text-[#00A88B] text-slate-700 transition-all group shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#00C9A7]/10 text-[#00A88B] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">+91 7894515345</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: About the Website & Technical Highlights */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Website Purpose Card */}
            <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  About {BRANDING.appName}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-semibold">{BRANDING.appName}</strong> is a high-performance, browser-based creative video editing suite designed to give creators full non-linear editing power directly inside Chrome, Safari, Edge, and Firefox. You can cut video clips, layer animated text, blend multi-track music, apply Spatial 3D rotations, and export uncompressed 4K video—all with zero downloads, no forced watermarks, and complete on-device privacy.
              </p>
            </div>

            {/* Tech Stack Pills Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00E5FF]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Tech Stack & Architecture
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#00C9A7] bg-[#00C9A7]/10 px-2 py-0.5 rounded-full border border-[#00C9A7]/20">
                  Modern Web Tech
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {techStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-[#00C9A7]/50 text-xs transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]" />
                    <span className="font-semibold text-white">{tech.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      ({tech.role})
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
