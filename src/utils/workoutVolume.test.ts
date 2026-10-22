import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWorkoutVolumeAndRecovery } from './workoutVolume';
import { Exercise, WeeklyCustomPlan } from '../types/fitness';

const mockExerciseMap = new Map<string, Exercise>([
  [
    'bench-press',
    {
      id: 'bench-press',
      name: 'Bench Press',
      primaryMuscle: 'chest',
      secondaryMuscles: ['triceps', 'anterior deltoids'],
      targetMuscleDisplay: 'Chest',
      equipment: 'barbell',
      equipmentDisplay: 'Barbell',
      difficulty: 'intermediate',
      defaultSets: 4,
      defaultReps: '8-10',
      restSeconds: 90,
      daySplit: 'wednesday',
      setup: '',
      bodyAlignment: '',
      movementSteps: [],
      breathing: '',
      postureCues: [],
      commonMistakes: [],
      injuryPreventionTips: [],
      beginnerAlternative: '',
      homeAlternative: '',
      videoSearchQuery: 'bench press',
      videoSource: 'YouTube',
      isVerifiedEmbed: false,
    },
  ],
  [
    'squat',
    {
      id: 'squat',
      name: 'Squat',
      primaryMuscle: 'legs',
      secondaryMuscles: ['glutes'],
      targetMuscleDisplay: 'Legs',
      equipment: 'barbell',
      equipmentDisplay: 'Barbell',
      difficulty: 'intermediate',
      defaultSets: 4,
      defaultReps: '8-10',
      restSeconds: 90,
      daySplit: 'saturday',
      setup: '',
      bodyAlignment: '',
      movementSteps: [],
      breathing: '',
      postureCues: [],
      commonMistakes: [],
      injuryPreventionTips: [],
      beginnerAlternative: '',
      homeAlternative: '',
      videoSearchQuery: 'squat',
      videoSource: 'YouTube',
      isVerifiedEmbed: false,
    },
  ],
]);

test('calculateWorkoutVolumeAndRecovery detects rest days and calculates planned sets', () => {
  const plan: WeeklyCustomPlan = {
    id: 'test-plan',
    name: 'Test Plan',
    updatedAt: new Date().toISOString(),
    days: {
      monday: {
        dayKey: 'monday',
        dayName: 'Monday',
        isRestDay: false,
        muscleGroups: ['chest'],
        targetTitle: 'Chest Day',
        durationMinutes: 60,
        intensity: 'moderate',
        exercises: [{ exerciseId: 'bench-press', sets: 4, reps: '8-10', restSeconds: 90 }],
      },
      tuesday: {
        dayKey: 'tuesday',
        dayName: 'Tuesday',
        isRestDay: true,
        muscleGroups: ['mobility'],
        targetTitle: 'Rest Day',
        durationMinutes: 0,
        intensity: 'light',
        exercises: [],
      },
      wednesday: {
        dayKey: 'wednesday',
        dayName: 'Wednesday',
        isRestDay: false,
        muscleGroups: ['legs'],
        targetTitle: 'Leg Day',
        durationMinutes: 60,
        intensity: 'high',
        exercises: [{ exerciseId: 'squat', sets: 4, reps: '8-10', restSeconds: 90 }],
      },
      thursday: {
        dayKey: 'thursday',
        dayName: 'Thursday',
        isRestDay: true,
        muscleGroups: [],
        targetTitle: 'Rest',
        durationMinutes: 0,
        intensity: 'light',
        exercises: [],
      },
      friday: {
        dayKey: 'friday',
        dayName: 'Friday',
        isRestDay: false,
        muscleGroups: ['chest'],
        targetTitle: 'Chest Day',
        durationMinutes: 60,
        intensity: 'moderate',
        exercises: [{ exerciseId: 'bench-press', sets: 4, reps: '8-10', restSeconds: 90 }],
      },
      saturday: {
        dayKey: 'saturday',
        dayName: 'Saturday',
        isRestDay: true,
        muscleGroups: [],
        targetTitle: 'Rest',
        durationMinutes: 0,
        intensity: 'light',
        exercises: [],
      },
      sunday: {
        dayKey: 'sunday',
        dayName: 'Sunday',
        isRestDay: true,
        muscleGroups: [],
        targetTitle: 'Rest',
        durationMinutes: 0,
        intensity: 'light',
        exercises: [],
      },
    },
  };

  const report = calculateWorkoutVolumeAndRecovery(plan, mockExerciseMap);
  assert.equal(report.totalWorkoutDays, 3);
  assert.equal(report.totalRestDays, 4);
  assert.equal(report.muscleStats['chest'].weeklySets, 8);
  assert.equal(report.muscleStats['legs'].weeklySets, 4);
  // Triceps should have secondary stimulus of 2 sets from each 4-set bench press -> 4 sets total
  assert.equal(report.muscleStats['triceps'].weeklySets, 4);
});

test('calculateWorkoutVolumeAndRecovery detects zero rest days', () => {
  const planAllWork: WeeklyCustomPlan = {
    id: 'test-all-work',
    name: 'All Work',
    updatedAt: new Date().toISOString(),
    days: {
      monday: { dayKey: 'monday', dayName: 'Mon', isRestDay: false, muscleGroups: ['chest'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
      tuesday: { dayKey: 'tuesday', dayName: 'Tue', isRestDay: false, muscleGroups: ['back'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
      wednesday: { dayKey: 'wednesday', dayName: 'Wed', isRestDay: false, muscleGroups: ['legs'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
      thursday: { dayKey: 'thursday', dayName: 'Thu', isRestDay: false, muscleGroups: ['shoulders'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
      friday: { dayKey: 'friday', dayName: 'Fri', isRestDay: false, muscleGroups: ['biceps'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
      saturday: { dayKey: 'saturday', dayName: 'Sat', isRestDay: false, muscleGroups: ['triceps'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
      sunday: { dayKey: 'sunday', dayName: 'Sun', isRestDay: false, muscleGroups: ['abs'], targetTitle: '', durationMinutes: 60, intensity: 'moderate', exercises: [] },
    },
  };

  const report = calculateWorkoutVolumeAndRecovery(planAllWork, mockExerciseMap);
  assert.equal(report.totalRestDays, 0);
  assert.ok(report.recoveryWarnings.some((w) => w.title.includes('Zero Rest Days')));
});
