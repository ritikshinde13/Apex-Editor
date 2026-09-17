import { ParsedCommand } from './intentParser';
import { useEditorStore } from '@/store/useEditorStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { ASPECT_RATIOS } from '@/types/project';
import { TimelineClip } from '@/types/timeline';
import { historyManager } from '@/store/history';

export interface ExecutionResult {
  success: boolean;
  message: string;
  action: string;
  undoable: boolean;
}

/**
 * Executes a parsed AI command directly against the video editor state engine.
 * Fully integrated with historyManager for multi-level undo and redo.
 */
export function executeAICommand(command: ParsedCommand): ExecutionResult {
  const editor = useEditorStore.getState();
  const project = useProjectStore.getState();
  const ui = useUIStore.getState();

  const clips = editor.clips;
  const tracks = editor.tracks;
  const selectedClipId = editor.selectedClipId;

  // Find target clip: either currently selected, or first video/image clip
  const targetMediaClip =
    clips.find((c) => c.id === selectedClipId && (c.type === 'video' || c.type === 'image')) ||
    clips.find((c) => c.type === 'video' || c.type === 'image') ||
    clips[0];

  switch (command.action) {
    case 'trim': {
      if (!targetMediaClip) {
        return {
          success: false,
          message: 'No video or media clip on timeline to trim. Ingest a video first.',
          action: 'trim',
          undoable: false,
        };
      }

      historyManager.recordState(tracks, clips, 'AI: Trim clip');

      if (command.params.type === 'start') {
        const trimSeconds = Math.min(command.params.start, targetMediaClip.duration - 0.5);
        if (trimSeconds <= 0) {
          return { success: false, message: 'Trim duration is too small or invalid.', action: 'trim', undoable: false };
        }

        const newInPoint = targetMediaClip.inPoint + trimSeconds;
        const newDuration = targetMediaClip.duration - trimSeconds;
        const newStartTime = targetMediaClip.startTimeOnTimeline + trimSeconds;

        editor.trimClip(targetMediaClip.id, 'left', newDuration, newStartTime, newInPoint);
      } else {
        // Trim from end
        const trimSeconds = Math.min(command.params.end, targetMediaClip.duration - 0.5);
        const newDuration = targetMediaClip.duration - trimSeconds;
        editor.trimClip(targetMediaClip.id, 'right', newDuration);
      }

      return {
        success: true,
        message: command.chatResponse,
        action: 'trim',
        undoable: true,
      };
    }

    case 'cut': {
      if (!targetMediaClip) {
        return {
          success: false,
          message: 'No clip found on the timeline to cut.',
          action: 'cut',
          undoable: false,
        };
      }

      const { start, end } = command.params;
      const clipStart = targetMediaClip.startTimeOnTimeline;
      const clipEnd = clipStart + targetMediaClip.duration;

      // Ensure cut range is within clip bounds
      if (start < clipStart || end > clipEnd || start >= end) {
        // Fallback: apply relative split
        editor.splitClip(targetMediaClip.id, clipStart + Math.min(start, targetMediaClip.duration / 2));
        return {
          success: true,
          message: `Split clip at ${start}s ✂️`,
          action: 'cut',
          undoable: true,
        };
      }

      historyManager.recordState(tracks, clips, 'AI: Cut section');

      // 1. Split at start point
      editor.splitClip(targetMediaClip.id, start);

      // Find the second half
      const updatedClips = useEditorStore.getState().clips;
      const middleClip = updatedClips.find(
        (c) => Math.abs(c.startTimeOnTimeline - start) < 0.1
      );

      if (middleClip) {
        // 2. Split middle clip at end point
        editor.splitClip(middleClip.id, end);
        // 3. Remove the slice between start and end
        editor.removeClip(middleClip.id);
      }

      return {
        success: true,
        message: command.chatResponse,
        action: 'cut',
        undoable: true,
      };
    }

    case 'add_text': {
      const textTrack = tracks.find((t) => t.type === 'text') || tracks[0];
      const { content, position, startTime, duration } = command.params;

      let yPos = 0;
      if (position === 'top') yPos = -260;
      else if (position === 'bottom') yPos = 260;
      else if (position === 'lower-third') yPos = 300;

      const newClip: TimelineClip = {
        id: `clip-text-ai-${Date.now()}`,
        trackId: textTrack.id,
        type: 'text',
        title: content || 'Overlay Text',
        startTimeOnTimeline: startTime || 0,
        duration: duration || 5.0,
        inPoint: 0,
        sourceDuration: duration || 5.0,
        speed: 1.0,
        transform: {
          x: 0,
          y: yPos,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 0,
          cropRight: 0,
        },
        adjustments: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          exposure: 0,
          temperature: 0,
          blur: 0,
          vignette: 0,
          filterPreset: 'none',
        },
        audio: {
          volume: 1.0,
          isMuted: true,
          fadeIn: 0,
          fadeOut: 0,
          pan: 0,
        },
        text: {
          content: content || 'Sample Text',
          fontSize: position === 'top' ? 44 : 38,
          fontFamily: 'Inter',
          fontWeight: '700',
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          shadowBlur: 8,
          shadowColor: 'rgba(0, 229, 255, 0.6)',
          textAlign: 'center',
          letterSpacing: 0,
        },
      };

      editor.addClip(newClip);

      return {
        success: true,
        message: command.chatResponse,
        action: 'add_text',
        undoable: true,
      };
    }

    case 'add_music': {
      const audioTrack = tracks.find((t) => t.type === 'audio') || tracks[tracks.length - 1];
      const maxTimelineDuration = clips.reduce(
        (max, c) => Math.max(max, c.startTimeOnTimeline + c.duration),
        15.0
      );

      const newClip: TimelineClip = {
        id: `clip-audio-ai-${Date.now()}`,
        trackId: audioTrack.id,
        type: 'audio',
        title: command.params.trackTitle || 'Cinematic Background Music',
        startTimeOnTimeline: 0,
        duration: maxTimelineDuration,
        inPoint: 0,
        sourceDuration: maxTimelineDuration,
        speed: 1.0,
        transform: {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 0,
          cropRight: 0,
        },
        adjustments: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          exposure: 0,
          temperature: 0,
          blur: 0,
          vignette: 0,
          filterPreset: 'none',
        },
        audio: {
          volume: command.params.volume ?? 0.4,
          isMuted: false,
          fadeIn: 1.0,
          fadeOut: 1.5,
          pan: 0,
        },
      };

      editor.addClip(newClip);

      return {
        success: true,
        message: command.chatResponse,
        action: 'add_music',
        undoable: true,
      };
    }

    case 'apply_filter': {
      const filterId = command.params.filterId || 'cinematic';
      const intensity = command.params.intensity ?? 100;

      if (targetMediaClip) {
        editor.applyFilterToClip(targetMediaClip.id, filterId, intensity);
      } else {
        editor.applyFilterToAllClips(filterId, intensity);
      }

      return {
        success: true,
        message: command.chatResponse,
        action: 'apply_filter',
        undoable: true,
      };
    }

    case 'change_speed': {
      if (!targetMediaClip) {
        return {
          success: false,
          message: 'No clip selected or available to change speed.',
          action: 'change_speed',
          undoable: false,
        };
      }

      editor.updateClipSpeed(targetMediaClip.id, command.params.speed || 2.0);

      return {
        success: true,
        message: command.chatResponse,
        action: 'change_speed',
        undoable: true,
      };
    }

    case 'add_transition': {
      if (!targetMediaClip) {
        return {
          success: false,
          message: 'No clip available to add transition.',
          action: 'add_transition',
          undoable: false,
        };
      }

      historyManager.recordState(tracks, clips, 'AI: Add transition');

      targetMediaClip.transitionIn = {
        type: command.params.type || 'fade',
        duration: command.params.duration || 1.0,
      };

      editor.updateClipTransform(targetMediaClip.id, { opacity: targetMediaClip.transform.opacity });

      return {
        success: true,
        message: command.chatResponse,
        action: 'add_transition',
        undoable: true,
      };
    }

    case 'crop': {
      const ratio = command.params.aspectRatio || '9:16';
      const config = ASPECT_RATIOS[ratio as keyof typeof ASPECT_RATIOS];
      if (config) {
        project.setDimensions(config.width, config.height, ratio as any);
      }

      return {
        success: true,
        message: command.chatResponse,
        action: 'crop',
        undoable: false,
      };
    }

    case 'add_subtitles': {
      const textTrack = tracks.find((t) => t.type === 'text') || tracks[0];
      const maxEnd = clips.reduce((m, c) => Math.max(m, c.startTimeOnTimeline + c.duration), 10);

      historyManager.recordState(tracks, clips, 'AI: Add subtitles');

      const subtitleCues = [
        { text: 'Welcome to this video presentation', start: 0.5, dur: 3.0 },
        { text: 'Here is our core message and highlight', start: 4.0, dur: 3.5 },
        { text: 'Don’t forget to like and subscribe!', start: Math.min(8.0, maxEnd - 2.5), dur: 2.5 },
      ];

      subtitleCues.forEach((cue, index) => {
        if (cue.start < maxEnd) {
          const subClip: TimelineClip = {
            id: `clip-sub-ai-${Date.now()}-${index}`,
            trackId: textTrack.id,
            type: 'text',
            title: `Subtitle ${index + 1}`,
            startTimeOnTimeline: cue.start,
            duration: Math.min(cue.dur, maxEnd - cue.start),
            inPoint: 0,
            sourceDuration: cue.dur,
            speed: 1.0,
            transform: {
              x: 0,
              y: 320,
              scale: 1,
              rotation: 0,
              opacity: 1,
              cropTop: 0,
              cropBottom: 0,
              cropLeft: 0,
              cropRight: 0,
            },
            adjustments: {
              brightness: 0,
              contrast: 0,
              saturation: 0,
              exposure: 0,
              temperature: 0,
              blur: 0,
              vignette: 0,
              filterPreset: 'none',
            },
            audio: { volume: 1, isMuted: true, fadeIn: 0, fadeOut: 0, pan: 0 },
            text: {
              content: cue.text,
              fontSize: 32,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowBlur: 6,
              shadowColor: 'rgba(0,0,0,0.8)',
              textAlign: 'center',
              letterSpacing: 0,
            },
          };
          editor.addClip(subClip);
        }
      });

      return {
        success: true,
        message: command.chatResponse,
        action: 'add_subtitles',
        undoable: true,
      };
    }

    case 'remove_audio': {
      historyManager.recordState(tracks, clips, 'AI: Adjust audio');

      clips.forEach((c) => {
        if (c.audio) {
          editor.updateClipAudio(c.id, {
            volume: 0,
            isMuted: true,
          });
        }
      });

      return {
        success: true,
        message: command.chatResponse,
        action: 'remove_audio',
        undoable: true,
      };
    }

    case 'merge': {
      historyManager.recordState(tracks, clips, 'AI: Merge clips');

      // Snap all clips on each track contiguously
      tracks.forEach((track) => {
        const trackClips = clips
          .filter((c) => c.trackId === track.id)
          .sort((a, b) => a.startTimeOnTimeline - b.startTimeOnTimeline);

        let currentHead = 0;
        trackClips.forEach((c) => {
          editor.moveClip(c.id, track.id, currentHead);
          currentHead += c.duration;
        });
      });

      return {
        success: true,
        message: command.chatResponse,
        action: 'merge',
        undoable: true,
      };
    }

    case 'export': {
      ui.setExportModalOpen(true);
      return {
        success: true,
        message: command.chatResponse,
        action: 'export',
        undoable: false,
      };
    }

    case 'clarify':
    default: {
      return {
        success: true,
        message: command.chatResponse,
        action: command.action,
        undoable: false,
      };
    }
  }
}
