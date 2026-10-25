import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Bell,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { HomepageContent } from '../../types/admin';

export const AdminHomepageManager: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    const data = await AdminService.getHomepageContent();
    setContent(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaveLoading(true);
    const success = await AdminService.saveHomepageContent(content);
    setSaveLoading(false);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (loading || !content) {
    return (
      <div className="p-12 text-center text-zinc-500 text-xs">
        Loading homepage content settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-lime-400" />
            <span>Homepage & Marketing Content Manager</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure the public hero message, top announcement alert bar, and featured workout splits.
          </p>
        </div>

        <button
          onClick={fetchContent}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Homepage content updated and live for all visitors!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs text-zinc-300">
        {/* Announcement Banner */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-lime-400" />
              <span>Top Notification & Announcement Banner</span>
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active-ann"
                checked={content.isAnnouncementActive}
                onChange={(e) => setContent({ ...content, isAnnouncementActive: e.target.checked })}
                className="w-4 h-4 rounded text-lime-500"
              />
              <label htmlFor="active-ann" className="text-xs font-semibold text-zinc-300 cursor-pointer">
                Display Banner
              </label>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={content.announcementBanner}
              onChange={(e) => setContent({ ...content, announcementBanner: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-lime-500"
            />
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Hero Welcome Copy</span>
          </h2>

          <div>
            <label className="block text-zinc-400 mb-1">Small Badge Title</label>
            <input
              type="text"
              value={content.heroBadge}
              onChange={(e) => setContent({ ...content, heroBadge: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-lime-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Main Heading</label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-lime-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Subtitle / Value Proposition</label>
            <textarea
              rows={3}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-lime-500 font-sans"
            />
          </div>
        </div>

        {/* Live Banner Preview */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-lime-400" />
            <h2 className="text-sm font-bold text-white">Live Hero Banner Preview</h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c100e] border border-zinc-800 text-center space-y-3">
            {content.isAnnouncementActive && (
              <div className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold">
                {content.announcementBanner}
              </div>
            )}
            <h3 className="text-xl sm:text-2xl font-black text-white">{content.heroTitle}</h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">{content.heroSubtitle}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button
            type="submit"
            disabled={saveLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-extrabold shadow-lg shadow-lime-500/10 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveLoading ? 'Deploying to Supabase...' : 'Deploy Live Homepage Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
