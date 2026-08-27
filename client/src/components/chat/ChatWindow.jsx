import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Sparkles, Code, Settings, Plus, Terminal } from 'lucide-react';
import ChatMessage from './ChatMessage';
import PromptSuggestions from './PromptSuggestions';
import ChatInput from './ChatInput';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';

export default function ChatWindow() {
  const { currentChat, loadingAI, createNewChat, setSidebarOpen, showEditor, setShowEditor, setSettingsModalOpen, setToolsModalOpen } = useChat();
  const { aiModel } = useSettings();
  const messagesEndRef = useRef(null);

  const messages = currentChat ? currentChat.messages : [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAI]);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* Top Bar Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="font-bold text-white text-base sm:text-lg truncate max-w-[200px] sm:max-w-xs">
              {currentChat ? currentChat.title : 'New Session'}
            </h1>
          </div>

          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-3 h-3 mr-1" />
            {aiModel}
          </span>
        </div>

        {/* Top Right Action Controls */}
        <div className="flex items-center space-x-2">
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs font-medium transition"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Chat</span>
          </button>

          {/* Developer Tools Modal Button */}
          <button
            onClick={() => setToolsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 text-violet-400 text-xs font-medium transition"
            title="Open Developer Tools"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">Tools</span>
          </button>

          {/* Toggle Monaco Split Editor */}
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
              showEditor
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">{showEditor ? 'Hide Editor' : 'Code Editor'}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Thread Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin">
        {messages.length === 0 ? (
          <PromptSuggestions />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}

            {/* AI Loading State Animation */}
            {loadingAI && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-md"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-300 font-mono">
                  <span>CodeSphere AI is thinking</span>
                  <span className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <ChatInput />
    </div>
  );
}
