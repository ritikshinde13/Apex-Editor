import { ProjectExportData, ProjectSettings } from '@/types/project';
import { TimelineClip, TimelineTrack } from '@/types/timeline';
import { MediaItem } from '@/types/media';
import { IndexedDBStorage } from './idbStorage';

export class ProjectSerializer {
  /**
   * Serialize current project state into clean JSON (excluding raw binaries)
   */
  static serialize(
    settings: ProjectSettings,
    tracks: TimelineTrack[],
    clips: TimelineClip[],
    mediaItems: MediaItem[]
  ): string {
    const data: ProjectExportData = {
      version: '1.0.0',
      settings: {
        ...settings,
        updatedAt: Date.now(),
      },
      tracks,
      clips,
      mediaManifest: mediaItems.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        sizeBytes: item.sizeBytes,
        duration: item.duration,
      })),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Parse and validate project JSON file
   */
  static deserialize(jsonString: string): ProjectExportData {
    try {
      const parsed = JSON.parse(jsonString) as ProjectExportData;
      if (!parsed.version || !parsed.settings || !Array.isArray(parsed.tracks) || !Array.isArray(parsed.clips)) {
        throw new Error('Invalid project file format.');
      }
      return parsed;
    } catch (err) {
      throw new Error(`Failed to parse project file: ${(err as Error).message}`);
    }
  }

  /**
   * Auto-save project to local storage / IndexedDB
   */
  static async autoSave(
    settings: ProjectSettings,
    tracks: TimelineTrack[],
    clips: TimelineClip[],
    mediaItems: MediaItem[]
  ): Promise<void> {
    const json = this.serialize(settings, tracks, clips, mediaItems);
    localStorage.setItem(`velocity_autosave_${settings.id}`, json);
    await IndexedDBStorage.saveProjectState(settings.id, json);
  }

  /**
   * Retrieve auto-saved project
   */
  static async getAutoSave(projectId: string): Promise<ProjectExportData | null> {
    const local = localStorage.getItem(`velocity_autosave_${projectId}`);
    if (local) {
      try {
        return this.deserialize(local);
      } catch {
        // Fall back to idb
      }
    }
    const fromIdb = await IndexedDBStorage.loadProjectState(projectId);
    if (fromIdb) {
      return this.deserialize(fromIdb);
    }
    return null;
  }
}
