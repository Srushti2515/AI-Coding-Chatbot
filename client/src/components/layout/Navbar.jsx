import React from 'react';
import { Code, Sparkles, Sun, Moon, ArrowRight, User } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme, activeView, setActiveView } = useSettings();
  const { user, setAuthModal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center space-x-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <Code className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
            CodeSphere <span className="text-cyan-400">AI</span>
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveView('landing')}
            className={`hover:text-cyan-400 transition ${activeView === 'landing' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <a href="#features" className="hover:text-cyan-400 transition">
            Features
          </a>
          <button
            onClick={() => setActiveView('playground')}
            className={`hover:text-cyan-400 transition ${activeView === 'playground' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Playground
          </button>
          <a href="#about" className="hover:text-cyan-400 transition">
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveView('playground')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Go to Playground</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAuthModal('login')}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
              >
                Sign In
              </button>

              <button
                onClick={() => setActiveView('playground')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
