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
  isComparingBeforeAfterRef.current = isComparingBeforeAfter;

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const playbackRateRef = useRef(playbackRate);
  playbackRateRef.current = playbackRate;

  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;

  const clipsRef = useRef(clips);
  clipsRef.current = clips;

  const itemsRef = useRef(items);
  itemsRef.current = items;

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
      className="flex-1 h-full bg-editor-bg flex flex-col justify-between p-3 select-none overflow-hidden relative"
    >
      {/* Top Monitor Bar: Aspect Ratio & Resolution Info */}
      <div className="flex items-center justify-between px-2 pb-2 text-xs text-editor-subtext">
        <div className="flex items-center gap-2">
          <Tv className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="font-semibold text-editor-text">Monitor</span>
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
          className="bg-editor-panel border border-editor-border text-editor-text text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-accent-cyan/60"
        >
          {Object.entries(ASPECT_RATIOS).map(([key, item]) => (
            <option key={key} value={key}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Canvas Viewport Area */}
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 relative">
        <div
          className="relative max-w-full max-h-full flex items-center justify-center rounded-xl overflow-hidden shadow-panel border border-editor-border/80 bg-black"
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
            <div className="absolute top-3 left-3 bg-amber-500/90 text-black text-xs font-bold px-2.5 py-1 rounded-md shadow-lg backdrop-blur-md pointer-events-none tracking-wider uppercase flex items-center gap-1.5 animate-pulse z-10 border border-amber-300/40">
              <span className="w-2 h-2 rounded-full bg-black/60 inline-block" />
              <span>Before (Original)</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Transport Controls */}
      <div className="bg-editor-panel border border-editor-border rounded-xl px-4 py-2 mt-2 flex items-center justify-between shadow-lg">
        {/* Left: Timecode Readout & Playback Speed Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 font-mono text-sm font-semibold text-editor-text">
            <span className="text-accent-cyan">{formatTimecode(currentTime, project.fps)}</span>
            <span className="text-editor-dim text-xs">/</span>
            <span className="text-editor-subtext text-xs">{formatTimecode(totalDuration, project.fps)}</span>
          </div>

          {/* Speed Selector (0.5x, 1x, 1.5x, 2x) */}
          <div className="flex items-center gap-0.5 bg-editor-surface/80 px-1 py-0.5 rounded-lg border border-editor-border text-[10px] font-mono">
            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                title={`Playback Speed ${rate}x`}
                className={`px-1.5 py-0.5 rounded transition-all font-semibold ${
                  playbackRate === rate
                    ? 'bg-accent-cyan text-black shadow-sm'
                    : 'text-editor-subtext hover:text-editor-text hover:bg-editor-panel'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Play / Pause & Frame Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => seek(0)}
            title="Jump to Start (Home)"
            className="p-1.5 rounded-lg hover:bg-editor-surface text-editor-subtext hover:text-editor-text transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => stepFrames(-1, project.fps)}
            title="Step Back 1 Frame (Left Arrow)"
            className="p-1.5 rounded-lg hover:bg-editor-surface text-editor-subtext hover:text-editor-text transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            title="Play / Pause (Space)"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-md ${
              isPlaying
                ? 'bg-accent-cyan text-black hover:bg-cyan-300 shadow-glow-cyan'
                : 'bg-white text-black hover:bg-gray-200'
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
            className="p-1.5 rounded-lg hover:bg-editor-surface text-editor-subtext hover:text-editor-text transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Audio Volume, Peak Meter & Fullscreen */}
        <div className="flex items-center gap-4">
          {/* Audio Volume & Peak Meter */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-editor-subtext hover:text-editor-text p-1 transition-colors"
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
              className="w-16 h-1 bg-editor-surface rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />

            {/* LED Peak Meter Bar */}
            <div className="w-12 h-2.5 bg-black/60 rounded overflow-hidden flex items-center p-0.5 border border-editor-border/60">
              <div
                className={`h-full rounded-sm transition-all duration-75 ${
                  peakLevel > 0.8
                    ? 'bg-accent-danger'
                    : peakLevel > 0.5
                    ? 'bg-accent-warning'
                    : 'bg-accent-success'
                }`}
                style={{ width: `${Math.round(peakLevel * 100)}%` }}
              />
            </div>
          </div>

          <div className="h-4 w-[1px] bg-editor-border" />

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-lg hover:bg-editor-surface text-editor-subtext hover:text-editor-text transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
