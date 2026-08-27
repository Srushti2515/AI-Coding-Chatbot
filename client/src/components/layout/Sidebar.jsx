import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Search, Trash2, Edit2, Check, X, Terminal, Settings, User, LogOut, Code, ChevronRight } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function Sidebar() {
  const {
    chats,
    activeChatId,
    selectChat,
    createNewChat,
    deleteChat,
    renameChat,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    setToolsModalOpen,
    setSettingsModalOpen,
  } = useChat();

  const { user, logout, setAuthModal } = useAuth();
  const { setActiveView } = useSettings();

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredChats = chats.filter((c) =>
    (c.title || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const startRenaming = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditingTitle(chat.title);
  };

  const saveRenaming = (id, e) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      renameChat(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center space-x-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <Code className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-base text-white tracking-tight group-hover:text-cyan-400 transition">
                CodeSphere <span className="text-cyan-400">AI</span>
              </span>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-4 space-y-3 border-b border-slate-800/80">
          {/* New Chat Button */}
          <button
            onClick={() => {
              createNewChat();
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Chat History
          </div>

          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No conversations found
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = activeChatId === chat._id;
              const isEditing = editingId === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => {
                    selectChat(chat._id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition ${
                    isActive
                      ? 'bg-slate-900 border border-slate-800 text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-12">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.key === 'Enter' && saveRenaming(chat._id, e)}
                        className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded border border-cyan-500 focus:outline-none w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="truncate">{chat.title || 'Untitled Chat'}</span>
                    )}
                  </div>

                  {/* Actions Bar (Rename / Delete) */}
                  <div className="absolute right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                    {isEditing ? (
                      <button
                        onClick={(e) => saveRenaming(chat._id, e)}
                        className="p-1 hover:text-emerald-400"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => startRenaming(chat, e)}
                          className="p-1 hover:text-cyan-400 text-slate-400"
                          title="Rename Chat"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat._id);
                          }}
                          className="p-1 hover:text-rose-400 text-slate-400"
                          title="Delete Chat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Developer Quick Tools Launcher */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <button
            onClick={() => setToolsModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-violet-300 flex items-center justify-between text-xs transition"
          >
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-violet-400" />
              <span>Developer Tools</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAuthModal('login')}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-medium transition"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModal('register')}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-medium transition shadow-md shadow-cyan-500/20"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
