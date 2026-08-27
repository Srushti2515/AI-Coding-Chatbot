import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import CodeEditorPanel from '../components/editor/CodeEditorPanel';
import TechBackground from '../components/3d/TechBackground';
import { useChat } from '../context/ChatContext';

export default function PlaygroundPage() {
  const { showEditor } = useChat();

  return (
    <div className="h-screen w-screen flex bg-[#090d16] text-white overflow-hidden relative">
      {/* 3D Visual Canvas */}
      <TechBackground />

      {/* Collapsible History Sidebar */}
      <Sidebar />

      {/* Main Workspace Area (Chat Playground + Monaco Editor) */}
      <div className="flex-1 flex h-full min-w-0 relative z-10">
        <ChatWindow />
        {showEditor && <CodeEditorPanel />}
      </div>
    </div>
  );
}
