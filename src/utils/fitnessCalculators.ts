import { ActivityLevel, FitnessGoal } from '../types/fitness';

export interface BMRCalculationParams {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
}

export interface MacroTargetResult {
  bmr: number;
  maintenanceCalories: number;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  bmi: number;
  bmiCategory: string;
  bmiNote: string;
  warningNotes: string[];
}

/**
 * Standard Mifflin-St Jeor equation for Basal Metabolic Rate (BMR)
 * Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
 * Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
 */
export function calculateBMR(params: BMRCalculationParams): number {
  const { age, gender, heightCm, weightKg } = params;
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    return 0;
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    return Math.round(base + 5);
  } else if (gender === 'female') {
    return Math.round(base - 161);
  }
  // Gender-neutral average
  return Math.round(base - 78);
}

/**
 * Activity Multiplier to convert BMR to Total Daily Energy Expenditure (TDEE)
 */
export function getActivityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case 'sedentary':
      return 1.2; // desk job, little exercise
    case 'light':
      return 1.375; // light exercise 1-3 days/week
    case 'moderate':
      return 1.55; // moderate exercise 3-5 days/week (typical gym goer)
    case 'very_active':
      return 1.725; // hard exercise 6-7 days/week or physical labor
    default:
      return 1.375;
  }
}

/**
 * Body Mass Index (BMI) = weight (kg) / (height (m))^2
 * Note: Asian Indian cut-offs recognize higher cardiometabolic risk at lower BMI:
 * Normal: 18.5 - 22.9, Overweight: 23 - 24.9, Obese: >= 25.
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string; note: string } {
  if (weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, category: 'Unknown', note: 'Please enter valid measurements.' };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 23) {
    category = 'Normal Range (Asian-Indian criteria)';
  } else if (bmi < 25) {
    category = 'Overweight (Borderline/At-Risk)';
  } else if (bmi < 30) {
    category = 'Overweight / Class I';
  } else {
    category = 'Obese';
  }

  const note = 'BMI is a rough screening metric and does not distinguish between muscle mass and fat mass.';
  return { bmi, category, note };
}

/**
 * Full macro & calorie targets according to fitness goals
 */
export function calculateMacroTargets(
  params: BMRCalculationParams,
  activityLevel: ActivityLevel,
  goal: FitnessGoal
): MacroTargetResult {
  const bmr = calculateBMR(params);
  const multiplier = getActivityMultiplier(activityLevel);
  const maintenanceCalories = Math.round(bmr * multiplier);

  let calorieAdjustment = 0;
  // Protein multiplier in g per kg bodyweight
  // Muscle Gain / Strength: 1.6 - 2.0 g/kg
  // Fat Loss (preserve muscle during deficit): 1.6 - 2.2 g/kg
  // Maintenance / General Fitness: 1.2 - 1.6 g/kg
  let proteinPerKg = 1.6;

  switch (goal) {
    case 'muscle_gain':
      calorieAdjustment = 350; // Moderate clean surplus (+350 kcal)
      proteinPerKg = 1.8;
      break;
    case 'fat_loss':
      calorieAdjustment = -400; // Sustainable moderate deficit (-400 kcal)
      proteinPerKg = 1.8;
      break;
    case 'strength':
      calorieAdjustment = 200; // Small surplus for strength progression
      proteinPerKg = 1.8;
      break;
    case 'general_fitness':
      calorieAdjustment = 0;
      proteinPerKg = 1.4;
      break;
    case 'maintenance':
    default:
      calorieAdjustment = 0;
      proteinPerKg = 1.4;
      break;
  }

  let targetCalories = maintenanceCalories + calorieAdjustment;

  const warningNotes: string[] = [];

  // Safety floor checks
  const minSafeFloor = params.gender === 'female' ? 1200 : 1500;
  if (targetCalories < minSafeFloor && params.weightKg > 35) {
    targetCalories = minSafeFloor;
    warningNotes.push(`Calorie target adjusted to the safe minimum floor of ${minSafeFloor} kcal/day to prevent metabolic slowdown.`);
  }

  if (params.age < 18) {
    warningNotes.push('For teenagers under 18, focus on nutritious balanced eating and progressive training rather than aggressive calorie restriction.');
  }

  // Protein target
  let targetProteinGrams = Math.round(params.weightKg * proteinPerKg);
  // Cap realistically for safety and Indian diet practicality (max 200g unless extreme elite)
  targetProteinGrams = Math.min(220, Math.max(50, targetProteinGrams));

  // Calories from protein = protein * 4
  const proteinCalories = targetProteinGrams * 4;

  // Fat target: typically 20-30% of total calories (0.8 - 1.0 g per kg)
  // Let's use 25% of target calories for healthy hormonal balance
  const fatCalories = Math.round(targetCalories * 0.25);
  const targetFatsGrams = Math.round(fatCalories / 9);

  // Carbohydrate target: Remaining calories
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const targetCarbsGrams = Math.round(remainingCalories / 4);

  const { bmi, category: bmiCategory, note: bmiNote } = calculateBMI(params.weightKg, params.heightCm);

  return {
    bmr,
    maintenanceCalories,
    targetCalories,
    targetProteinGrams,
    targetCarbsGrams,
    targetFatsGrams,
    bmi,
    bmiCategory,
    bmiNote,
    warningNotes,
  };
}
