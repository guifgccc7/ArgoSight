
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  toggleDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setDemoMode = (isDemo: boolean) => {
    setIsDemoMode(isDemo);
    localStorage.setItem('argosight-demo-mode', JSON.stringify(isDemo));
  };

  const toggleDemoMode = () => {
    setDemoMode(!isDemoMode);
  };

  // Initialize from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('argosight-demo-mode');
    if (stored) {
      try {
        setIsDemoMode(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const value = {
    isDemoMode,
    setDemoMode,
    toggleDemoMode
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};
