import React, { useRef, useState, useCallback } from 'react';
import { useMediaStore } from '@/store/useMediaStore';
import { useEditorStore } from '@/store/useEditorStore';
import { usePlaybackStore } from '@/store/usePlaybackStore';
import { useUIStore } from '@/store/useUIStore';
import { MediaItem } from '@/types/media';
import { TimelineClip } from '@/types/timeline';
import { formatCompactTime } from '@/utils/timecode';
import { generateUniqueId } from '@/utils/id';
import {
  UploadCloud,
  Film,
  Music,
  Image as ImageIcon,
  Plus,
  Trash2,
  Search,
} from 'lucide-react';

export const MediaLibrary: React.FC = () => {
  const {
    items,
    searchQuery,
    filterType,
    isImporting,
    setSearchQuery,
    setFilterType,
    importFiles,
    removeMediaItem,
  } = useMediaStore();

  const { tracks, addClip } = useEditorStore();
  const { currentTime } = usePlaybackStore();
  const { showToast } = useUIStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imported = await importFiles(e.target.files);
      showToast({
        type: 'success',
        title: 'Media Imported',
        message: `Imported ${imported.length} asset${imported.length > 1 ? 's' : ''}`,
      });
      e.target.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imported = await importFiles(e.dataTransfer.files);
      showToast({
        type: 'success',
        title: 'Media Imported',
        message: `Imported ${imported.length} asset${imported.length > 1 ? 's' : ''}`,
      });
    }
  };

  const handleAddMediaToTimeline = useCallback((media: MediaItem) => {
    // Find matching track
    let targetTrack = tracks.find((t) => {
      if (media.type === 'video' || media.type === 'image') return t.type === 'video' && !t.isLocked;
      if (media.type === 'audio') return t.type === 'audio' && !t.isLocked;
      return false;
    });

    if (!targetTrack) {
      targetTrack = tracks[0];
    }

    const clipDuration = media.duration > 0 ? media.duration : 5.0; // 5s for static images

    const newClip: TimelineClip = {
      id: generateUniqueId('clip'),
      trackId: targetTrack.id,
      mediaId: media.id,
      type: media.type === 'image' ? 'image' : media.type === 'audio' ? 'audio' : 'video',
      title: media.name,
      startTimeOnTimeline: currentTime,
      duration: clipDuration,
      inPoint: 0,
      sourceDuration: clipDuration,
      speed: 1.0,
      transform: {
        x: 0,
        y: 0,
        scale: 1.0,
        rotation: 0,
        opacity: 1.0,
        cropTop: 0,
        cropBottom: 0,
        cropLeft: 0,
        cropRight: 0,
      },
      adjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        temperature: 0,
        blur: 0,
        vignette: 0,
        filterPreset: 'none',
      },
      audio: {
        volume: 1.0,
        isMuted: false,
        fadeIn: 0,
        fadeOut: 0,
        pan: 0,
      },
    };

    addClip(newClip);
    showToast({
      type: 'info',
      title: 'Added to Timeline',
      message: `${media.name} added at ${formatCompactTime(currentTime)}`,
    });
  }, [tracks, currentTime, addClip, showToast]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-transparent select-none">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="video/*,audio/*,image/*"
        className="hidden"
      />

      {/* Header & Import Action */}
      <div className="p-3.5 border-b border-white/[0.08] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-editor-text uppercase tracking-wider drop-shadow-sm">
            Media Pool
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 bg-accent-cyan hover:bg-cyan-300 text-black text-xs font-bold rounded-full flex items-center gap-1.5 transition-all shadow-glow-cyan/50 hover:scale-105 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Import
          </button>
        </div>

        {/* Drag & Drop Box with frosted glass */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-accent-cyan bg-accent-cyan/15 shadow-glow-cyan/30'
              : 'border-white/10 hover:border-accent-cyan/40 glass-card'
          }`}
        >
          <div className="flex flex-col items-center gap-1 text-editor-subtext">
            <UploadCloud className="w-5 h-5 text-accent-cyan animate-pulse" />
            <p className="text-[11px] font-semibold text-editor-text">
              {isImporting ? 'Processing files...' : 'Drag & drop media files here'}
            </p>
            <span className="text-[10px] text-editor-dim">MP4, WebM, MOV, MP3, WAV, PNG, JPG</span>
          </div>
        </div>

        {/* Search Bar with Glass Pill */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-editor-dim" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-pill rounded-xl pl-8 pr-3 py-1.5 text-xs text-editor-text placeholder-editor-dim focus:outline-none focus:border-accent-cyan/50 focus:shadow-glow-cyan/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto text-[11px] pb-0.5">
          {(['all', 'video', 'audio', 'image'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full capitalize transition-all font-medium cursor-pointer ${
                filterType === t
                  ? 'glass-pill-active font-semibold'
                  : 'glass-pill text-editor-subtext hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset List / Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <Film className="w-8 h-8 text-editor-muted mb-2 stroke-1" />
            <p className="text-xs font-semibold text-editor-subtext">No media assets found</p>
            <p className="text-[11px] text-editor-dim mt-1">Import footage to begin editing</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 p-2.5 glass-card rounded-2xl hover:border-accent-cyan/40 transition-all shadow-glass-sm"
            >
              {/* Thumbnail / Icon */}
              <div className="w-14 h-10 rounded-xl overflow-hidden bg-black/80 flex items-center justify-center shrink-0 border border-white/10 relative shadow-inner">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : item.type === 'audio' ? (
                  <Music className="w-5 h-5 text-accent-purple" />
                ) : item.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-accent-cyan" />
                ) : (
                  <Film className="w-5 h-5 text-editor-dim" />
                )}
                {item.duration > 0 && (
                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.2 rounded text-[9px] font-mono text-editor-text">
                    {formatCompactTime(item.duration)}
                  </span>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-editor-text truncate" title={item.name}>
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-editor-dim mt-0.5">
                  <span className="uppercase font-medium text-accent-cyan/90">{item.type}</span>
                  <span>•</span>
                  <span>{(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleAddMediaToTimeline(item)}
                  title="Add to Timeline at playhead"
                  className="p-1.5 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan text-accent-cyan hover:text-black transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => removeMediaItem(item.id)}
                  title="Remove from Media Pool"
                  className="p-1.5 rounded-xl hover:bg-rose-500/20 text-editor-dim hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
