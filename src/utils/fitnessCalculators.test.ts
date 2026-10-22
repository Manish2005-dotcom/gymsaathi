import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBMR, calculateBMI, calculateMacroTargets, getActivityMultiplier } from './fitnessCalculators';

test('calculateBMR produces correct Mifflin-St Jeor values for male and female', () => {
  // Male: 25yo, 70kg, 175cm -> 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
  const maleBmr = calculateBMR({ age: 25, gender: 'male', heightCm: 175, weightKg: 70 });
  assert.equal(maleBmr, 1674);

  // Female: 25yo, 60kg, 160cm -> 10*60 + 6.25*160 - 5*25 - 161 = 600 + 1000 - 125 - 161 = 1314
  const femaleBmr = calculateBMR({ age: 25, gender: 'female', heightCm: 160, weightKg: 60 });
  assert.equal(femaleBmr, 1314);
});

test('calculateBMI handles valid numbers and returns proper category', () => {
  const normal = calculateBMI(68, 172);
  assert.equal(normal.bmi, 23.0);
  assert.match(normal.category, /Overweight/);

  const healthy = calculateBMI(62, 172);
  assert.equal(healthy.bmi, 21.0);
  assert.match(healthy.category, /Normal/);

  const zero = calculateBMI(0, 170);
  assert.equal(zero.bmi, 0);
});

test('calculateMacroTargets calculates proper surplus for muscle gain and deficit for fat loss', () => {
  const musclePlan = calculateMacroTargets(
    { age: 22, gender: 'male', heightCm: 175, weightKg: 70 },
    'moderate',
    'muscle_gain'
  );
  // BMR = 1689 (10*70 + 6.25*175 - 5*22 + 5 = 700 + 1093.75 - 110 + 5 = 1688.75 -> 1689)
  // TDEE = 1689 * 1.55 = 2617.95 -> 2618
  // Target = 2618 + 350 = 2968
  assert.ok(musclePlan.targetCalories > musclePlan.maintenanceCalories);
  assert.equal(musclePlan.targetProteinGrams, Math.round(70 * 1.8));

  const fatLossPlan = calculateMacroTargets(
    { age: 22, gender: 'male', heightCm: 175, weightKg: 70 },
    'moderate',
    'fat_loss'
  );
  assert.ok(fatLossPlan.targetCalories < fatLossPlan.maintenanceCalories);
  assert.equal(fatLossPlan.targetProteinGrams, Math.round(70 * 1.8));
});
