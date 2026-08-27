import React from 'react';
import { Code, Globe, Share2, Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold">
            <Code className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-lg">
            CodeSphere <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <p className="text-slate-500 text-xs sm:text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} CodeSphere AI. Built with React, Vite, Tailwind CSS, Monaco IDE & Three.js.
        </p>

        <div className="flex items-center space-x-3 text-slate-400">
          <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-cyan-400 transition" title="Website">
            <Globe className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-cyan-400 transition" title="Share Project">
            <Share2 className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-cyan-400 transition" title="Code Repository">
            <Code2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
