import React, { useState } from 'react';
import {
  Calculator,
  Flame,
  Info,
  ShieldAlert,
  Droplet,
  TrendingUp,
  Apple,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, FitnessGoal, ActivityLevel } from '../types/fitness';
import { calculateMacroTargets } from '../utils/fitnessCalculators';

interface CalculatorPageProps {
  profile: UserProfile;
  onApplyTargetsToProfile?: (targets: { targetCalories: number; targetProtein: number }) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ profile, onApplyTargetsToProfile }) => {
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);

  const results = calculateMacroTargets(
    { age, gender, heightCm, weightKg },
    activityLevel,
    goal
  );

  // Recommended daily water intake: ~35-40 ml per kg body weight in warm Indian climate
  const waterLiters = Number(((weightKg * 38) / 1000).toFixed(1));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Intro Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
          <Calculator className="w-4 h-4" />
          <span>Metabolic Science Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Calorie, Protein & BMI Calculator
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Based on the clinically validated <strong>Mifflin-St Jeor equation</strong> for Basal Metabolic Rate (BMR) with activity multipliers, goal-aligned progressive deficits/surpluses, and Asian-Indian BMI cardiovascular thresholds.
        </p>
      </div>

      {/* Input Parameters Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
        <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
          1. Your Body & Lifestyle Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Age (Years)</label>
            <input
              type="number"
              min="12"
              max="100"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-lime-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Biological Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-lime-400 text-sm"
            >
              <option value="male">Male (+5 kcal baseline)</option>
              <option value="female">Female (-161 kcal baseline)</option>
              <option value="other">Other / Neutral</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Height (cm)</label>
            <input
              type="number"
              min="100"
              max="240"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-lime-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="250"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-lime-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Daily Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-lime-400 text-sm"
            >
              <option value="sedentary">Sedentary (1.2x TDEE - Desk job)</option>
              <option value="light">Lightly Active (1.375x - 1-3 workouts)</option>
              <option value="moderate">Moderately Active (1.55x - 3-5 workouts)</option>
              <option value="very_active">Very Active (1.725x - 6-7 workouts)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Fitness Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-lime-400 text-sm"
            >
              <option value="muscle_gain">Muscle Gain (+350 kcal surplus)</option>
              <option value="fat_loss">Fat Loss (-400 kcal sustainable deficit)</option>
              <option value="general_fitness">General Fitness (Maintenance)</option>
              <option value="strength">Strength Focus (+200 kcal lean)</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Calculated Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Calories Card */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-lime-400">
            <Flame className="w-4 h-4" />
            <span>Target Energy</span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white">{results.targetCalories}</div>
            <div className="text-xs text-zinc-400 mt-1">Daily Calories (kcal/day)</div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">Basal Metabolic Rate (BMR):</span>
              <strong className="text-white">{results.bmr} kcal</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Maintenance TDEE:</span>
              <strong className="text-white">{results.maintenanceCalories} kcal</strong>
            </div>
          </div>
        </div>

        {/* Protein Target Card */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-lime-500/30 space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-lime-400">
            <Apple className="w-4 h-4" />
            <span>Optimal Protein</span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-lime-400">{results.targetProteinGrams}g</div>
            <div className="text-xs text-zinc-400 mt-1">
              Target Protein (~{Number((results.targetProteinGrams / weightKg).toFixed(1))}g per kg)
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-xs text-zinc-300">
            <p className="text-[11px] text-zinc-400">
              Protects muscle from catabolism during fat loss and fuels muscle protein synthesis during training.
            </p>
          </div>
        </div>

        {/* BMI & Screening Card */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-sky-400">
            <TrendingUp className="w-4 h-4" />
            <span>Body Mass Index (BMI)</span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white">{results.bmi}</div>
            <div className="text-xs font-bold text-sky-400 mt-1">{results.bmiCategory}</div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
            {results.bmiNote}
          </div>
        </div>
      </div>

      {/* Suggested Macro Grams Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <h3 className="text-base font-bold text-white">Daily Macronutrient Gram Ranges</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-lime-400 font-bold block">Protein</span>
            <span className="text-xl font-black text-white block">{results.targetProteinGrams} grams</span>
            <span className="text-zinc-400 block text-[11px]">{results.targetProteinGrams * 4} kcal (~25-30%)</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-amber-400 font-bold block">Carbohydrates</span>
            <span className="text-xl font-black text-white block">{results.targetCarbsGrams} grams</span>
            <span className="text-zinc-400 block text-[11px]">{results.targetCarbsGrams * 4} kcal (~45-50%)</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-sky-400 font-bold block">Dietary Fats</span>
            <span className="text-xl font-black text-white block">{results.targetFatsGrams} grams</span>
            <span className="text-zinc-400 block text-[11px]">{results.targetFatsGrams * 9} kcal (~25%)</span>
          </div>
        </div>
      </div>

      {/* Hydration Recommendation */}
      <div className="p-5 rounded-2xl bg-sky-950/20 border border-sky-900/30 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-white text-sm block">Daily Hydration Target</strong>
            <span className="text-zinc-300">
              Drink approximately <strong className="text-sky-300">{waterLiters} Liters</strong> of clean water daily for your body weight, especially on heavy lifting days.
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Medical Disclaimers (Prompt Section 10 Requirement) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Important Health & Medical Considerations</span>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-400 leading-relaxed list-disc list-inside">
          <li>
            <strong>BMI Disclaimer:</strong> BMI is merely a general screening metric based on total mass and stature. It cannot distinguish between lean muscle tissue, bone density, and visceral adipose tissue. Muscular athletes often register as "overweight" on BMI despite having low body fat.
          </li>
          <li>
            <strong>Youth & Minors (&lt; 18 years):</strong> Teenagers are still undergoing skeletal development. Avoid aggressive calorie cutting and focus on nutrient-dense meals and progressive resistance training.
          </li>
          <li>
            <strong>Disordered Eating & Special Conditions:</strong> If you have a personal history of eating disorders, are pregnant, nursing, or managing chronic metabolic conditions (like Type 1/2 diabetes or renal conditions), consult a registered dietitian and physician before adopting prescribed calorie ceilings.
          </li>
          <li>
            <strong>No Extreme Deficits:</strong> Starvation diets (&lt; 1200 kcal for women, &lt; 1500 kcal for men) trigger thyroid down-regulation, muscle loss, and severe rebound weight gain.
          </li>
        </ul>
      </div>
    </div>
  );
};
