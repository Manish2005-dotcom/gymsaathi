import { getSupabaseClient, resolveSupabaseCredentials } from './supabaseClient';
import {
  UserProfile,
  WeeklyCustomPlan,
  GeneratedDietPlan,
  KitchenIngredientItem,
  ProgressEntry,
  DayWorkoutSession,
} from '../types/fitness';

export const SupabaseDbService = {
  /**
   * Fetch profile from Supabase 'profiles' table
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return null;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching profile from Supabase:', error.message);
        return null;
      }
      if (!data) return null;

      const profile: UserProfile = {
        name: data.full_name || 'Fitness Enthusiast',
        email: data.email,
        age: data.age || 22,
        gender: data.gender || 'male',
        heightCm: Number(data.height_cm) || 174,
        weightKg: Number(data.weight_kg) || 68,
        targetWeightKg: data.target_weight_kg ? Number(data.target_weight_kg) : undefined,
        experience: data.experience || 'beginner',
        goal: data.goal || 'muscle_gain',
        dietPreference: data.diet_preference || 'vegetarian',
        dailyBudgetInr: Number(data.daily_budget_inr) || 200,
        workoutLocation: data.workout_location || 'gym',
        availableEquipment: Array.isArray(data.available_equipment)
          ? data.available_equipment
          : ['full_gym', 'dumbbells', 'barbells'],
        workoutTimeMinutes: data.workout_time_minutes || 60,
        preferredMealFrequency: data.preferred_meal_frequency || 4,
        allergies: Array.isArray(data.allergies) ? data.allergies : [],
        dislikedFoods: Array.isArray(data.disliked_foods) ? data.disliked_foods : [],
        activityLevel: data.activity_level || 'moderate',
        favoriteExerciseIds: Array.isArray(data.favorite_exercise_ids) ? data.favorite_exercise_ids : [],
        isOnboarded: data.is_onboarded ?? false,
        updatedAt: data.updated_at || new Date().toISOString(),
      };

      return profile;
    } catch (err) {
      console.error('Failed to getProfile from Supabase:', err);
      return null;
    }
  },

  /**
   * Upsert profile into Supabase 'profiles' table
   */
  async saveProfile(userId: string, profile: UserProfile): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const payload = {
        id: userId,
        email: profile.email,
        full_name: profile.name,
        age: profile.age,
        gender: profile.gender,
        height_cm: profile.heightCm,
        weight_kg: profile.weightKg,
        target_weight_kg: profile.targetWeightKg,
        experience: profile.experience,
        goal: profile.goal,
        diet_preference: profile.dietPreference,
        daily_budget_inr: profile.dailyBudgetInr,
        workout_location: profile.workoutLocation,
        available_equipment: profile.availableEquipment,
        workout_time_minutes: profile.workoutTimeMinutes,
        preferred_meal_frequency: profile.preferredMealFrequency,
        allergies: profile.allergies,
        disliked_foods: profile.dislikedFoods,
        activity_level: profile.activityLevel,
        favorite_exercise_ids: profile.favoriteExerciseIds || [],
        is_onboarded: profile.isOnboarded ?? true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Error saving profile to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to saveProfile to Supabase:', err);
      return false;
    }
  },

  /**
   * Fetch custom workout plan from Supabase 'workout_plans' table
   */
  async getWorkoutPlan(userId: string): Promise<WeeklyCustomPlan | null> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return null;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return {
        id: data.id,
        name: data.plan_name || 'My Custom Split',
        templateId: data.template_id,
        days: data.days_data,
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch (err) {
      console.error('Failed to getWorkoutPlan from Supabase:', err);
      return null;
    }
  },

  /**
   * Upsert custom workout plan
   */
  async saveWorkoutPlan(userId: string, plan: WeeklyCustomPlan): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('workout_plans').upsert(
        {
          user_id: userId,
          plan_name: plan.name,
          template_id: plan.templateId,
          days_data: plan.days,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) {
        console.warn('Error saving workout plan to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to saveWorkoutPlan to Supabase:', err);
      return false;
    }
  },

  /**
   * Fetch diet preferences
   */
  async getDietPreferences(userId: string): Promise<{
    activePlan: GeneratedDietPlan | null;
    savedPlans: GeneratedDietPlan[];
    kitchenInventory: KitchenIngredientItem[];
  } | null> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return null;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('diet_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return {
        activePlan: data.active_plan || null,
        savedPlans: Array.isArray(data.saved_plans) ? data.saved_plans : [],
        kitchenInventory: Array.isArray(data.kitchen_inventory) ? data.kitchen_inventory : [],
      };
    } catch (err) {
      console.error('Failed to getDietPreferences from Supabase:', err);
      return null;
    }
  },

  /**
   * Upsert diet preferences
   */
  async saveDietPreferences(
    userId: string,
    payload: {
      activePlan?: GeneratedDietPlan | null;
      savedPlans?: GeneratedDietPlan[];
      kitchenInventory?: KitchenIngredientItem[];
    }
  ): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('diet_preferences').upsert(
        {
          user_id: userId,
          active_plan: payload.activePlan,
          saved_plans: payload.savedPlans,
          kitchen_inventory: payload.kitchenInventory,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) {
        console.warn('Error saving diet preferences to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to saveDietPreferences to Supabase:', err);
      return false;
    }
  },

  /**
   * Fetch progress records
   */
  async getProgressEntries(userId: string): Promise<ProgressEntry[] | null> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return null;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('progress_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error || !data) return null;
      return data.map((row) => ({
        id: row.entry_id,
        date: row.date,
        weightKg: Number(row.weight_kg),
        waistCm: row.waist_cm ? Number(row.waist_cm) : undefined,
        workoutsCompletedCount: row.workouts_completed_count || 0,
        dailyCalories: row.daily_calories ? Number(row.daily_calories) : undefined,
        dailyProtein: row.daily_protein ? Number(row.daily_protein) : undefined,
        notes: row.notes || undefined,
      }));
    } catch (err) {
      console.error('Failed to getProgressEntries from Supabase:', err);
      return null;
    }
  },

  /**
   * Save progress entry
   */
  async saveProgressEntry(userId: string, entry: ProgressEntry): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('progress_records').upsert(
        {
          user_id: userId,
          entry_id: entry.id,
          date: entry.date,
          weight_kg: entry.weightKg,
          waist_cm: entry.waistCm,
          workouts_completed_count: entry.workoutsCompletedCount,
          daily_calories: entry.dailyCalories,
          daily_protein: entry.dailyProtein,
          notes: entry.notes,
        },
        { onConflict: 'user_id,entry_id' }
      );
      if (error) {
        console.warn('Error saving progress entry to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to saveProgressEntry to Supabase:', err);
      return false;
    }
  },

  /**
   * Delete progress entry
   */
  async deleteProgressEntry(userId: string, entryId: string): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('progress_records')
        .delete()
        .eq('user_id', userId)
        .eq('entry_id', entryId);

      if (error) {
        console.warn('Error deleting progress entry from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to deleteProgressEntry from Supabase:', err);
      return false;
    }
  },

  /**
   * Fetch workout logs
   */
  async getWorkoutLogs(userId: string): Promise<Record<string, DayWorkoutSession> | null> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return null;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) return null;
      const logs: Record<string, DayWorkoutSession> = {};
      data.forEach((row) => {
        logs[row.date] = {
          date: row.date,
          dayOfWeek: row.day_of_week || '',
          completed: row.completed,
          completedAt: row.completed_at || undefined,
          durationMinutes: row.duration_minutes || undefined,
          exercises: row.exercises || {},
          feedbackNotes: row.feedback_notes || undefined,
        };
      });
      return logs;
    } catch (err) {
      console.error('Failed to getWorkoutLogs from Supabase:', err);
      return null;
    }
  },

  /**
   * Save workout session
   */
  async saveWorkoutLog(userId: string, session: DayWorkoutSession): Promise<boolean> {
    const { isConfigured } = resolveSupabaseCredentials();
    if (!isConfigured) return false;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('workout_logs').upsert(
        {
          user_id: userId,
          date: session.date,
          day_of_week: session.dayOfWeek,
          completed: session.completed,
          duration_minutes: session.durationMinutes,
          exercises: session.exercises,
          feedback_notes: session.feedbackNotes,
          completed_at: session.completedAt || (session.completed ? new Date().toISOString() : null),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,date' }
      );

      if (error) {
        console.warn('Error saving workout log to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to saveWorkoutLog to Supabase:', err);
      return false;
    }
  },
};
