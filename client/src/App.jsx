import React from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import LandingPage from './pages/LandingPage';
import PlaygroundPage from './pages/PlaygroundPage';
import AuthModal from './components/modal/AuthModal';
import SettingsModal from './components/modal/SettingsModal';
import ToolsModal from './components/modal/ToolsModal';

function MainContent() {
  const { activeView } = useSettings();

  return (
    <>
      {activeView === 'landing' ? <LandingPage /> : <PlaygroundPage />}
      <AuthModal />
      <SettingsModal />
      <ToolsModal />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ChatProvider>
          <MainContent />
        </ChatProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
