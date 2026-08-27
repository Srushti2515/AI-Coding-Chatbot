import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { useAuth } from '../../context/AuthContext';

export default function ChatMessage({ message }) {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-2xl mb-4 ${
        isAssistant
          ? 'bg-slate-900/80 border border-slate-800/80 shadow-lg'
          : 'bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20'
      }`}
    >
      {/* Avatar Badge */}
      <div className="flex-shrink-0">
        {isAssistant ? (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {user?.name ? user.name[0].toUpperCase() : <User className="w-5 h-5" />}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-200">
              {isAssistant ? 'CodeSphere AI' : user?.name || 'You'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <button
            onClick={handleCopyText}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Copy message content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Markdown Text Body & Code Blocks */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                const codeString = String(children).replace(/\n$/, '');

                if (!inline && (match || codeString.includes('\n'))) {
                  return <CodeBlock language={language || 'javascript'} code={codeString} />;
                }
                return (
                  <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
