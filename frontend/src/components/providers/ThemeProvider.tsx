'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme?: 'dark' | 'light';
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  // unused props to match next-themes API surface
  attribute,
  enableSystem,
  disableTransitionOnChange
}: { 
  children: React.ReactNode; 
  defaultTheme?: Theme; 
  attribute?: string; 
  enableSystem?: boolean; 
  disableTransitionOnChange?: boolean 
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) setTheme(savedTheme);
    }
  }, []);
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');

  // Load initial theme and system preference
  useEffect(() => {
    // system preference only

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const listener = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Optional: disable transition on change to prevent flashing
    if (disableTransitionOnChange) {
      root.classList.add('[&_*]:!transition-none');
      window.setTimeout(() => {
        root.classList.remove('[&_*]:!transition-none');
      }, 0);
    }

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      root.classList.add(systemTheme);
      localStorage.removeItem('theme');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, systemTheme, disableTransitionOnChange]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, systemTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
