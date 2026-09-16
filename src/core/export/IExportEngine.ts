export interface ExportOptions {
  width: number;
  height: number;
  fps: number;
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high';
  filename: string;
}

export interface IExportEngine {
  startExport(
    options: ExportOptions,
    onProgress: (progressPercent: number) => void
  ): Promise<Blob>;
  cancelExport(): void;
}
