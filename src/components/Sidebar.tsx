import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Refrigerator,
  Calculator,
  LineChart,
  GraduationCap,
  Settings,
  User,
  Home,
  Flame,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'dashboard'
  | 'profile'
  | 'workout-planner'
  | 'exercise-library'
  | 'diet-planner'
  | 'kitchen-planner'
  | 'calculator'
  | 'progress-tracker'
  | 'education'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'home', label: 'Home Page', icon: Home },
  { id: 'profile', label: 'Fitness Profile', icon: User },
  { id: 'workout-planner', label: 'Workout Planner', icon: Dumbbell, badge: '7-Day' },
  { id: 'diet-planner', label: 'Diet Planner', icon: UtensilsCrossed, badge: '2 Modes' },
  { id: 'kitchen-planner', label: "Kitchen Planner", icon: Refrigerator },
  { id: 'exercise-library', label: 'Exercise Library', icon: BookOpen },
  { id: 'calculator', label: 'Macro Calculator', icon: Calculator },
  { id: 'progress-tracker', label: 'Progress Tracker', icon: LineChart },
  { id: 'education', label: 'Education & Safety', icon: GraduationCap },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpenMobile, onCloseMobile }) => {
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
            <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-lime-400/20 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">GymSaathi</span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              </div>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Your Fitness Companion</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            Main Features
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
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
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-lime-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-lime-400 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Tagline / India Badge */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/70">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/60 text-center">
            <div className="text-[11px] font-bold text-lime-400">🇮🇳 Built for Bharat Lifters</div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Budget-friendly workouts & Indian diet plans</p>
          </div>
        </div>
      </aside>
    </>
  );
};
