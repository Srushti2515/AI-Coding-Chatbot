import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Bug, Sparkles, Zap, Repeat, TestTube, FileText, Terminal, ArrowRight } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';

export default function ToolsModal() {
  const { toolsModalOpen, setToolsModalOpen, sendMessage, setEditorCode, setEditorLanguage, setShowEditor } = useChat();
  const { setActiveView } = useSettings();
  const [selectedTool, setSelectedTool] = useState('generator');

  // Input states for tool forms
  const [codePrompt, setCodePrompt] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [errorLog, setErrorLog] = useState('');
  const [targetLang, setTargetLang] = useState('python');
  const [sourceLang, setSourceLang] = useState('javascript');

  if (!toolsModalOpen) return null;

  const tools = [
    { id: 'generator', label: 'Code Generator', icon: Code2, color: 'text-cyan-400 border-cyan-500/30' },
    { id: 'debugger', label: 'Debugger & Fixer', icon: Bug, color: 'text-rose-400 border-rose-500/30' },
    { id: 'explainer', label: 'Line-by-Line Explainer', icon: Sparkles, color: 'text-violet-400 border-violet-500/30' },
    { id: 'optimizer', label: 'Code Optimizer', icon: Zap, color: 'text-amber-400 border-amber-500/30' },
    { id: 'converter', label: 'Language Converter', icon: Repeat, color: 'text-emerald-400 border-emerald-500/30' },
    { id: 'tests', label: 'Test Generator', icon: TestTube, color: 'text-indigo-400 border-indigo-500/30' },
    { id: 'docs', label: 'Doc & Comment Generator', icon: FileText, color: 'text-teal-400 border-teal-500/30' },
  ];

  const handleRunTool = () => {
    let finalPrompt = '';

    if (selectedTool === 'generator') {
      finalPrompt = `Generate clean, production-ready ${targetLang} code for: ${codePrompt}`;
    } else if (selectedTool === 'debugger') {
      finalPrompt = `Debug and fix this code:\n\`\`\`\n${sourceCode}\n\`\`\`${errorLog ? `\nError Log:\n${errorLog}` : ''}`;
    } else if (selectedTool === 'explainer') {
      finalPrompt = `Explain the following code line-by-line in detail:\n\`\`\`\n${sourceCode}\n\`\`\``;
    } else if (selectedTool === 'optimizer') {
      finalPrompt = `Optimize this code for speed, readability, and lower memory footprint:\n\`\`\`\n${sourceCode}\n\`\`\``;
    } else if (selectedTool === 'converter') {
      finalPrompt = `Convert this code from ${sourceLang} to ${targetLang}:\n\`\`\`${sourceLang}\n${sourceCode}\n\`\`\``;
    } else if (selectedTool === 'tests') {
      finalPrompt = `Generate comprehensive unit tests with edge cases for this code:\n\`\`\`\n${sourceCode}\n\`\`\``;
    } else if (selectedTool === 'docs') {
      finalPrompt = `Add thorough documentation, JSDoc/Docstring comments, and type definitions to this code:\n\`\`\`\n${sourceCode}\n\`\`\``;
    }

    setToolsModalOpen(false);
    setActiveView('playground');
    sendMessage(finalPrompt);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={() => setToolsModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Developer Suite Tools</h2>
              <p className="text-xs text-slate-400">Automate code generation, refactoring, debugging & unit testing</p>
            </div>
          </div>

          {/* Body Content Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 overflow-y-auto">
            {/* Tool Selection Tabs */}
            <div className="space-y-1">
              {tools.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTool === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTool(t.id)}
                    className={`w-full p-3 rounded-2xl text-left text-xs font-semibold flex items-center space-x-3 transition border ${
                      isSelected
                        ? `bg-slate-800 text-white ${t.color}`
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tool Config Panel */}
            <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              {selectedTool === 'generator' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
                    <Code2 className="w-4 h-4" />
                    <span>Generate Code from Specification</span>
                  </h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Language</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript / React</option>
                      <option value="typescript">TypeScript</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="sql">SQL Query</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Specification / Prompt</label>
                    <textarea
                      rows={4}
                      value={codePrompt}
                      onChange={(e) => setCodePrompt(e.target.value)}
                      placeholder="e.g. Build a REST API endpoint in Node.js Express that validates user tokens..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'debugger' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
                    <Bug className="w-4 h-4" />
                    <span>Debug Code & Fix Errors</span>
                  </h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Source Code to Debug</label>
                    <textarea
                      rows={3}
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      placeholder="Paste your broken function here..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Error Trace / Message (Optional)</label>
                    <input
                      type="text"
                      value={errorLog}
                      onChange={(e) => setErrorLog(e.target.value)}
                      placeholder="e.g. TypeError: Cannot read property 'map' of undefined"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'converter' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                    <Repeat className="w-4 h-4" />
                    <span>Convert Language</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">From Language</label>
                      <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">To Language</label>
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2"
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Source Code</label>
                    <textarea
                      rows={3}
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      placeholder="Paste code to convert..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(selectedTool === 'explainer' || selectedTool === 'optimizer' || selectedTool === 'tests' || selectedTool === 'docs') && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-violet-400 capitalize">
                    {selectedTool} Assistant
                  </h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Code Snippet</label>
                    <textarea
                      rows={5}
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      placeholder="Paste code snippet here..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleRunTool}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Execute Developer Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
