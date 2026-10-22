import React from 'react';
import { Menu, User, LayoutDashboard } from 'lucide-react';
import { NavTab } from './Sidebar';
import { UserProfile } from '../types/fitness';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  profile: UserProfile;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  home: { title: 'Welcome to GymSaathi', subtitle: 'Personalized fitness & Indian diet plans' },
  dashboard: { title: 'Fitness Command Center', subtitle: "Today's workouts, nutrition, and habits" },
  profile: { title: 'Fitness Profile & Assessment', subtitle: 'Personalized metrics and dietary parameters' },
  'workout-planner': { title: 'Weekly Workout Split', subtitle: 'Targeted 6-exercise routines with form guides' },
  'diet-planner': { title: 'Indian Diet Planner', subtitle: 'Automatic meal plans & kitchen inventory mode' },
  'kitchen-planner': { title: "What's in Your Kitchen?", subtitle: 'Cook with ingredients already in your home' },
  'exercise-library': { title: 'Exercise Technique Library', subtitle: 'Complete form, breathing & posture library' },
  calculator: { title: 'Calorie, Protein & BMI Calculator', subtitle: 'Science-backed metabolic calculations' },
  'progress-tracker': { title: 'Progress & Consistency Tracker', subtitle: 'Log weights, workouts and body trends' },
  education: { title: 'Fitness Education & Safety', subtitle: 'Science-informed guidelines and myth-busting' },
  settings: { title: 'Application Settings', subtitle: 'Data backup, export CSV, and reset preferences' },
};

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenMobileMenu, profile }) => {
  const meta = TAB_TITLES[currentTab] || { title: 'GymSaathi', subtitle: '' };

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
        {/* Quick return to dashboard button (Prompt requirement Section 3) */}
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

        {/* User Profile Pill */}
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
          title="Edit Profile"
        >
          <div className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-[11px] border border-lime-500/30">
            {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
          </div>
          <div className="text-left hidden md:block">
            <div className="font-semibold text-white leading-tight">{profile.name || 'Set Profile'}</div>
            <div className="text-[10px] text-zinc-400 capitalize">
              {profile.goal.replace('_', ' ')} • {profile.weightKg}kg
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
