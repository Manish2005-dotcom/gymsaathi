import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  Database,
  CloudCheck,
  CloudOff,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { UserProfile } from '../types/fitness';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  profile: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenSetupGuide?: () => void;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  home: { title: 'Welcome to GymSaathi', subtitle: 'Personalized fitness & Indian diet plans' },
  dashboard: { title: 'Fitness Command Center', subtitle: "Today's workouts, nutrition, and habits" },
  profile: { title: 'Fitness Profile & Assessment', subtitle: 'Personalized metrics and dietary parameters' },
  'workout-planner': { title: 'Weekly Workout Split', subtitle: 'Customizable 7-day schedule with animated demos' },
  'diet-planner': { title: 'Indian Diet Planner', subtitle: 'Automatic meal plans & kitchen inventory mode' },
  'kitchen-planner': { title: "What's in Your Kitchen?", subtitle: 'Cook with ingredients already in your home' },
  'exercise-library': { title: 'Exercise Technique Library', subtitle: 'Animated character demonstrations & form cues' },
  calculator: { title: 'Calorie, Protein & BMI Calculator', subtitle: 'Science-backed metabolic calculations' },
  'progress-tracker': { title: 'Progress & Consistency Tracker', subtitle: 'Log weights, workouts and body trends' },
  education: { title: 'Fitness Education & Safety', subtitle: 'Science-informed guidelines and myth-busting' },
  settings: { title: 'Application Settings', subtitle: 'Data backup, export CSV, and reset preferences' },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  profile,
  onOpenAuthModal,
  onOpenSetupGuide,
}) => {
  const meta = TAB_TITLES[currentTab] || { title: 'GymSaathi', subtitle: '' };
  const { user, signOut, isConfigured, isGuestMode } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 border border-zinc-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>{meta.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 hidden sm:block">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase status indicator */}
        <button
          onClick={onOpenSetupGuide}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            user && isConfigured
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : isConfigured
              ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
          }`}
          title="Supabase Database Status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              user && isConfigured
                ? 'bg-emerald-400 animate-pulse'
                : isConfigured
                ? 'bg-sky-400'
                : 'bg-amber-400'
            }`}
          />
          <span>{user && isConfigured ? 'Supabase Synced' : isConfigured ? 'Supabase Ready' : 'Setup Supabase'}</span>
        </button>

        {/* Quick return to dashboard button */}
        {currentTab !== 'dashboard' && (
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            title="Return to Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        )}

        {/* User Account / Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-[11px] border border-lime-500/30">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <div className="text-left hidden md:block">
                <div className="font-semibold text-white leading-tight">{profile.name || user.email?.split('@')[0]}</div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">{user.email}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold transition-all shadow-md shadow-lime-500/10"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Join</span>
              </button>
            </div>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-zinc-800/80">
                <p className="text-xs font-bold text-white truncate">{profile.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Cloud Session Active</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onSelectTab('profile');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5"
                >
                  <User className="w-3.5 h-3.5 text-lime-400" />
                  <span>My Fitness Profile</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenSetupGuide) onOpenSetupGuide();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5"
                >
                  <Database className="w-3.5 h-3.5 text-sky-400" />
                  <span>Supabase Database & SQL</span>
                </button>
              </div>

              <div className="pt-1 border-t border-zinc-800/80">
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await signOut();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
