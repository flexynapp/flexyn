import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

export const THEMES = [
  {
    id: 'orange-slate',
    name: 'Iron Orange',
    description: 'Default · Orange & Slate',
    preview: ['#e8711a', '#2d3748'],
    vars: {
      '--primary': '26 90% 50%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '210 18% 30%',
      '--accent-foreground': '0 0% 100%',
      '--ring': '26 90% 50%',
      '--sidebar-primary': '26 90% 50%',
      '--sidebar-ring': '26 90% 50%',
    },
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    description: 'Bold & energetic',
    preview: ['#2563eb', '#1e3a5f'],
    vars: {
      '--primary': '221 83% 53%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '214 60% 25%',
      '--accent-foreground': '0 0% 100%',
      '--ring': '221 83% 53%',
      '--sidebar-primary': '221 83% 53%',
      '--sidebar-ring': '221 83% 53%',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Fresh & focused',
    preview: ['#10b981', '#064e3b'],
    vars: {
      '--primary': '160 84% 39%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '158 60% 20%',
      '--accent-foreground': '0 0% 100%',
      '--ring': '160 84% 39%',
      '--sidebar-primary': '160 84% 39%',
      '--sidebar-ring': '160 84% 39%',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson',
    description: 'Intense & powerful',
    preview: ['#dc2626', '#450a0a'],
    vars: {
      '--primary': '0 72% 51%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '0 50% 20%',
      '--accent-foreground': '0 0% 100%',
      '--ring': '0 72% 51%',
      '--sidebar-primary': '0 72% 51%',
      '--sidebar-ring': '0 72% 51%',
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Sleek & modern',
    preview: ['#7c3aed', '#2e1065'],
    vars: {
      '--primary': '263 70% 50%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '262 50% 22%',
      '--accent-foreground': '0 0% 100%',
      '--ring': '263 70% 50%',
      '--sidebar-primary': '263 70% 50%',
      '--sidebar-ring': '263 70% 50%',
    },
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Champion vibes',
    preview: ['#d97706', '#78350f'],
    vars: {
      '--primary': '38 92% 50%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '32 60% 25%',
      '--accent-foreground': '0 0% 100%',
      '--ring': '38 92% 50%',
      '--sidebar-primary': '38 92% 50%',
      '--sidebar-ring': '38 92% 50%',
    },
  },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(() => {
    try { return localStorage.getItem('fn-theme') || 'orange-slate'; } catch { return 'orange-slate'; }
  });
  const [darkMode, setDarkModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('fn-dark-mode');
      if (saved !== null) return saved === 'true';
    } catch {}
    return false;
  });

  // Hydrate from server user on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await base44.auth.me();
        if (cancelled) return;
        if (me?.preferred_theme && THEMES.some(t => t.id === me.preferred_theme) && me.preferred_theme !== themeId) {
          setThemeIdState(me.preferred_theme);
          try { localStorage.setItem('fn-theme', me.preferred_theme); } catch {}
        }
        if (typeof me?.dark_mode === 'boolean' && me.dark_mode !== darkMode) {
          setDarkModeState(me.dark_mode);
          try { localStorage.setItem('fn-dark-mode', String(me.dark_mode)); } catch {}
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Apply theme vars to CSS + persist localStorage
  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    try { localStorage.setItem('fn-theme', themeId); } catch {}
  }, [themeId]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('fn-dark-mode', String(darkMode)); } catch {}
  }, [darkMode]);

  const setThemeId = useCallback((id) => {
    setThemeIdState(id);
    try { base44.auth.updateMe({ preferred_theme: id }).catch(() => {}); } catch {}
  }, []);

  const setDarkMode = useCallback((val) => {
    setDarkModeState(val);
    try { base44.auth.updateMe({ dark_mode: val }).catch(() => {}); } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}