import {
  MuscleGroup,
  EquipmentType,
  ExerciseDifficulty,
  FitnessGoal,
  DayKey,
  CustomDayPlan,
} from './fitness';

export type UserRoleType = 'user' | 'admin' | 'superadmin';

export interface UserRoleRecord {
  userId: string;
  role: UserRoleType;
  createdAt: string;
  updatedAt: string;
  email?: string;
  fullName?: string;
}

export interface PublicExercise {
  id: string;
  slug: string;
  name: string;
  description: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: string[];
  equipment: EquipmentType;
  difficulty: ExerciseDifficulty;
  instructions: string[];
  commonMistakes: string[];
  formTips: string[];
  defaultSets: number;
  defaultReps: string;
  durationSeconds: number;
  demonstrationUrl?: string;
  demonstrationType: 'animation' | 'video' | 'gif';
  animationKey?: string;
  isPublished: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicWorkoutTemplate {
  id: string;
  title: string;
  description: string;
  splitType: string;
  daysPerWeek: number;
  difficulty: ExerciseDifficulty;
  goal: FitnessGoal;
  daysData: Record<DayKey, CustomDayPlan>;
  isPublished: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicFoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'protein' | 'carbs' | 'fats' | 'fruits_veggies' | 'dairy';
  dietType: 'vegetarian' | 'eggetarian' | 'non_vegetarian';
  servingUnit: string;
  servingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  approxCostInr: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AppThemeSettings {
  id: string;
  accentColor: string; // e.g. '#84CC16'
  accentName: string; // 'Neon Lime', 'Emerald', 'Cyber Green', etc.
  appearance: 'dark' | 'light';
  borderRadius: string; // 'rounded-2xl', 'rounded-xl', 'rounded-lg'
  updatedBy?: string;
  updatedAt: string;
}

export interface HomepageContent {
  id: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  announcementBanner: string;
  isAnnouncementActive: boolean;
  featuredWorkoutId?: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId?: string;
  adminEmail?: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalExercises: number;
  publishedExercises: number;
  totalTemplates: number;
  totalFoods: number;
  recentAuditLogs: AdminAuditLog[];
}

export type AdminTab =
  | 'dashboard'
  | 'exercises'
  | 'workouts'
  | 'foods'
  | 'theme'
  | 'media'
  | 'homepage'
  | 'users';
