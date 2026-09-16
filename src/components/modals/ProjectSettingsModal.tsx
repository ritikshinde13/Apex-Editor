import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { ASPECT_RATIOS } from '@/types/project';
import { Settings, X } from 'lucide-react';

export const ProjectSettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, showToast } = useUIStore();
  const { project, setDimensions, setFps, setProjectName } = useProjectStore();

  const [name, setName] = useState(project.name);
  const [aspectRatio, setAspectRatio] = useState(project.aspectRatio);
  const [fps, setFpsVal] = useState(project.fps);

  if (!isSettingsModalOpen) return null;

  const handleSave = () => {
    if (name.trim()) setProjectName(name.trim());
    const config = ASPECT_RATIOS[aspectRatio];
    setDimensions(config.width, config.height, aspectRatio);
    setFps(fps);

    showToast({
      type: 'success',
      title: 'Settings Updated',
      message: `Canvas configured to ${config.width}x${config.height} @ ${fps}fps`,
    });

    setSettingsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-editor-panel border border-editor-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-editor-border">
          <div className="flex items-center gap-2 text-accent-cyan">
            <Settings className="w-5 h-5" />
            <h3 className="font-bold text-editor-text text-base">Project Settings</h3>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1 rounded-lg hover:bg-editor-surface text-editor-dim hover:text-editor-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-4">
          {/* Project Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-editor-subtext">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-editor-surface border border-editor-border rounded-xl px-3 py-2 text-xs text-editor-text focus:outline-none focus:border-accent-cyan"
            />
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-editor-subtext">Canvas Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as keyof typeof ASPECT_RATIOS)}
              className="w-full bg-editor-surface border border-editor-border rounded-xl px-3 py-2 text-xs text-editor-text focus:outline-none focus:border-accent-cyan"
            >
              {Object.entries(ASPECT_RATIOS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* FPS */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-editor-subtext">Frame Rate (FPS)</label>
            <div className="grid grid-cols-3 gap-2">
              {[24, 30, 60].map((f) => (
                <button
                  key={f}
                  onClick={() => setFpsVal(f)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    fps === f
                      ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan'
                      : 'bg-editor-surface text-editor-subtext border-editor-border'
                  }`}
                >
                  {f} FPS
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-editor-border">
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-editor-subtext hover:text-editor-text bg-editor-surface border border-editor-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-accent-cyan hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
