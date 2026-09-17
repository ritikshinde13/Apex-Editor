import { create } from 'zustand';
import { MediaItem, MediaType } from '@/types/media';
import { IndexedDBStorage } from '@/core/storage/idbStorage';
import {
  parseMp4DurationFromFile,
  extractAudioTrackDuration,
  resolveVideoElementDuration,
} from '@/utils/mediaDuration';

interface MediaState {
  items: MediaItem[];
  selectedMediaId: string | null;
  searchQuery: string;
  filterType: 'all' | MediaType;
  isImporting: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterType: (filter: 'all' | MediaType) => void;
  setSelectedMediaId: (id: string | null) => void;
  importFiles: (files: FileList | File[]) => Promise<MediaItem[]>;
  removeMediaItem: (id: string) => Promise<void>;
  getMediaBlobUrl: (id: string) => Promise<string | undefined>;
  loadPersistedManifest: (manifestItems: MediaItem[]) => void;
  updateMediaDuration: (id: string, duration: number) => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  items: [],
  selectedMediaId: null,
  searchQuery: '',
  filterType: 'all',
  isImporting: false,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilterType: (filter: 'all' | MediaType) => set({ filterType: filter }),
  setSelectedMediaId: (id: string | null) => set({ selectedMediaId: id }),

  updateMediaDuration: (id: string, duration: number) => {
    if (!isFinite(duration) || duration <= 0) return;
    const current = get().items.find((i) => i.id === id);
    if (current && (current.duration < duration || current.duration <= 30)) {
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, duration } : i)),
      }));
    }
  },

  importFiles: async (files: FileList | File[]): Promise<MediaItem[]> => {
    set({ isImporting: true });
    const importedItems: MediaItem[] = [];

    for (const file of Array.from(files)) {
      try {
        const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        let mediaType: MediaType = 'video';

        if (file.type.startsWith('video/')) {
          mediaType = 'video';
        } else if (file.type.startsWith('audio/')) {
          mediaType = 'audio';
        } else if (file.type.startsWith('image/')) {
          mediaType = 'image';
        } else {
          console.warn(`Unsupported file format skipped: ${file.name} (${file.type})`);
          continue;
        }

        // Store persistent binary blob in IndexedDB (§6.4)
        await IndexedDBStorage.saveMediaBlob(id, file);

        const objectUrl = URL.createObjectURL(file);
        let duration = 0;
        let width = 1920;
        let height = 1080;
        let thumbnailUrl: string | undefined = undefined;
        let waveformPeaks: number[] | undefined = undefined;

        if (mediaType === 'video') {
          const videoMeta = await extractVideoMetadata(file, objectUrl);
          duration = videoMeta.duration;
          width = videoMeta.width;
          height = videoMeta.height;
          thumbnailUrl = videoMeta.thumbnailUrl;
        } else if (mediaType === 'audio') {
          const audioMeta = await extractAudioMetadata(file);
          duration = audioMeta.duration;
          waveformPeaks = audioMeta.waveformPeaks;
        } else if (mediaType === 'image') {
          const imgMeta = await extractImageMetadata(objectUrl);
          width = imgMeta.width;
          height = imgMeta.height;
          thumbnailUrl = objectUrl;
        }

        const item: MediaItem = {
          id,
          name: file.name,
          type: mediaType,
          mimeType: file.type,
          sizeBytes: file.size,
          duration,
          width,
          height,
          thumbnailUrl,
          waveformPeaks,
          blobUrl: objectUrl,
          dateAdded: Date.now(),
        };

        importedItems.push(item);
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
    }

    set((state) => ({
      items: [...state.items, ...importedItems],
      isImporting: false,
    }));

    return importedItems;
  },

  removeMediaItem: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (item?.blobUrl) {
      URL.revokeObjectURL(item.blobUrl);
    }
    await IndexedDBStorage.deleteMediaBlob(id);
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      selectedMediaId: state.selectedMediaId === id ? null : state.selectedMediaId,
    }));
  },

  getMediaBlobUrl: async (id: string): Promise<string | undefined> => {
    const existing = get().items.find((i) => i.id === id);
    if (existing?.blobUrl) return existing.blobUrl;

    const blob = await IndexedDBStorage.getMediaBlob(id);
    if (blob) {
      const url = URL.createObjectURL(blob);
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, blobUrl: url } : i)),
      }));
      return url;
    }
    return undefined;
  },

  loadPersistedManifest: (manifestItems: MediaItem[]) => {
    set({ items: manifestItems });
  },
}));

// Video metadata extractor with multi-tier duration resolution and thumbnail generation
async function extractVideoMetadata(
  file: File,
  videoUrl: string
): Promise<{ duration: number; width: number; height: number; thumbnailUrl: string }> {
  // Run Strategy A (MP4 box parse) and Strategy B (Audio track duration) in parallel with HTML5 video
  const [mp4Duration, audioDuration] = await Promise.all([
    parseMp4DurationFromFile(file).catch(() => null),
    extractAudioTrackDuration(file).catch(() => null),
  ]);

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'auto'; // Ensures browser buffers container metadata & trailer chunks

    let resolved = false;
    let bestDuration = Math.max(mp4Duration || 0, audioDuration || 0);

    const finish = (thumbnailUrl: string = '') => {
      if (resolved) return;
      resolved = true;
      const finalDuration = Math.max(
        bestDuration,
        isFinite(video.duration) && video.duration > 0 ? video.duration : 0,
        10
      );
      resolve({
        duration: finalDuration,
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        thumbnailUrl,
      });
    };

    video.onloadedmetadata = async () => {
      if (isFinite(video.duration) && video.duration > 0) {
        bestDuration = Math.max(bestDuration, video.duration);
      } else {
        // Chromium Infinity duration fix: force browser to read the trailer
        const resolvedElemDuration = await resolveVideoElementDuration(video, 2500);
        if (resolvedElemDuration > 0) {
          bestDuration = Math.max(bestDuration, resolvedElemDuration);
        }
      }

      // Seek to 1s or 25% for thumbnail
      const targetThumbTime = Math.min(1.0, (bestDuration > 0 ? bestDuration : 10) * 0.25);
      try {
        video.currentTime = targetThumbTime;
      } catch {
        finish();
      }
    };

    video.onseeked = () => {
      if (isFinite(video.duration) && video.duration > 0) {
        bestDuration = Math.max(bestDuration, video.duration);
      }
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (ctx && video.videoWidth > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
      finish(thumbnailUrl);
    };

    video.onerror = () => {
      finish();
    };

    // Safety timeout so file import never hangs indefinitely
    setTimeout(() => {
      finish();
    }, 4000);
  });
}

// Audio metadata & downsampled waveform extractor
async function extractAudioMetadata(
  audioFile: File
): Promise<{ duration: number; waveformPeaks: number[] }> {
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    // Downsample to 64 normalized peaks for visualization
    const channelData = audioBuffer.getChannelData(0);
    const samples = 64;
    const blockSize = Math.floor(channelData.length / samples);
    const peaks: number[] = [];

    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[blockStart + j] || 0);
      }
      peaks.push(Math.min(1.0, (sum / blockSize) * 2.5));
    }

    ctx.close();
    return { duration, waveformPeaks: peaks };
  } catch (err) {
    console.error('Waveform extraction fallback:', err);
    return { duration: 10, waveformPeaks: Array(64).fill(0.3) };
  }
}

// Image metadata extractor
function extractImageMetadata(
  imgUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 1920, height: 1080 });
    };
  });
}
