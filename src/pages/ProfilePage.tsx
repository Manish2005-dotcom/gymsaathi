import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Dumbbell,
  UtensilsCrossed,
  Clock,
  Wallet,
  Activity,
  Info,
} from 'lucide-react';
import { UserProfile, FitnessGoal, FitnessExperience, DietaryPreference, WorkoutLocation, ActivityLevel } from '../types/fitness';

interface ProfilePageProps {
  initialProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ initialProfile, onSaveProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(initialProfile);
  const [allergiesInput, setAllergiesInput] = useState(initialProfile.allergies.join(', '));
  const [dislikedInput, setDislikedInput] = useState(initialProfile.dislikedFoods.join(', '));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const equipmentOptions = [
    { id: 'full_gym', label: 'Full Gym Access' },
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'barbell', label: 'Barbell & Plates' },
    { id: 'cables', label: 'Cable Machine' },
    { id: 'bands', label: 'Resistance Bands' },
    { id: 'pullup_bar', label: 'Pull-up Bar' },
    { id: 'bodyweight_only', label: 'Bodyweight / None' },
  ];

  const handleEquipmentToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.availableEquipment.includes(id);
      const updated = exists
        ? prev.availableEquipment.filter((item) => item !== id)
        : [...prev.availableEquipment, id];
      return { ...prev, availableEquipment: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name or nickname.';
    }

    if (formData.age < 12 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age between 12 and 100.';
    }

    if (formData.heightCm < 100 || formData.heightCm > 240) {
      newErrors.heightCm = 'Height must be between 100 cm and 240 cm.';
    }

    if (formData.weightKg < 30 || formData.weightKg > 250) {
      newErrors.weightKg = 'Weight must be between 30 kg and 250 kg.';
    }

    if (formData.targetWeightKg && (formData.targetWeightKg < 30 || formData.targetWeightKg > 250)) {
      newErrors.targetWeightKg = 'Target weight must be realistic (30 - 250 kg).';
    }

    if (formData.dailyBudgetInr < 50) {
      newErrors.dailyBudgetInr = 'Approximate budget must be at least ₹50/day.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanedAllergies = allergiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const cleanedDisliked = dislikedInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProfile: UserProfile = {
      ...formData,
      allergies: cleanedAllergies,
      dislikedFoods: cleanedDisliked,
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Privacy Notice Banner (Prompt Section 5 Requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-white block mb-0.5">100% Local Browser Storage</strong>
          Your personal metrics and assessment answers are kept securely in your local browser’s localStorage. No personal data is transmitted or stored on third-party tracking servers.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Personal Assessment */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-lime-500/15 text-lime-400 border border-lime-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">1. Basic Fitness Assessment</h2>
              <p className="text-xs text-zinc-400">Used for BMR, calorie needs, and personalized volume</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white transition-colors"
                placeholder="e.g. Aman Sharma"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Age (years) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="12"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white transition-colors"
              />
              {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Biological Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Neutral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Height (cm) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="100"
                max="240"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white transition-colors"
              />
              {errors.heightCm && <p className="text-xs text-red-400 mt-1">{errors.heightCm}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Current Weight (kg) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="250"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white transition-colors"
              />
              {errors.weightKg && <p className="text-xs text-red-400 mt-1">{errors.weightKg}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target Weight (kg, optional)
              </label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="250"
                value={formData.targetWeightKg || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetWeightKg: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="e.g. 72"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white transition-colors"
              />
              {errors.targetWeightKg && <p className="text-xs text-red-400 mt-1">{errors.targetWeightKg}</p>}
            </div>
          </div>
        </div>

        {/* Goals & Experience */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-lime-500/15 text-lime-400 border border-lime-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. Fitness Goals & Experience</h2>
              <p className="text-xs text-zinc-400">Tailors workout progression and calorie surpluses/deficits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Primary Fitness Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as FitnessGoal })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value="muscle_gain">Muscle Gain (Hypertrophy Surplus)</option>
                <option value="fat_loss">Fat Loss (Sustainable Deficit)</option>
                <option value="general_fitness">General Fitness & Endurance</option>
                <option value="strength">Pure Strength Progression</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Fitness Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value as FitnessExperience })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value="beginner">Beginner (&lt; 6 months in gym)</option>
                <option value="intermediate">Intermediate (6 months - 2 years)</option>
                <option value="advanced">Advanced (2+ years dedicated)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Daily Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value="sedentary">Sedentary (Desk Job, little walking)</option>
                <option value="light">Lightly Active (1-3 workout days/week)</option>
                <option value="moderate">Moderately Active (3-5 workout days)</option>
                <option value="very_active">Very Active (6-7 days or manual work)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Workout Location</label>
              <select
                value={formData.workoutLocation}
                onChange={(e) => setFormData({ ...formData, workoutLocation: e.target.value as WorkoutLocation })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value="gym">Gym with standard equipment</option>
                <option value="home">Home Workouts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Typical Workout Duration</label>
              <select
                value={formData.workoutTimeMinutes}
                onChange={(e) => setFormData({ ...formData, workoutTimeMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value={45}>45 Minutes (Efficient)</option>
                <option value={60}>60 Minutes (Standard)</option>
                <option value={75}>75 Minutes</option>
                <option value={90}>90 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Available Equipment</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {equipmentOptions.map((eq) => {
                const isSelected = formData.availableEquipment.includes(eq.id);
                return (
                  <button
                    type="button"
                    key={eq.id}
                    onClick={() => handleEquipmentToggle(eq.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-lime-500/15 border-lime-500/40 text-lime-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{eq.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dietary Preferences & Budget */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">3. Dietary Preferences & Budget</h2>
              <p className="text-xs text-zinc-400">Ensures meal plans match your food habits and wallet</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Dietary Preference</label>
              <select
                value={formData.dietPreference}
                onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value as DietaryPreference })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value="vegetarian">Vegetarian (Dairy & Plant-based)</option>
                <option value="eggetarian">Eggetarian (Veg + Eggs)</option>
                <option value="non_vegetarian">Non-Vegetarian (Eggs, Chicken, Fish)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Approx. Daily Food Budget (₹)
              </label>
              <input
                type="number"
                min="50"
                step="25"
                value={formData.dailyBudgetInr}
                onChange={(e) => setFormData({ ...formData, dailyBudgetInr: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              />
              {errors.dailyBudgetInr && <p className="text-xs text-red-400 mt-1">{errors.dailyBudgetInr}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Preferred Meals per Day</label>
              <select
                value={formData.preferredMealFrequency}
                onChange={(e) => setFormData({ ...formData, preferredMealFrequency: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              >
                <option value={3}>3 Meals (Breakfast, Lunch, Dinner)</option>
                <option value={4}>4 Meals (Breakfast, Lunch, Evening Snack, Dinner)</option>
                <option value={5}>5 Meals (+ Mid-Morning Boost)</option>
                <option value={6}>6 Meals (+ Dedicated Pre/Post Workout)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Food Allergies or Intolerances (comma-separated)
              </label>
              <input
                type="text"
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
                placeholder="e.g. lactose, peanut, gluten"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">Leave empty if none</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Disliked Foods (comma-separated)
              </label>
              <input
                type="text"
                value={dislikedInput}
                onChange={(e) => setDislikedInput(e.target.value)}
                placeholder="e.g. karela, tinda, fish"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-lime-400 text-sm text-white transition-colors"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">We will avoid suggesting these foods</span>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Info className="w-4 h-4 text-lime-400" />
            <span>Updates will immediately recalibrate your meal and workout plans.</span>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile Saved Successfully!</span>
              </span>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-lime-950/40 hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
