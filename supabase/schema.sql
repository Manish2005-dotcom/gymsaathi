-- ==============================================================================
-- GYMSAATHI SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all required tables, handles new user signup triggers, and sets up
-- airtight Row Level Security so users can only ever view and edit their own data.
-- ==============================================================================

-- 1. PROFILES TABLE (Stores user metrics, dietary preferences, and fitness goals)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  age INTEGER DEFAULT 22,
  gender TEXT DEFAULT 'male',
  height_cm NUMERIC DEFAULT 174,
  weight_kg NUMERIC DEFAULT 68,
  target_weight_kg NUMERIC DEFAULT 72,
  experience TEXT DEFAULT 'beginner', -- 'beginner' | 'intermediate' | 'advanced'
  goal TEXT DEFAULT 'muscle_gain',    -- 'muscle_gain' | 'fat_loss' | 'general_fitness' | 'strength' | 'maintenance'
  diet_preference TEXT DEFAULT 'vegetarian', -- 'vegetarian' | 'eggetarian' | 'non_vegetarian'
  daily_budget_inr NUMERIC DEFAULT 200,
  workout_location TEXT DEFAULT 'gym', -- 'gym' | 'home'
  available_equipment JSONB DEFAULT '["full_gym","dumbbells","barbells","cables"]'::jsonb,
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

-- 2. WORKOUT PLANS TABLE (Stores 7-day customized workout split & assigned exercises)
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT DEFAULT 'My Custom Split',
  template_id TEXT,
  days_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT workout_plans_user_id_key UNIQUE (user_id)
);

-- 3. DIET PREFERENCES TABLE (Stores active meal plan, kitchen pantry, bookmarks)
CREATE TABLE IF NOT EXISTS public.diet_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  active_plan JSONB,
  saved_plans JSONB DEFAULT '[]'::jsonb,
  kitchen_inventory JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT diet_preferences_user_id_key UNIQUE (user_id)
);

-- 4. PROGRESS RECORDS TABLE (Stores weekly weigh-ins, body metrics, workout volume)
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

-- 5. WORKOUT LOGS TABLE (Stores day-by-day completed sets, reps, weight logs)
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- 2. Workout Plans RLS
DROP POLICY IF EXISTS "workout_plans_all_own" ON public.workout_plans;
CREATE POLICY "workout_plans_all_own" ON public.workout_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Diet Preferences RLS
DROP POLICY IF EXISTS "diet_preferences_all_own" ON public.diet_preferences;
CREATE POLICY "diet_preferences_all_own" ON public.diet_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Progress Records RLS
DROP POLICY IF EXISTS "progress_records_all_own" ON public.progress_records;
CREATE POLICY "progress_records_all_own" ON public.progress_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Workout Logs RLS
DROP POLICY IF EXISTS "workout_logs_all_own" ON public.workout_logs;
CREATE POLICY "workout_logs_all_own" ON public.workout_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    is_onboarded,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_progress_records_user_date ON public.progress_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON public.workout_logs(user_id, date);
