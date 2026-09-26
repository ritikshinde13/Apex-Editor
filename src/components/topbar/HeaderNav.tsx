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
  LogOut,
  Home,
} from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';

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
    currentUser,
    setCurrentUser,
  } = useUIStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(project.name);
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'help' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
        console.error('Failed to open project file:', err);
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
    <header className="h-14 backdrop-blur-2xl bg-editor-panel/75 border-b border-white/[0.08] shadow-glass px-4 flex items-center justify-between select-none z-30 relative specular-border">
      {/* Hidden file input for opening project */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleOpenProjectFile}
        accept=".apexproject,.velocityproject,.json"
        className="hidden"
      />

      {/* Left: Brand Monogram & Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            window.location.hash = '#landing';
            setCurrentPage('landing');
          }}
          title="Return to Landing Page"
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-cyan via-blue-500 to-accent-purple p-1.5 shadow-glow-cyan flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-black w-full h-full">
              <path d={BRANDING.logo.svgPath} />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-base text-editor-text hidden sm:inline group-hover:text-white transition-colors">
            Apex <span className="text-accent-cyan font-normal drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Editor</span>
          </span>
        </button>

        <div className="h-5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        {/* Dropdown Menus in Glass Pills */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-editor-subtext">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                openMenu === 'file'
                  ? 'glass-pill-active text-white'
                  : 'glass-pill text-editor-subtext hover:text-white'
              }`}
            >
              File <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openMenu === 'file' && (
              <div
                className="absolute left-0 top-full mt-2 w-52 glass-panel rounded-2xl shadow-glass-lg border border-white/10 py-1.5 z-50 backdrop-blur-3xl bg-slate-950/85 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => {
                    handleNewProject();
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] hover:text-accent-cyan rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-accent-cyan" /> New Project
                </button>
                <button
                  onClick={() => {
                    window.location.hash = '#landing';
                    setCurrentPage('landing');
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-editor-subtext" /> Home Landing Page
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-editor-subtext" /> Open Project...
                </button>
                <button
                  onClick={() => {
                    handleSaveProject();
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-editor-subtext" /> Save Project (Ctrl+S)
                </button>
                <div className="my-1 border-t border-white/[0.08]" />
                <button
                  onClick={() => {
                    setSettingsModalOpen(true);
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                openMenu === 'edit'
                  ? 'glass-pill-active text-white'
                  : 'glass-pill text-editor-subtext hover:text-white'
              }`}
            >
              Edit <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openMenu === 'edit' && (
              <div
                className="absolute left-0 top-full mt-2 w-48 glass-panel rounded-2xl shadow-glass-lg border border-white/10 py-1.5 z-50 backdrop-blur-3xl bg-slate-950/85 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => {
                    undo();
                    setOpenMenu(null);
                  }}
                  disabled={!canUndo}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl disabled:opacity-30 transition-colors flex items-center justify-between cursor-pointer"
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
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl disabled:opacity-30 transition-colors flex items-center justify-between cursor-pointer"
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                openMenu === 'help'
                  ? 'glass-pill-active text-white'
                  : 'glass-pill text-editor-subtext hover:text-white'
              }`}
            >
              Help <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openMenu === 'help' && (
              <div
                className="absolute left-0 top-full mt-2 w-52 glass-panel rounded-2xl shadow-glass-lg border border-white/10 py-1.5 z-50 backdrop-blur-3xl bg-slate-950/85 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => {
                    setShortcutsModalOpen(true);
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] hover:text-accent-cyan rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-accent-cyan" /> Keyboard Shortcuts
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Center: Editable Project Name in Frosted Capsule */}
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
            className="glass-pill border border-accent-cyan/80 rounded-full px-4 py-1 text-xs font-semibold text-editor-text focus:outline-none shadow-glow-cyan"
          />
        ) : (
          <button
            onClick={() => {
              setNameInput(project.name);
              setIsEditingName(true);
            }}
            title="Click to rename project"
            className="glass-pill px-4 py-1.5 rounded-full text-xs font-semibold text-editor-text hover:text-accent-cyan hover:border-accent-cyan/50 hover:shadow-glow-cyan transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_6px_#00e5ff]" />
            <span>{project.name}</span>
            <span className="text-[10px] text-editor-dim font-normal">
              ({project.width}x{project.height} @ {project.fps}fps)
            </span>
          </button>
        )}
      </div>

      {/* Right: Quick Tools & Export CTA */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo in Glass Capsule */}
        <div className="flex items-center glass-pill rounded-full p-0.5 border border-white/10">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-editor-subtext hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-editor-subtext hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Snapping Magnet Toggle */}
        <button
          onClick={toggleSnapping}
          title={snappingEnabled ? 'Snapping Enabled (S)' : 'Snapping Disabled'}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            snappingEnabled
              ? 'glass-pill-active'
              : 'glass-pill text-editor-dim hover:text-editor-text'
          }`}
        >
          <Magnet className="w-4 h-4" />
        </button>

        {/* Ripple Mode Toggle */}
        <button
          onClick={toggleRipple}
          title={rippleEnabled ? 'Ripple Edit: ON' : 'Ripple Edit: OFF'}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            rippleEnabled
              ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/50 shadow-glow-purple backdrop-blur-md'
              : 'glass-pill text-editor-dim hover:text-editor-text'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={() => setSettingsModalOpen(true)}
          title="Project Settings"
          className="p-2 rounded-xl glass-pill text-editor-subtext hover:text-white transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* AI Co-Pilot Assistant Button */}
        <button
          onClick={toggleChatBot}
          title="AI Video Editing Assistant (Ctrl+J)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
            isChatBotOpen
              ? 'glass-pill-active font-semibold'
              : 'glass-pill text-editor-subtext hover:text-accent-cyan hover:border-accent-cyan/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
          <span className="text-xs font-semibold">AI Co-Pilot</span>
        </button>

        {/* User Account Button or Profile Dropdown */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-editor-text hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00D2FF] to-[#6C5CE7] flex items-center justify-center text-[10px] font-bold text-black uppercase shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline max-w-[85px] truncate font-medium">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 glass-panel rounded-2xl shadow-glass-lg border border-white/10 py-1.5 z-50 backdrop-blur-3xl bg-slate-950/85 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-white/[0.08]">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-editor-dim truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    window.location.hash = '#login';
                    setCurrentPage('login');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-editor-text hover:bg-white/[0.08] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-accent-cyan" /> Switch / Account
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    setCurrentUser(null);
                    window.location.hash = '#login';
                    setCurrentPage('login');
                    showToast({
                      type: 'info',
                      title: 'Signed Out',
                      message: 'You have returned to the login screen.',
                    });
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              window.location.hash = '#login';
              setCurrentPage('login');
            }}
            title="Sign In / Account"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-editor-subtext hover:text-white transition-all text-xs font-medium cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-editor-subtext" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* Export CTA Button with Animated Border Beam & Shimmer */}
        <AnimatedButton
          variant="cyan"
          onClick={() => setExportModalOpen(true)}
          className="ml-1 text-xs py-1.5 px-4 h-8 font-bold shadow-glow-cyan"
        >
          <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>Export Video</span>
        </AnimatedButton>
      </div>
    </header>
  );
};
