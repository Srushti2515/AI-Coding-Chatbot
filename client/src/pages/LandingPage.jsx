import React from 'react';
import { motion } from 'framer-motion';
import { Code, Sparkles, ArrowRight, Terminal, Cpu, ShieldCheck, Zap, Repeat, Play, Layers } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TechBackground from '../components/3d/TechBackground';
import { useSettings } from '../context/SettingsContext';

export default function LandingPage() {
  const { setActiveView } = useSettings();

  const features = [
    {
      icon: Sparkles,
      title: 'Intelligent Code Generation',
      description: 'Generate production-ready algorithms, React components, REST APIs, and SQL queries with zero friction.',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      icon: Terminal,
      title: 'Monaco IDE Split View',
      description: 'Built-in VS Code-powered Monaco editor with live JavaScript browser execution sandbox.',
      color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    },
    {
      icon: Zap,
      title: 'Real-time Debugging & Fixes',
      description: 'Paste error stack traces or broken code snippets to receive immediate line-by-line root cause analysis.',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      icon: Repeat,
      title: 'Polyglot Language Converter',
      description: 'Convert code seamlessly between Python, Java, C++, JavaScript, TypeScript, Rust, and SQL.',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      icon: Layers,
      title: 'Three.js 3D Developer Canvas',
      description: 'Futuristic developer-themed 3D environment with floating symbols, connected nodes, and toggle controls.',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Server-side AI Layer',
      description: 'Abstracted backend architecture protecting API keys with JWT authentication & rate limiting.',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white relative overflow-hidden">
      {/* 3D Background */}
      <TechBackground />

      {/* Navigation Bar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>CodeSphere AI 2.0 • Next-Gen AI Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Your AI <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">Coding Partner</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Write, debug, explain, and improve code with intelligent AI assistance. Built for software engineers, developers, and learners.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveView('playground')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 group transition"
              >
                <span>Start Coding Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base flex items-center justify-center transition"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Coding Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="p-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-blue-500/30 shadow-2xl backdrop-blur-xl">
              <div className="bg-slate-950/90 rounded-[22px] p-5 sm:p-6 border border-slate-800/80 space-y-4">
                {/* IDE Window Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-slate-300 font-bold">binary_search.py</span>
                  </div>
                  <span className="text-cyan-400 font-bold">CodeSphere AI</span>
                </div>

                {/* Animated Code Mockup */}
                <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto bg-slate-900/90 p-4 rounded-xl border border-slate-800/60">
                  <code>
                    <span className="text-rose-400">def</span> <span className="text-cyan-400">binary_search</span>(arr, target):{"\n"}
                    {"    "}left, right = <span className="text-amber-400">0</span>, len(arr) - <span className="text-amber-400">1</span>{"\n"}
                    {"    "}<span className="text-rose-400">while</span> left &lt;= right:{"\n"}
                    {"        "}mid = (left + right) // <span className="text-amber-400">2</span>{"\n"}
                    {"        "}<span className="text-rose-400">if</span> arr[mid] == target:{"\n"}
                    {"            "}<span className="text-rose-400">return</span> mid{"\n"}
                    {"        "}<span className="text-rose-400">elif</span> arr[mid] &lt; target:{"\n"}
                    {"            "}left = mid + <span className="text-amber-400">1</span>{"\n"}
                    {"        "}<span className="text-rose-400">else</span>:{"\n"}
                    {"            "}right = mid - <span className="text-amber-400">1</span>{"\n"}
                    {"    "}<span className="text-rose-400">return</span> -<span className="text-amber-400">1</span>
                  </code>
                </pre>

                {/* AI Assistant Insight Bubble */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">AI Analysis:</span> Time complexity is <code className="text-cyan-300 font-mono">O(log n)</code>. Auxiliary space requirement is <code className="text-cyan-300 font-mono">O(1)</code>.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Breakdown Grid */}
        <div id="features" className="pt-28 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Supercharge Your Developer Workflow
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Everything you need to write clean code, solve algorithmic challenges, and understand complex software architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playground Callout Banner */}
        <div id="about" className="mt-28 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/60 border border-slate-800 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to experience CodeSphere AI?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Test code generation, Monaco editor integration, and real-time AI debugging instantly in your browser.
          </p>
          <button
            onClick={() => setActiveView('playground')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 inline-flex items-center space-x-2 transition"
          >
            <span>Launch AI Chat Playground</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
