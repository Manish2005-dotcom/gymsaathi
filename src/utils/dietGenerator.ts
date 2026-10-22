import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import {
  DietaryPreference,
  DietMeal,
  FitnessGoal,
  FoodItem,
  GeneratedDietPlan,
  KitchenIngredientItem,
  MealFoodItem,
} from '../types/fitness';

export interface AutoPlanOptions {
  goal: FitnessGoal;
  dietPreference: DietaryPreference;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  mealCount: number; // 3, 4, 5, 6
  allergies?: string[];
  dislikedFoods?: string[];
  budgetLevel?: number; // approx inr per day
}

export function findFood(foodId: string): FoodItem | undefined {
  return INDIAN_FOOD_DATABASE.find((f) => f.id === foodId);
}

export function createMealFoodItem(foodId: string, multiplier = 1, customDesc?: string): MealFoodItem | null {
  const food = findFood(foodId);
  if (!food) return null;
  return {
    foodId: food.id,
    name: food.name,
    portionMultiplier: multiplier,
    servingDescription: customDesc || (multiplier === 1 ? food.servingUnit : `${multiplier}x (${food.servingUnit})`),
    calories: Math.round(food.calories * multiplier),
    protein: Number((food.protein * multiplier).toFixed(1)),
    carbs: Number((food.carbs * multiplier).toFixed(1)),
    fats: Number((food.fats * multiplier).toFixed(1)),
    costInr: Math.round(food.approxCostInr * multiplier),
  };
}

export function calculateMealTotals(foods: MealFoodItem[]) {
  return foods.reduce(
    (acc, f) => {
      acc.totalCalories += f.calories;
      acc.totalProtein = Number((acc.totalProtein + f.protein).toFixed(1));
      acc.totalCarbs = Number((acc.totalCarbs + f.carbs).toFixed(1));
      acc.totalFats = Number((acc.totalFats + f.fats).toFixed(1));
      acc.totalCostInr += f.costInr;
      return acc;
    },
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, totalCostInr: 0 }
  );
}

export function calculatePlanTotals(meals: DietMeal[]) {
  return meals.reduce(
    (acc, m) => {
      acc.actualCalories += m.totalCalories;
      acc.actualProtein = Number((acc.actualProtein + m.totalProtein).toFixed(1));
      acc.actualCarbs = Number((acc.actualCarbs + m.totalCarbs).toFixed(1));
      acc.actualFats = Number((acc.actualFats + m.totalFats).toFixed(1));
      acc.totalEstimatedCostInr += m.totalCostInr;
      return acc;
    },
    { actualCalories: 0, actualProtein: 0, actualCarbs: 0, actualFats: 0, totalEstimatedCostInr: 0 }
  );
}

/**
 * Filter foods compatible with diet preference and allergies
 */
function isFoodAllowed(food: FoodItem, pref: DietaryPreference, allergies: string[] = []): boolean {
  if (pref === 'vegetarian' && food.dietType !== 'vegetarian') return false;
  if (pref === 'eggetarian' && food.dietType === 'non_vegetarian') return false;

  const lowerName = food.name.toLowerCase();
  for (const allergy of allergies) {
    const a = allergy.toLowerCase().trim();
    if (a && lowerName.includes(a)) return false;
  }
  return true;
}

/**
 * MODE A: AUTOMATIC DIET PLAN GENERATOR
 */
export function generateAutomaticDietPlan(options: AutoPlanOptions): GeneratedDietPlan {
  const { goal, dietPreference, targetCalories, targetProtein, targetCarbs, targetFats, mealCount, allergies = [] } = options;

  const meals: DietMeal[] = [];
  const count = Math.max(3, Math.min(6, mealCount || 4));

  // Determine meal slots
  // 3 meals: Breakfast, Lunch, Dinner
  // 4 meals: Breakfast, Lunch, Evening Snack, Dinner
  // 5 meals: Breakfast, Mid-morning, Lunch, Evening Snack, Dinner
  // 6 meals: Breakfast, Mid-morning, Lunch, Evening Snack, Pre/Post-workout, Dinner

  // Build breakfast
  const breakfastFoods: MealFoodItem[] = [];
  if (dietPreference === 'eggetarian' || dietPreference === 'non_vegetarian') {
    const eggs = createMealFoodItem('eggs-whole', 1, '2 whole boiled eggs');
    if (eggs) breakfastFoods.push(eggs);
    const toast = createMealFoodItem('whole-wheat-bread', 1, '2 slices brown bread');
    if (toast) breakfastFoods.push(toast);
    const fruit = createMealFoodItem('banana', 1, '1 banana');
    if (fruit) breakfastFoods.push(fruit);
  } else {
    // Vegetarian breakfast
    const oats = createMealFoodItem('oats-rolled', 1, '50g rolled oats');
    if (oats) breakfastFoods.push(oats);
    const milk = createMealFoodItem('milk-cow-toned', 1, '1 glass toned milk (250ml)');
    if (milk) breakfastFoods.push(milk);
    const banana = createMealFoodItem('banana', 1, '1 ripe banana');
    if (banana) breakfastFoods.push(banana);
    const pb = createMealFoodItem('peanut-butter', 1, '1 tbsp peanut butter');
    if (pb) breakfastFoods.push(pb);
  }

  meals.push({
    id: 'meal-breakfast',
    type: 'breakfast',
    title: 'Energizing Breakfast',
    suggestedTime: '8:00 AM - 9:00 AM',
    foods: breakfastFoods,
    ...calculateMealTotals(breakfastFoods),
  });

  // Mid-morning (if 5 or 6 meals)
  if (count >= 5) {
    const midFoods: MealFoodItem[] = [];
    const fruit = createMealFoodItem('apple', 1, '1 seasonal apple');
    if (fruit) midFoods.push(fruit);
    const nuts = createMealFoodItem('almonds-raw', 1, '10 soaked almonds');
    if (nuts) midFoods.push(nuts);
    meals.push({
      id: 'meal-mid-morning',
      type: 'mid_morning',
      title: 'Mid-Morning Boost',
      suggestedTime: '11:00 AM - 11:30 AM',
      foods: midFoods,
      ...calculateMealTotals(midFoods),
    });
  }

  // Lunch (Substantial Indian Meal)
  const lunchFoods: MealFoodItem[] = [];
  const roti = createMealFoodItem('roti-chapati', 2, '2 whole wheat chapatis');
  if (roti) lunchFoods.push(roti);
  const rice = createMealFoodItem('white-rice-cooked', 1, '1 bowl steamed rice (150g)');
  if (rice) lunchFoods.push(rice);

  if (dietPreference === 'non_vegetarian') {
    const chicken = createMealFoodItem('chicken-breast', 1, '150g grilled/curry chicken breast');
    if (chicken) lunchFoods.push(chicken);
  } else if (dietPreference === 'eggetarian') {
    const eggCurry = createMealFoodItem('eggs-whole', 1.5, '3 boiled eggs curry style');
    if (eggCurry) lunchFoods.push(eggCurry);
    const dal = createMealFoodItem('moong-dal-cooked', 1, '1 katori moong dal');
    if (dal) lunchFoods.push(dal);
  } else {
    // Veg: Paneer or high-protein Dal/Soy
    if (goal === 'muscle_gain') {
      const paneer = createMealFoodItem('paneer-raw', 1, '100g paneer bhurji / curry');
      if (paneer) lunchFoods.push(paneer);
      const dal = createMealFoodItem('moong-dal-cooked', 1, '1 katori dal');
      if (dal) lunchFoods.push(dal);
    } else {
      const soy = createMealFoodItem('soy-chunks', 1, '50g soy chunks curry (high protein, low cost)');
      if (soy) lunchFoods.push(soy);
      const dal = createMealFoodItem('moong-dal-cooked', 1, '1 katori dal');
      if (dal) lunchFoods.push(dal);
    }
  }

  const salad = createMealFoodItem('cucumber-salad', 1, '1 bowl cucumber & tomato salad');
  if (salad) lunchFoods.push(salad);

  meals.push({
    id: 'meal-lunch',
    type: 'lunch',
    title: 'Balanced Indian Lunch',
    suggestedTime: '1:00 PM - 2:00 PM',
    foods: lunchFoods,
    ...calculateMealTotals(lunchFoods),
  });

  // Pre/Post Workout (if 6 meals)
  if (count >= 6) {
    const workoutFoods: MealFoodItem[] = [];
    const sprouts = createMealFoodItem('sprouted-moong', 1, '1 bowl sprouted moong chaat');
    if (sprouts) workoutFoods.push(sprouts);
    const curd = createMealFoodItem('curd-dahi', 1, '1 katori fresh dahi');
    if (curd) workoutFoods.push(curd);
    meals.push({
      id: 'meal-pre-post',
      type: 'pre_workout',
      title: 'Pre / Post-Workout Fuel',
      suggestedTime: '4:30 PM (1 hr before gym)',
      foods: workoutFoods,
      ...calculateMealTotals(workoutFoods),
    });
  }

  // Evening Snack (if 4, 5, or 6 meals)
  if (count >= 4) {
    const eveningFoods: MealFoodItem[] = [];
    const peanuts = createMealFoodItem('peanuts-roasted', 1, '1 handful roasted peanuts (30g)');
    if (peanuts) eveningFoods.push(peanuts);
    const milkOrCurd = createMealFoodItem('milk-cow-toned', 1, '1 cup warm milk or chai (low sugar)');
    if (milkOrCurd) eveningFoods.push(milkOrCurd);
    meals.push({
      id: 'meal-evening-snack',
      type: 'evening_snack',
      title: 'Evening Snack',
      suggestedTime: '5:30 PM - 6:30 PM',
      foods: eveningFoods,
      ...calculateMealTotals(eveningFoods),
    });
  }

  // Dinner
  const dinnerFoods: MealFoodItem[] = [];
  const dinnerRoti = createMealFoodItem('roti-chapati', 2, '2 whole wheat rotis');
  if (dinnerRoti) dinnerFoods.push(dinnerRoti);

  if (dietPreference === 'non_vegetarian') {
    const fishOrEgg = createMealFoodItem('fish-rohu', 1, '150g fish curry or 2 boiled eggs');
    if (fishOrEgg) dinnerFoods.push(fishOrEgg);
  } else if (dietPreference === 'eggetarian') {
    const eggs = createMealFoodItem('eggs-whole', 1, '2 boiled eggs');
    if (eggs) dinnerFoods.push(eggs);
    const rajma = createMealFoodItem('rajma-cooked', 1, '1 katori rajma curry');
    if (rajma) dinnerFoods.push(rajma);
  } else {
    const rajmaOrChana = createMealFoodItem('rajma-cooked', 1, '1 katori rajma or chole');
    if (rajmaOrChana) dinnerFoods.push(rajmaOrChana);
    const dahi = createMealFoodItem('curd-dahi', 1, '1 katori curd (dahi)');
    if (dahi) dinnerFoods.push(dahi);
  }

  const sabzi = createMealFoodItem('mixed-vegetables-sabzi', 1, '1 katori green mixed sabzi');
  if (sabzi) dinnerFoods.push(sabzi);

  meals.push({
    id: 'meal-dinner',
    type: 'dinner',
    title: 'Light & Digestible Dinner',
    suggestedTime: '8:30 PM - 9:30 PM',
    foods: dinnerFoods,
    ...calculateMealTotals(dinnerFoods),
  });

  const totals = calculatePlanTotals(meals);

  const notes = [
    'All calorie and protein values are realistic estimates based on standard Indian household preparations.',
    'Drink 3 to 4 liters of clean water daily, especially in hot conditions and on lifting days.',
    'Portions can be scaled up or down according to hunger and rate of progress.',
  ];

  if (goal === 'muscle_gain') {
    notes.push('For muscle gain: aim to be in a consistent mild surplus. Do not skip post-workout meals.');
  } else if (goal === 'fat_loss') {
    notes.push('For fat loss: preserve your protein intake to protect lean muscle mass while in deficit.');
  }

  return {
    id: `plan-auto-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    mode: 'automatic',
    goal,
    dietPreference,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFats,
    ...totals,
    meals,
    notes,
  };
}

/**
 * MODE B: AVAILABLE KITCHEN INGREDIENTS PLAN GENERATOR
 * "What's Available in Your Kitchen?"
 */
export function generateKitchenIngredientsPlan(
  availableIngredients: KitchenIngredientItem[],
  options: {
    goal: FitnessGoal;
    dietPreference: DietaryPreference;
    targetCalories: number;
    targetProtein: number;
  }
): GeneratedDietPlan {
  const { goal, dietPreference, targetCalories, targetProtein } = options;
  const targetCarbs = Math.round((targetCalories * 0.5) / 4);
  const targetFats = Math.round((targetCalories * 0.25) / 9);

  // Map of available items by lower name
  const invMap = new Map<string, KitchenIngredientItem>();
  availableIngredients.forEach((item) => {
    invMap.set(item.name.toLowerCase().trim(), { ...item });
  });

  const meals: DietMeal[] = [];
  const ingredientUsage: { ingredientName: string; usedAmount: string; remainingAmount?: string }[] = [];
  const missingGaps: string[] = [];

  // Helper to check if ingredient exists with positive quantity
  function takeItem(keyword: string, reqAmount: number, unit: string): boolean {
    for (const [key, item] of invMap.entries()) {
      if (key.includes(keyword.toLowerCase()) && item.quantity > 0) {
        const used = Math.min(item.quantity, reqAmount);
        item.quantity -= used;
        ingredientUsage.push({
          ingredientName: item.name,
          usedAmount: `${used} ${unit}`,
          remainingAmount: `${item.quantity} ${unit}`,
        });
        return true;
      }
    }
    return false;
  }

  function hasItem(keyword: string): boolean {
    for (const [key, item] of invMap.entries()) {
      if (key.includes(keyword.toLowerCase()) && item.quantity > 0) return true;
    }
    return false;
  }

  // 1. Breakfast Meal Creation
  const bFoods: MealFoodItem[] = [];
  if (hasItem('egg')) {
    takeItem('egg', 2, 'eggs');
    const eggs = createMealFoodItem('eggs-whole', 1, '2 Whole Eggs (scrambled/boiled)');
    if (eggs) bFoods.push(eggs);
    if (hasItem('bread')) {
      takeItem('bread', 2, 'slices');
      const bread = createMealFoodItem('whole-wheat-bread', 1, '2 Slices Bread');
      if (bread) bFoods.push(bread);
    } else if (hasItem('roti') || hasItem('atta')) {
      takeItem('roti', 2, 'rotis');
      const roti = createMealFoodItem('roti-chapati', 2, '2 Rotis');
      if (roti) bFoods.push(roti);
    }
  } else if (hasItem('oat')) {
    takeItem('oat', 50, 'g');
    const oats = createMealFoodItem('oats-rolled', 1, '50g Oats');
    if (oats) bFoods.push(oats);
    if (hasItem('milk')) {
      takeItem('milk', 250, 'ml');
      const milk = createMealFoodItem('milk-cow-toned', 1, '250ml Milk');
      if (milk) bFoods.push(milk);
    }
    if (hasItem('banana')) {
      takeItem('banana', 1, 'banana');
      const ban = createMealFoodItem('banana', 1, '1 Banana sliced');
      if (ban) bFoods.push(ban);
    }
  } else if (hasItem('poha')) {
    takeItem('poha', 100, 'g');
    const poha = createMealFoodItem('poha-cooked', 1, 'Poha with mild spices');
    if (poha) bFoods.push(poha);
    if (hasItem('peanut')) {
      takeItem('peanut', 20, 'g');
      const pn = createMealFoodItem('peanuts-roasted', 0.7, 'Peanuts in poha (20g)');
      if (pn) bFoods.push(pn);
    }
  } else {
    // Fallback breakfast using whatever carb or dairy exists
    if (hasItem('milk')) {
      takeItem('milk', 250, 'ml');
      const milk = createMealFoodItem('milk-cow-toned', 1, '1 Glass Warm Milk');
      if (milk) bFoods.push(milk);
    }
    if (hasItem('banana')) {
      takeItem('banana', 2, 'bananas');
      const ban = createMealFoodItem('banana', 2, '2 Bananas');
      if (ban) bFoods.push(ban);
    }
  }

  if (bFoods.length > 0) {
    meals.push({
      id: 'kitchen-breakfast',
      type: 'breakfast',
      title: 'Kitchen Breakfast',
      suggestedTime: '8:30 AM',
      foods: bFoods,
      ...calculateMealTotals(bFoods),
    });
  }

  // 2. Lunch Meal Creation
  const lFoods: MealFoodItem[] = [];
  if (hasItem('rice')) {
    takeItem('rice', 100, 'g');
    const rice = createMealFoodItem('white-rice-cooked', 1, 'Steamed Rice (1 bowl)');
    if (rice) lFoods.push(rice);
  } else if (hasItem('roti') || hasItem('atta')) {
    takeItem('roti', 2, 'rotis');
    const roti = createMealFoodItem('roti-chapati', 2, '2 Fresh Rotis');
    if (roti) lFoods.push(roti);
  }

  // Add protein source in lunch
  if (hasItem('chicken')) {
    takeItem('chicken', 150, 'g');
    const chicken = createMealFoodItem('chicken-breast', 1, '150g Homemade Chicken Curry');
    if (chicken) lFoods.push(chicken);
  } else if (hasItem('soy')) {
    takeItem('soy', 50, 'g');
    const soy = createMealFoodItem('soy-chunks', 1, '50g Soy Chunks Sabzi');
    if (soy) lFoods.push(soy);
  } else if (hasItem('paneer')) {
    takeItem('paneer', 100, 'g');
    const paneer = createMealFoodItem('paneer-raw', 1, '100g Paneer Sabzi');
    if (paneer) lFoods.push(paneer);
  } else if (hasItem('dal')) {
    takeItem('dal', 60, 'g');
    const dal = createMealFoodItem('moong-dal-cooked', 1, '1 Bowl Dal Tadka');
    if (dal) lFoods.push(dal);
  } else if (hasItem('chana') || hasItem('chole')) {
    takeItem('chana', 80, 'g');
    const chana = createMealFoodItem('chana-chole-cooked', 1, '1 Bowl Chana Curry');
    if (chana) lFoods.push(chana);
  } else if (hasItem('rajma')) {
    takeItem('rajma', 80, 'g');
    const rajma = createMealFoodItem('rajma-cooked', 1, '1 Bowl Rajma Curry');
    if (rajma) lFoods.push(rajma);
  } else if (hasItem('egg')) {
    takeItem('egg', 2, 'eggs');
    const eggs = createMealFoodItem('eggs-whole', 1, '2 Boiled Eggs with Salt & Pepper');
    if (eggs) lFoods.push(eggs);
  }

  if (hasItem('curd') || hasItem('dahi')) {
    takeItem('curd', 150, 'g');
    const curd = createMealFoodItem('curd-dahi', 1, '1 Katori Fresh Dahi');
    if (curd) lFoods.push(curd);
  }

  if (lFoods.length > 0) {
    meals.push({
      id: 'kitchen-lunch',
      type: 'lunch',
      title: 'Kitchen Lunch',
      suggestedTime: '1:30 PM',
      foods: lFoods,
      ...calculateMealTotals(lFoods),
    });
  }

  // 3. Evening Snack Creation
  const sFoods: MealFoodItem[] = [];
  if (hasItem('peanut')) {
    takeItem('peanut', 30, 'g');
    const p = createMealFoodItem('peanuts-roasted', 1, 'Handful Roasted Peanuts');
    if (p) sFoods.push(p);
  } else if (hasItem('almond')) {
    takeItem('almond', 15, 'g');
    const al = createMealFoodItem('almonds-raw', 1, '10-12 Almonds');
    if (al) sFoods.push(al);
  } else if (hasItem('sprout')) {
    takeItem('sprout', 100, 'g');
    const sp = createMealFoodItem('sprouted-moong', 1, '1 Bowl Sprouted Moong');
    if (sp) sFoods.push(sp);
  }

  if (hasItem('banana') && !bFoods.some((f) => f.foodId === 'banana')) {
    takeItem('banana', 1, 'banana');
    const ban = createMealFoodItem('banana', 1, '1 Banana (Pre-workout energy)');
    if (ban) sFoods.push(ban);
  }

  if (sFoods.length > 0) {
    meals.push({
      id: 'kitchen-snack',
      type: 'evening_snack',
      title: 'Kitchen Evening Snack',
      suggestedTime: '5:30 PM',
      foods: sFoods,
      ...calculateMealTotals(sFoods),
    });
  }

  // 4. Dinner Creation
  const dFoods: MealFoodItem[] = [];
  if (hasItem('roti') || hasItem('atta')) {
    takeItem('roti', 2, 'rotis');
    const roti = createMealFoodItem('roti-chapati', 2, '2 Chapatis');
    if (roti) dFoods.push(roti);
  } else if (hasItem('rice')) {
    takeItem('rice', 100, 'g');
    const rice = createMealFoodItem('white-rice-cooked', 1, 'Rice (1 bowl)');
    if (rice) dFoods.push(rice);
  }

  // Second protein source for dinner
  if (hasItem('egg')) {
    takeItem('egg', 2, 'eggs');
    const eggs = createMealFoodItem('eggs-whole', 1, '2 Boiled Eggs or Omelette');
    if (eggs) dFoods.push(eggs);
  } else if (hasItem('paneer')) {
    takeItem('paneer', 100, 'g');
    const paneer = createMealFoodItem('paneer-raw', 1, '100g Paneer Bhurji');
    if (paneer) dFoods.push(paneer);
  } else if (hasItem('dal')) {
    takeItem('dal', 60, 'g');
    const dal = createMealFoodItem('moong-dal-cooked', 1, '1 Bowl Warm Dal');
    if (dal) dFoods.push(dal);
  } else if (hasItem('soy')) {
    takeItem('soy', 50, 'g');
    const soy = createMealFoodItem('soy-chunks', 1, '50g Soy Chunks Curry');
    if (soy) dFoods.push(soy);
  } else if (hasItem('rajma')) {
    takeItem('rajma', 80, 'g');
    const rajma = createMealFoodItem('rajma-cooked', 1, 'Rajma bowl');
    if (rajma) dFoods.push(rajma);
  }

  if (hasItem('spinach') || hasItem('palak') || hasItem('vegetable')) {
    const veg = createMealFoodItem('mixed-vegetables-sabzi', 1, 'Cooked Green Veggies');
    if (veg) dFoods.push(veg);
  }

  if (dFoods.length > 0) {
    meals.push({
      id: 'kitchen-dinner',
      type: 'dinner',
      title: 'Kitchen Dinner',
      suggestedTime: '9:00 PM',
      foods: dFoods,
      ...calculateMealTotals(dFoods),
    });
  }

  // If user selected very few ingredients and meals are sparse, ensure at least 3 meals
  if (meals.length < 3) {
    missingGaps.push('You selected very few ingredients. A balanced day requires at least 1-2 protein sources and 1 staple carb.');
  }

  const totals = calculatePlanTotals(meals);

  // Check protein deficit against target
  const proteinGap = targetProtein - totals.actualProtein;
  if (proteinGap > 15) {
    missingGaps.push(
      `You are approximately ${Math.round(proteinGap)}g below your target daily protein (${targetProtein}g). ` +
        `Consider stocking affordable high-protein Indian staples like Soy Chunks (₹12/50g = 26g protein), Eggs (₹14/2 eggs = 13g protein), or Fresh Curd/Dahi.`
    );
  }

  const calGap = targetCalories - totals.actualCalories;
  if (calGap > 300) {
    missingGaps.push(
      `Total calories from your current kitchen foods (${totals.actualCalories} kcal) are ${Math.round(calGap)} kcal below your daily energy target (${targetCalories} kcal). ` +
        `Add healthy calories using bananas, peanuts, rice, or milk.`
    );
  }

  const notes = [
    'Meals generated strictly prioritizing what you marked available in your kitchen.',
    'Portions reflect realistic Indian home cooking.',
  ];

  return {
    id: `plan-kitchen-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    mode: 'kitchen_inventory',
    goal,
    dietPreference,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFats,
    ...totals,
    meals,
    notes,
    missingGaps,
    ingredientUsageSummary: ingredientUsage,
  };
}
