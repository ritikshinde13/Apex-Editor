import { TimelineClip, TimelineTrack } from '@/types/timeline';

export interface HistorySnapshot {
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  description: string;
  timestamp: number;
}

const MAX_HISTORY_LENGTH = 50;

class HistoryManager {
  private past: HistorySnapshot[] = [];
  private future: HistorySnapshot[] = [];

  public recordState(tracks: TimelineTrack[], clips: TimelineClip[], description: string = 'Edit') {
    // Deep clone state snapshot
    const snapshot: HistorySnapshot = {
      tracks: JSON.parse(JSON.stringify(tracks)),
      clips: JSON.parse(JSON.stringify(clips)),
      description,
      timestamp: Date.now(),
    };

    this.past.push(snapshot);
    if (this.past.length > MAX_HISTORY_LENGTH) {
      this.past.shift();
    }
    // Clear redo history when a new action is performed
    this.future = [];
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  public undo(currentTracks: TimelineTrack[], currentClips: TimelineClip[]): HistorySnapshot | null {
    if (this.past.length === 0) return null;

    // Push current state onto future stack
    this.future.push({
      tracks: JSON.parse(JSON.stringify(currentTracks)),
      clips: JSON.parse(JSON.stringify(currentClips)),
      description: 'Before Undo',
      timestamp: Date.now(),
    });

    return this.past.pop() || null;
  }

  public redo(currentTracks: TimelineTrack[], currentClips: TimelineClip[]): HistorySnapshot | null {
    if (this.future.length === 0) return null;

    // Push current state onto past stack
    this.past.push({
      tracks: JSON.parse(JSON.stringify(currentTracks)),
      clips: JSON.parse(JSON.stringify(currentClips)),
      description: 'Before Redo',
      timestamp: Date.now(),
    });

    return this.future.pop() || null;
  }

  public clear() {
    this.past = [];
    this.future = [];
  }
}

export const historyManager = new HistoryManager();
