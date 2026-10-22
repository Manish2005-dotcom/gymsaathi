import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAutomaticDietPlan, generateKitchenIngredientsPlan } from './dietGenerator';
import { KitchenIngredientItem } from '../types/fitness';

test('generateAutomaticDietPlan generates realistic meals and accurate totals', () => {
  const plan = generateAutomaticDietPlan({
    goal: 'muscle_gain',
    dietPreference: 'vegetarian',
    targetCalories: 2400,
    targetProtein: 120,
    targetCarbs: 300,
    targetFats: 65,
    mealCount: 4,
  });

  assert.equal(plan.meals.length, 4);
  assert.ok(plan.actualCalories > 1500, 'Actual calories should be realistic');
  assert.ok(plan.actualProtein > 60, 'Actual protein should be tracked accurately');
  assert.ok(plan.totalEstimatedCostInr > 0, 'Cost should be calculated');
  assert.equal(plan.mode, 'automatic');
});

test('generateKitchenIngredientsPlan uses available foods and reports gaps honestly', () => {
  const inventory: KitchenIngredientItem[] = [
    { id: '1', name: 'Eggs', category: 'protein', dietType: 'eggetarian', quantity: 6, unit: 'count' },
    { id: '2', name: 'Oats', category: 'carbs', dietType: 'vegetarian', quantity: 200, unit: 'g' },
    { id: '3', name: 'Milk', category: 'protein', dietType: 'vegetarian', quantity: 500, unit: 'ml' },
    { id: '4', name: 'Banana', category: 'fruits_veggies', dietType: 'vegetarian', quantity: 4, unit: 'count' },
    { id: '5', name: 'Rice', category: 'carbs', dietType: 'vegetarian', quantity: 500, unit: 'g' },
    { id: '6', name: 'Dal', category: 'protein', dietType: 'vegetarian', quantity: 300, unit: 'g' },
  ];

  const plan = generateKitchenIngredientsPlan(inventory, {
    goal: 'muscle_gain',
    dietPreference: 'eggetarian',
    targetCalories: 2500,
    targetProtein: 130,
  });

  assert.ok(plan.meals.length >= 2, 'Should generate meals from kitchen foods');
  assert.equal(plan.mode, 'kitchen_inventory');
  assert.ok(plan.ingredientUsageSummary && plan.ingredientUsageSummary.length > 0);
});
