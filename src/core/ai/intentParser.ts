/**
 * Natural Language Intent & Command Parser for Video Editing
 */

export type ChatbotActionType =
  | 'trim'
  | 'cut'
  | 'add_text'
  | 'add_music'
  | 'apply_filter'
  | 'change_speed'
  | 'add_transition'
  | 'crop'
  | 'add_subtitles'
  | 'remove_audio'
  | 'merge'
  | 'export'
  | 'clarify'
  | 'unknown';

export interface ParsedCommand {
  action: ChatbotActionType;
  params: Record<string, any>;
  chatResponse: string;
  clarificationOptions?: string[];
}

/**
 * Parses time formats such as "0:30", "00:45", "10s", "10 seconds", "2 minutes" into numeric seconds.
 */
export function parseTimeToSeconds(input: string): number | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  // Format MM:SS or HH:MM:SS
  const colonMatch = clean.match(/^(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)$/);
  if (colonMatch) {
    const hours = colonMatch[1] ? parseFloat(colonMatch[1]) : 0;
    const minutes = parseFloat(colonMatch[2]);
    const seconds = parseFloat(colonMatch[3]);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Format "10s", "10 sec", "10 seconds"
  const secMatch = clean.match(/^(\d+(?:\.\d+)?)\s*(?:s|sec|secs|seconds?)$/);
  if (secMatch) {
    return parseFloat(secMatch[1]);
  }

  // Format "2m", "2 min", "2 minutes"
  const minMatch = clean.match(/^(\d+(?:\.\d+)?)\s*(?:m|min|mins|minutes?)$/);
  if (minMatch) {
    return parseFloat(minMatch[1]) * 60;
  }

  // Raw number
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

/**
 * Intelligent client-side rule & regex NLP Intent Parser.
 * Accurately parses user instructions into executable editing operations.
 */
export function parseIntentNLP(prompt: string): ParsedCommand {
  const p = prompt.trim().toLowerCase();

  // 1. AMBIGUITY DETECTION (e.g. "make it shorter", "change speed" without values)
  if (
    p === 'make it shorter' ||
    p === 'shorten video' ||
    p === 'trim video' ||
    p === 'cut video' ||
    p === 'make it cut'
  ) {
    return {
      action: 'clarify',
      params: {},
      chatResponse: 'How much would you like to trim, or from where? For example:\n• "Trim the first 10 seconds"\n• "Trim 5s from the end"\n• "Cut from 0:15 to 0:30"',
      clarificationOptions: ['Trim first 5 seconds', 'Trim first 10 seconds', 'Cut from 0:10 to 0:20'],
    };
  }

  if (p === 'faster' || p === 'make it faster' || p === 'slower' || p === 'speed' || p === 'change speed') {
    return {
      action: 'clarify',
      params: {},
      chatResponse: 'What speed multiplier would you like to apply? (e.g., 2x for fast forward, 0.5x for slow motion)',
      clarificationOptions: ['Speed up by 2x', 'Speed up by 1.5x', 'Slow motion 0.5x'],
    };
  }

  if (p === 'add text' || p === 'add title' || p === 'write text') {
    return {
      action: 'clarify',
      params: {},
      chatResponse: 'What text would you like to add and where? (e.g., "Add text \'Sale Ends Soon\' at the top from 0:00 to 0:05")',
      clarificationOptions: ["Add text 'Breaking News' at top", "Add text 'Subscribe Now' at bottom"],
    };
  }

  if (p === 'apply filter' || p === 'color filter' || p === 'add filter' || p === 'change colors') {
    return {
      action: 'clarify',
      params: {},
      chatResponse: 'Which color filter style would you like? We have 35+ presets including Cinematic, Teal & Orange, Vintage, Black & White, Noir, Warm, and Cyberpunk.',
      clarificationOptions: ['Apply Cinematic filter', 'Apply Teal & Orange filter', 'Make it Black and White'],
    };
  }

  // 2. EXPORT (e.g. "Export as MP4 in 1080p", "export video in 4k", "export as webm")
  if (p.includes('export') || p.includes('render video') || p.includes('download video')) {
    let resolution = '1080p';
    if (p.includes('4k') || p.includes('2160p')) resolution = '4k';
    else if (p.includes('1440p') || p.includes('2k')) resolution = '1440p';
    else if (p.includes('720p')) resolution = '720p';

    let format: 'mp4' | 'webm' = 'mp4';
    if (p.includes('webm')) format = 'webm';

    return {
      action: 'export',
      params: { resolution, format },
      chatResponse: `Preparing export modal for ${resolution.toUpperCase()} ${format.toUpperCase()} video 🎬`,
    };
  }

  // 3. CROP / ASPECT RATIO (e.g. "Crop to 9:16 for Instagram Reels", "change to 16:9", "square 1:1")
  if (
    p.includes('crop') ||
    p.includes('aspect') ||
    p.includes('ratio') ||
    p.includes('reels') ||
    p.includes('tiktok') ||
    p.includes('shorts') ||
    p.includes('widescreen') ||
    p.includes('instagram')
  ) {
    let ratio: '16:9' | '9:16' | '1:1' | '4:5' | '21:9' = '16:9';
    let label = '16:9 Widescreen';

    if (p.includes('9:16') || p.includes('reels') || p.includes('tiktok') || p.includes('shorts') || p.includes('vertical')) {
      ratio = '9:16';
      label = '9:16 Vertical (Reels / TikTok)';
    } else if (p.includes('1:1') || p.includes('square')) {
      ratio = '1:1';
      label = '1:1 Square (Instagram Feed)';
    } else if (p.includes('4:5') || p.includes('portrait')) {
      ratio = '4:5';
      label = '4:5 Portrait';
    } else if (p.includes('21:9') || p.includes('ultrawide') || p.includes('cinemascope')) {
      ratio = '21:9';
      label = '21:9 Ultra-Widescreen';
    }

    return {
      action: 'crop',
      params: { aspectRatio: ratio },
      chatResponse: `Cropped project canvas to ${label} 📱`,
    };
  }

  // 4. CUT (e.g. "Cut from 0:30 to 0:45", "cut between 10s and 20s", "delete from 0:05 to 0:12")
  const cutMatch = p.match(/(?:cut|remove|delete|slice)\s+(?:from|between)?\s*(\d+:\d+|\d+s?|\d+)\s*(?:to|and|-)\s*(\d+:\d+|\d+s?|\d+)/);
  if (cutMatch) {
    const startSec = parseTimeToSeconds(cutMatch[1]) ?? 0;
    const endSec = parseTimeToSeconds(cutMatch[2]) ?? startSec + 5;
    return {
      action: 'cut',
      params: { start: startSec, end: endSec },
      chatResponse: `Cut and removed section from ${cutMatch[1]} to ${cutMatch[2]} ✂️`,
    };
  }

  // 5. TRIM (e.g. "Trim the first 10 seconds", "trim 5 seconds from start", "trim 10s from the end", "trim to 15s")
  const trimFirstMatch = p.match(/trim\s+(?:the\s+)?(?:first|initial|beginning)\s+(\d+:\d+|\d+\s*(?:s|sec|seconds?))/);
  if (trimFirstMatch) {
    const dur = parseTimeToSeconds(trimFirstMatch[1]) ?? 10;
    return {
      action: 'trim',
      params: { start: dur, type: 'start' },
      chatResponse: `Trimmed the first ${dur} seconds from video ✅`,
    };
  }

  const trimEndMatch = p.match(/trim\s+(\d+:\d+|\d+\s*(?:s|sec|seconds?))\s+(?:from\s+)?(?:the\s+)?end/);
  if (trimEndMatch) {
    const dur = parseTimeToSeconds(trimEndMatch[1]) ?? 10;
    return {
      action: 'trim',
      params: { end: dur, type: 'end' },
      chatResponse: `Trimmed ${dur} seconds from the end of video ✅`,
    };
  }

  const genericTrimMatch = p.match(/trim\s+(?:to\s+)?(\d+:\d+|\d+\s*(?:s|sec|seconds?))/);
  if (genericTrimMatch) {
    const dur = parseTimeToSeconds(genericTrimMatch[1]) ?? 10;
    return {
      action: 'trim',
      params: { start: dur, type: 'start' },
      chatResponse: `Trimmed video to start at ${dur}s ✅`,
    };
  }

  // 6. ADD TEXT (e.g. "Add text 'Sale Ends Soon' at the top from 0:00 to 0:05", "Add title 'Summer Vibes'")
  if (p.includes('add text') || p.includes('add title') || p.includes('insert text') || p.includes('overlay text')) {
    // Extract quoted text or text after "text"
    let content = 'Sample Title';
    const quoteMatch = prompt.match(/['"“](.+?)['"”]/);
    if (quoteMatch) {
      content = quoteMatch[1];
    } else {
      const afterTextMatch = prompt.match(/(?:text|title|caption)\s+([a-zA-Z0-9\s!?,.-]+?)(?:\s+at|\s+from|\s+on|$)/i);
      if (afterTextMatch && afterTextMatch[1].trim()) {
        content = afterTextMatch[1].trim();
      }
    }

    // Position
    let position: 'top' | 'center' | 'bottom' | 'lower-third' = 'top';
    if (p.includes('bottom')) position = 'bottom';
    else if (p.includes('lower') || p.includes('third')) position = 'lower-third';
    else if (p.includes('center') || p.includes('middle')) position = 'center';

    // Start and duration
    let start = 0;
    let duration = 5.0;
    const timeRangeMatch = p.match(/from\s+(\d+:\d+|\d+s?|\d+)\s+to\s+(\d+:\d+|\d+s?|\d+)/);
    if (timeRangeMatch) {
      const s = parseTimeToSeconds(timeRangeMatch[1]);
      const e = parseTimeToSeconds(timeRangeMatch[2]);
      if (s !== null) start = s;
      if (e !== null && s !== null && e > s) duration = e - s;
    }

    return {
      action: 'add_text',
      params: {
        content,
        position,
        startTime: start,
        duration,
      },
      chatResponse: `Added text "${content}" at the ${position} from ${start.toFixed(1)}s to ${(start + duration).toFixed(1)}s 🔤`,
    };
  }

  // 7. SPEED (e.g. "Speed up this clip by 2x", "slow motion 0.5x", "set speed to 1.5x")
  if (p.includes('speed') || p.includes('fast') || p.includes('slow')) {
    let speed = 2.0;
    const speedNumMatch = p.match(/(\d+(?:\.\d+)?)\s*x/);
    if (speedNumMatch) {
      speed = parseFloat(speedNumMatch[1]);
    } else if (p.includes('double')) {
      speed = 2.0;
    } else if (p.includes('half') || p.includes('slow motion')) {
      speed = 0.5;
    } else if (p.includes('triple')) {
      speed = 3.0;
    }

    return {
      action: 'change_speed',
      params: { speed },
      chatResponse: `Set clip playback speed to ${speed}x ⚡`,
    };
  }

  // 8. APPLY FILTER (e.g. "Apply a cinematic color filter", "make it vintage", "apply teal and orange")
  if (p.includes('filter') || p.includes('color grade') || p.includes('look') || p.includes('black and white') || p.includes('b&w') || p.includes('vintage') || p.includes('cinematic') || p.includes('noir')) {
    let filterId = 'cinematic';
    let filterName = 'Cinematic';

    if (p.includes('teal') || p.includes('orange')) {
      filterId = 'teal-orange';
      filterName = 'Teal & Orange';
    } else if (p.includes('black and white') || p.includes('b&w') || p.includes('monochrome')) {
      filterId = 'bw';
      filterName = 'Black & White';
    } else if (p.includes('noir')) {
      filterId = 'noir';
      filterName = 'Film Noir';
    } else if (p.includes('vintage') || p.includes('retro') || p.includes('70s')) {
      filterId = 'vintage';
      filterName = 'Vintage';
    } else if (p.includes('vhs')) {
      filterId = 'vhs';
      filterName = 'VHS Retro';
    } else if (p.includes('sepia')) {
      filterId = 'sepia';
      filterName = 'Sepia';
    } else if (p.includes('polaroid')) {
      filterId = 'polaroid';
      filterName = 'Polaroid';
    } else if (p.includes('cyberpunk') || p.includes('neon')) {
      filterId = 'cyberpunk';
      filterName = 'Cyberpunk';
    } else if (p.includes('warm') || p.includes('sunset') || p.includes('golden')) {
      filterId = 'warm';
      filterName = 'Warm Sunset';
    } else if (p.includes('cool') || p.includes('cold')) {
      filterId = 'cool';
      filterName = 'Nordic Cool';
    } else if (p.includes('vibrant') || p.includes('saturated')) {
      filterId = 'vibrant';
      filterName = 'Vibrant';
    } else if (p.includes('contrast')) {
      filterId = 'contrast';
      filterName = 'High Contrast';
    } else if (p.includes('fade')) {
      filterId = 'fade';
      filterName = 'Matte Fade';
    }

    // Extract intensity if specified (e.g. "at 75%", "80% intensity")
    let intensity = 100;
    const intensityMatch = p.match(/(\d+)\s*%/);
    if (intensityMatch) {
      intensity = parseInt(intensityMatch[1]);
    }

    return {
      action: 'apply_filter',
      params: { filterId, intensity },
      chatResponse: `Applied ${filterName} color filter at ${intensity}% intensity 🎨`,
    };
  }

  // 9. ADD TRANSITION (e.g. "Add a fade transition between clip 1 and clip 2", "add dissolve transition")
  if (p.includes('transition') || p.includes('fade') || p.includes('dissolve') || p.includes('slide')) {
    let type: 'fade' | 'dissolve' | 'slideLeft' | 'slideRight' = 'fade';
    let name = 'Fade to Black';

    if (p.includes('dissolve') || p.includes('cross dissolve')) {
      type = 'dissolve';
      name = 'Cross Dissolve';
    } else if (p.includes('slide left')) {
      type = 'slideLeft';
      name = 'Slide Left';
    } else if (p.includes('slide right') || p.includes('slide')) {
      type = 'slideRight';
      name = 'Slide Right';
    }

    return {
      action: 'add_transition',
      params: { type, duration: 1.0 },
      chatResponse: `Added ${name} transition (1.0s) between clips 🔀`,
    };
  }

  // 10. ADD MUSIC / AUDIO (e.g. "Add background music, lower volume during voiceover", "add upbeat music")
  if (p.includes('music') || p.includes('audio') || p.includes('soundtrack') || p.includes('bgm')) {
    const hasDucking = p.includes('lower volume') || p.includes('ducking') || p.includes('voiceover') || p.includes('background');
    const volume = hasDucking ? 0.3 : 0.8;

    return {
      action: 'add_music',
      params: {
        trackTitle: 'Cinematic Ambient BGM',
        volume,
        ducking: hasDucking,
      },
      chatResponse: `Added background soundtrack to audio track (volume set to ${(volume * 100).toFixed(0)}%${hasDucking ? ' with voiceover ducking' : ''}) 🎵`,
    };
  }

  // 11. REMOVE NOISE / MUTE AUDIO (e.g. "Remove background noise", "mute audio", "lower volume")
  if (p.includes('noise') || p.includes('mute') || p.includes('remove audio') || p.includes('disable audio')) {
    return {
      action: 'remove_audio',
      params: { action: p.includes('mute') ? 'mute' : 'noise_reduction' },
      chatResponse: p.includes('mute')
        ? 'Muted audio track 🔇'
        : 'Applied audio noise filter and voice isolation curve 🎧',
    };
  }

  // 12. SUBTITLES (e.g. "Add subtitles automatically", "generate auto captions", "add subtitles")
  if (p.includes('subtitle') || p.includes('caption') || p.includes('transcribe')) {
    return {
      action: 'add_subtitles',
      params: {},
      chatResponse: 'Automatically generated synchronized subtitle blocks across the timeline 💬',
    };
  }

  // 13. MERGE CLIPS (e.g. "Merge these two clips", "join clips", "combine clips")
  if (p.includes('merge') || p.includes('join') || p.includes('combine')) {
    return {
      action: 'merge',
      params: {},
      chatResponse: 'Snapped and merged consecutive clips together on the timeline 🔗',
    };
  }

  // Default fallback: conversational suggestion
  return {
    action: 'unknown',
    params: { originalPrompt: prompt },
    chatResponse: `I'm not completely sure how to execute: "${prompt}". Try one of these commands:\n• "Trim the first 10 seconds"\n• "Cut from 0:15 to 0:30"\n• "Apply a cinematic color filter"\n• "Speed up this clip by 2x"\n• "Crop to 9:16 for Instagram Reels"\n• "Add text 'Summer Sale' at the top"\n• "Export as MP4 in 1080p"`,
    clarificationOptions: [
      'Trim first 10 seconds',
      'Apply cinematic color filter',
      'Crop to 9:16 for Instagram Reels',
      'Speed up this clip by 2x',
    ],
  };
}
