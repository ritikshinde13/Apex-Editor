export interface FileDialogFilter {
  name: string;
  extensions: string[];
}

export interface IPlatformBridge {
  isDesktop: boolean;
  openMediaFiles(): Promise<File[]>;
  saveProjectFile(filename: string, contentJson: string): Promise<void>;
  downloadBlob(blob: Blob, filename: string): void;
}

export class WebPlatformBridge implements IPlatformBridge {
  public isDesktop = false;

  public async openMediaFiles(): Promise<File[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'video/*,audio/*,image/*';
      input.onchange = () => {
        if (input.files) {
          resolve(Array.from(input.files));
        } else {
          resolve([]);
        }
      };
      input.click();
    });
  }

  public async saveProjectFile(filename: string, contentJson: string): Promise<void> {
    const blob = new Blob([contentJson], { type: 'application/json' });
    this.downloadBlob(blob, filename.endsWith('.velocityproject') ? filename : `${filename}.velocityproject`);
  }

  public downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const platformBridge: IPlatformBridge = new WebPlatformBridge();
