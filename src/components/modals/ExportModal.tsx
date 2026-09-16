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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-editor-panel border border-editor-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-editor-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-editor-text">Export Timeline Video</h3>
              <p className="text-xs text-editor-dim">Render your project to a playable video file</p>
            </div>
          </div>

          {!isExporting && (
            <button
              onClick={() => setExportModalOpen(false)}
              className="p-1 rounded-lg hover:bg-editor-surface text-editor-dim hover:text-editor-text transition-colors"
            >
              <X className="w-5 h-5" />
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
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                      resolution === r
                        ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan shadow-glow-cyan'
                        : 'bg-editor-surface text-editor-subtext border-editor-border hover:text-editor-text'
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
                    className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                      fps === f
                        ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan shadow-glow-cyan'
                        : 'bg-editor-surface text-editor-subtext border-editor-border hover:text-editor-text'
                    }`}
                  >
                    {f} FPS {f === 24 ? '(Cinema)' : f === 60 ? '(High Motion)' : '(Standard)'}
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
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                        format === fmt
                          ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan'
                          : 'bg-editor-surface text-editor-subtext border-editor-border'
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
                  className="w-full bg-editor-surface border border-editor-border rounded-xl px-3 py-2 text-xs text-editor-text focus:outline-none focus:border-accent-cyan"
                >
                  <option value="low">Low (Faster, smaller file)</option>
                  <option value="medium">Medium (Standard)</option>
                  <option value="high">High (Best visual fidelity)</option>
                </select>
              </div>
            </div>

            {/* Estimated Information Summary */}
            <div className="bg-editor-surface/60 border border-editor-border rounded-xl p-3 flex items-center justify-between text-xs text-editor-dim">
              <div>
                <span>Duration: </span>
                <span className="font-mono text-editor-text">{totalDuration.toFixed(1)}s</span>
              </div>
              <div>
                <span>Output: </span>
                <span className="font-mono text-editor-text">
                  {resolutionDimensions[resolution].width}x{resolutionDimensions[resolution].height} @ {fps}fps
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Live Export Rendering Progress */
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-14 h-14 text-accent-cyan animate-spin stroke-1" />
              <span className="absolute font-mono text-sm font-bold text-editor-text">
                {progress}%
              </span>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-bold text-editor-text">Rendering Video Composition...</h4>
              <p className="text-xs text-editor-dim mt-1">
                Compositing layers and audio tracks into {format.toUpperCase()}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-editor-surface h-2.5 rounded-full overflow-hidden border border-editor-border">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple transition-all duration-150 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-editor-border">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-editor-subtext hover:text-editor-text bg-editor-surface hover:bg-editor-hover border border-editor-border transition-colors"
          >
            {isExporting ? 'Cancel Export' : 'Cancel'}
          </button>

          {!isExporting && (
            <button
              onClick={handleStartExport}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent-cyan to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
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
