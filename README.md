# Apex Editor — Professional Video Editing Suite

Apex Editor is a modern, high-performance Non-Linear Video Editor (NLE) built with React 19, TypeScript, Tailwind CSS, Canvas 2D/WebGL Compositor, and Web Audio API.

---

## Features

- **Multitrack Timeline**:
  - Multiple Video and Audio tracks, dedicated Typography track.
  - Non-destructive edge trimming with responsive drag handles.
  - Razor / Split tool (`S` or `Ctrl+B`) preserving media offsets.
  - Magnetic snapping to clip boundaries and playhead.
  - Real-time zoom scaling (`pixelsPerSecond`).
- **Real-Time Video Compositor**:
  - Double-buffered offscreen canvas rendering engine ensuring **zero-flicker / zero-blink playback**.
  - Persistent last-known frame cache during video seeks.
  - Live matrix transforms (Position X/Y, Uniform Scale, Rotation, Opacity).
  - Real-time color filters (Brightness, Contrast, Saturation, Blur, Vignette, Cinematic presets).
  - Transitions (Fade to Black, Cross Dissolve, Slide Left/Right).
- **Web Audio API Mixing**:
  - Independent gain nodes per track with volume sliders and mute buttons.
  - Fade In and Fade Out curves.
  - Real-time LED audio peak meter telemetry.
- **Media Asset Ingestion (§6.4)**:
  - Drag-and-drop file import (MP4, WebM, MOV, MP3, WAV, PNG, JPG).
  - Video thumbnail frame generation and audio waveform decoding.
  - IndexedDB binary caching keeping large files completely outside `.apexproject` JSON files.
- **Video Export Engine**:
  - Export presets: 720p, 1080p, 1440p, 4K UHD.
  - Frame rates: 24, 30, 60 FPS.
  - Formats: MP4, WebM.
  - Bitrate quality presets (Low, Medium, High) with real-time percentage progress bar and auto-download.
- **Undo / Redo History**:
  - Ring buffer restoring exact timeline tracks and clips state across 50+ edits (`Ctrl+Z`, `Ctrl+Y`).

---

## Getting Started

### 1. Installation
```powershell
npm install
```

### 2. Development Server
```powershell
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Automated Tests
```powershell
npm test
```

### 4. Production Build
```powershell
npm run build
```

---

## Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| **`Space`** | Play / Pause toggle |
| **`S` or `Ctrl+B`** | Split selected clip at playhead position |
| **`Del` / `Backspace`** | Delete selected clip |
| **`Ctrl+Z`** | Undo |
| **`Ctrl+Y` or `Ctrl+Shift+Z`** | Redo |
| **`Left Arrow` / `Right Arrow`** | Step 1 frame backward / forward |
| **`Shift + Left / Right`** | Step 5 frames backward / forward |
| **`+` / `-`** | Zoom in / out on timeline |
| **`Home`** | Jump to start of timeline |
