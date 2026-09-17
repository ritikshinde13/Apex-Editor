import { parseIntentNLP, ParsedCommand } from './intentParser';
import { executeAICommand, ExecutionResult } from './commandExecutor';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: string;
  parameters?: Record<string, any>;
  clarificationOptions?: string[];
  executionSuccess?: boolean;
  canUndo?: boolean;
}

/**
 * Client service to submit natural language commands to the AI engine,
 * parse intents, execute operations on the video editor state, and return chat messages.
 */
export async function processChatbotCommand(
  prompt: string,
  history: ChatMessage[],
  apiKey?: string
): Promise<{ message: ChatMessage; execution: ExecutionResult }> {
  let parsed: ParsedCommand;

  try {
    // 1. Send to POST /api/chatbot/edit
    const response = await fetch('/api/chatbot/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt: prompt,
        conversationHistory: history.map((m) => ({ role: m.role, content: m.content })),
        apiKey,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      parsed = {
        action: data.action,
        params: data.parameters || {},
        chatResponse: data.chatResponse,
        clarificationOptions: data.clarificationOptions,
      };
    } else {
      throw new Error('Backend returned ' + response.status);
    }
  } catch (err) {
    // 2. Offline fallback to local NLP engine
    console.info('Using local client-side NLP parser:', err);
    parsed = parseIntentNLP(prompt);
  }

  // 3. Execute the parsed command on the timeline & video state
  const execution = executeAICommand(parsed);

  const assistantMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: 'assistant',
    content: execution.success ? execution.message : `${execution.message}\n(Command could not be fully applied)`,
    timestamp: Date.now(),
    action: parsed.action,
    parameters: parsed.params,
    clarificationOptions: parsed.clarificationOptions,
    executionSuccess: execution.success,
    canUndo: execution.undoable,
  };

  return {
    message: assistantMessage,
    execution,
  };
}
