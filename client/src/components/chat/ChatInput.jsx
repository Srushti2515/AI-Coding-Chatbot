import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, X, Sparkles, Code2, Bug, Zap, Repeat, TestTube, FileText } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';

export default function ChatInput() {
  const { sendMessage, loadingAI } = useChat();
  const { enterToSend } = useSettings();
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!text.trim() && !attachment) || loadingAI) return;

    sendMessage(text, attachment);
    setText('');
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Quick Action pills
  const handleQuickAction = (actionPrefix) => {
    setText((prev) => {
      if (!prev.trim()) return `${actionPrefix}: `;
      return `${actionPrefix}:\n${prev}`;
    });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Voice Recognition (Speech-to-Text)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please try Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // File Upload Reader & Validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.html', '.css', '.json', '.sql', '.md', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      alert(`Unsupported file type. Please upload code files (${allowedExtensions.join(', ')})`);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds maximum 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        language: fileExt.replace('.', ''),
        content: event.target.result,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-4">
      {/* Quick Action Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-xs font-medium text-slate-300">
        <button
          type="button"
          onClick={() => handleQuickAction('Generate Code')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 whitespace-nowrap transition"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generate Code</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction('Debug Code')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 whitespace-nowrap transition"
        >
          <Bug className="w-3.5 h-3.5 text-rose-400" />
          <span>Debug Code</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction('Explain Code')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 hover:text-violet-400 whitespace-nowrap transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Explain Code</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction('Optimize')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:text-amber-400 whitespace-nowrap transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Optimize</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction('Convert Language')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 whitespace-nowrap transition"
        >
          <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          <span>Convert Language</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction('Write Tests')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-400 whitespace-nowrap transition"
        >
          <TestTube className="w-3.5 h-3.5 text-indigo-400" />
          <span>Write Tests</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction('Generate Documentation')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:text-teal-400 whitespace-nowrap transition"
        >
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span>Generate Docs</span>
        </button>
      </div>

      {/* Main Input Card */}
      <form onSubmit={handleSubmit} className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 sm:p-3 focus-within:border-cyan-500/70 transition">
        {/* Attachment Pill Indicator */}
        {attachment && (
          <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{attachment.name}</span>
              <span className="text-slate-500 text-[10px]">({attachment.size})</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="p-1 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CodeSphere AI anything about coding..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base resize-none focus:outline-none px-2 py-1 max-h-44"
        />

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.sql,.md,.txt"
              className="hidden"
            />

            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
              title="Attach Code File (.js, .py, .java, etc.)"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-slate-400 hover:text-violet-400 hover:bg-slate-800'
              }`}
              title={isListening ? 'Listening...' : 'Voice Input (Speech-to-Text)'}
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Clear Input */}
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-300 transition font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!text.trim() && !attachment) || loadingAI}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
