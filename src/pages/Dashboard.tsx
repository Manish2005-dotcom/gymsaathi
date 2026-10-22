import React from 'react';
import {
  Flame,
  Dumbbell,
  UtensilsCrossed,
  LineChart,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Refrigerator,
  Info,
} from 'lucide-react';
import { NavTab } from '../components/Sidebar';
import { UserProfile, DayWorkoutSession, GeneratedDietPlan, Exercise, DayKey } from '../types/fitness';
import { WORKOUT_DAYS, EXERCISES } from '../data/exercises';
import { calculateMacroTargets } from '../utils/fitnessCalculators';
import { StorageService } from '../services/storage';

interface DashboardProps {
  profile: UserProfile;
  workoutLogs: Record<string, DayWorkoutSession>;
  activeDietPlan: GeneratedDietPlan | null;
  onNavigate: (tab: NavTab) => void;
  onSelectWorkoutDay?: (dayKey: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  workoutLogs,
  activeDietPlan,
  onNavigate,
  onSelectWorkoutDay,
}) => {
  // Current local day
  const today = new Date();
  const dayIndex = today.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const dayKeyMap: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayKey: DayKey = dayKeyMap[dayIndex];
  const dateStr = today.toISOString().split('T')[0];

  const customPlan = StorageService.getCustomWorkoutPlan();
  const customDay = customPlan?.days?.[currentDayKey];
  const isTodayRest = customDay ? customDay.isRestDay : currentDayKey === 'sunday';
  const todayMeta = WORKOUT_DAYS.find((d) => d.dayKey === currentDayKey) || WORKOUT_DAYS[1];
  
  const allExercisesMap = new Map(EXERCISES.map((e) => [e.id, e]));
  const todayExercises: Exercise[] = customDay && customDay.exercises?.length > 0
    ? (customDay.exercises.map((item: { exerciseId: string }) => allExercisesMap.get(item.exerciseId)).filter(Boolean) as Exercise[])
    : EXERCISES.filter((e) => e.daySplit === currentDayKey);

  const todayLog = workoutLogs[dateStr];
  const isTodayCompleted = todayLog?.completed || false;
  const completedCount = todayLog ? Object.values(todayLog.exercises).filter((e) => e.completed).length : 0;

  // Macro target calculations
  const macroResults = calculateMacroTargets(
    {
      age: profile.age,
      gender: profile.gender,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
    },
    profile.activityLevel,
    profile.goal
  );

  // Weekly consistency calculation (last 7 days)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const fullDay = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isDone = workoutLogs[dStr]?.completed;
    return { date: dStr, narrow: dayName, short: fullDay, done: isDone, isToday: i === 6 };
  });

  const weeklyStreak = past7Days.filter((d) => d.done).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-lime-500/15 text-lime-400 text-xs font-bold border border-lime-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Namaste, {profile.name || 'Friend'}!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to crush your goals today?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Target: <span className="text-zinc-200 font-semibold capitalize">{profile.goal.replace('_', ' ')}</span> • Current Weight: <span className="text-zinc-200 font-semibold">{profile.weightKg} kg</span> • Experience: <span className="text-zinc-200 font-semibold capitalize">{profile.experience}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('workout-planner')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-lime-950/40 hover:scale-105"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Today's Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Workout + Daily Nutrition Target */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Card (2 cols on lg) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-500/15 text-lime-400 border border-lime-500/20 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-lime-400">
                  Today's Training ({customDay?.dayName || todayMeta.label})
                </div>
                <h3 className="text-lg font-black text-white">
                  {customDay?.targetTitle || todayMeta.title}
                </h3>
              </div>
            </div>

            {isTodayCompleted ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/20 text-lime-400 border border-lime-500/40 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-zinc-400">
                {isTodayRest ? 'Rest Day' : `${completedCount}/${todayExercises.length} Exercises Logged`}
              </span>
            )}
          </div>

          {isTodayRest ? (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Scheduled Active Recovery & Muscle Repair</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No heavy lifting scheduled today! Muscles synthesize new tissue during rest periods. Aim for 20-30 minutes of gentle walking, joint mobility, 3+ liters of water, and 8 hours of sleep.
              </p>
              <button
                onClick={() => onNavigate('workout-planner')}
                className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1.5"
              >
                <span>Customize Schedule or Open Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {todayExercises.slice(0, 6).map((ex, idx) => {
                  const isDone = todayLog?.exercises[ex.id]?.completed;
                  return (
                    <div
                      key={ex.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        isDone
                          ? 'bg-lime-950/20 border-lime-500/30 text-lime-200'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white">{ex.name}</div>
                          <div className="text-[10px] text-zinc-400">{ex.defaultSets} sets × {ex.defaultReps}</div>
                        </div>
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-zinc-500">
                  Target Muscle: <strong className="text-zinc-300">{todayMeta.target}</strong>
                </span>
                <button
                  onClick={() => {
                    if (onSelectWorkoutDay) onSelectWorkoutDay(currentDayKey);
                    onNavigate('workout-planner');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300"
                >
                  <span>Open Full Workout & Form Cues</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nutritional Targets & Calories */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Daily Fuel Targets</div>
                <h3 className="text-lg font-black text-white">Nutrition Goals</h3>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-1">
              <div className="text-xs text-zinc-400">Target Daily Calories</div>
              <div className="text-3xl font-black text-white">{macroResults.targetCalories} <span className="text-sm font-normal text-zinc-400">kcal</span></div>
              <div className="text-[11px] text-zinc-400">
                Maintenance: {macroResults.maintenanceCalories} kcal
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">Daily Protein</span>
                  <span className="text-lime-400 font-bold">{macroResults.targetProteinGrams}g target</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full"
                    style={{
                      width: `${Math.min(100, activeDietPlan ? (activeDietPlan.actualProtein / macroResults.targetProteinGrams) * 100 : 85)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">Carbohydrates</span>
                  <span className="font-bold text-white text-sm">{macroResults.targetCarbsGrams}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">Healthy Fats</span>
                  <span className="font-bold text-white text-sm">{macroResults.targetFatsGrams}g</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('diet-planner')}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{activeDietPlan ? 'View Active Meal Plan' : 'Generate Diet Plan'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Consistency Bar (Last 7 Days) */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lime-400" />
              <span>Weekly Workout Consistency</span>
            </h3>
            <p className="text-xs text-zinc-400">Consistency beats intensity. Check off your workouts as you complete them.</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-bold">
            {weeklyStreak} of 7 Days Completed
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {past7Days.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                item.done
                  ? 'bg-lime-500/15 border-lime-500/40 text-lime-400 font-bold'
                  : item.isToday
                  ? 'bg-zinc-900 border-zinc-600 text-white'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider">{item.short}</div>
              <div className="my-1.5 flex justify-center">
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${item.isToday ? 'border-lime-400' : 'border-zinc-700'}`} />
                )}
              </div>
              <div className="text-[10px] text-zinc-400">{item.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('kitchen-planner')}
          className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Refrigerator className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
            Kitchen Inventory
          </h4>
          <p className="text-xs text-zinc-400 mt-1">Plan meals with ingredients already in your home fridge.</p>
        </div>

        <div
          onClick={() => onNavigate('exercise-library')}
          className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors">
            Exercise Library
          </h4>
          <p className="text-xs text-zinc-400 mt-1">42+ movements with video tutorials and posture cues.</p>
        </div>

        <div
          onClick={() => onNavigate('calculator')}
          className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
            Calorie & Macro Calc
          </h4>
          <p className="text-xs text-zinc-400 mt-1">Mifflin-St Jeor BMR, TDEE, and Indian BMI screening.</p>
        </div>

        <div
          onClick={() => onNavigate('progress-tracker')}
          className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <LineChart className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">
            Progress Tracker
          </h4>
          <p className="text-xs text-zinc-400 mt-1">Log body weight, waist changes, and export CSV logs.</p>
        </div>
      </div>

      {/* Beginner Tip of the Day */}
      <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-4 text-xs text-zinc-400">
        <Info className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">GymSaathi Pro-Tip for Beginners:</strong>
          <span>
            Don't worry about lifting the heaviest dumbbells on day one. Focus on mastering the 3-second eccentric (lowering) tempo with zero body swing. A lighter weight with strict control triggers significantly greater muscle hypertrophy and shields your ligaments from strain.
          </span>
        </div>
      </div>
    </div>
  );
};
