import { parseIntentNLP } from '../core/ai/intentParser';

export interface ChatbotEditRequest {
  videoId?: string;
  userPrompt: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  apiKey?: string;
}

export interface ChatbotEditResponse {
  action: string;
  parameters: Record<string, any>;
  chatResponse: string;
  clarificationOptions?: string[];
  source: 'claude_api' | 'local_nlp';
}

const CLAUDE_SYSTEM_PROMPT = `You are the AI Co-Pilot for Apex Editor, a professional non-linear video editing suite.
Your task is to parse the user's natural language command into a structured JSON editing action.

Supported actions:
- "trim": { "start": number (seconds from start to trim), "end": number (seconds from end to trim), "type": "start" | "end" }
- "cut": { "start": number (seconds), "end": number (seconds) }
- "add_text": { "content": string, "position": "top" | "center" | "bottom" | "lower-third", "startTime": number, "duration": number }
- "add_music": { "trackTitle": string, "volume": number, "ducking": boolean }
- "apply_filter": { "filterId": string ("cinematic", "teal-orange", "vintage", "bw", "noir", "warm", "cool", "cyberpunk"), "intensity": number (0-100) }
- "change_speed": { "speed": number (0.25 to 8.0) }
- "add_transition": { "type": "fade" | "dissolve" | "slideLeft" | "slideRight", "duration": number }
- "crop": { "aspectRatio": "16:9" | "9:16" | "1:1" | "4:5" | "21:9" }
- "add_subtitles": {}
- "remove_audio": { "action": "mute" | "noise_reduction" }
- "merge": {}
- "export": { "resolution": "1080p" | "4k" | "720p", "format": "mp4" | "webm" }
- "clarify": If the request is ambiguous (e.g. "make it shorter" without duration), ask a clarifying question.

Respond ONLY with a valid JSON object matching this schema:
{
  "action": "<action_name>",
  "params": { ... },
  "chatResponse": "<Friendly confirmation message with emoji>",
  "clarificationOptions": ["option1", "option2"] (optional)
}`;

/**
 * Core handler for POST /api/chatbot/edit
 */
export async function handleChatbotEditRequest(
  payload: ChatbotEditRequest
): Promise<ChatbotEditResponse> {
  const { userPrompt, apiKey } = payload;
  const anthropicKey = apiKey || (typeof process !== 'undefined' ? process.env?.ANTHROPIC_API_KEY : undefined);

  // If Claude API key is provided, attempt LLM call
  if (anthropicKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: CLAUDE_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content?.[0]?.text;
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              action: parsed.action || 'unknown',
              parameters: parsed.params || {},
              chatResponse: parsed.chatResponse || 'Command processed.',
              clarificationOptions: parsed.clarificationOptions,
              source: 'claude_api',
            };
          }
        }
      }
    } catch (err) {
      console.warn('Claude API request failed, falling back to local NLP parser:', err);
    }
  }

  // High-accuracy fallback: Local NLP intent engine
  const parsed = parseIntentNLP(userPrompt);
  return {
    action: parsed.action,
    parameters: parsed.params,
    chatResponse: parsed.chatResponse,
    clarificationOptions: parsed.clarificationOptions,
    source: 'local_nlp',
  };
}
