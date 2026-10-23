import React, { useState } from 'react';
import { X, Copy, Check, Database, Key, ShieldCheck, Terminal, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SupabaseSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupGuideModal: React.FC<SupabaseSetupGuideModalProps> = ({ isOpen, onClose }) => {
  const { isConfigured, configSource, supabaseUrl, saveCustomConfig, resetCustomConfig } = useAuth();
  const [copied, setCopied] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const sqlSchemaSnippet = `-- Run this in your Supabase SQL Editor:
-- 1. Profiles Table with RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  age INTEGER DEFAULT 22,
  gender TEXT DEFAULT 'male',
  height_cm NUMERIC DEFAULT 174,
  weight_kg NUMERIC DEFAULT 68,
  target_weight_kg NUMERIC DEFAULT 72,
  experience TEXT DEFAULT 'beginner',
  goal TEXT DEFAULT 'muscle_gain',
  diet_preference TEXT DEFAULT 'vegetarian',
  daily_budget_inr NUMERIC DEFAULT 200,
  workout_location TEXT DEFAULT 'gym',
  available_equipment JSONB DEFAULT '["full_gym","dumbbells","barbells"]'::jsonb,
  workout_time_minutes INTEGER DEFAULT 60,
  preferred_meal_frequency INTEGER DEFAULT 4,
  allergies JSONB DEFAULT '[]'::jsonb,
  disliked_foods JSONB DEFAULT '[]'::jsonb,
  activity_level TEXT DEFAULT 'moderate',
  favorite_exercise_ids JSONB DEFAULT '[]'::jsonb,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workout Plans Table
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_name TEXT DEFAULT 'My Custom Split',
  template_id TEXT,
  days_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Diet Preferences Table
CREATE TABLE IF NOT EXISTS public.diet_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  active_plan JSONB,
  saved_plans JSONB DEFAULT '[]'::jsonb,
  kitchen_inventory JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Progress Records Table
CREATE TABLE IF NOT EXISTS public.progress_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id TEXT NOT NULL,
  date DATE NOT NULL,
  weight_kg NUMERIC NOT NULL,
  waist_cm NUMERIC,
  workouts_completed_count INTEGER DEFAULT 0,
  daily_calories NUMERIC,
  daily_protein NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT progress_records_user_entry_key UNIQUE (user_id, entry_id)
);

-- 5. Workout Logs Table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_of_week TEXT,
  completed BOOLEAN DEFAULT false,
  duration_minutes INTEGER,
  exercises JSONB DEFAULT '{}'::jsonb,
  feedback_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT workout_logs_user_date_key UNIQUE (user_id, date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Airtight RLS Policies ensuring users only access their own records
CREATE POLICY "profiles_user" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "workout_plans_user" ON public.workout_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "diet_preferences_user" ON public.diet_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_records_user" ON public.progress_records FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_logs_user" ON public.workout_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto trigger for user profile creation upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_onboarded)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), false)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) return;
    saveCustomConfig(urlInput.trim(), keyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-[#121614] border border-zinc-800 rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Supabase Integration & Database Setup
              </h2>
              <p className="text-xs text-zinc-400">Step-by-step setup guide for Authentication and Row Level Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isConfigured
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">
                  {isConfigured ? 'Supabase Client Connected' : 'Supabase Not Configured'}
                </p>
                <p className="text-xs opacity-90">
                  {isConfigured
                    ? `Active URL: ${supabaseUrl} (Source: ${configSource})`
                    : 'Provide your project URL and public anon key to enable persistent cloud authentication.'}
                </p>
              </div>
            </div>
            {isConfigured && configSource === 'custom' && (
              <button
                onClick={resetCustomConfig}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700"
              >
                Reset to Env
              </button>
            )}
          </div>

          {/* Quick Setup Steps */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-lime-400 text-black font-black flex items-center justify-center text-xs">
                1
              </span>
              Run Database Migration in Supabase SQL Editor
            </h3>
            <p className="text-xs text-zinc-400">
              Copy the complete schema below and paste it into your Supabase Dashboard under <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, then click <strong>Run</strong>. This creates all tables and RLS security policies.
            </p>

            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-lime-400" />
                  supabase/schema.sql
                </span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300 font-semibold bg-lime-500/10 px-2.5 py-1 rounded-md border border-lime-500/20 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-400 overflow-x-auto max-h-56 leading-relaxed">
                {sqlSchemaSnippet}
              </pre>
            </div>
          </div>

          {/* Step 2: Configure Credentials */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-lime-400 text-black font-black flex items-center justify-center text-xs">
                2
              </span>
              Configure Project Credentials
            </h3>
            <p className="text-xs text-zinc-400">
              You can set these in your `.env` file as <code className="text-lime-400">VITE_SUPABASE_URL</code> and <code className="text-lime-400">VITE_SUPABASE_ANON_KEY</code>, or test them instantly right here:
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Database className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Supabase Anon (Public) Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500">
                  Never enter service_role secret keys. Use only the public anon key.
                </span>
                <button
                  type="submit"
                  disabled={!urlInput || !keyInput}
                  className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {saveSuccess ? 'Saved & Connected!' : 'Apply Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
