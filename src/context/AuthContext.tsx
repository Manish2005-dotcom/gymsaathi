import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import {
  getSupabaseClient,
  resolveSupabaseCredentials,
  setCustomCredentials as storeCustomCredentials,
  clearCustomCredentials as removeCustomCredentials,
} from '../services/supabaseClient';
import { SupabaseDbService } from '../services/supabaseDb';
import { StorageService, DEFAULT_USER_PROFILE } from '../services/storage';
import { UserProfile } from '../types/fitness';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  configSource: 'env' | 'custom' | 'none';
  supabaseUrl: string;
  profile: UserProfile;
  isOnboarded: boolean;
  isGuestMode: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  setGuestMode: (enabled: boolean) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string; user?: User | null }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updated: UserProfile) => Promise<void>;
  completeOnboarding: (onboardedProfile: UserProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveCustomConfig: (url: string, key: string) => void;
  resetCustomConfig: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gymsaathi_guest_mode') === 'true';
    }
    return false;
  });

  const [credsState, setCredsState] = useState(() => resolveSupabaseCredentials());

  const isConfigured = credsState.isConfigured;
  const configSource = credsState.source;
  const supabaseUrl = credsState.url;

  // Determine if onboarded
  const isOnboarded = Boolean(profile.isOnboarded || (profile.name && profile.name !== 'Aman Sharma' && profile.heightCm > 0));

  // Sync profile from Supabase when user changes
  const loadCloudProfile = useCallback(async (activeUser: User) => {
    try {
      const cloudProfile = await SupabaseDbService.getProfile(activeUser.id);
      if (cloudProfile) {
        setProfile(cloudProfile);
        StorageService.saveProfile(cloudProfile);
      } else {
        // Build initial profile from user metadata
        const initial: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          name: (activeUser.user_metadata?.full_name as string) || activeUser.email?.split('@')[0] || 'Fitness Seeker',
          email: activeUser.email,
          isOnboarded: false,
          updatedAt: new Date().toISOString(),
        };
        setProfile(initial);
        StorageService.saveProfile(initial);
        await SupabaseDbService.saveProfile(activeUser.id, initial);
      }
    } catch (err) {
      console.error('Failed to load cloud profile:', err);
    }
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseClient();
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr) {
          console.warn('Supabase getSession error:', sessionErr.message);
        }

        if (mounted) {
          const currentSession = sessionData?.session ?? null;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            await loadCloudProfile(currentSession.user);
          }
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!mounted) return;
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (event === 'SIGNED_IN' && newSession?.user) {
              await loadCloudProfile(newSession.user);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setSession(null);
            }
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Failed to initialize Supabase auth listener:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [isConfigured, credsState.url, credsState.anonKey, loadCloudProfile]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string; user?: User | null }> => {
    setAuthError(null);
    if (!isConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);

        // Seed initial profile with onboarded = false
        const initialProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          name: fullName.trim() || email.split('@')[0],
          email: email.trim(),
          isOnboarded: false,
          updatedAt: new Date().toISOString(),
        };
        setProfile(initialProfile);
        StorageService.saveProfile(initialProfile);

        if (data.session) {
          await SupabaseDbService.saveProfile(data.user.id, initialProfile);
        }
      }

      return { success: true, user: data.user };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!isConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      setUser(data.user);
      setSession(data.session);
      if (data.user) {
        await loadCloudProfile(data.user);
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthError(null);
    try {
      if (isConfigured) {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Error during signOut:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsGuestMode(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gymsaathi_guest_mode');
      }
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!isConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured yet.',
      };
    }

    try {
      const supabase = getSupabaseClient();
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/?tab=profile` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!isConfigured) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const updateUserProfile = async (updated: UserProfile): Promise<void> => {
    setProfile(updated);
    StorageService.saveProfile(updated);

    if (user && isConfigured) {
      await SupabaseDbService.saveProfile(user.id, updated);
    }
  };

  const completeOnboarding = async (onboardedProfile: UserProfile): Promise<void> => {
    const finalProfile: UserProfile = {
      ...onboardedProfile,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    };
    setProfile(finalProfile);
    StorageService.saveProfile(finalProfile);

    if (user && isConfigured) {
      await SupabaseDbService.saveProfile(user.id, finalProfile);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user && isConfigured) {
      await loadCloudProfile(user);
    }
  };

  const saveCustomConfig = (url: string, key: string) => {
    storeCustomCredentials(url, key);
    const updated = resolveSupabaseCredentials();
    setCredsState(updated);
  };

  const resetCustomConfig = () => {
    removeCustomCredentials();
    const updated = resolveSupabaseCredentials();
    setCredsState(updated);
  };

  const handleSetGuestMode = (enabled: boolean) => {
    setIsGuestMode(enabled);
    if (typeof window !== 'undefined') {
      if (enabled) {
        localStorage.setItem('gymsaathi_guest_mode', 'true');
      } else {
        localStorage.removeItem('gymsaathi_guest_mode');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        configSource,
        supabaseUrl,
        profile,
        isOnboarded,
        isGuestMode,
        authError,
        setAuthError,
        setGuestMode: handleSetGuestMode,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile: updateUserProfile,
        completeOnboarding,
        refreshProfile,
        saveCustomConfig,
        resetCustomConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
