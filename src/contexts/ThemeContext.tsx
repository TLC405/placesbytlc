import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { isHalloweenSeason } from '@/lib/season';

export type ThemeType = 'romance' | 'man-mode' | 'cyberpunk' | 'nature';

interface ThemeConfig {
  name: string;
  displayName: string;
  icon: string;
  description: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

const THEMES: Record<ThemeType, ThemeConfig> = {
  romance: {
    name: 'romance',
    displayName: '💕 Romance',
    icon: '💕',
    description: 'Soft, romantic, perfect for date planning',
    colors: {
      primary: '336 72 153',
      accent: '244 63 94',
      background: '255 242 249',
      foreground: '88 28 135',
    }
  },
  'man-mode': {
    name: 'man-mode',
    displayName: '🎮 Man Mode',
    icon: '🎮',
    description: 'Tactical, gaming, CoD-inspired HUD',
    colors: {
      primary: '34 197 94',
      accent: '249 115 22',
      background: '10 10 10',
      foreground: '34 197 94',
    }
  },
  cyberpunk: {
    name: 'cyberpunk',
    displayName: '🌌 Cyberpunk',
    icon: '🌌',
    description: 'Neon, futuristic, hacker aesthetic',
    colors: {
      primary: '6 182 212',
      accent: '168 85 247',
      background: '2 6 23',
      foreground: '6 182 212',
    }
  },
  nature: {
    name: 'nature',
    displayName: '🌿 Nature',
    icon: '🌿',
    description: 'Earth tones, outdoor adventures',
    colors: {
      primary: '22 163 74',
      accent: '14 165 233',
      background: '249 246 238',
      foreground: '92 64 14',
    }
  }
};

interface ThemeContextType {
  isHalloween: boolean;
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('romance');
  const [isHalloween, setIsHalloween] = useState(() => isHalloweenSeason());

  useEffect(() => {
    const saved = localStorage.getItem('tlc_theme') as ThemeType;
    if (saved && THEMES[saved]) {
      setCurrentTheme(saved);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsHalloween(isHalloweenSeason());
    const interval = window.setInterval(check, 60000);
    window.addEventListener('focus', check);
    return () => { clearInterval(interval); window.removeEventListener('focus', check); };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    for (const token of ['--primary', '--accent', '--background', '--foreground']) root.style.removeProperty(token);
    root.setAttribute('data-season', isHalloween ? 'halloween' : 'regular');
    root.removeAttribute('data-theme');
  }, [isHalloween]);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('tlc_theme', theme);
    toast.success(`${THEMES[theme].icon} ${THEMES[theme].displayName} activated`);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: THEMES, isHalloween }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
