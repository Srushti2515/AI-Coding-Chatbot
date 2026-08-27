import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Cpu, Code, Sparkles, Sliders, CornerDownLeft } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useChat } from '../../context/ChatContext';

export default function SettingsModal() {
  const { settingsModalOpen, setSettingsModalOpen } = useChat();
  const {
    theme,
    toggleTheme,
    effects3D,
    setEffects3D,
    enterToSend,
    setEnterToSend,
    aiModel,
    setAiModel,
    monacoOptions,
    setMonacoOptions,
  } = useSettings();

  if (!settingsModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Application Settings</h2>
              <p className="text-xs text-slate-400">Configure theme, 3D graphics, AI model & Monaco editor</p>
            </div>
          </div>

          <div className="space-y-6 text-sm">
            {/* 1. Theme & Graphics */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Appearance & Graphics
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  <div>
                    <div className="font-semibold text-white">Theme Mode</div>
                    <div className="text-xs text-slate-500">Switch between dark & light UI themes</div>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                >
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <div>
                    <div className="font-semibold text-white">3D Visual Effects</div>
                    <div className="text-xs text-slate-500">Enable Three.js animated background canvas</div>
                  </div>
                </div>
                <button
                  onClick={() => setEffects3D(!effects3D)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    effects3D ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {effects3D ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* 2. AI Model Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                AI Provider & Model
              </h3>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="block text-xs text-slate-400 mb-2 font-mono">Selected AI Engine</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Recommended - Fast & Code Smart)</option>
                  <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Next-Gen AI)</option>
                  <option value="gpt-4o">OpenAI GPT-4o Compatible</option>
                </select>
              </div>
            </div>

            {/* 3. Monaco Editor Preferences */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Code Editor Preferences
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs text-slate-400 mb-1">Font Size</label>
                  <select
                    value={monacoOptions.fontSize}
                    onChange={(e) => setMonacoOptions((p) => ({ ...p, fontSize: Number(e.target.value) }))}
                    className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value={12}>12 px</option>
                    <option value={14}>14 px (Default)</option>
                    <option value={16}>16 px</option>
                    <option value={18}>18 px</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs text-slate-400 mb-1">Word Wrap</label>
                  <select
                    value={monacoOptions.wordWrap}
                    onChange={(e) => setMonacoOptions((p) => ({ ...p, wordWrap: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Chat Input Behavior */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Chat Keyboard Shortcut
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <CornerDownLeft className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">Enter to Send</div>
                    <div className="text-xs text-slate-500">Press Enter to send message, Shift+Enter for newline</div>
                  </div>
                </div>
                <button
                  onClick={() => setEnterToSend(!enterToSend)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    enterToSend ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {enterToSend ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
