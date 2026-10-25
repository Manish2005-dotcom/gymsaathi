import React, { useState, useEffect } from 'react';
import {
  Users,
  Dumbbell,
  Layers,
  UtensilsCrossed,
  Activity,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { AdminStats, AdminTab } from '../../types/admin';

interface AdminDashboardViewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const data = await AdminService.getAdminStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-lime-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Database-Authorized Administrator Area</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              GymSaathi Control Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Manage exercises, animated demonstration assets, workout split templates, Indian nutrition database, site-wide themes, and registered lifters.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-lime-400' : ''}`} />
              <span>Refresh Stats</span>
            </button>
            <button
              onClick={() => onNavigateTab('exercises')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold shadow-md shadow-lime-500/10 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Exercise</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Registered Lifters</span>
            <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {loading ? '...' : stats?.totalUsers || 1}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active accounts in Supabase</span>
          </div>
        </div>

        {/* Exercises */}
        <div
          onClick={() => onNavigateTab('exercises')}
          className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Exercise Library</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {loading ? '...' : stats?.publishedExercises || 0}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {stats?.totalExercises || 0} total created
          </div>
        </div>

        {/* Workout Templates */}
        <div
          onClick={() => onNavigateTab('workouts')}
          className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Workout Splits</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {loading ? '...' : stats?.totalTemplates || 0}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            PPL, Upper/Lower, 6-Day & Custom
          </div>
        </div>

        {/* Food Database */}
        <div
          onClick={() => onNavigateTab('foods')}
          className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Indian Food DB</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {loading ? '...' : stats?.totalFoods || 0}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Paneer, Soya, Sattu, Eggs, Dals
          </div>
        </div>
      </div>

      {/* Quick Admin Actions & Recent Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Cards */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Fast Administration Actions</span>
          </h2>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
            <button
              onClick={() => onNavigateTab('exercises')}
              className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-left border border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                <span>Upload & Publish Exercise</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('theme')}
              className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-left border border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-lime-400" />
                <span>Change Default Neon Accent</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('homepage')}
              className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-left border border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Update Announcement Banner</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('users')}
              className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-left border border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Review User Roles</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Recent Audit Logs Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-400" />
              <span>Recent Administrative Audit Trail</span>
            </h2>
            <span className="text-[11px] text-zinc-500">Live database audit</span>
          </div>

          <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 overflow-hidden divide-y divide-zinc-800/60">
            {stats?.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
              stats.recentAuditLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 font-mono text-[10px]">
                      {log.targetType.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        By {log.adminEmail || 'admin'} • Target: {log.targetType}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No recent administrative events recorded yet. New actions (exercise uploads, theme updates) will appear here automatically.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
