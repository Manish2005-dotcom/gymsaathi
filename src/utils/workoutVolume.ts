import { CustomDayPlan, Exercise, MuscleGroup, WeeklyCustomPlan } from '../types/fitness';

export interface MuscleVolumeStats {
  muscle: MuscleGroup;
  displayName: string;
  weeklySets: number;
  status: 'low' | 'optimal' | 'high';
  statusNote: string;
}

export interface VolumeRecoveryReport {
  totalWorkoutDays: number;
  totalRestDays: number;
  totalWeeklyExercises: number;
  totalWeeklySets: number;
  muscleStats: Record<string, MuscleVolumeStats>;
  recoveryWarnings: {
    severity: 'info' | 'warning' | 'caution';
    title: string;
    description: string;
    saferAlternative: string;
  }[];
}

const MUSCLE_DISPLAY_NAMES: Record<string, string> = {
  chest: 'Chest',
  back: 'Back & Lats',
  biceps: 'Biceps',
  triceps: 'Triceps',
  shoulders: 'Shoulders',
  abs: 'Abs & Core',
  legs: 'Legs',
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  forearms: 'Forearms',
  full_body: 'Full Body',
  cardio: 'Cardio',
  mobility: 'Mobility & Recovery',
};

/**
 * Calculates planned weekly sets and analyzes training volume & recovery
 */
export function calculateWorkoutVolumeAndRecovery(
  weeklyPlan: WeeklyCustomPlan,
  exerciseMap: Map<string, Exercise>
): VolumeRecoveryReport {
  const days = Object.values(weeklyPlan.days);
  let totalWorkoutDays = 0;
  let totalRestDays = 0;
  let totalWeeklyExercises = 0;
  let totalWeeklySets = 0;

  const setsPerMuscle: Record<string, number> = {};

  // Initialize all muscle keys
  Object.keys(MUSCLE_DISPLAY_NAMES).forEach((key) => {
    setsPerMuscle[key] = 0;
  });

  days.forEach((day) => {
    if (day.isRestDay) {
      totalRestDays++;
      return;
    }

    totalWorkoutDays++;
    totalWeeklyExercises += day.exercises.length;

    day.exercises.forEach((item) => {
      const exercise = exerciseMap.get(item.exerciseId);
      const sets = item.sets || 3;
      totalWeeklySets += sets;

      if (exercise) {
        // Add to primary muscle
        const primary = exercise.primaryMuscle;
        setsPerMuscle[primary] = (setsPerMuscle[primary] || 0) + sets;

        // If secondary muscles exist, allocate half-volume stimulus
        exercise.secondaryMuscles.forEach((sec) => {
          const secLower = sec.toLowerCase();
          if (secLower.includes('tricep')) setsPerMuscle['triceps'] = (setsPerMuscle['triceps'] || 0) + Math.round(sets * 0.5);
          if (secLower.includes('bicep')) setsPerMuscle['biceps'] = (setsPerMuscle['biceps'] || 0) + Math.round(sets * 0.5);
          if (secLower.includes('rear delt') || secLower.includes('shoulder')) setsPerMuscle['shoulders'] = (setsPerMuscle['shoulders'] || 0) + Math.round(sets * 0.5);
          if (secLower.includes('hamstring')) setsPerMuscle['hamstrings'] = (setsPerMuscle['hamstrings'] || 0) + Math.round(sets * 0.5);
          if (secLower.includes('glute')) setsPerMuscle['glutes'] = (setsPerMuscle['glutes'] || 0) + Math.round(sets * 0.5);
          if (secLower.includes('core') || secLower.includes('abs')) setsPerMuscle['abs'] = (setsPerMuscle['abs'] || 0) + Math.round(sets * 0.5);
        });
      }
    });
  });

  // Calculate volume status per muscle
  const muscleStats: Record<string, MuscleVolumeStats> = {};
  Object.keys(MUSCLE_DISPLAY_NAMES).forEach((muscleKey) => {
    const sets = setsPerMuscle[muscleKey] || 0;
    let status: 'low' | 'optimal' | 'high' = 'low';
    let statusNote = 'Maintenance / Low Stimulus (<10 sets)';

    if (sets >= 10 && sets <= 20) {
      status = 'optimal';
      statusNote = 'Optimal Growth Zone (10-20 weekly sets)';
    } else if (sets > 20) {
      status = 'high';
      statusNote = 'High Volume (>20 weekly sets) — Monitor fatigue';
    }

    muscleStats[muscleKey] = {
      muscle: muscleKey as MuscleGroup,
      displayName: MUSCLE_DISPLAY_NAMES[muscleKey],
      weeklySets: sets,
      status,
      statusNote,
    };
  });

  // Analyze recovery warnings
  const recoveryWarnings: VolumeRecoveryReport['recoveryWarnings'] = [];

  // Warning 1: No rest days
  if (totalRestDays === 0) {
    recoveryWarnings.push({
      severity: 'caution',
      title: 'Zero Rest Days Scheduled',
      description: 'You have programmed workouts on all 7 days of the week. Connective tissue, tendons, and central nervous systems require at least 1-2 full rest days for systemic recovery and growth.',
      saferAlternative: 'Schedule Sunday (or at least one weekday) as an Active Recovery or Rest day with gentle walking and mobility drills.',
    });
  }

  // Warning 2: High volume on specific muscles
  Object.values(muscleStats).forEach((stat) => {
    if (stat.weeklySets > 24) {
      recoveryWarnings.push({
        severity: 'warning',
        title: `High Weekly Volume for ${stat.displayName} (${stat.weeklySets} sets)`,
        description: `Research shows diminishing returns and increased joint wear when training a single muscle group beyond 20-22 hard sets per week.`,
        saferAlternative: `Consider trimming 3-4 sets from ${stat.displayName} or distributing volume across two spaced sessions with higher intensity.`,
      });
    }
  });

  // Warning 3: Consecutive muscle group overlap (e.g. Chest on Wednesday then Shoulders/Triceps on Thursday)
  const dayKeys: (keyof WeeklyCustomPlan['days'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (let i = 0; i < dayKeys.length; i++) {
    const todayKey = dayKeys[i];
    const nextKey = dayKeys[(i + 1) % dayKeys.length];
    const todayPlan = weeklyPlan.days[todayKey];
    const nextPlan = weeklyPlan.days[nextKey];

    if (!todayPlan?.isRestDay && !nextPlan?.isRestDay) {
      const todayMuscles = todayPlan.muscleGroups;
      const nextMuscles = nextPlan.muscleGroups;

      // Check chest -> shoulders
      if (todayMuscles.includes('chest') && nextMuscles.includes('shoulders')) {
        recoveryWarnings.push({
          severity: 'info',
          title: `Shoulder Pressing Immediately Following Chest (${todayPlan.dayName} → ${nextPlan.dayName})`,
          description: `Heavy chest bench pressing heavily recruits the anterior deltoids and triceps. Performing heavy overhead presses the very next day can lead to accumulated shoulder fatigue.`,
          saferAlternative: `Swap shoulder day with a pulling session (Back/Biceps) or insert a rest day in between.`,
        });
      }

      // Check legs -> legs
      if (todayMuscles.includes('legs') && nextMuscles.includes('legs')) {
        recoveryWarnings.push({
          severity: 'caution',
          title: `Consecutive Leg Training Days (${todayPlan.dayName} → ${nextPlan.dayName})`,
          description: `Quadriceps and hamstrings are massive muscle groups that benefit from 48-72 hours of recovery between heavy loads.`,
          saferAlternative: `Space your leg sessions by at least 2 days (e.g., Monday and Thursday) to allow glycogen replenishment.`,
        });
      }
    }
  }

  return {
    totalWorkoutDays,
    totalRestDays,
    totalWeeklyExercises,
    totalWeeklySets,
    muscleStats,
    recoveryWarnings,
  };
}
