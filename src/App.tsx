import React, { useEffect, useState } from 'react';
import { HeaderNav } from './components/topbar/HeaderNav';
import { LeftDock } from './components/panels/LeftLibrary/LeftDock';
import { PreviewPlayer } from './components/panels/PreviewPlayer/PreviewPlayer';
import { Inspector } from './components/panels/Inspector/Inspector';
import { Timeline } from './components/timeline/Timeline';
import { ExportModal } from './components/modals/ExportModal';
import { ProjectSettingsModal } from './components/modals/ProjectSettingsModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ToastContainer } from './components/common/ToastContainer';
import { ChatBotModal } from './components/chatbot/ChatBotModal';
import { ChatBotTrigger } from './components/chatbot/ChatBotTrigger';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { useMediaStore } from './store/useMediaStore';
import { useProjectStore } from './store/useProjectStore';
import { useEditorStore } from './store/useEditorStore';
import { useUIStore } from './store/useUIStore';
import { ProjectSerializer } from './core/storage/projectSerializer';
import { UploadCloud } from 'lucide-react';

export const App: React.FC = () => {
  const { importFiles } = useMediaStore();
  const { project, markDirty } = useProjectStore();
  const { tracks, clips } = useEditorStore();
  const { items } = useMediaStore();
  const { showToast, currentPage, setCurrentPage, currentUser } = useUIStore();

  const [isWindowDragOver, setIsWindowDragOver] = useState(false);

  // Responsive route sync: landing page default, login auth gateway, and editor studio
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') {
        setCurrentPage('login');
      } else if (hash === '#editor') {
        if (!currentUser || !currentUser.isLoggedIn) {
          setCurrentPage('login');
          window.location.hash = '#login';
        } else {
          setCurrentPage('editor');
        }
      } else {
        // Any section hash (#about, #tools, #features, #faq, #app, #resources, #home, #landing, or empty)
        setCurrentPage('landing');
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [setCurrentPage, currentUser]);

  // Global window drag-and-drop file import
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes('Files')) {
        setIsWindowDragOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsWindowDragOver(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsWindowDragOver(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const imported = await importFiles(e.dataTransfer.files);
        showToast({
          type: 'success',
          title: 'Files Imported',
          message: `Added ${imported.length} asset${imported.length > 1 ? 's' : ''} to media pool`,
        });
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [importFiles, showToast]);

  // Periodic Auto-Save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (clips.length > 0) {
        ProjectSerializer.autoSave(project, tracks, clips, items).catch(() => {});
        markDirty(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [project, tracks, clips, items, markDirty]);

  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'login' || !currentUser?.isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-[#07080c] overflow-y-auto relative selection:bg-accent-cyan selection:text-black">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-editor-bg text-editor-text overflow-hidden font-sans relative select-none">
      {/* Dynamic Ambient Background Mesh Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Cyan Orb top-left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-accent-cyan/15 blur-[140px] animate-orb-1" />
        {/* Purple Orb bottom-right */}
        <div className="absolute -bottom-40 -right-32 w-[700px] h-[700px] rounded-full bg-accent-purple/15 blur-[160px] animate-orb-2" />
        {/* Deep Violet Center Ambient */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px] animate-orb-3" />
        {/* Subtle Noise / Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,6,8,0.6)_100%)] pointer-events-none" />
      </div>

      {/* Top Navigation */}
      <HeaderNav />

      {/* Main Workspace (Left Library, Preview Monitor, Inspector) */}
      <div className="flex-1 flex flex-row overflow-hidden relative z-10">
        <LeftDock />
        <PreviewPlayer />
        <Inspector />
      </div>

      {/* Bottom Multitrack Timeline */}
      <Timeline />

      {/* Modals & Dialogs */}
      <ExportModal />
      <ProjectSettingsModal />
      <ShortcutsModal />
      <ConfirmDialog />
      <ToastContainer />
      <ChatBotModal />
      <ChatBotTrigger />

      {/* Full-Window Drag & Drop Indicator Overlay */}
      {isWindowDragOver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-150">
          <div className="glass-panel p-12 rounded-3xl flex flex-col items-center gap-4 text-accent-cyan shadow-glow-cyan border-2 border-dashed border-accent-cyan/60 scale-105 transition-transform">
            <UploadCloud className="w-16 h-16 animate-bounce" />
            <h2 className="text-xl font-bold tracking-wide text-white">
              Drop Media Files Anywhere to Ingest
            </h2>
            <p className="text-xs text-editor-subtext">Videos, Music, Voiceovers, Photos</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
