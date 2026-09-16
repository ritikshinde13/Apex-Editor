export type MediaType = 'video' | 'audio' | 'image';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  mimeType: string;
  sizeBytes: number;
  duration: number;        // In seconds (0 for images)
  width?: number;          // Native width in pixels
  height?: number;         // Native height in pixels
  thumbnailUrl?: string;   // Frame thumbnail data URI
  waveformPeaks?: number[];// Downsampled normalized audio peaks [-1.0 to 1.0]
  blobUrl?: string;        // Active browser object URL
  dateAdded: number;       // Timestamp
}
