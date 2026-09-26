import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { useMediaStore } from '@/store/useMediaStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Compositor } from '@/core/engine/Compositor';
import { AudioMixer } from '@/core/engine/AudioMixer';
import { formatTimecode } from '@/utils/timecode';
import { ASPECT_RATIOS } from '@/types/project';
import { useUIStore } from '@/store/useUIStore';
import {
  Play,
  Pause,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize2,
  Tv,
} from 'lucide-react';

export const PreviewPlayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { tracks, clips } = useEditorStore();
  const { items } = useMediaStore();
  const { project, setDimensions } = useProjectStore();
  const {
    currentTime,
    isPlaying,
    playbackRate,
    setPlaybackRate,
    volume,
    isMuted,
    togglePlay,
    seek,
    stepFrames,
    setVolume,
    toggleMute,
    setCurrentTime,
  } = usePlaybackStore();

  const [peakLevel, setPeakLevel] = useState(0);

  // Compute total timeline duration
  const totalDuration = useMemo(() => {
    if (clips.length === 0) return 10.0;
    const maxEnd = Math.max(...clips.map((c) => c.startTimeOnTimeline + c.duration));
    return Math.max(5.0, maxEnd);
  }, [clips]);

  const compositorRef = useRef<Compositor | null>(null);
  const audioMixerRef = useRef<AudioMixer | null>(null);

  // Initialize engine instances
  useEffect(() => {
    if (canvasRef.current && !compositorRef.current) {
      compositorRef.current = new Compositor(canvasRef.current);
    }
    if (!audioMixerRef.current) {
      audioMixerRef.current = new AudioMixer();
    }

    return () => {
      compositorRef.current?.dispose();
      audioMixerRef.current?.dispose();
    };
  }, []);

  // Update canvas size when project dimensions change
  useEffect(() => {
    if (compositorRef.current) {
      compositorRef.current.setSize(project.width, project.height);
    }
  }, [project.width, project.height]);

  const isComparingBeforeAfter = useUIStore((state) => state.isComparingBeforeAfter);
  const isComparingBeforeAfterRef = useRef(isComparingBeforeAfter);
  const currentTimeRef = useRef(currentTime);
  const isPlayingRef = useRef(isPlaying);
  const playbackRateRef = useRef(playbackRate);
  const tracksRef = useRef(tracks);
  const clipsRef = useRef(clips);
  const itemsRef = useRef(items);

  useEffect(() => {
    isComparingBeforeAfterRef.current = isComparingBeforeAfter;
    currentTimeRef.current = currentTime;
    isPlayingRef.current = isPlaying;
    playbackRateRef.current = playbackRate;
    tracksRef.current = tracks;
    clipsRef.current = clips;
    itemsRef.current = items;
  }, [isComparingBeforeAfter, currentTime, isPlaying, playbackRate, tracks, clips, items]);

  // Master Playback Loop
  useEffect(() => {
    let animFrame: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const deltaSeconds = Math.min(0.1, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      let time = currentTimeRef.current;

      if (isPlayingRef.current) {
        time += deltaSeconds * (playbackRateRef.current || 1.0);
        if (time >= totalDuration) {
          setCurrentTime(0);
          togglePlay(); // Pause at end
          time = 0;
        } else {
          setCurrentTime(time);
        }
      }

      // Render video frame
      if (compositorRef.current) {
        compositorRef.current.renderFrame(
          time,
          tracksRef.current,
          clipsRef.current,
          itemsRef.current,
          isPlayingRef.current,
          isComparingBeforeAfterRef.current,
          playbackRateRef.current || 1.0
        );
      }

      // Sync audio
      if (audioMixerRef.current) {
        audioMixerRef.current.syncAudio(
          time,
          tracksRef.current,
          clipsRef.current,
          itemsRef.current,
          isPlayingRef.current,
          volume,
          isMuted,
          playbackRateRef.current || 1.0
        );
        setPeakLevel(audioMixerRef.current.getPeakLevel());
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [totalDuration, volume, isMuted, setCurrentTime, togglePlay]);

  // Toggle Fullscreen on canvas
  const handleToggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full bg-transparent flex flex-col justify-between p-3 select-none overflow-hidden relative"
    >
      {/* Top Monitor Bar: Aspect Ratio & Resolution Info */}
      <div className="flex items-center justify-between px-2 pb-2 text-xs text-editor-subtext">
        <div className="flex items-center gap-2 glass-pill px-3 py-1 rounded-full">
          <Tv className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="font-semibold text-editor-text">Cinema Monitor</span>
          <span className="text-[10px] text-editor-dim">
            ({project.width}x{project.height} • {project.fps}fps)
          </span>
        </div>

        {/* Aspect Ratio Switcher */}
        <select
          value={project.aspectRatio}
          onChange={(e) => {
            const val = e.target.value as keyof typeof ASPECT_RATIOS;
            const config = ASPECT_RATIOS[val];
            setDimensions(config.width, config.height, val);
          }}
          className="glass-pill text-editor-text text-xs rounded-full px-3 py-1 focus:outline-none focus:border-accent-cyan/60 focus:shadow-glow-cyan/20 cursor-pointer"
        >
          {Object.entries(ASPECT_RATIOS).map(([key, item]) => (
            <option key={key} value={key} className="bg-slate-900 text-white">
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Canvas Viewport Area with Ambient Backlight Glow */}
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 relative">
        {/* Soft dynamic ambient backlight under video */}
        <div className="absolute inset-4 bg-accent-cyan/5 rounded-3xl blur-2xl pointer-events-none" />

        <div
          className="relative max-w-full max-h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-glass-lg border border-white/10 bg-black/95 transition-all"
          style={{
            aspectRatio: `${project.width} / ${project.height}`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={project.width}
            height={project.height}
            className="w-full h-full object-contain pointer-events-none"
          />

          {isComparingBeforeAfter && (
            <div className="absolute top-3 left-3 bg-amber-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md pointer-events-none tracking-wider uppercase flex items-center gap-1.5 animate-pulse z-10 border border-amber-300/40">
              <span className="w-2 h-2 rounded-full bg-black/60 inline-block" />
              <span>Before (Original)</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Transport Controls - Liquid Frosted Glass Island */}
      <div className="glass-panel rounded-2xl px-5 py-2.5 mt-2 flex items-center justify-between shadow-glass-lg backdrop-blur-3xl bg-editor-panel/80 border border-white/10">
        {/* Left: Timecode Readout & Playback Speed Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 font-mono text-sm font-semibold text-editor-text glass-pill px-3 py-1 rounded-full border border-white/10">
            <span className="text-accent-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
              {formatTimecode(currentTime, project.fps)}
            </span>
            <span className="text-editor-dim text-xs">/</span>
            <span className="text-editor-subtext text-xs">{formatTimecode(totalDuration, project.fps)}</span>
          </div>

          {/* Speed Selector (0.5x, 1x, 1.5x, 2x) */}
          <div className="flex items-center gap-0.5 glass-pill px-1.5 py-0.5 rounded-full text-[10px] font-mono border border-white/10">
            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                title={`Playback Speed ${rate}x`}
                className={`px-2 py-0.5 rounded-full transition-all font-semibold cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-accent-cyan text-black shadow-glow-cyan'
                    : 'text-editor-subtext hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Play / Pause & Frame Step Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => seek(0)}
            title="Jump to Start (Home)"
            className="p-2 rounded-full glass-pill hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-all cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => stepFrames(-1, project.fps)}
            title="Step Back 1 Frame (Left Arrow)"
            className="p-2 rounded-full glass-pill hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            title="Play / Pause (Space)"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg cursor-pointer ${
              isPlaying
                ? 'bg-accent-cyan text-black hover:bg-cyan-300 shadow-glow-cyan scale-105'
                : 'bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.35)]'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => stepFrames(1, project.fps)}
            title="Step Forward 1 Frame (Right Arrow)"
            className="p-2 rounded-full glass-pill hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Audio Volume, Peak Meter & Fullscreen */}
        <div className="flex items-center gap-4">
          {/* Audio Volume & Peak Meter in Glass Capsule */}
          <div className="flex items-center gap-2 glass-pill px-3 py-1 rounded-full border border-white/10">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-editor-subtext hover:text-white p-0.5 transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-accent-danger" />
              ) : (
                <Volume2 className="w-4 h-4 text-accent-cyan" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent-cyan"
            />

            {/* LED Peak Meter Bar */}
            <div className="w-12 h-2.5 bg-black/60 rounded-full overflow-hidden flex items-center p-0.5 border border-white/10 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  peakLevel > 0.8
                    ? 'bg-accent-danger shadow-[0_0_8px_#ef4444]'
                    : peakLevel > 0.5
                    ? 'bg-accent-warning shadow-[0_0_8px_#f59e0b]'
                    : 'bg-accent-success shadow-[0_0_8px_#10b981]'
                }`}
                style={{ width: `${Math.round(peakLevel * 100)}%` }}
              />
            </div>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-full glass-pill hover:bg-white/[0.08] text-editor-subtext hover:text-white transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
