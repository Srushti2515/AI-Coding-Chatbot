import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('cs_theme') || 'dark');
  const [effects3D, setEffects3D] = useState(() => {
    const saved = localStorage.getItem('cs_effects3d');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [animations, setAnimations] = useState(true);
  const [enterToSend, setEnterToSend] = useState(true);
  const [activeView, setActiveView] = useState('landing'); // 'landing' or 'playground'
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');

  const [monacoOptions, setMonacoOptions] = useState({
    fontSize: 14,
    wordWrap: 'on',
    lineNumbers: 'on',
    tabSize: 2,
    minimap: false,
  });

  useEffect(() => {
    localStorage.setItem('cs_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cs_effects3d', JSON.stringify(effects3D));
  }, [effects3D]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        effects3D,
        setEffects3D,
        animations,
        setAnimations,
        enterToSend,
        setEnterToSend,
        activeView,
        setActiveView,
        aiModel,
        setAiModel,
        monacoOptions,
        setMonacoOptions,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
