import { create } from 'zustand';
import { MediaItem, MediaType } from '@/types/media';
import { IndexedDBStorage } from '@/core/storage/idbStorage';

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
          const videoMeta = await extractVideoMetadata(objectUrl);
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

// Video metadata extractor with real thumbnail generation
function extractVideoMetadata(
  videoUrl: string
): Promise<{ duration: number; width: number; height: number; thumbnailUrl: string }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const duration = isFinite(video.duration) ? video.duration : 10;
      // Seek to 1s or 25% for thumbnail
      video.currentTime = Math.min(1.0, duration * 0.25);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve({
        duration: isFinite(video.duration) ? video.duration : 10,
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        thumbnailUrl,
      });
    };

    video.onerror = () => {
      resolve({ duration: 5, width: 1920, height: 1080, thumbnailUrl: '' });
    };
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
