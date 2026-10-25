import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppThemeSettings } from '../types/admin';
import { resolveSupabaseCredentials, getSupabaseClient } from '../services/supabaseClient';

export interface PredefinedTheme {
  name: string;
  color: string;
  darkBg: string;
  glow: string;
}

export const PREDEFINED_THEMES: PredefinedTheme[] = [
  { name: 'Neon Lime', color: '#84CC16', darkBg: '#0C100E', glow: 'rgba(132, 204, 22, 0.35)' },
  { name: 'Electric Emerald', color: '#10B981', darkBg: '#09120E', glow: 'rgba(16, 185, 129, 0.35)' },
  { name: 'Cyber Cyan', color: '#06B6D4', darkBg: '#081014', glow: 'rgba(6, 182, 212, 0.35)' },
  { name: 'Solar Amber', color: '#F59E0B', darkBg: '#120F08', glow: 'rgba(245, 158, 11, 0.35)' },
  { name: 'Hyper Violet', color: '#8B5CF6', darkBg: '#0F0B14', glow: 'rgba(139, 92, 246, 0.35)' },
];

export const DEFAULT_THEME: AppThemeSettings = {
  id: 'global_theme',
  accentColor: '#84CC16',
  accentName: 'Neon Lime',
  appearance: 'dark',
  borderRadius: 'rounded-2xl',
  updatedAt: new Date().toISOString(),
};

interface ThemeContextType {
  theme: AppThemeSettings;
  setAccentColor: (color: string, name?: string) => void;
  setAppearance: (appearance: 'dark' | 'light') => void;
  saveGlobalTheme: (settings: Partial<AppThemeSettings>) => Promise<boolean>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '132, 204, 22';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppThemeSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('gymsaathi_user_theme');
        if (local) return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    return DEFAULT_THEME;
  });

  const [loading, setLoading] = useState(false);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.accentColor);
    root.style.setProperty('--color-primary-rgb', hexToRgb(theme.accentColor));

    // Handle class for appearance
    if (theme.appearance === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme.accentColor, theme.appearance]);

  // Load global theme from Supabase on mount
  useEffect(() => {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return;

    let isMounted = true;
    async function fetchGlobalTheme() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('app_theme_settings')
          .select('*')
          .eq('id', 'global_theme')
          .maybeSingle();

        if (data && !error && isMounted) {
          const loaded: AppThemeSettings = {
            id: data.id,
            accentColor: data.accent_color || '#84CC16',
            accentName: data.accent_name || 'Neon Lime',
            appearance: data.appearance || 'dark',
            borderRadius: data.border_radius || 'rounded-2xl',
            updatedAt: data.updated_at || new Date().toISOString(),
          };
          // If user hasn't chosen a local custom accent, adopt the global one
          const hasLocalUserChoice = localStorage.getItem('gymsaathi_user_theme_customized') === 'true';
          if (!hasLocalUserChoice) {
            setTheme(loaded);
          }
        }
      } catch (err) {
        console.warn('Failed to load global theme:', err);
      }
    }

    fetchGlobalTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const setAccentColor = (color: string, name?: string) => {
    const matched = PREDEFINED_THEMES.find((t) => t.color.toLowerCase() === color.toLowerCase());
    const resolvedName = name || matched?.name || 'Custom Neon';
    const updated: AppThemeSettings = {
      ...theme,
      accentColor: color,
      accentName: resolvedName,
      updatedAt: new Date().toISOString(),
    };
    setTheme(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymsaathi_user_theme', JSON.stringify(updated));
      localStorage.setItem('gymsaathi_user_theme_customized', 'true');
    }
  };

  const setAppearance = (appearance: 'dark' | 'light') => {
    const updated: AppThemeSettings = {
      ...theme,
      appearance,
      updatedAt: new Date().toISOString(),
    };
    setTheme(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymsaathi_user_theme', JSON.stringify(updated));
    }
  };

  const saveGlobalTheme = async (settings: Partial<AppThemeSettings>): Promise<boolean> => {
    setLoading(true);
    try {
      const merged: AppThemeSettings = {
        ...theme,
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      setTheme(merged);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gymsaathi_user_theme', JSON.stringify(merged));
      }

      const { isConfigured } = resolveSupabaseCredentials();
      if (isConfigured) {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('app_theme_settings').upsert({
          id: 'global_theme',
          accent_color: merged.accentColor,
          accent_name: merged.accentName,
          appearance: merged.appearance,
          border_radius: merged.borderRadius,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.warn('Error saving global theme to Supabase:', error.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to saveGlobalTheme:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setAccentColor,
        setAppearance,
        saveGlobalTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
