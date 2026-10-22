import {
  AppSettings,
  DayWorkoutSession,
  Exercise,
  GeneratedDietPlan,
  KitchenIngredientItem,
  ProgressEntry,
  UserProfile,
  WeeklyCustomPlan,
} from '../types/fitness';
import { getDefaultWeeklyCustomPlan } from '../data/workoutTemplates';

const STORAGE_KEYS = {
  PROFILE: 'gymsaathi_user_profile',
  WORKOUT_LOGS: 'gymsaathi_workout_logs',
  KITCHEN_INVENTORY: 'gymsaathi_kitchen_inventory',
  SAVED_DIET_PLANS: 'gymsaathi_saved_diet_plans',
  ACTIVE_DIET_PLAN: 'gymsaathi_active_diet_plan',
  PROGRESS_ENTRIES: 'gymsaathi_progress_entries',
  SETTINGS: 'gymsaathi_settings',
  CUSTOM_WORKOUT_PLAN: 'gymsaathi_custom_workout_plan',
  FAVORITE_EXERCISES: 'gymsaathi_favorite_exercises',
  CUSTOM_EXERCISES: 'gymsaathi_custom_exercises',
} as const;

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Aman Sharma',
  age: 22,
  gender: 'male',
  heightCm: 174,
  weightKg: 68,
  targetWeightKg: 72,
  experience: 'beginner',
  goal: 'muscle_gain',
  dietPreference: 'vegetarian',
  dailyBudgetInr: 200,
  workoutLocation: 'gym',
  availableEquipment: ['full_gym', 'dumbbells', 'barbells', 'cables'],
  workoutTimeMinutes: 60,
  preferredMealFrequency: 4,
  allergies: [],
  dislikedFoods: [],
  activityLevel: 'moderate',
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_KITCHEN_INVENTORY: KitchenIngredientItem[] = [
  { id: 'ing-1', name: 'Eggs', category: 'protein', dietType: 'eggetarian', quantity: 6, unit: 'count' },
  { id: 'ing-2', name: 'Toned Milk', category: 'protein', dietType: 'vegetarian', quantity: 500, unit: 'ml' },
  { id: 'ing-3', name: 'Fresh Paneer', category: 'protein', dietType: 'vegetarian', quantity: 200, unit: 'g' },
  { id: 'ing-4', name: 'Soy Chunks', category: 'protein', dietType: 'vegetarian', quantity: 150, unit: 'g' },
  { id: 'ing-5', name: 'Rolled Oats', category: 'carbs', dietType: 'vegetarian', quantity: 250, unit: 'g' },
  { id: 'ing-6', name: 'Whole Wheat Atta / Roti', category: 'carbs', dietType: 'vegetarian', quantity: 500, unit: 'g' },
  { id: 'ing-7', name: 'White Rice', category: 'carbs', dietType: 'vegetarian', quantity: 500, unit: 'g' },
  { id: 'ing-8', name: 'Yellow Moong Dal', category: 'protein', dietType: 'vegetarian', quantity: 250, unit: 'g' },
  { id: 'ing-9', name: 'Roasted Peanuts', category: 'fats', dietType: 'vegetarian', quantity: 150, unit: 'g' },
  { id: 'ing-10', name: 'Ripe Bananas', category: 'fruits_veggies', dietType: 'vegetarian', quantity: 4, unit: 'count' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  weightUnit: 'kg',
  heightUnit: 'cm',
  theme: 'dark',
  enableReminders: false,
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed reading from localStorage [${key}]:`, err);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed writing to localStorage [${key}]:`, err);
  }
}

export const StorageService = {
  // Profile
  getProfile(): UserProfile {
    return safeGetItem<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_USER_PROFILE);
  },
  saveProfile(profile: UserProfile): void {
    safeSetItem(STORAGE_KEYS.PROFILE, { ...profile, updatedAt: new Date().toISOString() });
  },

  // Workout Logs
  getWorkoutLogs(): Record<string, DayWorkoutSession> {
    return safeGetItem<Record<string, DayWorkoutSession>>(STORAGE_KEYS.WORKOUT_LOGS, {});
  },
  saveWorkoutSession(session: DayWorkoutSession): void {
    const logs = this.getWorkoutLogs();
    logs[session.date] = session;
    safeSetItem(STORAGE_KEYS.WORKOUT_LOGS, logs);
  },
  getWorkoutSession(date: string): DayWorkoutSession | undefined {
    const logs = this.getWorkoutLogs();
    return logs[date];
  },

  // Kitchen Inventory
  getKitchenInventory(): KitchenIngredientItem[] {
    return safeGetItem<KitchenIngredientItem[]>(STORAGE_KEYS.KITCHEN_INVENTORY, DEFAULT_KITCHEN_INVENTORY);
  },
  saveKitchenInventory(inventory: KitchenIngredientItem[]): void {
    safeSetItem(STORAGE_KEYS.KITCHEN_INVENTORY, inventory);
  },

  // Diet Plans
  getSavedDietPlans(): GeneratedDietPlan[] {
    return safeGetItem<GeneratedDietPlan[]>(STORAGE_KEYS.SAVED_DIET_PLANS, []);
  },
  saveDietPlan(plan: GeneratedDietPlan): void {
    const plans = this.getSavedDietPlans().filter((p) => p.id !== plan.id);
    plans.unshift(plan);
    safeSetItem(STORAGE_KEYS.SAVED_DIET_PLANS, plans);
    this.setActiveDietPlan(plan);
  },
  getActiveDietPlan(): GeneratedDietPlan | null {
    return safeGetItem<GeneratedDietPlan | null>(STORAGE_KEYS.ACTIVE_DIET_PLAN, null);
  },
  setActiveDietPlan(plan: GeneratedDietPlan | null): void {
    safeSetItem(STORAGE_KEYS.ACTIVE_DIET_PLAN, plan);
  },
  deleteSavedDietPlan(planId: string): void {
    const plans = this.getSavedDietPlans().filter((p) => p.id !== planId);
    safeSetItem(STORAGE_KEYS.SAVED_DIET_PLANS, plans);
    const active = this.getActiveDietPlan();
    if (active && active.id === planId) {
      this.setActiveDietPlan(plans[0] || null);
    }
  },

  // Progress Entries
  getProgressEntries(): ProgressEntry[] {
    return safeGetItem<ProgressEntry[]>(STORAGE_KEYS.PROGRESS_ENTRIES, []);
  },
  saveProgressEntry(entry: ProgressEntry): void {
    const entries = this.getProgressEntries().filter((e) => e.id !== entry.id && e.date !== entry.date);
    entries.push(entry);
    // Sort ascending by date
    entries.sort((a, b) => a.date.localeCompare(b.date));
    safeSetItem(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  },
  deleteProgressEntry(id: string): void {
    const entries = this.getProgressEntries().filter((e) => e.id !== id);
    safeSetItem(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  },

  // Settings
  getSettings(): AppSettings {
    return safeGetItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings: AppSettings): void {
    safeSetItem(STORAGE_KEYS.SETTINGS, settings);
  },

  // Custom 7-Day Workout Plan
  getCustomWorkoutPlan(): WeeklyCustomPlan {
    return safeGetItem<WeeklyCustomPlan>(
      STORAGE_KEYS.CUSTOM_WORKOUT_PLAN,
      getDefaultWeeklyCustomPlan()
    );
  },
  saveCustomWorkoutPlan(plan: WeeklyCustomPlan): void {
    safeSetItem(STORAGE_KEYS.CUSTOM_WORKOUT_PLAN, {
      ...plan,
      updatedAt: new Date().toISOString(),
    });
  },

  // Favorite Exercises
  getFavoriteExercises(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.FAVORITE_EXERCISES, [
      'barbell-bench-press',
      'squat',
      'lat-pulldown',
      'bicep-curl',
    ]);
  },
  saveFavoriteExercises(favorites: string[]): void {
    safeSetItem(STORAGE_KEYS.FAVORITE_EXERCISES, favorites);
  },
  toggleFavoriteExercise(exerciseId: string): string[] {
    const favs = this.getFavoriteExercises();
    const exists = favs.includes(exerciseId);
    const updated = exists ? favs.filter((id) => id !== exerciseId) : [...favs, exerciseId];
    this.saveFavoriteExercises(updated);
    return updated;
  },

  // Custom User-Created Exercises
  getCustomExercises(): Exercise[] {
    return safeGetItem<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
  },
  saveCustomExercise(exercise: Exercise): void {
    const current = this.getCustomExercises().filter((e) => e.id !== exercise.id);
    current.unshift(exercise);
    safeSetItem(STORAGE_KEYS.CUSTOM_EXERCISES, current);
  },
  deleteCustomExercise(exerciseId: string): void {
    const current = this.getCustomExercises().filter((e) => e.id !== exerciseId);
    safeSetItem(STORAGE_KEYS.CUSTOM_EXERCISES, current);
  },

  // Export JSON Backup
  exportAllData(): string {
    const data = {
      profile: this.getProfile(),
      workoutLogs: this.getWorkoutLogs(),
      customWorkoutPlan: this.getCustomWorkoutPlan(),
      favoriteExercises: this.getFavoriteExercises(),
      customExercises: this.getCustomExercises(),
      kitchenInventory: this.getKitchenInventory(),
      savedDietPlans: this.getSavedDietPlans(),
      activeDietPlan: this.getActiveDietPlan(),
      progressEntries: this.getProgressEntries(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.2.0',
    };
    return JSON.stringify(data, null, 2);
  },

  // Import JSON Backup
  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) safeSetItem(STORAGE_KEYS.PROFILE, parsed.profile);
      if (parsed.workoutLogs) safeSetItem(STORAGE_KEYS.WORKOUT_LOGS, parsed.workoutLogs);
      if (parsed.customWorkoutPlan) safeSetItem(STORAGE_KEYS.CUSTOM_WORKOUT_PLAN, parsed.customWorkoutPlan);
      if (parsed.favoriteExercises) safeSetItem(STORAGE_KEYS.FAVORITE_EXERCISES, parsed.favoriteExercises);
      if (parsed.customExercises) safeSetItem(STORAGE_KEYS.CUSTOM_EXERCISES, parsed.customExercises);
      if (parsed.kitchenInventory) safeSetItem(STORAGE_KEYS.KITCHEN_INVENTORY, parsed.kitchenInventory);
      if (parsed.savedDietPlans) safeSetItem(STORAGE_KEYS.SAVED_DIET_PLANS, parsed.savedDietPlans);
      if (parsed.activeDietPlan) safeSetItem(STORAGE_KEYS.ACTIVE_DIET_PLAN, parsed.activeDietPlan);
      if (parsed.progressEntries) safeSetItem(STORAGE_KEYS.PROGRESS_ENTRIES, parsed.progressEntries);
      if (parsed.settings) safeSetItem(STORAGE_KEYS.SETTINGS, parsed.settings);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  // Clear all data with reset
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WORKOUT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_WORKOUT_PLAN);
    localStorage.removeItem(STORAGE_KEYS.FAVORITE_EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.KITCHEN_INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.SAVED_DIET_PLANS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_DIET_PLAN);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
