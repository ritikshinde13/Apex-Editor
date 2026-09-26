import React, { useState, useMemo } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useEditorStore } from '@/store/useEditorStore';
import { useMediaStore } from '@/store/useMediaStore';
import { useProjectStore } from '@/store/useProjectStore';
import { StreamExporter } from '@/core/export/StreamExporter';
import { platformBridge } from '@/core/platform/PlatformBridge';
import { ExportOptions } from '@/core/export/IExportEngine';
import { Download, X, Loader2 } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setExportModalOpen, showToast } = useUIStore();
  const { tracks, clips } = useEditorStore();
  const { items } = useMediaStore();
  const { project } = useProjectStore();

  const [resolution, setResolution] = useState<'720p' | '1080p' | '1440p' | '4k'>('1080p');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentExporter, setCurrentExporter] = useState<StreamExporter | null>(null);

  const totalDuration = useMemo(() => {
    if (clips.length === 0) return 5.0;
    return Math.max(...clips.map((c) => c.startTimeOnTimeline + c.duration));
  }, [clips]);

  if (!isExportModalOpen) return null;

  const resolutionDimensions = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '1440p': { width: 2560, height: 1440 },
    '4k': { width: 3840, height: 2160 },
  };

  const handleStartExport = async () => {
    if (clips.length === 0) {
      showToast({
        type: 'warning',
        title: 'Empty Timeline',
        message: 'Add media clips to the timeline before exporting.',
      });
      return;
    }

    setIsExporting(true);
    setProgress(0);

    const dims = resolutionDimensions[resolution];
    const exporter = new StreamExporter(tracks, clips, items, totalDuration);
    setCurrentExporter(exporter);

    const options: ExportOptions = {
      width: dims.width,
      height: dims.height,
      fps,
      format,
      quality,
      filename: `${project.name}.${format}`,
    };

    try {
      const blob = await exporter.startExport(options, (pct) => {
        setProgress(pct);
      });

      platformBridge.downloadBlob(blob, options.filename);

      showToast({
        type: 'success',
        title: 'Export Completed',
        message: `Successfully rendered and downloaded ${options.filename}`,
      });

      setIsExporting(false);
      setExportModalOpen(false);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: (err as Error).message,
      });
      setIsExporting(false);
    }
  };

  const handleCancel = () => {
    if (isExporting && currentExporter) {
      currentExporter.cancelExport();
      setIsExporting(false);
    } else {
      setExportModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-150">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-7 shadow-glass-lg backdrop-blur-3xl bg-slate-950/80 border border-white/15 relative select-none specular-border">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-cyan to-blue-500 text-black flex items-center justify-center shadow-glow-cyan">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white drop-shadow-sm">Export Timeline Video</h3>
              <p className="text-xs text-editor-dim">Render client-side video with full hardware acceleration</p>
            </div>
          </div>

          {!isExporting && (
            <button
              onClick={() => setExportModalOpen(false)}
              className="p-1.5 rounded-full glass-pill hover:bg-white/[0.1] text-editor-dim hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Export Settings Form */}
        {!isExporting ? (
          <div className="space-y-4 py-4">
            {/* Resolution Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-editor-subtext">Resolution</label>
              <div className="grid grid-cols-4 gap-2">
                {(['720p', '1080p', '1440p', '4k'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setResolution(r)}
                    className={`py-2 rounded-2xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      resolution === r
                        ? 'glass-pill-active'
                        : 'glass-pill text-editor-subtext hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-editor-subtext">Frame Rate</label>
              <div className="grid grid-cols-3 gap-2">
                {([24, 30, 60] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      fps === f
                        ? 'glass-pill-active'
                        : 'glass-pill text-editor-subtext hover:text-white'
                    }`}
                  >
                    {f} FPS {f === 24 ? '(Cinema)' : f === 60 ? '(Fluid)' : '(Standard)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-editor-subtext">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['mp4', 'webm'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`py-2 rounded-2xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        format === fmt
                          ? 'glass-pill-active'
                          : 'glass-pill text-editor-subtext hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-editor-subtext">Bitrate Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full glass-pill rounded-2xl px-3.5 py-2 text-xs text-editor-text focus:outline-none focus:border-accent-cyan cursor-pointer"
                >
                  <option value="low" className="bg-slate-900 text-white">Low (Faster, smaller file)</option>
                  <option value="medium" className="bg-slate-900 text-white">Medium (Standard)</option>
                  <option value="high" className="bg-slate-900 text-white">High (Best visual fidelity)</option>
                </select>
              </div>
            </div>

            {/* Estimated Information Summary in Frosted Glass Card */}
            <div className="glass-card rounded-2xl p-3.5 flex items-center justify-between text-xs text-editor-dim border border-white/10">
              <div>
                <span>Duration: </span>
                <span className="font-mono text-accent-cyan font-bold">{totalDuration.toFixed(1)}s</span>
              </div>
              <div>
                <span>Output: </span>
                <span className="font-mono text-white font-semibold">
                  {resolutionDimensions[resolution].width}x{resolutionDimensions[resolution].height} @ {fps}fps
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Live Export Rendering Progress */
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-accent-cyan animate-spin stroke-1 drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]" />
              <span className="absolute font-mono text-sm font-bold text-white">
                {progress}%
              </span>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-bold text-white">Rendering Composition...</h4>
              <p className="text-xs text-editor-dim mt-1">
                Compositing layers and audio tracks into {format.toUpperCase()}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-accent-cyan via-blue-500 to-accent-purple transition-all duration-150 rounded-full shadow-glow-cyan"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-2xl text-xs font-semibold text-editor-subtext hover:text-white glass-pill transition-colors cursor-pointer"
          >
            {isExporting ? 'Cancel Export' : 'Cancel'}
          </button>

          {!isExporting && (
            <button
              onClick={handleStartExport}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Start Export</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
