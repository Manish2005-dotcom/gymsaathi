export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'general_fitness' | 'strength' | 'maintenance';
export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced';
export type DietaryPreference = 'vegetarian' | 'eggetarian' | 'non_vegetarian';
export type WorkoutLocation = 'gym' | 'home';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  experience: FitnessExperience;
  goal: FitnessGoal;
  dietPreference: DietaryPreference;
  dailyBudgetInr: number;
  workoutLocation: WorkoutLocation;
  availableEquipment: string[];
  workoutTimeMinutes: number;
  preferredMealFrequency: number;
  allergies: string[];
  dislikedFoods: string[];
  activityLevel: ActivityLevel;
  favoriteExerciseIds?: string[];
  updatedAt: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'biceps'
  | 'triceps'
  | 'shoulders'
  | 'abs'
  | 'legs'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'forearms'
  | 'full_body'
  | 'cardio'
  | 'mobility';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'bands'
  | 'bench'
  | 'pullup_bar'
  | 'cardio_machine';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: string[];
  targetMuscleDisplay: string;
  equipment: EquipmentType;
  equipmentDisplay: string;
  difficulty: ExerciseDifficulty;
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  daySplit: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'all';
  setup: string;
  bodyAlignment: string;
  movementSteps: string[];
  breathing: string;
  postureCues: string[];
  commonMistakes: string[];
  injuryPreventionTips: string[];
  beginnerAlternative: string;
  homeAlternative: string;
  videoUrl?: string; // genuine embed if verified
  videoSearchQuery: string; // fallback search query
  videoSource: string;
  isVerifiedEmbed: boolean;
  isCustom?: boolean;
}

// ---------------- CUSTOM WORKOUT PLAN TYPES ----------------

export interface CustomDayExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type WorkoutIntensity = 'light' | 'moderate' | 'high' | 'extreme';

export interface CustomDayPlan {
  dayKey: DayKey;
  dayName: string; // "Monday", "Tuesday", etc.
  isRestDay: boolean;
  muscleGroups: MuscleGroup[];
  targetTitle: string; // e.g. "Chest + Triceps" or "Rest & Recovery"
  durationMinutes: number;
  intensity: WorkoutIntensity;
  exercises: CustomDayExercise[];
  customNotes?: string;
}

export interface WeeklyCustomPlan {
  id: string;
  name: string;
  templateId?: string;
  days: Record<DayKey, CustomDayPlan>;
  updatedAt: string;
}

export interface WorkoutSplitTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  experienceLevel: FitnessExperience;
  planFactory: () => Record<DayKey, CustomDayPlan>;
}

// ---------------- ANIMATED EXERCISE DEMONSTRATION TYPES ----------------

export type AnimationView = 'front' | 'side';

export interface JointPosition2D {
  head: [number, number];
  neck: [number, number];
  chest: [number, number];
  pelvis: [number, number];
  leftShoulder: [number, number];
  leftElbow: [number, number];
  leftWrist: [number, number];
  rightShoulder: [number, number];
  rightElbow: [number, number];
  rightWrist: [number, number];
  leftHip: [number, number];
  leftKnee: [number, number];
  leftAnkle: [number, number];
  rightHip: [number, number];
  rightKnee: [number, number];
  rightAnkle: [number, number];
  // Optional equipment props
  barbell?: [number, number, number, number]; // [x1, y1, x2, y2]
  leftDumbbell?: [number, number]; // [x, y]
  rightDumbbell?: [number, number];
  cablePulley?: [number, number, number, number]; // [originX, originY, handleX, handleY]
  bench?: { x: number; y: number; width: number; height: number; angle?: number };
  floorMat?: boolean;
}

export interface AnimationPhase {
  name: string; // e.g. "1. Starting Position", "2. Eccentric Descent", "3. Deep Stretch", "4. Concentric Lift"
  phaseType: 'setup' | 'eccentric' | 'stretch' | 'concentric' | 'contraction';
  cue: string;
  durationPercent: number; // e.g. 25, 25, 25, 25
  joints: JointPosition2D;
}

export interface ExerciseAnimationDef {
  exerciseId: string;
  exerciseName: string;
  defaultView: AnimationView;
  supportedViews: AnimationView[];
  durationSeconds: number; // e.g. 3.0s per complete rep
  targetMuscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  phases: AnimationPhase[];
  formTips: string[];
  mistakesToAvoid: string[];
}

// ---------------- WORKOUT LOGGING & EXECUTION ----------------

export interface SetLogItem {
  setNumber: number;
  completed: boolean;
  weightKg?: number;
  repsCompleted?: number;
}

export interface WorkoutLogEntry {
  exerciseId: string;
  completed: boolean;
  actualWeightKg?: number;
  actualReps?: string;
  notes?: string;
  setLogs?: SetLogItem[];
}

export interface DayWorkoutSession {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  completed: boolean;
  completedAt?: string;
  durationMinutes?: number;
  exercises: Record<string, WorkoutLogEntry>;
  feedbackNotes?: string;
}

// ---------------- DIET & FOOD TYPES ----------------

export interface FoodItem {
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
  commonInIndia: boolean;
}

export interface MealFoodItem {
  foodId: string;
  name: string;
  portionMultiplier: number;
  servingDescription: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  costInr: number;
}

export interface DietMeal {
  id: string;
  type: 'breakfast' | 'mid_morning' | 'lunch' | 'evening_snack' | 'pre_workout' | 'post_workout' | 'dinner';
  title: string;
  suggestedTime: string;
  foods: MealFoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalCostInr: number;
  completed?: boolean;
}

export interface GeneratedDietPlan {
  id: string;
  generatedAt: string;
  mode: 'automatic' | 'kitchen_inventory';
  goal: FitnessGoal;
  dietPreference: DietaryPreference;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  actualCalories: number;
  actualProtein: number;
  actualCarbs: number;
  actualFats: number;
  totalEstimatedCostInr: number;
  meals: DietMeal[];
  notes: string[];
  missingGaps?: string[];
  ingredientUsageSummary?: {
    ingredientName: string;
    usedAmount: string;
    remainingAmount?: string;
  }[];
}

export interface KitchenIngredientItem {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'fats' | 'fruits_veggies';
  dietType: 'vegetarian' | 'eggetarian' | 'non_vegetarian';
  quantity: number;
  unit: 'g' | 'ml' | 'count' | 'cups' | 'tbsp';
  foodRefId?: string;
}

export interface ProgressEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  waistCm?: number;
  workoutsCompletedCount: number;
  dailyCalories?: number;
  dailyProtein?: number;
  notes?: string;
}

export interface AppSettings {
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft_in';
  theme: 'dark';
  enableReminders: boolean;
  animationSpeed?: number;
  soundEnabled?: boolean;
}
