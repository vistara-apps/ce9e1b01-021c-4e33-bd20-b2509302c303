'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'default' | 'celo' | 'solana' | 'base' | 'coinbase';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme') as Theme;
    if (themeParam && ['default', 'celo', 'solana', 'base', 'coinbase'].includes(themeParam)) {
      setTheme(themeParam);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
