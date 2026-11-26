import { useEffect, useState } from 'react';

export type ThemePreference = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'yawmiyati_theme';

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return 'auto';
  });

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };

    setSystemDark(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDark = preference === 'dark' || (preference === 'auto' && systemDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Ignore storage errors
    }
  }, [isDark, preference]);

  const cycleTheme = () => {
    setPreference((prev) => {
      if (prev === 'auto') return isDark ? 'light' : 'dark';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  return {
    preference,
    isDark,
    setPreference,
    cycleTheme,
  };
}
