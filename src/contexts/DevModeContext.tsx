import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface DevModeContextType {
  isDevMode: boolean;
  enableDevMode: () => void;
  disableDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const devModeEnabled = sessionStorage.getItem('tlc_dev_mode') === 'true';
    setIsDevMode(devModeEnabled);
  }, []);

  const enableDevMode = () => {
    setIsDevMode(true);
    sessionStorage.setItem('tlc_dev_mode', 'true');
    toast.success("✨ Welcome, Developer!", {
      description: "You've unlocked premium features, all themes, and enhanced UI throughout the app. Enjoy exploring! 💖",
      duration: 5000,
    });
  };

  const disableDevMode = () => {
    setIsDevMode(false);
    sessionStorage.removeItem('tlc_dev_mode');
    toast.info("💝 Developer mode turned off. See you soon!");
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, enableDevMode, disableDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};
