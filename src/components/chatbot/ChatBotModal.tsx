import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useEditorStore } from '@/store/useEditorStore';
import { processChatbotCommand, ChatMessage } from '@/core/ai/chatbotService';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Settings,
  Trash2,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

const API_KEY_STORAGE_KEY = 'apex_claude_api_key';

const QUICK_SUGGESTIONS = [
  '✂️ Trim the first 10 seconds',
  '✂️ Cut from 0:30 to 0:45',
  '🎬 Apply a cinematic color filter',
  '⚡ Speed up this clip by 2x',
  '📱 Crop to 9:16 for Instagram Reels',
  "🔤 Add text 'Sale Ends Soon' at the top from 0:00 to 0:05",
  '🎵 Add background music, lower volume during voiceover',
  '🔀 Add a fade transition between clip 1 and clip 2',
  '🔇 Remove background noise',
  '💬 Add subtitles automatically',
  '🔗 Merge these two clips',
  '🎥 Export as MP4 in 1080p',
];

export const ChatBotModal: React.FC = () => {
  const { isChatBotOpen, setChatBotOpen } = useUIStore();
  const { undo, canUndo } = useEditorStore();

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        '👋 Hi! I am your AI Video Editing Co-Pilot. Tell me what to edit in plain English or click the mic to speak.',
      timestamp: Date.now(),
      clarificationOptions: [
        'Trim the first 10 seconds',
        'Apply a cinematic color filter',
        'Speed up this clip by 2x',
        'Crop to 9:16 for Instagram Reels',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isChatBotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, isChatBotOpen]);

  // Save API key
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch (e) {
      console.warn(e);
    }
  };

  // Web Speech API Voice Input
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Submit message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isProcessing) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const { message } = await processChatbotCommand(query, messages, apiKey);
      setMessages((prev) => [...prev, message]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Sorry, an error occurred while executing that command: ${err.message || 'Unknown error'}`,
          timestamp: Date.now(),
          executionSuccess: false,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Chat history cleared. How can I help you edit your video next?',
        timestamp: Date.now(),
      },
    ]);
  };

  if (!isChatBotOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-5rem)] bg-editor-panel/95 backdrop-blur-xl border border-editor-border/90 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans select-none animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-editor-surface/90 border-b border-editor-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-purple p-0.5 flex items-center justify-center shadow-glow-cyan">
            <div className="w-full h-full bg-editor-bg rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-editor-text leading-tight">Apex AI Co-Pilot</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-editor-dim">Natural Language Video Editing</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-editor-dim">
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="AI Model & API Key Settings"
            className={`p-1.5 rounded-lg hover:text-editor-text hover:bg-editor-panel transition-colors ${
              showSettings ? 'text-accent-cyan bg-editor-panel' : ''
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 rounded-lg hover:text-editor-text hover:bg-editor-panel transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChatBotOpen(false)}
            title="Close Assistant"
            className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-editor-panel transition-colors ml-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Drawer (API Key & Engine Selection) */}
      {showSettings && (
        <div className="p-3 bg-editor-bg border-b border-editor-border/80 space-y-2 text-xs animate-in slide-in-from-top-2 duration-150 shrink-0">
          <div className="flex items-center justify-between font-semibold text-editor-text">
            <span>AI Engine Configuration</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan font-mono">
              Claude 3.5 Sonnet / Local NLP
            </span>
          </div>
          <p className="text-[11px] text-editor-dim leading-relaxed">
            Apex Editor uses a zero-config local NLP engine by default. Optionally enter an Anthropic API Key for advanced natural reasoning.
          </p>
          <div className="space-y-1 pt-1">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              placeholder="sk-ant-api03-... (Optional)"
              className="w-full bg-editor-surface border border-editor-border text-editor-text text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-cyan/90 text-black font-medium rounded-tr-sm shadow-md'
                    : 'bg-editor-surface/90 border border-editor-border text-editor-text rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              {/* Action confirmation & Undo Button */}
              {msg.role === 'assistant' && msg.action && msg.action !== 'clarify' && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  {msg.executionSuccess ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {msg.action.toUpperCase()} EXECUTED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-mono px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      <AlertCircle className="w-2.5 h-2.5" />
                      FAILED
                    </span>
                  )}

                  {msg.canUndo && canUndo && (
                    <button
                      onClick={() => undo()}
                      title="Undo this edit"
                      className="inline-flex items-center gap-1 text-[10px] text-editor-dim hover:text-accent-cyan px-1.5 py-0.5 rounded bg-editor-surface hover:bg-editor-border border border-editor-border transition-colors"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>
              )}

              {/* Clarification Quick-Replies */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.clarificationOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSendMessage(opt)}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-editor-surface border border-editor-border text-accent-cyan hover:bg-accent-cyan/15 hover:border-accent-cyan/40 transition-all text-left"
                    >
                      <Zap className="w-2.5 h-2.5 shrink-0" />
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-accent-purple/20 text-accent-purple flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* Processing State Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-editor-dim text-xs py-2 px-1">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
            <span className="font-mono text-[11px]">Co-Pilot is analyzing & editing timeline...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips Bar */}
      <div className="px-3 py-1.5 border-t border-editor-border/60 bg-editor-bg/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] text-editor-dim uppercase tracking-wider font-semibold shrink-0">
          Try:
        </span>
        {QUICK_SUGGESTIONS.map((item) => (
          <button
            key={item}
            onClick={() => handleSendMessage(item.replace(/^[^\s]+\s+/, ''))}
            className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full bg-editor-surface border border-editor-border text-editor-subtext hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors shrink-0"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-editor-surface border-t border-editor-border shrink-0">
        <div className="flex items-center gap-2">
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Stop Listening' : 'Speak Video Command (Web Speech)'}
            className={`p-2 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 shadow-glow-rose animate-pulse'
                : 'bg-editor-panel text-editor-dim hover:text-accent-cyan border-editor-border hover:border-accent-cyan/40'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder={isListening ? 'Listening to voice...' : 'Type editing command (e.g. "Trim first 10s")...'}
              className="w-full bg-editor-panel border border-editor-border text-editor-text text-xs pl-3 pr-3 py-2 rounded-xl placeholder:text-editor-dim/60 focus:outline-none focus:border-accent-cyan/60 transition-colors disabled:opacity-60"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isProcessing}
            title="Execute Command (Enter)"
            className="p-2 rounded-xl bg-accent-cyan text-black hover:bg-accent-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow-cyan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Listening notification indicator */}
        {isListening && (
          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] text-rose-400 font-mono animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Listening to microphone... Speak command now</span>
          </div>
        )}
      </div>
    </div>
  );
};
