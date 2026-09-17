import { describe, it, expect, beforeEach } from 'vitest';
import { parseTimeToSeconds, parseIntentNLP } from '../../src/core/ai/intentParser';
import { executeAICommand } from '../../src/core/ai/commandExecutor';
import { useEditorStore } from '../../src/store/useEditorStore';
import { useProjectStore } from '../../src/store/useProjectStore';
import { TimelineClip } from '../../src/types/timeline';

describe('Time String Parser', () => {
  it('parses colon-separated timecodes correctly', () => {
    expect(parseTimeToSeconds('0:30')).toBe(30);
    expect(parseTimeToSeconds('01:15')).toBe(75);
    expect(parseTimeToSeconds('00:02:30')).toBe(150);
  });

  it('parses seconds and minutes format correctly', () => {
    expect(parseTimeToSeconds('10s')).toBe(10);
    expect(parseTimeToSeconds('10 seconds')).toBe(10);
    expect(parseTimeToSeconds('2m')).toBe(120);
    expect(parseTimeToSeconds('2 minutes')).toBe(120);
  });
});

describe('AI Intent Parser — Natural Language Commands', () => {
  it('parses trim commands for the first N seconds', () => {
    const cmd = parseIntentNLP('Trim the first 10 seconds');
    expect(cmd.action).toBe('trim');
    expect(cmd.params.start).toBe(10);
    expect(cmd.params.type).toBe('start');
  });

  it('parses trim commands from the end', () => {
    const cmd = parseIntentNLP('Trim 5s from the end');
    expect(cmd.action).toBe('trim');
    expect(cmd.params.end).toBe(5);
    expect(cmd.params.type).toBe('end');
  });

  it('parses cut range commands', () => {
    const cmd = parseIntentNLP('Cut from 0:30 to 0:45');
    expect(cmd.action).toBe('cut');
    expect(cmd.params.start).toBe(30);
    expect(cmd.params.end).toBe(45);
  });

  it('parses add text overlay commands with content, position, and timing', () => {
    const cmd = parseIntentNLP("Add text 'Sale Ends Soon' at the top from 0:00 to 0:05");
    expect(cmd.action).toBe('add_text');
    expect(cmd.params.content).toBe('Sale Ends Soon');
    expect(cmd.params.position).toBe('top');
    expect(cmd.params.startTime).toBe(0);
    expect(cmd.params.duration).toBe(5);
  });

  it('parses background music with ducking for voiceovers', () => {
    const cmd = parseIntentNLP('Add background music, lower volume during voiceover');
    expect(cmd.action).toBe('add_music');
    expect(cmd.params.ducking).toBe(true);
    expect(cmd.params.volume).toBeLessThanOrEqual(0.4);
  });

  it('parses color filter styling commands', () => {
    const cmd = parseIntentNLP('Apply a cinematic color filter');
    expect(cmd.action).toBe('apply_filter');
    expect(cmd.params.filterId).toBe('cinematic');

    const tealCmd = parseIntentNLP('Apply teal and orange filter at 80%');
    expect(tealCmd.action).toBe('apply_filter');
    expect(tealCmd.params.filterId).toBe('teal-orange');
    expect(tealCmd.params.intensity).toBe(80);
  });

  it('parses speed multiplier commands', () => {
    const cmd = parseIntentNLP('Speed up this clip by 2x');
    expect(cmd.action).toBe('change_speed');
    expect(cmd.params.speed).toBe(2.0);

    const slowCmd = parseIntentNLP('Slow motion 0.5x');
    expect(slowCmd.action).toBe('change_speed');
    expect(slowCmd.params.speed).toBe(0.5);
  });

  it('parses transition effect requests', () => {
    const cmd = parseIntentNLP('Add a fade transition between clip 1 and clip 2');
    expect(cmd.action).toBe('add_transition');
    expect(cmd.params.type).toBe('fade');

    const dissCmd = parseIntentNLP('Add cross dissolve transition');
    expect(dissCmd.action).toBe('add_transition');
    expect(dissCmd.params.type).toBe('dissolve');
  });

  it('parses aspect ratio crop commands for social media platforms', () => {
    const reelsCmd = parseIntentNLP('Crop to 9:16 for Instagram Reels');
    expect(reelsCmd.action).toBe('crop');
    expect(reelsCmd.params.aspectRatio).toBe('9:16');

    const wideCmd = parseIntentNLP('Change to 16:9 widescreen');
    expect(wideCmd.action).toBe('crop');
    expect(wideCmd.params.aspectRatio).toBe('16:9');
  });

  it('parses automatic subtitles commands', () => {
    const cmd = parseIntentNLP('Add subtitles automatically');
    expect(cmd.action).toBe('add_subtitles');
  });

  it('parses audio noise reduction commands', () => {
    const cmd = parseIntentNLP('Remove background noise');
    expect(cmd.action).toBe('remove_audio');
  });

  it('parses merge clips command', () => {
    const cmd = parseIntentNLP('Merge these two clips');
    expect(cmd.action).toBe('merge');
  });

  it('parses video export commands with resolution and format', () => {
    const cmd = parseIntentNLP('Export as MP4 in 1080p');
    expect(cmd.action).toBe('export');
    expect(cmd.params.resolution).toBe('1080p');
    expect(cmd.params.format).toBe('mp4');
  });

  it('detects ambiguous input and asks clarifying questions', () => {
    const clarifyTrim = parseIntentNLP('make it shorter');
    expect(clarifyTrim.action).toBe('clarify');
    expect(clarifyTrim.clarificationOptions?.length).toBeGreaterThan(0);

    const clarifySpeed = parseIntentNLP('change speed');
    expect(clarifySpeed.action).toBe('clarify');
  });
});

describe('AI Command Executor — Timeline Mutations', () => {
  const sampleClip: TimelineClip = {
    id: 'test-video-clip-1',
    trackId: 'track-v1',
    type: 'video',
    title: 'Camera Footage',
    startTimeOnTimeline: 0,
    duration: 20.0,
    inPoint: 0,
    sourceDuration: 30.0,
    speed: 1.0,
    transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 },
    adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, temperature: 0, blur: 0, vignette: 0, filterPreset: 'original', filterIntensity: 100 },
    audio: { volume: 1, isMuted: false, fadeIn: 0, fadeOut: 0, pan: 0 },
  };

  beforeEach(() => {
    useEditorStore.setState({
      clips: [JSON.parse(JSON.stringify(sampleClip))],
      selectedClipId: 'test-video-clip-1',
    });
  });

  it('executes trim command modifying clip in-point and duration', () => {
    const cmd = parseIntentNLP('Trim the first 5 seconds');
    const result = executeAICommand(cmd);

    expect(result.success).toBe(true);
    const clip = useEditorStore.getState().clips.find((c) => c.id === 'test-video-clip-1');
    expect(clip?.inPoint).toBe(5);
    expect(clip?.duration).toBe(15);
  });

  it('executes speed adjustment command', () => {
    const cmd = parseIntentNLP('Speed up this clip by 2x');
    const result = executeAICommand(cmd);

    expect(result.success).toBe(true);
    const clip = useEditorStore.getState().clips.find((c) => c.id === 'test-video-clip-1');
    expect(clip?.speed).toBe(2.0);
  });

  it('executes add text command creating a styled title clip on the text track', () => {
    const cmd = parseIntentNLP("Add text 'Flash Sale' at the top from 0:00 to 0:04");
    const result = executeAICommand(cmd);

    expect(result.success).toBe(true);
    const clips = useEditorStore.getState().clips;
    const textClip = clips.find((c) => c.type === 'text');
    expect(textClip).toBeDefined();
    expect(textClip?.text?.content).toBe('Flash Sale');
    expect(textClip?.duration).toBe(4);
  });

  it('executes filter application command', () => {
    const cmd = parseIntentNLP('Apply a cinematic color filter at 90%');
    const result = executeAICommand(cmd);

    expect(result.success).toBe(true);
    const clip = useEditorStore.getState().clips.find((c) => c.id === 'test-video-clip-1');
    expect(clip?.adjustments.filterPreset).toBe('cinematic');
    expect(clip?.adjustments.filterIntensity).toBe(90);
  });

  it('executes crop command updating project canvas aspect ratio', () => {
    const cmd = parseIntentNLP('Crop to 9:16 for Instagram Reels');
    const result = executeAICommand(cmd);

    expect(result.success).toBe(true);
    const project = useProjectStore.getState().project;
    expect(project.aspectRatio).toBe('9:16');
    expect(project.width).toBe(1080);
    expect(project.height).toBe(1920);
  });

  it('executes add subtitles command generating caption blocks', () => {
    const cmd = parseIntentNLP('Add subtitles automatically');
    const result = executeAICommand(cmd);

    expect(result.success).toBe(true);
    const subtitleClips = useEditorStore.getState().clips.filter((c) => c.title.startsWith('Subtitle'));
    expect(subtitleClips.length).toBeGreaterThanOrEqual(1);
  });
});
