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
  const { showToast, currentPage, setCurrentPage } = useUIStore();

  const [isWindowDragOver, setIsWindowDragOver] = useState(false);

  // Sync route with URL hash #login or #editor
  useEffect(() => {
    const handleHashSync = () => {
      if (window.location.hash === '#login') {
        setCurrentPage('login');
      } else if (window.location.hash === '#editor') {
        setCurrentPage('editor');
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [setCurrentPage]);

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

  if (currentPage === 'login') {
    return (
      <div className="h-screen w-screen bg-[#0d0d0f] overflow-y-auto">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-editor-bg text-editor-text overflow-hidden font-sans relative select-none">
      {/* Top Navigation */}
      <HeaderNav />

      {/* Main Workspace (Left Library, Preview Monitor, Inspector) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-100">
          <div className="border-3 border-dashed border-accent-cyan p-12 rounded-3xl flex flex-col items-center gap-4 text-accent-cyan shadow-glow-cyan">
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
