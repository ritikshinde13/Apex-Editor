import React from 'react';
import { TimelineTrack } from '@/types/timeline';
import { useEditorStore } from '@/store/useEditorStore';
import {
  Film,
  Music,
  Type,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Trash2,
} from 'lucide-react';

interface TrackHeaderProps {
  track: TimelineTrack;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({ track }) => {
  const { toggleMuteTrack, toggleLockTrack, toggleHideTrack, deleteTrack } = useEditorStore();

  const getIcon = () => {
    switch (track.type) {
      case 'video':
        return <Film className="w-3.5 h-3.5 text-accent-cyan" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-accent-purple" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  return (
    <div className="h-14 bg-editor-panel border-b border-editor-border px-3 flex items-center justify-between select-none shrink-0 w-48 border-r">
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1 rounded bg-editor-surface">{getIcon()}</div>
        <span className="text-xs font-semibold text-editor-text truncate" title={track.name}>
          {track.name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Visibility / Hide (Video & Text) */}
        {track.type !== 'audio' && (
          <button
            onClick={() => toggleHideTrack(track.id)}
            title={track.isHidden ? 'Show Track' : 'Hide Track'}
            className={`p-1 rounded hover:bg-editor-surface transition-colors ${
              track.isHidden ? 'text-accent-danger' : 'text-editor-dim hover:text-editor-text'
            }`}
          >
            {track.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Mute (Audio & Video) */}
        {track.type !== 'text' && (
          <button
            onClick={() => toggleMuteTrack(track.id)}
            title={track.isMuted ? 'Unmute Track' : 'Mute Track'}
            className={`p-1 rounded hover:bg-editor-surface transition-colors ${
              track.isMuted ? 'text-accent-danger' : 'text-editor-dim hover:text-editor-text'
            }`}
          >
            {track.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Lock Track */}
        <button
          onClick={() => toggleLockTrack(track.id)}
          title={track.isLocked ? 'Unlock Track' : 'Lock Track'}
          className={`p-1 rounded hover:bg-editor-surface transition-colors ${
            track.isLocked ? 'text-accent-warning' : 'text-editor-dim hover:text-editor-text'
          }`}
        >
          {track.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Delete Track */}
        <button
          onClick={() => deleteTrack(track.id)}
          title="Delete Track"
          className="p-1 rounded hover:bg-editor-surface text-editor-dim hover:text-accent-danger transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
