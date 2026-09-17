import React, { useState, useRef } from 'react';
import { BRANDING } from '@/branding';
import { useEditorStore } from '@/store/useEditorStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { useMediaStore } from '@/store/useMediaStore';
import { ProjectSerializer } from '@/core/storage/projectSerializer';
import { platformBridge } from '@/core/platform/PlatformBridge';
import {
  Undo2,
  Redo2,
  Magnet,
  Layers,
  Download,
  Settings,
  HelpCircle,
  FolderOpen,
  Save,
  PlusCircle,
  ChevronDown,
  Sparkles,
  User,
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { project, setProjectName } = useProjectStore();
  const {
    tracks,
    clips,
    canUndo,
    canRedo,
    undo,
    redo,
    snappingEnabled,
    toggleSnapping,
    rippleEnabled,
    toggleRipple,
    loadProjectData,
    resetProject,
  } = useEditorStore();
  const { items, loadPersistedManifest } = useMediaStore();
  const {
    setExportModalOpen,
    setSettingsModalOpen,
    setShortcutsModalOpen,
    isChatBotOpen,
    toggleChatBot,
    showToast,
    openConfirmDialog,
    setCurrentPage,
  } = useUIStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(project.name);
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'help' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProject = async () => {
    try {
      const json = ProjectSerializer.serialize(project, tracks, clips, items);
      await platformBridge.saveProjectFile(`${project.name}.apexproject`, json);
      showToast({
        type: 'success',
        title: 'Project Saved',
        message: `Saved ${project.name} successfully.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: (err as Error).message,
      });
    }
  };

  const handleOpenProjectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const projectData = ProjectSerializer.deserialize(content);
        loadProjectData(projectData.tracks, projectData.clips);
        loadPersistedManifest(
          projectData.mediaManifest.map((m) => ({
            id: m.id,
            name: m.name,
            type: m.type as 'video' | 'audio' | 'image',
            mimeType: 'video/mp4',
            sizeBytes: m.sizeBytes,
            duration: m.duration,
            dateAdded: Date.now(),
          }))
        );
        showToast({
          type: 'success',
          title: 'Project Loaded',
          message: `Loaded ${projectData.settings.name}`,
        });
      } catch (err) {
        showToast({
          type: 'error',
          title: 'Open Failed',
          message: 'Invalid project file format.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleNewProject = () => {
    openConfirmDialog({
      title: 'New Project',
      message: 'Are you sure you want to start a new project? Any unsaved timeline progress will be cleared.',
      confirmLabel: 'Create New Project',
      isDestructive: true,
      onConfirm: () => {
        resetProject();
        showToast({
          type: 'info',
          title: 'New Project Created',
        });
      },
    });
  };

  return (
    <header className="h-14 bg-editor-panel border-b border-editor-border px-4 flex items-center justify-between select-none z-30 relative">
      {/* Hidden file input for opening project */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleOpenProjectFile}
        accept=".apexproject,.velocityproject,.json"
        className="hidden"
      />

      {/* Left: Brand Monogram & Menu */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-cyan to-accent-purple p-1.5 shadow-glow-cyan flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-black w-full h-full">
              <path d={BRANDING.logo.svgPath} />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-base text-editor-text hidden sm:inline">
            Apex <span className="text-accent-cyan font-normal">Editor</span>
          </span>
        </div>

        <div className="h-5 w-[1px] bg-editor-border mx-1" />

        {/* Dropdown Menus */}
        <nav className="flex items-center gap-1 text-xs font-medium text-editor-subtext">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
              className={`px-2.5 py-1.5 rounded-lg hover:text-editor-text hover:bg-editor-surface transition-colors flex items-center gap-1 ${
                openMenu === 'file' ? 'bg-editor-surface text-editor-text' : ''
              }`}
            >
              File <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openMenu === 'file' && (
              <div
                className="absolute left-0 top-full mt-1 w-48 bg-editor-panel border border-editor-border rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => {
                    handleNewProject();
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface flex items-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-accent-cyan" /> New Project
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface flex items-center gap-2"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-editor-subtext" /> Open Project...
                </button>
                <button
                  onClick={() => {
                    handleSaveProject();
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-editor-subtext" /> Save Project (Ctrl+S)
                </button>
                <div className="my-1 border-t border-editor-border" />
                <button
                  onClick={() => {
                    setSettingsModalOpen(true);
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-editor-subtext" /> Project Settings
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
              className={`px-2.5 py-1.5 rounded-lg hover:text-editor-text hover:bg-editor-surface transition-colors flex items-center gap-1 ${
                openMenu === 'edit' ? 'bg-editor-surface text-editor-text' : ''
              }`}
            >
              Edit <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openMenu === 'edit' && (
              <div
                className="absolute left-0 top-full mt-1 w-44 bg-editor-panel border border-editor-border rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => {
                    undo();
                    setOpenMenu(null);
                  }}
                  disabled={!canUndo}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface disabled:opacity-40 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Undo2 className="w-3.5 h-3.5" /> Undo
                  </span>
                  <kbd className="text-[10px] text-editor-dim">Ctrl+Z</kbd>
                </button>
                <button
                  onClick={() => {
                    redo();
                    setOpenMenu(null);
                  }}
                  disabled={!canRedo}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface disabled:opacity-40 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Redo2 className="w-3.5 h-3.5" /> Redo
                  </span>
                  <kbd className="text-[10px] text-editor-dim">Ctrl+Y</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
              className={`px-2.5 py-1.5 rounded-lg hover:text-editor-text hover:bg-editor-surface transition-colors flex items-center gap-1 ${
                openMenu === 'help' ? 'bg-editor-surface text-editor-text' : ''
              }`}
            >
              Help <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openMenu === 'help' && (
              <div
                className="absolute left-0 top-full mt-1 w-48 bg-editor-panel border border-editor-border rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => {
                    setShortcutsModalOpen(true);
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-editor-text hover:bg-editor-surface flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-accent-cyan" /> Keyboard Shortcuts
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Center: Editable Project Name */}
      <div className="flex items-center justify-center">
        {isEditingName ? (
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => {
              if (nameInput.trim()) setProjectName(nameInput.trim());
              setIsEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (nameInput.trim()) setProjectName(nameInput.trim());
                setIsEditingName(false);
              }
            }}
            autoFocus
            className="bg-editor-surface border border-accent-cyan rounded px-2.5 py-1 text-xs font-semibold text-editor-text focus:outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setNameInput(project.name);
              setIsEditingName(true);
            }}
            title="Click to rename project"
            className="text-xs font-semibold text-editor-text hover:text-accent-cyan px-2.5 py-1 rounded hover:bg-editor-surface transition-colors flex items-center gap-1.5"
          >
            {project.name}
            <span className="text-[10px] text-editor-dim font-normal">
              ({project.width}x{project.height} @ {project.fps}fps)
            </span>
          </button>
        )}
      </div>

      {/* Right: Quick Tools & Export CTA */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-editor-surface rounded-lg p-0.5 border border-editor-border">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-editor-hover text-editor-subtext hover:text-editor-text disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-editor-hover text-editor-subtext hover:text-editor-text disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Snapping Magnet Toggle */}
        <button
          onClick={toggleSnapping}
          title={snappingEnabled ? 'Snapping Enabled (S)' : 'Snapping Disabled'}
          className={`p-1.5 rounded-lg border transition-all ${
            snappingEnabled
              ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40 shadow-glow-cyan'
              : 'bg-editor-surface text-editor-dim border-editor-border hover:text-editor-text'
          }`}
        >
          <Magnet className="w-4 h-4" />
        </button>

        {/* Ripple Mode Toggle */}
        <button
          onClick={toggleRipple}
          title={rippleEnabled ? 'Ripple Edit: ON' : 'Ripple Edit: OFF'}
          className={`p-1.5 rounded-lg border transition-all ${
            rippleEnabled
              ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/40 shadow-glow-purple'
              : 'bg-editor-surface text-editor-dim border-editor-border hover:text-editor-text'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={() => setSettingsModalOpen(true)}
          title="Project Settings"
          className="p-1.5 rounded-lg bg-editor-surface text-editor-subtext hover:text-editor-text border border-editor-border transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* AI Co-Pilot Assistant Button */}
        <button
          onClick={toggleChatBot}
          title="AI Video Editing Assistant (Ctrl+J)"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
            isChatBotOpen
              ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/60 shadow-glow-cyan font-semibold'
              : 'bg-editor-surface text-editor-subtext hover:text-accent-cyan border-editor-border hover:border-accent-cyan/40 shadow-sm'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-xs font-semibold">AI Co-Pilot</span>
        </button>

        {/* Sign In / Account Button */}
        <button
          onClick={() => {
            window.location.hash = '#login';
            setCurrentPage('login');
          }}
          title="Sign In / Account"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-editor-surface text-editor-subtext hover:text-white border border-editor-border hover:border-white/20 transition-all text-xs font-medium cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-editor-subtext" />
          <span className="hidden sm:inline">Sign In</span>
        </button>

        {/* Export CTA Button */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="ml-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-accent-cyan to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:shadow-cyan-400/40 transition-all transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
};
