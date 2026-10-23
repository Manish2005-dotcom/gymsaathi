import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite environment variables first
const ENV_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const ENV_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Local storage overrides for interactive in-browser configuration/testing
const LOCAL_OVERRIDE_URL_KEY = 'gymsaathi_custom_supabase_url';
const LOCAL_OVERRIDE_KEY_KEY = 'gymsaathi_custom_supabase_anon_key';

export function getCustomCredentials(): { url: string; key: string } {
  if (typeof window === 'undefined') return { url: '', key: '' };
  try {
    return {
      url: localStorage.getItem(LOCAL_OVERRIDE_URL_KEY)?.trim() || '',
      key: localStorage.getItem(LOCAL_OVERRIDE_KEY_KEY)?.trim() || '',
    };
  } catch {
    return { url: '', key: '' };
  }
}

export function setCustomCredentials(url: string, key: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (url) localStorage.setItem(LOCAL_OVERRIDE_URL_KEY, url.trim());
    else localStorage.removeItem(LOCAL_OVERRIDE_URL_KEY);

    if (key) localStorage.setItem(LOCAL_OVERRIDE_KEY_KEY, key.trim());
    else localStorage.removeItem(LOCAL_OVERRIDE_KEY_KEY);
  } catch (err) {
    console.error('Failed to save custom Supabase credentials:', err);
  }
}

export function clearCustomCredentials(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_OVERRIDE_URL_KEY);
    localStorage.removeItem(LOCAL_OVERRIDE_KEY_KEY);
  } catch (err) {
    console.error('Failed to clear custom Supabase credentials:', err);
  }
}

export function resolveSupabaseCredentials(): {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
} {
  const custom = getCustomCredentials();
  if (custom.url && custom.key && isValidSupabaseUrl(custom.url)) {
    return {
      url: custom.url,
      anonKey: custom.key,
      isConfigured: true,
      source: 'custom',
    };
  }

  if (ENV_URL && ENV_ANON_KEY && isValidSupabaseUrl(ENV_URL) && !ENV_URL.includes('your-project-id')) {
    return {
      url: ENV_URL,
      anonKey: ENV_ANON_KEY,
      isConfigured: true,
      source: 'env',
    };
  }

  return {
    url: ENV_URL || 'https://placeholder-project.supabase.co',
    anonKey: ENV_ANON_KEY || 'placeholder-anon-key',
    isConfigured: false,
    source: 'none',
  };
}

function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient {
  const creds = resolveSupabaseCredentials();

  if (!cachedClient || lastUrl !== creds.url || lastKey !== creds.anonKey) {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'gymsaathi-supabase-auth-token',
      },
    });
    lastUrl = creds.url;
    lastKey = creds.anonKey;
  }

  return cachedClient;
}

export const supabase = getSupabaseClient();
