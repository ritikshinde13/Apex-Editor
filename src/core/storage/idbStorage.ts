import { get, set, del, keys } from 'idb-keyval';

const MEDIA_PREFIX = 'velocity_media_blob_';
const PROJECT_PREFIX = 'velocity_project_';

export class IndexedDBStorage {
  /**
   * Store media file Blob in IndexedDB by media ID
   */
  static async saveMediaBlob(mediaId: string, blob: Blob): Promise<void> {
    try {
      await set(`${MEDIA_PREFIX}${mediaId}`, blob);
    } catch (err) {
      console.error(`Failed to save media blob ${mediaId} in IndexedDB:`, err);
      throw err;
    }
  }

  /**
   * Retrieve media file Blob from IndexedDB
   */
  static async getMediaBlob(mediaId: string): Promise<Blob | undefined> {
    try {
      return await get<Blob>(`${MEDIA_PREFIX}${mediaId}`);
    } catch (err) {
      console.error(`Failed to retrieve media blob ${mediaId} from IndexedDB:`, err);
      return undefined;
    }
  }

  /**
   * Delete media file Blob from IndexedDB
   */
  static async deleteMediaBlob(mediaId: string): Promise<void> {
    try {
      await del(`${MEDIA_PREFIX}${mediaId}`);
    } catch (err) {
      console.error(`Failed to delete media blob ${mediaId}:`, err);
    }
  }

  /**
   * Clean up all stored blobs (e.g. project reset)
   */
  static async clearAllMedia(): Promise<void> {
    const allKeys = await keys();
    for (const key of allKeys) {
      if (typeof key === 'string' && key.startsWith(MEDIA_PREFIX)) {
        await del(key);
      }
    }
  }

  /**
   * Save project state string
   */
  static async saveProjectState(projectId: string, stateJson: string): Promise<void> {
    await set(`${PROJECT_PREFIX}${projectId}`, stateJson);
  }

  /**
   * Load project state string
   */
  static async loadProjectState(projectId: string): Promise<string | undefined> {
    return await get<string>(`${PROJECT_PREFIX}${projectId}`);
  }
}
