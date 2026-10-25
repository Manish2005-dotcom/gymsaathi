import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Layers,
  UtensilsCrossed,
  Palette,
  Video,
  FileText,
  Users,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminExerciseManager } from './AdminExerciseManager';
import { AdminWorkoutManager } from './AdminWorkoutManager';
import { AdminFoodManager } from './AdminFoodManager';
import { AdminThemeManager } from './AdminThemeManager';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminHomepageManager } from './AdminHomepageManager';
import { AdminUserManager } from './AdminUserManager';

interface AdminLayoutProps {
  onReturnToUserApp: () => void;
  onOpenSetupGuide?: () => void;
}

const ADMIN_NAV: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Overview & Stats', icon: LayoutDashboard },
  { id: 'exercises', label: 'Exercise & Demos', icon: Dumbbell },
  { id: 'workouts', label: 'Workout Splits', icon: Layers },
  { id: 'foods', label: 'Food & Nutrition DB', icon: UtensilsCrossed },
  { id: 'theme', label: 'Theme & Brand Style', icon: Palette },
  { id: 'media', label: 'Media Library', icon: Video },
  { id: 'homepage', label: 'Homepage Content', icon: FileText },
  { id: 'users', label: 'User Roles & Access', icon: Users },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onReturnToUserApp, onOpenSetupGuide }) => {
  const { user, isAdmin, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [devPreview, setDevPreview] = useState(false);

  // Authorization Wall: Server-enforced check
  if (!isAdmin && !devPreview) {
    return (
      <div className="min-h-screen bg-[#0a0d0c] text-zinc-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-white">Restricted Administrator Area</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your authenticated account ({user?.email || 'Guest'}) does not possess database-enforced administrator privileges in <code className="text-lime-400">public.user_roles</code>.
          </p>
          <p className="text-[11px] text-zinc-500">
            Row Level Security prevents unauthorized viewing, modification, or publication of administrative content.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={onReturnToUserApp}
              className="w-full py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-lime-500/10 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to GymSaathi App</span>
            </button>

            <button
              onClick={() => setDevPreview(true)}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-lime-400 font-bold text-xs rounded-xl border border-lime-500/30 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>Test Admin Console (Owner Simulation)</span>
            </button>

            {onOpenSetupGuide && (
              <button
                onClick={onOpenSetupGuide}
                className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs rounded-xl border border-zinc-800"
              >
                View SQL Role Migration Script
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d0c] text-zinc-100 flex flex-col font-sans selection:bg-lime-500 selection:text-black">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/30 flex items-center justify-center font-black">
              GS
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <span>GymSaathi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-400 text-black font-extrabold">ADMIN</span>
              </div>
              <p className="text-[10px] text-zinc-500">Platform Management</p>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
            Admin Modules
          </div>
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-lime-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Return To App Link */}
        <div className="p-4 border-t border-zinc-800/80 space-y-2">
          <button
            onClick={onReturnToUserApp}
            className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl border border-zinc-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-lime-400" />
            <span>Return to User App</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        {/* Admin Header */}
        <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 border border-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Admin Console</span>
              </div>
              <h2 className="text-base font-extrabold text-white capitalize">
                {ADMIN_NAV.find((n) => n.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.email}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Authorized Admin</div>
            </div>

            <button
              onClick={onReturnToUserApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-extrabold shadow-sm transition-all"
            >
              <span>User App</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Dynamic Admin Modules */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <AdminDashboardView onNavigateTab={setActiveTab} />}
          {activeTab === 'exercises' && <AdminExerciseManager />}
          {activeTab === 'workouts' && <AdminWorkoutManager />}
          {activeTab === 'foods' && <AdminFoodManager />}
          {activeTab === 'theme' && <AdminThemeManager />}
          {activeTab === 'media' && <AdminMediaLibrary />}
          {activeTab === 'homepage' && <AdminHomepageManager />}
          {activeTab === 'users' && <AdminUserManager />}
        </main>
      </div>
    </div>
  );
};
