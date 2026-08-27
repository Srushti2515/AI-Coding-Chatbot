import React from 'react';
import { Sparkles, Code2, Bug, Zap, TestTube, BookOpen } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function PromptSuggestions() {
  const { sendMessage } = useChat();

  const suggestions = [
    {
      title: 'Build React Login Page',
      description: 'Generate a modern React login form component with Tailwind CSS & state validation.',
      prompt: 'Build a React login page component with form validation and Tailwind CSS styling.',
      icon: Sparkles,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'Explain Python Decorators',
      description: 'Understand higher-order functions & @decorator syntax line-by-line.',
      prompt: 'Explain Python decorators with clear code examples and practical use cases.',
      icon: BookOpen,
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400',
    },
    {
      title: 'Debug Code & Fix Errors',
      description: 'Detect null reference exceptions, memory leaks, or unhandled promise rejections.',
      prompt: 'Debug my code to check for performance bottlenecks and unhandled errors.',
      icon: Bug,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    },
    {
      title: 'Optimize JS Function',
      description: 'Improve algorithm time complexity from O(n^2) to O(n log n).',
      prompt: 'Optimize this JavaScript function for maximum speed and lower memory usage.',
      icon: Zap,
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Generate Unit Tests',
      description: 'Write Jest or PyTest unit tests with edge cases & mocks.',
      prompt: 'Generate unit tests for a user authentication service using Jest.',
      icon: TestTube,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Explain Binary Trees',
      description: 'Master binary search tree traversals (in-order, pre-order, post-order).',
      prompt: 'Explain binary search trees and write a Python implementation with insertion and search.',
      icon: Code2,
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          What would you like to build today?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Ask questions, generate algorithms, debug errors, convert code between languages, or pick a starter template below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => sendMessage(item.prompt)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br ${item.color} hover:shadow-lg group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center space-x-2.5 mb-2">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-3 text-[11px] font-mono text-slate-500 group-hover:text-slate-300">
                Click to run prompt &rarr;
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
