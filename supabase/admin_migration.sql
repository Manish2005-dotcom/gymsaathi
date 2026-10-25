-- ==============================================================================
-- GYMSAATHI ADMIN SYSTEM & SHARED CONTENT MIGRATION SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It adds server-enforced role authorization, published exercises, workout templates,
-- food databases, theme settings, homepage content, audit logs, and storage policies.
-- ==============================================================================

-- 1. USER ROLES TABLE (Server-Enforced RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Definer function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "user_roles_read_own" ON public.user_roles;
CREATE POLICY "user_roles_read_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
CREATE POLICY "user_roles_admin_manage" ON public.user_roles
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. PUBLISHED EXERCISES TABLE (Admin Managed Content)
CREATE TABLE IF NOT EXISTS public.public_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  primary_muscle TEXT NOT NULL,
  secondary_muscles JSONB DEFAULT '[]'::jsonb,
  equipment TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  instructions JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  form_tips JSONB DEFAULT '[]'::jsonb,
  default_sets INTEGER DEFAULT 3,
  default_reps TEXT DEFAULT '10-12',
  duration_seconds INTEGER DEFAULT 60,
  demonstration_url TEXT,
  demonstration_type TEXT DEFAULT 'animation', -- 'animation' | 'video' | 'gif'
  animation_key TEXT,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.public_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_exercises_read" ON public.public_exercises;
CREATE POLICY "public_exercises_read" ON public.public_exercises
  FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "public_exercises_admin_write" ON public.public_exercises;
CREATE POLICY "public_exercises_admin_write" ON public.public_exercises
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. PUBLISHED WORKOUT TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.public_workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  split_type TEXT NOT NULL,
  days_per_week INTEGER DEFAULT 4,
  difficulty TEXT DEFAULT 'beginner',
  goal TEXT DEFAULT 'muscle_gain',
  days_data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.public_workout_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_templates_read" ON public.public_workout_templates;
CREATE POLICY "public_templates_read" ON public.public_workout_templates
  FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "public_templates_admin_write" ON public.public_workout_templates;
CREATE POLICY "public_templates_admin_write" ON public.public_workout_templates
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. PUBLISHED FOOD ITEMS AND RECIPES
CREATE TABLE IF NOT EXISTS public.public_food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hindi_name TEXT,
  category TEXT NOT NULL,
  diet_type TEXT NOT NULL,
  serving_unit TEXT NOT NULL,
  serving_grams NUMERIC NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fats NUMERIC NOT NULL,
  approx_cost_inr NUMERIC DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.public_food_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_foods_read" ON public.public_food_items;
CREATE POLICY "public_foods_read" ON public.public_food_items
  FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "public_foods_admin_write" ON public.public_food_items;
CREATE POLICY "public_foods_admin_write" ON public.public_food_items
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. APP THEME SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_theme_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_theme',
  accent_color TEXT DEFAULT '#84CC16',
  accent_name TEXT DEFAULT 'Neon Lime',
  appearance TEXT DEFAULT 'dark',
  border_radius TEXT DEFAULT 'rounded-2xl',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_theme_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "theme_read_all" ON public.app_theme_settings;
CREATE POLICY "theme_read_all" ON public.app_theme_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "theme_admin_write" ON public.app_theme_settings;
CREATE POLICY "theme_admin_write" ON public.app_theme_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Insert default theme row if not exists
INSERT INTO public.app_theme_settings (id, accent_color, accent_name, appearance)
VALUES ('global_theme', '#84CC16', 'Neon Lime', 'dark')
ON CONFLICT (id) DO NOTHING;

-- 6. HOMEPAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'main_banner',
  hero_badge TEXT DEFAULT 'Built for Gym Beginners & Students in India',
  hero_title TEXT DEFAULT 'Your Fitness Journey Starts Here.',
  hero_subtitle TEXT DEFAULT 'Personalized Indian workout splits, affordable nutrition plans, and animated technique demonstrations.',
  announcement_banner TEXT DEFAULT '⚡ New: Custom 7-Day Workout Builder with 2D Animated Exercises & Admin Console!',
  is_announcement_active BOOLEAN DEFAULT true,
  featured_workout_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "homepage_read_all" ON public.homepage_content;
CREATE POLICY "homepage_read_all" ON public.homepage_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "homepage_admin_write" ON public.homepage_content;
CREATE POLICY "homepage_admin_write" ON public.homepage_content
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.homepage_content (id, hero_badge, hero_title, hero_subtitle, announcement_banner, is_announcement_active)
VALUES (
  'main_banner',
  'Built for Gym Beginners & Students in India',
  'Your Fitness Journey Starts Here.',
  'Personalized Indian workout splits, affordable nutrition plans, and animated technique demonstrations.',
  '⚡ New: Custom 7-Day Workout Builder with 2D Animated Exercises & Admin Console!',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 7. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  admin_email TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_admin_only" ON public.admin_audit_logs;
CREATE POLICY "audit_logs_admin_only" ON public.admin_audit_logs
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8. GRANT INITIAL ADMIN ROLE TO SITE OWNER
-- Automatically grants admin privileges to the project owner
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'manishmaury2005@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Auto-assign 'user' role trigger for newly created auth accounts
CREATE OR REPLACE FUNCTION public.handle_user_role_assignment()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
  VALUES (
    new.id,
    CASE WHEN new.email = 'manishmaury2005@gmail.com' THEN 'admin' ELSE 'user' END,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_role_assignment();
