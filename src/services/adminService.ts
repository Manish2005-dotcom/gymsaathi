import { getSupabaseClient, resolveSupabaseCredentials } from './supabaseClient';
import {
  PublicExercise,
  PublicWorkoutTemplate,
  PublicFoodItem,
  HomepageContent,
  AdminAuditLog,
  AdminStats,
  UserRoleRecord,
  UserRoleType,
} from '../types/admin';

export const AdminService = {
  /**
   * Log an administrative action to admin_audit_logs
   */
  async logAction(
    action: string,
    targetType: string,
    targetId?: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const supabase = getSupabaseClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      await supabase.from('admin_audit_logs').insert({
        admin_id: authData.user.id,
        admin_email: authData.user.email,
        action,
        target_type: targetType,
        target_id: targetId,
        details: details || {},
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Failed to record admin audit log:', err);
    }
  },

  /**
   * Fetch aggregate admin statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    const defaultStats: AdminStats = {
      totalUsers: 1,
      activeUsers: 1,
      totalExercises: 0,
      publishedExercises: 0,
      totalTemplates: 0,
      totalFoods: 0,
      recentAuditLogs: [],
    };

    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return defaultStats;

    try {
      const supabase = getSupabaseClient();

      // Parallel count queries
      const [
        { count: userCount },
        { count: totalExCount },
        { count: pubExCount },
        { count: templateCount },
        { count: foodCount },
        { data: logsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('public_exercises').select('*', { count: 'exact', head: true }),
        supabase.from('public_exercises').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('public_workout_templates').select('*', { count: 'exact', head: true }),
        supabase.from('public_food_items').select('*', { count: 'exact', head: true }),
        supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
      ]);

      const recentLogs: AdminAuditLog[] = (logsData || []).map((row) => ({
        id: row.id,
        adminId: row.admin_id,
        adminEmail: row.admin_email,
        action: row.action,
        targetType: row.target_type,
        targetId: row.target_id,
        details: row.details,
        createdAt: row.created_at,
      }));

      return {
        totalUsers: Math.max(userCount || 1, 1),
        activeUsers: Math.max(userCount || 1, 1),
        totalExercises: totalExCount || 0,
        publishedExercises: pubExCount || 0,
        totalTemplates: templateCount || 0,
        totalFoods: foodCount || 0,
        recentAuditLogs: recentLogs,
      };
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      return defaultStats;
    }
  },

  /**
   * EXERCISE MANAGER
   */
  async getExercises(includeUnpublished = true): Promise<PublicExercise[]> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return [];

    try {
      const supabase = getSupabaseClient();
      let query = supabase.from('public_exercises').select('*').order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description || '',
        primaryMuscle: row.primary_muscle,
        secondaryMuscles: Array.isArray(row.secondary_muscles) ? row.secondary_muscles : [],
        equipment: row.equipment,
        difficulty: row.difficulty,
        instructions: Array.isArray(row.instructions) ? row.instructions : [],
        commonMistakes: Array.isArray(row.common_mistakes) ? row.common_mistakes : [],
        formTips: Array.isArray(row.form_tips) ? row.form_tips : [],
        defaultSets: row.default_sets || 3,
        defaultReps: row.default_reps || '10-12',
        durationSeconds: row.duration_seconds || 60,
        demonstrationUrl: row.demonstration_url || undefined,
        demonstrationType: row.demonstration_type || 'animation',
        animationKey: row.animation_key || undefined,
        isPublished: row.is_published ?? true,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      console.error('Failed to getExercises:', err);
      return [];
    }
  },

  async saveExercise(exercise: Partial<PublicExercise>): Promise<{ success: boolean; data?: PublicExercise; error?: string }> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return { success: false, error: 'Supabase not configured' };

    try {
      const supabase = getSupabaseClient();
      const { data: authData } = await supabase.auth.getUser();

      const payload = {
        name: exercise.name,
        slug: exercise.slug || exercise.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: exercise.description,
        primary_muscle: exercise.primaryMuscle,
        secondary_muscles: exercise.secondaryMuscles || [],
        equipment: exercise.equipment,
        difficulty: exercise.difficulty || 'beginner',
        instructions: exercise.instructions || [],
        common_mistakes: exercise.commonMistakes || [],
        form_tips: exercise.formTips || [],
        default_sets: exercise.defaultSets || 3,
        default_reps: exercise.defaultReps || '10-12',
        duration_seconds: exercise.durationSeconds || 60,
        demonstration_url: exercise.demonstrationUrl,
        demonstration_type: exercise.demonstrationType || 'animation',
        animation_key: exercise.animationKey,
        is_published: exercise.isPublished ?? true,
        created_by: authData?.user?.id,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (exercise.id) {
        result = await supabase.from('public_exercises').update(payload).eq('id', exercise.id).select().single();
        await this.logAction('update_exercise', 'exercise', exercise.id, { name: exercise.name });
      } else {
        result = await supabase.from('public_exercises').insert(payload).select().single();
        if (result.data?.id) {
          await this.logAction('create_exercise', 'exercise', result.data.id, { name: exercise.name });
        }
      }

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save exercise';
      return { success: false, error: message };
    }
  },

  async toggleExercisePublish(id: string, currentState: boolean): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('public_exercises')
        .update({ is_published: !currentState, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return false;
      await this.logAction(!currentState ? 'publish_exercise' : 'unpublish_exercise', 'exercise', id);
      return true;
    } catch {
      return false;
    }
  },

  async deleteExercise(id: string, name?: string): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('public_exercises').delete().eq('id', id);
      if (error) return false;
      await this.logAction('delete_exercise', 'exercise', id, { name });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * WORKOUT TEMPLATES MANAGER
   */
  async getWorkoutTemplates(includeUnpublished = true): Promise<PublicWorkoutTemplate[]> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return [];

    try {
      const supabase = getSupabaseClient();
      let query = supabase.from('public_workout_templates').select('*').order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        splitType: row.split_type,
        daysPerWeek: row.days_per_week || 4,
        difficulty: row.difficulty,
        goal: row.goal,
        daysData: row.days_data || {},
        isPublished: row.is_published ?? true,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      return [];
    }
  },

  async saveWorkoutTemplate(template: Partial<PublicWorkoutTemplate>): Promise<{ success: boolean; error?: string }> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return { success: false, error: 'Supabase not configured' };

    try {
      const supabase = getSupabaseClient();
      const { data: authData } = await supabase.auth.getUser();

      const payload = {
        title: template.title,
        description: template.description,
        split_type: template.splitType || 'Custom Split',
        days_per_week: template.daysPerWeek || 4,
        difficulty: template.difficulty || 'beginner',
        goal: template.goal || 'muscle_gain',
        days_data: template.daysData || {},
        is_published: template.isPublished ?? true,
        created_by: authData?.user?.id,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (template.id) {
        result = await supabase.from('public_workout_templates').update(payload).eq('id', template.id);
        await this.logAction('update_workout_template', 'workout_template', template.id, { title: template.title });
      } else {
        result = await supabase.from('public_workout_templates').insert(payload);
        await this.logAction('create_workout_template', 'workout_template', undefined, { title: template.title });
      }

      if (result.error) return { success: false, error: result.error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to save template' };
    }
  },

  async toggleTemplatePublish(id: string, currentState: boolean): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('public_workout_templates')
        .update({ is_published: !currentState, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return false;
      await this.logAction(!currentState ? 'publish_template' : 'unpublish_template', 'workout_template', id);
      return true;
    } catch {
      return false;
    }
  },

  async deleteWorkoutTemplate(id: string): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('public_workout_templates').delete().eq('id', id);
      if (error) return false;
      await this.logAction('delete_workout_template', 'workout_template', id);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * FOOD & DIET MANAGER
   */
  async getFoodItems(includeUnpublished = true): Promise<PublicFoodItem[]> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return [];

    try {
      const supabase = getSupabaseClient();
      let query = supabase.from('public_food_items').select('*').order('name', { ascending: true });
      if (!includeUnpublished) query = query.eq('is_published', true);

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((row) => ({
        id: row.id,
        name: row.name,
        hindiName: row.hindi_name || undefined,
        category: row.category,
        dietType: row.diet_type,
        servingUnit: row.serving_unit || 'g',
        servingGrams: Number(row.serving_grams) || 100,
        calories: Number(row.calories) || 0,
        protein: Number(row.protein) || 0,
        carbs: Number(row.carbs) || 0,
        fats: Number(row.fats) || 0,
        approxCostInr: Number(row.approx_cost_inr) || 0,
        isPublished: row.is_published ?? true,
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  },

  async saveFoodItem(food: Partial<PublicFoodItem>): Promise<{ success: boolean; error?: string }> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return { success: false, error: 'Supabase not configured' };

    try {
      const supabase = getSupabaseClient();
      const payload = {
        name: food.name,
        hindi_name: food.hindiName,
        category: food.category || 'protein',
        diet_type: food.dietType || 'vegetarian',
        serving_unit: food.servingUnit || 'g',
        serving_grams: food.servingGrams || 100,
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fats: food.fats || 0,
        approx_cost_inr: food.approxCostInr || 0,
        is_published: food.isPublished ?? true,
      };

      let result;
      if (food.id) {
        result = await supabase.from('public_food_items').update(payload).eq('id', food.id);
        await this.logAction('update_food', 'food_item', food.id, { name: food.name });
      } else {
        result = await supabase.from('public_food_items').insert(payload);
        await this.logAction('create_food', 'food_item', undefined, { name: food.name });
      }

      if (result.error) return { success: false, error: result.error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to save food' };
    }
  },

  async toggleFoodPublish(id: string, currentState: boolean): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('public_food_items').update({ is_published: !currentState }).eq('id', id);
      if (error) return false;
      await this.logAction(!currentState ? 'publish_food' : 'unpublish_food', 'food_item', id);
      return true;
    } catch {
      return false;
    }
  },

  async deleteFoodItem(id: string): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('public_food_items').delete().eq('id', id);
      if (error) return false;
      await this.logAction('delete_food', 'food_item', id);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * HOMEPAGE CONTENT MANAGER
   */
  async getHomepageContent(): Promise<HomepageContent> {
    const defaultContent: HomepageContent = {
      id: 'main_banner',
      heroBadge: 'Built for Gym Beginners & Students in India',
      heroTitle: 'Your Fitness Journey Starts Here.',
      heroSubtitle: 'Personalized Indian workout splits, affordable nutrition plans, and animated technique demonstrations.',
      announcementBanner: '⚡ New: Custom 7-Day Workout Builder with 2D Animated Exercises!',
      isAnnouncementActive: true,
      updatedAt: new Date().toISOString(),
    };

    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return defaultContent;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 'main_banner')
        .maybeSingle();

      if (error || !data) return defaultContent;

      return {
        id: data.id,
        heroBadge: data.hero_badge || defaultContent.heroBadge,
        heroTitle: data.hero_title || defaultContent.heroTitle,
        heroSubtitle: data.hero_subtitle || defaultContent.heroSubtitle,
        announcementBanner: data.announcement_banner || defaultContent.announcementBanner,
        isAnnouncementActive: data.is_announcement_active ?? true,
        featuredWorkoutId: data.featured_workout_id,
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch {
      return defaultContent;
    }
  },

  async saveHomepageContent(content: Partial<HomepageContent>): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('homepage_content').upsert({
        id: 'main_banner',
        hero_badge: content.heroBadge,
        hero_title: content.heroTitle,
        hero_subtitle: content.heroSubtitle,
        announcement_banner: content.announcementBanner,
        is_announcement_active: content.isAnnouncementActive,
        featured_workout_id: content.featuredWorkoutId,
        updated_at: new Date().toISOString(),
      });

      if (error) return false;
      await this.logAction('update_homepage_content', 'homepage', 'main_banner');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * USER & ROLE MANAGEMENT
   */
  async getRegisteredUsers(): Promise<UserRoleRecord[]> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return [];

    try {
      const supabase = getSupabaseClient();

      // Fetch profiles
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (pErr || !profiles) return [];

      // Fetch roles
      const { data: roles } = await supabase.from('user_roles').select('*');
      const roleMap = new Map<string, UserRoleType>();
      (roles || []).forEach((r) => roleMap.set(r.user_id, r.role as UserRoleType));

      return profiles.map((p) => ({
        userId: p.id,
        email: p.email,
        fullName: p.full_name,
        role: roleMap.get(p.id) || (p.email === 'manishmaury2005@gmail.com' ? 'admin' : 'user'),
        createdAt: p.created_at || new Date().toISOString(),
        updatedAt: p.updated_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },

  async updateUserRole(userId: string, newRole: UserRoleType, targetEmail?: string): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('user_roles').upsert({
        user_id: userId,
        role: newRole,
        updated_at: new Date().toISOString(),
      });

      if (error) return false;
      await this.logAction('change_user_role', 'user_role', userId, { newRole, email: targetEmail });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * MEDIA ASSET UPLOAD & VALIDATION
   */
  async uploadMediaAsset(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    // 1. Validation: Allowed MIME types
    const allowedTypes = ['image/gif', 'image/svg+xml', 'image/png', 'image/jpeg', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type "${file.type}". Allowed formats: GIF, MP4, WebM, SVG, PNG, JPG.`,
      };
    }

    // 2. Validation: File size limit (15 MB)
    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        success: false,
        error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed is 15 MB.`,
      };
    }

    const { isConfigured } = resolveSupabaseCredentials();

    try {
      if (isConfigured) {
        const supabase = getSupabaseClient();
        const fileExt = file.name.split('.').pop() || 'bin';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `exercises/${fileName}`;

        const { data, error } = await supabase.storage.from('exercise-media').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

        if (!error && data?.path) {
          const { data: publicUrlData } = supabase.storage.from('exercise-media').getPublicUrl(data.path);
          await this.logAction('upload_media', 'storage', data.path, { fileName: file.name, size: file.size });
          return { success: true, url: publicUrlData.publicUrl };
        }
      }

      // Safe fallback to Base64 data URL for offline preview/local sandbox
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, error: 'Failed to read media file.' });
        };
        reader.readAsDataURL(file);
      });
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Media upload failed' };
    }
  },
};
