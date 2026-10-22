import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Refrigerator,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  Bookmark,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  UserProfile,
  GeneratedDietPlan,
  DietMeal,
  MealFoodItem,
  DietaryPreference,
  FitnessGoal,
  KitchenIngredientItem,
} from '../types/fitness';
import {
  generateAutomaticDietPlan,
  generateKitchenIngredientsPlan,
  calculateMealTotals,
  calculatePlanTotals,
  createMealFoodItem,
} from '../utils/dietGenerator';
import { calculateMacroTargets } from '../utils/fitnessCalculators';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import { ConfirmModal } from '../components/ConfirmModal';

interface DietPlannerPageProps {
  profile: UserProfile;
  activePlan: GeneratedDietPlan | null;
  savedPlans: GeneratedDietPlan[];
  kitchenInventory: KitchenIngredientItem[];
  onSaveActivePlan: (plan: GeneratedDietPlan) => void;
  onSavePlanToBookmarks: (plan: GeneratedDietPlan) => void;
  onDeleteBookmark: (planId: string) => void;
  onUpdateInventory: (inventory: KitchenIngredientItem[]) => void;
  initialMode?: 'automatic' | 'kitchen_inventory';
}

export const DietPlannerPage: React.FC<DietPlannerPageProps> = ({
  profile,
  activePlan,
  savedPlans,
  kitchenInventory,
  onSaveActivePlan,
  onSavePlanToBookmarks,
  onDeleteBookmark,
  onUpdateInventory,
  initialMode = 'automatic',
}) => {
  const [activeTab, setActiveTab] = useState<'automatic' | 'kitchen_inventory'>(initialMode);

  // Form options for Mode A
  const [dietPref, setDietPref] = useState<DietaryPreference>(profile.dietPreference);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [mealCount, setMealCount] = useState<number>(profile.preferredMealFrequency || 4);
  const [budgetInr, setBudgetInr] = useState<number>(profile.dailyBudgetInr || 200);

  // Current Working Plan
  const [currentPlan, setCurrentPlan] = useState<GeneratedDietPlan | null>(activePlan);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Kitchen inventory search and multi-select for Mode B
  const [searchTerm, setSearchTerm] = useState('');
  const [customIngName, setCustomIngName] = useState('');
  const [customIngCategory, setCustomIngCategory] = useState<'protein' | 'carbs' | 'fats' | 'fruits_veggies'>('protein');
  const [customIngQty, setCustomIngQty] = useState(100);
  const [customIngUnit, setCustomIngUnit] = useState<'g' | 'ml' | 'count'>('g');

  const macroTargets = calculateMacroTargets(
    { age: profile.age, gender: profile.gender, heightCm: profile.heightCm, weightKg: profile.weightKg },
    profile.activityLevel,
    goal
  );

  // Initialize automatic plan if none exists
  useEffect(() => {
    if (!currentPlan) {
      handleGenerateAutoPlan();
    }
  }, []);

  const handleGenerateAutoPlan = () => {
    const newPlan = generateAutomaticDietPlan({
      goal,
      dietPreference: dietPref,
      targetCalories: macroTargets.targetCalories,
      targetProtein: macroTargets.targetProteinGrams,
      targetCarbs: macroTargets.targetCarbsGrams,
      targetFats: macroTargets.targetFatsGrams,
      mealCount,
      allergies: profile.allergies,
      dislikedFoods: profile.dislikedFoods,
      budgetLevel: budgetInr,
    });
    setCurrentPlan(newPlan);
    onSaveActivePlan(newPlan);
  };

  const handleGenerateKitchenPlan = () => {
    const newPlan = generateKitchenIngredientsPlan(kitchenInventory, {
      goal,
      dietPreference: dietPref,
      targetCalories: macroTargets.targetCalories,
      targetProtein: macroTargets.targetProteinGrams,
    });
    setCurrentPlan(newPlan);
    onSaveActivePlan(newPlan);
  };

  // Adjust portion of an item in a meal
  const handleAdjustPortion = (mealId: string, foodIndex: number, deltaMultiplier: number) => {
    if (!currentPlan) return;
    const updatedMeals = currentPlan.meals.map((meal) => {
      if (meal.id !== mealId) return meal;
      const updatedFoods = meal.foods.map((food, idx) => {
        if (idx !== foodIndex) return food;
        const newMultiplier = Math.max(0.5, Number((food.portionMultiplier + deltaMultiplier).toFixed(1)));
        const baseItem = createMealFoodItem(food.foodId, newMultiplier);
        return baseItem || food;
      });
      return {
        ...meal,
        foods: updatedFoods,
        ...calculateMealTotals(updatedFoods),
      };
    });

    const updatedPlan: GeneratedDietPlan = {
      ...currentPlan,
      meals: updatedMeals,
      ...calculatePlanTotals(updatedMeals),
    };

    setCurrentPlan(updatedPlan);
    onSaveActivePlan(updatedPlan);
  };

  // Replace a food item in a meal with an alternative
  const handleReplaceFood = (mealId: string, foodIndex: number, newFoodId: string) => {
    if (!currentPlan) return;
    const newItem = createMealFoodItem(newFoodId, 1);
    if (!newItem) return;

    const updatedMeals = currentPlan.meals.map((meal) => {
      if (meal.id !== mealId) return meal;
      const updatedFoods = [...meal.foods];
      updatedFoods[foodIndex] = newItem;
      return {
        ...meal,
        foods: updatedFoods,
        ...calculateMealTotals(updatedFoods),
      };
    });

    const updatedPlan: GeneratedDietPlan = {
      ...currentPlan,
      meals: updatedMeals,
      ...calculatePlanTotals(updatedMeals),
    };

    setCurrentPlan(updatedPlan);
    onSaveActivePlan(updatedPlan);
  };

  // Toggle meal completed
  const handleToggleMealCompleted = (mealId: string) => {
    if (!currentPlan) return;
    const updatedMeals = currentPlan.meals.map((m) => {
      if (m.id === mealId) return { ...m, completed: !m.completed };
      return m;
    });
    const updatedPlan = { ...currentPlan, meals: updatedMeals };
    setCurrentPlan(updatedPlan);
    onSaveActivePlan(updatedPlan);
  };

  // Save to saved bookmarks
  const handleBookmarkPlan = () => {
    if (!currentPlan) return;
    onSavePlanToBookmarks(currentPlan);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Kitchen Inventory functions
  const handleUpdateInventoryQty = (id: string, qty: number) => {
    const updated = kitchenInventory.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, qty) } : item));
    onUpdateInventory(updated);
  };

  const handleRemoveInventoryItem = (id: string) => {
    const updated = kitchenInventory.filter((item) => item.id !== id);
    onUpdateInventory(updated);
  };

  const handleAddCustomInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIngName.trim()) return;
    const newItem: KitchenIngredientItem = {
      id: `custom-ing-${Date.now()}`,
      name: customIngName.trim(),
      category: customIngCategory,
      dietType: dietPref,
      quantity: customIngQty,
      unit: customIngUnit,
    };
    onUpdateInventory([...kitchenInventory, newItem]);
    setCustomIngName('');
  };

  const filteredFoods = INDIAN_FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.hindiName && f.hindiName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset to Original Recommendation?"
        message="This will discard any portion tweaks or meal replacements you made to this plan and regenerate fresh balanced meals."
        confirmLabel="Regenerate Original"
        onConfirm={() => {
          handleGenerateAutoPlan();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Mode Selector Tabs (Section 6 Requirement) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-lime-400">
              Indian Nutrition Architecture
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Personalized Diet Planner
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveTab('automatic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'automatic'
                  ? 'bg-lime-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>MODE A: Automatic Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('kitchen_inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'kitchen_inventory'
                  ? 'bg-lime-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Refrigerator className="w-3.5 h-3.5" />
              <span>MODE B: What's in My Kitchen?</span>
            </button>
          </div>
        </div>

        {/* Mode A Controls Bar */}
        {activeTab === 'automatic' ? (
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Diet Preference</label>
              <select
                value={dietPref}
                onChange={(e) => setDietPref(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
              >
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="general_fitness">General Fitness</option>
                <option value="strength">Strength</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Meals Per Day</label>
              <select
                value={mealCount}
                onChange={(e) => setMealCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
              >
                <option value={3}>3 Meals</option>
                <option value={4}>4 Meals</option>
                <option value={5}>5 Meals</option>
                <option value={6}>6 Meals</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Daily Food Budget</label>
              <select
                value={budgetInr}
                onChange={(e) => setBudgetInr(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
              >
                <option value={150}>Budget (₹150/day)</option>
                <option value={200}>Standard (₹200/day)</option>
                <option value={350}>Comfortable (₹350/day)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-end">
              <button
                onClick={handleGenerateAutoPlan}
                className="w-full py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-lime-950/40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Plan</span>
              </button>
            </div>
          </div>
        ) : (
          /* Mode B Intro Banner */
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-white block">Cook With What You Already Have</strong>
              <span className="text-zinc-400">
                Check and adjust the quantities of foods in your kitchen below, then click "Generate Kitchen Diet Plan".
              </span>
            </div>
            <button
              onClick={handleGenerateKitchenPlan}
              className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 flex-shrink-0 transition-all shadow-md shadow-lime-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate From Kitchen</span>
            </button>
          </div>
        )}
      </div>

      {/* MODE B: KITCHEN INVENTORY SELECTOR */}
      {activeTab === 'kitchen_inventory' && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Refrigerator className="w-5 h-5 text-amber-400" />
                <span>What's Available in Your Kitchen?</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Specify available quantities so GymSaathi does not recommend more food than you actually own.
              </p>
            </div>

            <button
              onClick={() => onUpdateInventory([])}
              className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
            >
              Clear All Kitchen Items
            </button>
          </div>

          {/* Current Inventory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {kitchenInventory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-white truncate max-w-[130px]">{item.name}</div>
                  <div className="text-[10px] text-zinc-400 capitalize">{item.category.replace('_', ' ')}</div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateInventoryQty(item.id, Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white text-right"
                  />
                  <span className="text-[11px] text-zinc-400 min-w-[24px]">{item.unit}</span>
                  <button
                    onClick={() => handleRemoveInventoryItem(item.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Ingredient Form */}
          <form onSubmit={handleAddCustomInventory} className="pt-4 border-t border-zinc-800/80">
            <div className="text-xs font-bold text-zinc-300 mb-2">Add Custom Food in Your Kitchen</div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Food name (e.g. Sattu, Curd, Tofu)"
                value={customIngName}
                onChange={(e) => setCustomIngName(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white flex-1 min-w-[180px]"
              />
              <select
                value={customIngCategory}
                onChange={(e) => setCustomIngCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
              >
                <option value="protein">Protein</option>
                <option value="carbs">Carbohydrate</option>
                <option value="fats">Fats & Nuts</option>
                <option value="fruits_veggies">Fruit / Veggie</option>
              </select>
              <input
                type="number"
                min="1"
                value={customIngQty}
                onChange={(e) => setCustomIngQty(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
              <select
                value={customIngUnit}
                onChange={(e) => setCustomIngUnit(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
              >
                <option value="g">Grams (g)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="count">Count / Pcs</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-lime-400" />
                <span>Add Ingredient</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PLAN OUTPUT DISPLAY */}
      {currentPlan && (
        <div className="space-y-6">
          {/* Nutrition Macro Summary Header Card */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
                    {currentPlan.mode === 'automatic' ? 'Automatic Plan' : 'Kitchen Inventory Plan'}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {currentPlan.meals.length} Scheduled Meals
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">Daily Nutritional Blueprint</h3>
                <p className="text-xs text-zinc-400">Values are calculated estimates based on typical Indian home preparations.</p>
              </div>

              <div className="flex items-center gap-2">
                {showSavedToast && (
                  <span className="text-xs font-bold text-lime-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
                <button
                  onClick={handleBookmarkPlan}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-lime-400" />
                  <span>Save Plan</span>
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Reset to original recommendation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nutrition Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Daily Calories</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {currentPlan.actualCalories}{' '}
                  <span className="text-[11px] font-normal text-zinc-400">/ {currentPlan.targetCalories}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-lime-500/10 border border-lime-500/20">
                <div className="text-[11px] text-lime-400 font-semibold">Protein Target</div>
                <div className="text-xl font-black text-lime-300 mt-0.5">
                  {currentPlan.actualProtein}g{' '}
                  <span className="text-[11px] font-normal text-lime-400/80">/ {currentPlan.targetProtein}g</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Carbohydrates</div>
                <div className="text-xl font-black text-white mt-0.5">{currentPlan.actualCarbs}g</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Healthy Fats</div>
                <div className="text-xl font-black text-white mt-0.5">{currentPlan.actualFats}g</div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Estimated Cost</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">
                  ₹{currentPlan.totalEstimatedCostInr} <span className="text-[11px] font-normal text-zinc-400">/ day</span>
                </div>
              </div>
            </div>

            {/* Missing Gaps / Honest Disclosures in Mode B (Section 6 Requirement) */}
            {currentPlan.missingGaps && currentPlan.missingGaps.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1.5 text-xs text-amber-200">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Kitchen Inventory Gaps & Suggestions:</span>
                </div>
                {currentPlan.missingGaps.map((gap, idx) => (
                  <p key={idx} className="leading-relaxed">
                    • {gap}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Meals List */}
          <div className="space-y-4">
            {currentPlan.meals.map((meal) => (
              <div
                key={meal.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  meal.completed
                    ? 'bg-zinc-950/70 border-lime-500/30'
                    : 'bg-zinc-950 border-zinc-800/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleMealCompleted(meal.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                        meal.completed
                          ? 'bg-lime-500 text-zinc-950'
                          : 'border-2 border-zinc-700 hover:border-lime-400 text-transparent'
                      }`}
                      aria-label="Mark meal as eaten"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">{meal.title}</h4>
                        <span className="text-xs text-zinc-400 font-medium">({meal.suggestedTime})</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Total Meal Nutrition: <strong className="text-white">{meal.totalCalories} kcal</strong> • <strong className="text-lime-400">{meal.totalProtein}g Protein</strong> • ₹{meal.totalCostInr} approx
                      </p>
                    </div>
                  </div>
                </div>

                {/* Food Items in Meal with Portion Adjustment & Replacement */}
                <div className="pt-4 space-y-2.5">
                  {meal.foods.map((food, foodIdx) => (
                    <div
                      key={foodIdx}
                      className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-sm">{food.name}</div>
                        <div className="text-zinc-400 text-xs">
                          Portion: <span className="text-zinc-200">{food.servingDescription}</span> • {food.calories} kcal • {food.protein}g protein • ₹{food.costInr}
                        </div>
                      </div>

                      {/* Interactive Controls: Portion +/- & Alternative dropdown */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                          <button
                            onClick={() => handleAdjustPortion(meal.id, foodIdx, -0.5)}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Decrease portion"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-1 text-[11px] font-bold text-zinc-200">
                            {food.portionMultiplier}x
                          </span>
                          <button
                            onClick={() => handleAdjustPortion(meal.id, foodIdx, 0.5)}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Increase portion"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Replace with alternative food */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) handleReplaceFood(meal.id, foodIdx, e.target.value);
                          }}
                          defaultValue=""
                          className="px-2 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 focus:border-lime-400"
                        >
                          <option value="" disabled>
                            Swap Food...
                          </option>
                          <option value="eggs-whole">Whole Eggs</option>
                          <option value="paneer-raw">Fresh Paneer</option>
                          <option value="soy-chunks">Soy Chunks (Nutrela)</option>
                          <option value="chicken-breast">Chicken Breast</option>
                          <option value="moong-dal-cooked">Moong Dal</option>
                          <option value="curd-dahi">Fresh Curd / Dahi</option>
                          <option value="oats-rolled">Rolled Oats</option>
                          <option value="peanuts-roasted">Roasted Peanuts</option>
                          <option value="banana">Banana</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
