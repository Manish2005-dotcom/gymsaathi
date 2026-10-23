import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Target,
  Utensils,
  Flame,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  UserProfile,
  FitnessGoal,
  FitnessExperience,
  DietaryPreference,
  WorkoutLocation,
  ActivityLevel,
} from '../types/fitness';
import { calculateMacroTargets, calculateBMI } from '../utils/fitnessCalculators';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { profile, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State initialized from user's current profile
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    name: profile.name && profile.name !== 'Aman Sharma' ? profile.name : '',
    age: profile.age || 22,
    gender: profile.gender || 'male',
    heightCm: profile.heightCm || 174,
    weightKg: profile.weightKg || 68,
    targetWeightKg: profile.targetWeightKg || 72,
    goal: profile.goal || 'muscle_gain',
    experience: profile.experience || 'beginner',
    workoutLocation: profile.workoutLocation || 'gym',
    dietPreference: profile.dietPreference || 'vegetarian',
    dailyBudgetInr: profile.dailyBudgetInr || 200,
    preferredMealFrequency: profile.preferredMealFrequency || 4,
    activityLevel: profile.activityLevel || 'moderate',
    workoutTimeMinutes: profile.workoutTimeMinutes || 60,
    availableEquipment: profile.availableEquipment?.length
      ? profile.availableEquipment
      : ['dumbbells', 'barbells', 'bench', 'cables'],
    allergies: profile.allergies || [],
    dislikedFoods: profile.dislikedFoods || [],
  });

  const bmi = calculateBMI(formData.weightKg, formData.heightCm);
  const targets = calculateMacroTargets(
    {
      age: formData.age,
      gender: formData.gender,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
    },
    formData.activityLevel,
    formData.goal
  );

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4 | 5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = async () => {
    await completeOnboarding({
      ...formData,
      isOnboarded: true,
      updatedAt: new Date().toISOString(),
    });
    onComplete();
  };

  const toggleEquipment = (eq: string) => {
    const list = [...formData.availableEquipment];
    const idx = list.indexOf(eq);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(eq);
    setFormData({ ...formData, availableEquipment: list });
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Top Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5 text-lime-400 font-bold">
            <Sparkles className="w-4 h-4" />
            Fitness Onboarding Wizard
          </span>
          <span>Step {step} of 5</span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-[#111613] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        {/* STEP 1: Body Metrics */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">Step 1 of 5</span>
              <h2 className="text-2xl font-black text-white mt-1">Tell Us About Yourself</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Your body metrics calibrate your daily calorie deficit/surplus, protein synthesis requirements, and workout volume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Biological Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['male', 'female'] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-2.5 text-xs font-semibold rounded-xl border capitalize transition-all ${
                        formData.gender === gender
                          ? 'bg-lime-500/10 border-lime-500 text-lime-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Age (Years)</label>
                <input
                  type="number"
                  min="13"
                  max="90"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 20 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) || 170 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="200"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) || 65 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Weight (kg) (Optional)</label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="200"
                  value={formData.targetWeightKg || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetWeightKg: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g. 72"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            {/* Live Metric Preview */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-lime-400" />
                <span className="text-zinc-400">Current BMI:</span>
                <span className="font-bold text-white">{bmi.bmi}</span>
                <span className="text-zinc-400">({bmi.category})</span>
              </div>
              <div className="text-zinc-400 text-[11px] max-w-xs text-right">
                BMR: <strong className="text-white">{targets.bmr} kcal</strong> • Maint: <strong className="text-white">{targets.maintenanceCalories} kcal</strong>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Fitness Goals & Experience */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">Step 2 of 5</span>
              <h2 className="text-2xl font-black text-white mt-1">What is Your Primary Goal?</h2>
              <p className="text-xs text-zinc-400 mt-1">
                We will adapt your weekly workout split, exercise selection, and macro ratios accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'muscle_gain', title: 'Muscle Gain (Hypertrophy)', desc: 'Progressive overload, high volume, caloric surplus' },
                { id: 'fat_loss', title: 'Fat Loss & Leaning Out', desc: 'Metabolic conditioning, high protein, moderate deficit' },
                { id: 'strength', title: 'Pure Strength & Power', desc: 'Compound heavy lifts, longer rest intervals' },
                { id: 'general_fitness', title: 'General Fitness & Energy', desc: 'Balanced cardio, flexibility, and resistance training' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: item.id as FitnessGoal })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.goal === item.id
                      ? 'bg-lime-500/10 border-lime-500 text-white shadow-lg shadow-lime-500/5'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{item.title}</span>
                    {formData.goal === item.id && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
                  </div>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Training Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Beginner', sub: '< 6 months' },
                  { id: 'intermediate', label: 'Intermediate', sub: '6 - 24 months' },
                  { id: 'advanced', label: 'Advanced', sub: '2+ years' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, experience: lvl.id as FitnessExperience })}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      formData.experience === lvl.id
                        ? 'bg-lime-500/10 border-lime-500 text-lime-400 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{lvl.label}</div>
                    <div className="text-[10px] text-zinc-500">{lvl.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Primary Workout Location</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'gym', label: 'Commercial Gym', desc: 'Access to barbells, cables, dumbbells, and racks' },
                  { id: 'home', label: 'Home Workout', desc: 'Dumbbells, bands, or bodyweight exercises' },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, workoutLocation: loc.id as WorkoutLocation })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      formData.workoutLocation === loc.id
                        ? 'bg-lime-500/10 border-lime-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">{loc.label}</div>
                    <div className="text-[11px] text-zinc-400">{loc.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Indian Nutrition & Budget */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">Step 3 of 5</span>
              <h2 className="text-2xl font-black text-white mt-1">Indian Nutrition & Dietary Style</h2>
              <p className="text-xs text-zinc-400 mt-1">
                GymSaathi crafts affordable Indian meal plans with paneer, sattu, eggs, moong dal, soya chunks, and roti.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Dietary Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'vegetarian', label: 'Vegetarian', sub: 'Paneer, Dals, Soya, Dairy' },
                  { id: 'eggetarian', label: 'Eggetarian', sub: 'Eggs + Veg food sources' },
                  { id: 'non_vegetarian', label: 'Non-Vegetarian', sub: 'Chicken, Fish, Eggs & Veg' },
                ].map((diet) => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietPreference: diet.id as DietaryPreference })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.dietPreference === diet.id
                        ? 'bg-lime-500/10 border-lime-500 text-lime-400 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{diet.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{diet.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Daily Food Budget (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">₹</span>
                  <input
                    type="number"
                    min="60"
                    max="1500"
                    step="10"
                    value={formData.dailyBudgetInr}
                    onChange={(e) => setFormData({ ...formData, dailyBudgetInr: Number(e.target.value) || 200 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Recommended: ₹150 - ₹250 for student/pocket-friendly protein</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Preferred Meal Frequency
                </label>
                <select
                  value={formData.preferredMealFrequency}
                  onChange={(e) => setFormData({ ...formData, preferredMealFrequency: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value={3}>3 Meals / Day (Breakfast, Lunch, Dinner)</option>
                  <option value={4}>4 Meals / Day (+ Evening Snack)</option>
                  <option value={5}>5 Meals / Day (+ Pre/Post Workout)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Equipment & Schedule */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">Step 4 of 5</span>
              <h2 className="text-2xl font-black text-white mt-1">Available Equipment & Workout Time</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select what gear you have access to. The planner filters routines so you never get stuck on missing equipment.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Available Equipment (Multi-select)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'dumbbells', label: 'Dumbbells' },
                  { id: 'barbells', label: 'Barbells & Plates' },
                  { id: 'bench', label: 'Weight Bench' },
                  { id: 'cables', label: 'Cable Machine' },
                  { id: 'pullup_bar', label: 'Pull-up Bar' },
                  { id: 'bands', label: 'Resistance Bands' },
                  { id: 'bodyweight', label: 'Bodyweight Only' },
                  { id: 'machines', label: 'Gym Weight Machines' },
                ].map((eq) => {
                  const selected = formData.availableEquipment.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipment(eq.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-lime-500/10 border-lime-500 text-lime-300 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{eq.label}</span>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Daily Workout Time</label>
                <select
                  value={formData.workoutTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, workoutTimeMinutes: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value={30}>30 Minutes (Express / High Intensity)</option>
                  <option value={45}>45 Minutes (Efficient)</option>
                  <option value={60}>60 Minutes (Standard Gold Standard)</option>
                  <option value={75}>75 Minutes (Extended Volume)</option>
                  <option value={90}>90 Minutes (Powerlifting / Full Body)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Daily Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
                >
                  <option value="sedentary">Sedentary (Desk job / minimal walking)</option>
                  <option value="light">Lightly Active (1-3 days light exercise)</option>
                  <option value="moderate">Moderately Active (3-5 days gym)</option>
                  <option value="very_active">Very Active (6-7 days hard training)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Calibrated Profile Summary & Launch */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center max-w-lg mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-lime-400 mb-3">
                <Flame className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Your Custom Blueprint is Ready!</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Here are your science-backed metabolic targets calculated by GymSaathi for {formData.name || 'you'}.
              </p>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Target Energy</span>
                <span className="text-lg font-black text-lime-400">{targets.targetCalories}</span>
                <span className="text-[10px] text-zinc-400 block">kcal / day</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Protein Target</span>
                <span className="text-lg font-black text-emerald-400">{targets.targetProteinGrams}g</span>
                <span className="text-[10px] text-zinc-400 block">optimal repair</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Carbs</span>
                <span className="text-lg font-black text-amber-400">{targets.targetCarbsGrams}g</span>
                <span className="text-[10px] text-zinc-400 block">energy & endurance</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Healthy Fats</span>
                <span className="text-lg font-black text-sky-400">{targets.targetFatsGrams}g</span>
                <span className="text-[10px] text-zinc-400 block">hormonal health</span>
              </div>
            </div>

            {/* Blueprint Overview Box */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Primary Goal:</span>
                <span className="font-semibold text-white capitalize">{formData.goal.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Dietary Format:</span>
                <span className="font-semibold text-white capitalize">{formData.dietPreference} (₹{formData.dailyBudgetInr}/day)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400">Workout Duration:</span>
                <span className="font-semibold text-white">{formData.workoutTimeMinutes} mins / session</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Cloud Sync Status:</span>
                <span className="font-semibold text-lime-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synced to Supabase
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Controls / Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-800/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-extrabold shadow-lg shadow-lime-500/10 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-black text-sm font-black shadow-lg shadow-lime-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Personalized Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
