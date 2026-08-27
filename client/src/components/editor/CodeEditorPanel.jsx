import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Copy, Check, Sparkles, Bug, Zap, X, Terminal, Code2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';

export default function CodeEditorPanel() {
  const {
    editorCode,
    setEditorCode,
    editorLanguage,
    setEditorLanguage,
    setShowEditor,
    runCodeInSandbox,
    editorOutput,
    setEditorOutput,
    sendMessage,
  } = useChat();

  const { monacoOptions } = useSettings();
  const [copied, setCopied] = React.useState(false);
  const [stdin, setStdin] = React.useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'sql', label: 'SQL' },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAIAction = (actionType) => {
    const prompts = {
      explain: `Please explain the following ${editorLanguage} code line-by-line:`,
      debug: `Debug and fix any errors in the following ${editorLanguage} code:`,
      optimize: `Optimize the performance, readability, and structure of this ${editorLanguage} code:`,
    };

    const executionError = actionType === 'debug' && editorOutput?.type === 'error'
      ? `\n\nActual execution result:\n${editorOutput.message}`
      : '';
    const attachment = {
      name: `editor_selection.${editorLanguage}`,
      content: `${editorCode}${executionError}`,
      language: editorLanguage,
    };

    sendMessage(prompts[actionType] || 'Analyze this code:', attachment);
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex flex-col bg-slate-950 border-l border-slate-800 shadow-2xl relative z-10">
      {/* Editor Top Bar */}
      <div className="h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Monaco IDE</span>
          </div>

          {/* Language Selector */}
          <select
            value={editorLanguage}
            onChange={(e) => setEditorLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Run Code Button */}
          <button
            onClick={() => runCodeInSandbox(stdin)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition"
            title="Run Code in Sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Close Panel */}
          <button
            onClick={() => setShowEditor(false)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Close Editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Assistant Quick Bar directly over Editor */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-500 flex-shrink-0">Ask AI on Code:</span>
        
        <button
          onClick={() => handleAIAction('explain')}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-violet-300 border border-violet-500/30 transition whitespace-nowrap"
        >
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>Explain</span>
        </button>

        <button
          onClick={() => handleAIAction('debug')}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-rose-300 border border-rose-500/30 transition whitespace-nowrap"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          <span>Debug & Fix</span>
        </button>

        <button
          onClick={() => handleAIAction('optimize')}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition whitespace-nowrap"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Optimize</span>
        </button>
      </div>

      {/* Monaco Code Editor Instance */}
      <div className="flex-1 w-full bg-[#1e1e1e] overflow-hidden">
        <Editor
          height="100%"
          language={editorLanguage}
          theme="vs-dark"
          value={editorCode}
          onChange={(val) => setEditorCode(val || '')}
          options={{
            fontSize: monacoOptions.fontSize || 14,
            wordWrap: monacoOptions.wordWrap || 'on',
            lineNumbers: monacoOptions.lineNumbers || 'on',
            tabSize: monacoOptions.tabSize || 2,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}
        />
      </div>

      <div className="px-3 py-2 bg-slate-900 border-t border-slate-800">
        <label className="block mb-1 text-xs font-mono text-slate-400" htmlFor="code-stdin">Input (stdin)</label>
        <textarea
          id="code-stdin"
          value={stdin}
          onChange={(event) => setStdin(event.target.value)}
          placeholder="Optional input for input()"
          rows={2}
          className="w-full resize-y rounded bg-slate-950 border border-slate-700 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Console Output Drawer */}
      {editorOutput && (
        <div className="h-44 bg-slate-900 border-t border-slate-800 p-3 flex flex-col font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <div className="flex items-center space-x-2 text-slate-300 font-bold">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Console Execution Output</span>
            </div>
            <button
              onClick={() => setEditorOutput(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Clear Output
            </button>
          </div>
          <pre className="flex-1 overflow-y-auto whitespace-pre-wrap text-emerald-400 font-mono">
            {editorOutput.message}
          </pre>
        </div>
      )}
    </div>
  );
}
