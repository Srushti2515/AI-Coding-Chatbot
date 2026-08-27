import React, { useState } from 'react';
import { Copy, Check, Download, Play, Code, FileText } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function CodeBlock({ language = 'text', code = '' }) {
  const [copied, setCopied] = useState(false);
  const { setEditorCode, setEditorLanguage, setShowEditor, runCodeInSandbox } = useChat();

  const cleanCode = code.trim();
  const lines = cleanCode.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
      sql: 'sql',
    };
    const ext = extensions[language.toLowerCase()] || 'txt';
    const filename = `code_solution.${ext}`;
    
    const blob = new Blob([cleanCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenInEditor = () => {
    setEditorCode(cleanCode);
    setEditorLanguage(language.toLowerCase() || 'javascript');
    setShowEditor(true);
  };

  const handleRunCode = () => {
    setEditorCode(cleanCode);
    setEditorLanguage(language.toLowerCase() || 'javascript');
    setShowEditor(true);
    setTimeout(() => {
      runCodeInSandbox();
    }, 300);
  };

  return (
    <div className="my-4 rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-2xl group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-wider">{language || 'CODE'}</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Send to Monaco Editor */}
          <button
            onClick={handleOpenInEditor}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Open in Code Editor"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium transition"
            title="Run Code in Sandbox"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Download File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-200 bg-slate-950/90 flex">
        <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="pl-4 flex-1 overflow-x-auto whitespace-pre font-mono text-xs sm:text-sm">
          <code>{cleanCode}</code>
        </pre>
      </div>
    </div>
  );
}
