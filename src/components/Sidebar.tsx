import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  LineChart,
  User,
  Settings,
  Flame,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'workouts'
  | 'diet-planner'
  | 'progress'
  | 'profile'
  | 'settings'
  // Compatibility aliases
  | 'home'
  | 'workout-planner'
  | 'exercise-library'
  | 'kitchen-planner'
  | 'calculator'
  | 'progress-tracker'
  | 'education';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAdminPanel?: () => void;
}

export const MAIN_NAV_ITEMS: {
  id: NavTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  subtabs?: NavTab[];
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'workouts',
    label: 'Workouts',
    icon: Dumbbell,
    badge: '7-Day & Demos',
    subtabs: ['workouts', 'workout-planner', 'exercise-library'],
  },
  {
    id: 'diet-planner',
    label: 'Diet Planner',
    icon: UtensilsCrossed,
    badge: 'Indian Diet',
    subtabs: ['diet-planner', 'kitchen-planner'],
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: LineChart,
    subtabs: ['progress', 'progress-tracker', 'calculator', 'education'],
  },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenAdminPanel,
}) => {
  const { user, isAdmin } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div
            onClick={() => {
              onSelectTab('dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform shadow-lg shadow-lime-500/5">
              <Flame className="w-6 h-6 fill-lime-400/20 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">GymSaathi</span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold tracking-wide uppercase">
                Premium Fitness SaaS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
            Navigation
          </div>

          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentTab === item.id || (item.subtabs && item.subtabs.includes(currentTab));

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-lime-400' : 'text-zinc-500 group-hover:text-zinc-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-lime-400 text-black'
                        : 'bg-zinc-900 text-zinc-400 group-hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Section (Only rendered for database-verified administrators) */}
        {isAdmin && onOpenAdminPanel && (
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90">
            <button
              onClick={() => {
                onOpenAdminPanel();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full p-3 rounded-xl bg-lime-500/10 hover:bg-lime-500/20 border border-lime-500/30 flex items-center justify-between text-xs font-bold text-lime-400 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <span>Admin Console</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Bottom Tagline / India Badge */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/70">
          <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-center">
            <div className="text-[11px] font-bold text-lime-400">🇮🇳 Built for Bharat Lifters</div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Budget workouts & high-protein Indian diet</p>
          </div>
        </div>
      </aside>
    </>
  );
};
