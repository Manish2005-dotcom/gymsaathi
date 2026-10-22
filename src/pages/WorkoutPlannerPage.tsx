import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Dumbbell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Flame,
  Info,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  Bookmark,
  Layers,
  Heart,
  Search,
  Filter,
  ShieldAlert,
  Activity,
  Zap,
  Save,
  Check,
  X,
  Repeat,
} from 'lucide-react';
import {
  Exercise,
  DayWorkoutSession,
  UserProfile,
  WeeklyCustomPlan,
  CustomDayPlan,
  CustomDayExercise,
  MuscleGroup,
  DayKey,
  WorkoutIntensity,
  WorkoutSplitTemplate,
  EquipmentType,
  ExerciseDifficulty,
} from '../types/fitness';
import { EXERCISES, WORKOUT_DAYS } from '../data/exercises';
import { WORKOUT_TEMPLATES, getDefaultWeeklyCustomPlan } from '../data/workoutTemplates';
import { calculateWorkoutVolumeAndRecovery } from '../utils/workoutVolume';
import { StorageService } from '../services/storage';
import { ExerciseModal } from '../components/ExerciseModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { WorkoutExecutionModal } from '../components/WorkoutExecutionModal';
import { AnimatedExercise } from '../components/AnimatedExercise';

interface WorkoutPlannerPageProps {
  profile: UserProfile;
  workoutLogs: Record<string, DayWorkoutSession>;
  onSaveSession: (session: DayWorkoutSession) => void;
  initialDayKey?: string;
}

const ALL_MUSCLE_GROUPS: { key: MuscleGroup; label: string; icon: string }[] = [
  { key: 'chest', label: 'Chest', icon: '🏋️' },
  { key: 'back', label: 'Back & Lats', icon: '🚣' },
  { key: 'biceps', label: 'Biceps', icon: '💪' },
  { key: 'triceps', label: 'Triceps', icon: '🔥' },
  { key: 'shoulders', label: 'Shoulders', icon: '🛡️' },
  { key: 'abs', label: 'Abs / Core', icon: '⚡' },
  { key: 'quadriceps', label: 'Quadriceps', icon: '🦵' },
  { key: 'hamstrings', label: 'Hamstrings', icon: '🏃' },
  { key: 'glutes', label: 'Glutes', icon: '🍑' },
  { key: 'calves', label: 'Calves', icon: '🦶' },
  { key: 'forearms', label: 'Forearms', icon: '✊' },
  { key: 'full_body', label: 'Full Body', icon: '🌐' },
  { key: 'cardio', label: 'Cardio', icon: '🫀' },
  { key: 'mobility', label: 'Mobility & Recovery', icon: '🧘' },
];

const INTENSITY_OPTIONS: { value: WorkoutIntensity; label: string; badgeClass: string }[] = [
  { value: 'light', label: 'Light', badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { value: 'moderate', label: 'Moderate', badgeClass: 'bg-lime-500/15 text-lime-400 border-lime-500/30' },
  { value: 'high', label: 'High', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { value: 'extreme', label: 'Extreme', badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30' },
];

const EQUIPMENT_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Equipment' },
  { value: 'dumbbell', label: 'Dumbbells' },
  { value: 'barbell', label: 'Barbells' },
  { value: 'cable', label: 'Cable Machine' },
  { value: 'machine', label: 'Weight Machines' },
  { value: 'bodyweight', label: 'Bodyweight Only' },
  { value: 'bench', label: 'Bench' },
  { value: 'pullup_bar', label: 'Pull-up Bar' },
  { value: 'bands', label: 'Resistance Bands' },
];

const ORDERED_DAYS: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const WorkoutPlannerPage: React.FC<WorkoutPlannerPageProps> = ({
  profile,
  workoutLogs,
  onSaveSession,
  initialDayKey,
}) => {
  const today = new Date();
  const dayKeyMap: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentTodayKey = dayKeyMap[today.getDay()];
  const todayDateStr = today.toISOString().split('T')[0];

  // Active custom weekly plan
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyCustomPlan>(() =>
    StorageService.getCustomWorkoutPlan()
  );

  // Favorite exercise IDs
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    StorageService.getFavoriteExercises()
  );

  // Custom user-created exercises
  const [customExercises, setCustomExercises] = useState<Exercise[]>(() =>
    StorageService.getCustomExercises()
  );

  // Selected Day Key
  const [selectedDayKey, setSelectedDayKey] = useState<DayKey>(
    (initialDayKey as DayKey) || currentTodayKey
  );

  // Modals & Drawers
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<WorkoutSplitTemplate | null>(null);
  const [showConfirmTemplate, setShowConfirmTemplate] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClearWeek, setShowConfirmClearWeek] = useState(false);
  const [showAddExerciseDrawer, setShowAddExerciseDrawer] = useState(false);
  const [showCreateCustomExerciseModal, setShowCreateCustomExerciseModal] = useState(false);
  const [showVolumeSummary, setShowVolumeSummary] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Exercise Picker Drawer Filter State
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [exerciseMuscleFilter, setExerciseMuscleFilter] = useState<string>('all');
  const [exerciseEquipmentFilter, setExerciseEquipmentFilter] = useState<string>('all');
  const [exerciseDifficultyFilter, setExerciseDifficultyFilter] = useState<string>('all');
  const [onlyFavoritesFilter, setOnlyFavoritesFilter] = useState(false);

  // Custom Exercise Form State
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExercisePrimaryMuscle, setNewExercisePrimaryMuscle] = useState<MuscleGroup>('chest');
  const [newExerciseSecondary, setNewExerciseSecondary] = useState('');
  const [newExerciseEquipment, setNewExerciseEquipment] = useState<EquipmentType>('dumbbell');
  const [newExerciseDifficulty, setNewExerciseDifficulty] = useState<ExerciseDifficulty>('beginner');
  const [newExerciseSets, setNewExerciseSets] = useState(3);
  const [newExerciseReps, setNewExerciseReps] = useState('10-12');
  const [newExerciseRest, setNewExerciseRest] = useState(60);
  const [newExerciseSetup, setNewExerciseSetup] = useState('');
  const [newExerciseSteps, setNewExerciseSteps] = useState('');

  // Combine built-in exercises + user custom exercises
  const allAvailableExercises = useMemo(() => {
    return [...customExercises, ...EXERCISES];
  }, [customExercises]);

  const exerciseMap = useMemo(() => {
    const map = new Map<string, Exercise>();
    allAvailableExercises.forEach((ex) => map.set(ex.id, ex));
    return map;
  }, [allAvailableExercises]);

  // Volume & Recovery Analysis Report
  const volumeReport = useMemo(() => {
    return calculateWorkoutVolumeAndRecovery(weeklyPlan, exerciseMap);
  }, [weeklyPlan, exerciseMap]);

  // Current day data
  const currentDayPlan: CustomDayPlan = weeklyPlan.days[selectedDayKey] || {
    dayKey: selectedDayKey,
    dayName: selectedDayKey.charAt(0).toUpperCase() + selectedDayKey.slice(1),
    isRestDay: false,
    muscleGroups: ['chest'],
    targetTitle: 'Workout Session',
    durationMinutes: 60,
    intensity: 'moderate',
    exercises: [],
  };

  // Retrieve today's workout log session
  const activeSession: DayWorkoutSession = workoutLogs[todayDateStr] || {
    date: todayDateStr,
    dayOfWeek: currentDayPlan.dayName,
    completed: false,
    exercises: {},
  };

  // Persist weekly plan to localStorage helper
  const persistPlan = (updated: WeeklyCustomPlan) => {
    setWeeklyPlan(updated);
    StorageService.saveCustomWorkoutPlan(updated);
  };

  // Day field updates
  const updateCurrentDay = (partial: Partial<CustomDayPlan>) => {
    const updatedPlan: WeeklyCustomPlan = {
      ...weeklyPlan,
      days: {
        ...weeklyPlan.days,
        [selectedDayKey]: {
          ...currentDayPlan,
          ...partial,
        },
      },
      updatedAt: new Date().toISOString(),
    };
    persistPlan(updatedPlan);
  };

  // Toggle Muscle Group on Current Day
  const handleToggleMuscleGroup = (muscle: MuscleGroup) => {
    const current = currentDayPlan.muscleGroups;
    let next: MuscleGroup[];
    if (current.includes(muscle)) {
      next = current.filter((m) => m !== muscle);
    } else {
      next = [...current, muscle];
    }
    // Update targetTitle automatically if generic
    const muscleNames = next.map((m) => m.toUpperCase()).join(' + ');
    const newTitle = next.length > 0 ? `${muscleNames} Focus` : 'Workout Day';
    updateCurrentDay({ muscleGroups: next, targetTitle: newTitle });
  };

  // Toggle Rest vs Workout Day
  const handleToggleRestDay = () => {
    const isNowRest = !currentDayPlan.isRestDay;
    updateCurrentDay({
      isRestDay: isNowRest,
      targetTitle: isNowRest ? 'Rest & Muscle Repair' : 'Custom Training Day',
      durationMinutes: isNowRest ? 0 : (currentDayPlan.durationMinutes || 60),
    });
  };

  // Exercise Management in Selected Day
  const handleAddExerciseToDay = (exerciseId: string) => {
    const ex = exerciseMap.get(exerciseId);
    if (!ex) return;
    const exists = currentDayPlan.exercises.some((e) => e.exerciseId === exerciseId);
    if (exists) return; // avoid duplicates

    const newExerciseItem: CustomDayExercise = {
      exerciseId: ex.id,
      sets: ex.defaultSets || 3,
      reps: ex.defaultReps || '10-12',
      restSeconds: ex.restSeconds || 60,
    };

    updateCurrentDay({
      exercises: [...currentDayPlan.exercises, newExerciseItem],
    });
  };

  const handleRemoveExerciseFromDay = (index: number) => {
    const updated = [...currentDayPlan.exercises];
    updated.splice(index, 1);
    updateCurrentDay({ exercises: updated });
  };

  const handleReorderExercise = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentDayPlan.exercises.length) return;

    const list = [...currentDayPlan.exercises];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    updateCurrentDay({ exercises: list });
  };

  const handleUpdateExerciseParams = (
    index: number,
    partial: Partial<CustomDayExercise>
  ) => {
    const updated = [...currentDayPlan.exercises];
    updated[index] = { ...updated[index], ...partial };
    updateCurrentDay({ exercises: updated });
  };

  // Favorites
  const handleToggleFavorite = (exerciseId: string) => {
    const updatedFavs = StorageService.toggleFavoriteExercise(exerciseId);
    setFavoriteIds(updatedFavs);
  };

  // Custom Exercise Creation
  const handleCreateCustomExercise = () => {
    if (!newExerciseName.trim()) return;

    const newEx: Exercise = {
      id: `custom-${Date.now()}`,
      name: newExerciseName.trim(),
      primaryMuscle: newExercisePrimaryMuscle,
      secondaryMuscles: newExerciseSecondary
        ? newExerciseSecondary.split(',').map((s) => s.trim())
        : [],
      targetMuscleDisplay: newExercisePrimaryMuscle.toUpperCase(),
      equipment: newExerciseEquipment,
      equipmentDisplay: newExerciseEquipment.toUpperCase(),
      difficulty: newExerciseDifficulty,
      defaultSets: newExerciseSets,
      defaultReps: newExerciseReps,
      restSeconds: newExerciseRest,
      daySplit: selectedDayKey,
      setup: newExerciseSetup.trim() || 'Assume proper athletic posture with brace core.',
      bodyAlignment: 'Maintain natural spine curvature and controlled joint angle.',
      movementSteps: newExerciseSteps
        ? newExerciseSteps.split('\n').filter((s) => s.trim())
        : ['Perform controlled concentric movement.', 'Lower with smooth eccentric tension.'],
      breathing: 'Exhale during concentric exertion; inhale smoothly on return.',
      postureCues: ['Keep shoulders back and core engaged.'],
      commonMistakes: ['Rushing through the range of motion without control.'],
      injuryPreventionTips: ['Warm up joints properly before heavier working sets.'],
      beginnerAlternative: 'Perform lighter or bodyweight variation.',
      homeAlternative: 'Use resistance bands or water bottles if dumbbells are absent.',
      videoSearchQuery: `${newExerciseName} workout exercise form`,
      videoSource: 'Custom Exercise',
      isVerifiedEmbed: false,
    };

    StorageService.saveCustomExercise(newEx);
    setCustomExercises((prev) => [newEx, ...prev]);

    // Automatically add to current day
    handleAddExerciseToDay(newEx.id);

    // Reset Form
    setNewExerciseName('');
    setNewExerciseSecondary('');
    setNewExerciseSetup('');
    setNewExerciseSteps('');
    setShowCreateCustomExerciseModal(false);
  };

  // Template Applications
  const handleSelectTemplateForPreview = (tmpl: WorkoutSplitTemplate) => {
    setPendingTemplate(tmpl);
    setShowConfirmTemplate(true);
  };

  const handleApplyPendingTemplate = () => {
    if (!pendingTemplate) return;
    const newDays = pendingTemplate.planFactory();
    const updated: WeeklyCustomPlan = {
      id: `plan-${Date.now()}`,
      name: pendingTemplate.name,
      templateId: pendingTemplate.id,
      days: newDays,
      updatedAt: new Date().toISOString(),
    };
    persistPlan(updated);
    setShowConfirmTemplate(false);
    setShowTemplateModal(false);
    setPendingTemplate(null);

    // Trigger feedback notification
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 2500);
  };

  // Reset to default
  const handleResetToDefault = () => {
    const def = getDefaultWeeklyCustomPlan();
    persistPlan(def);
    setShowConfirmReset(false);
  };

  // Clear entire week
  const handleClearWeek = () => {
    const blankDays = { ...weeklyPlan.days };
    ORDERED_DAYS.forEach((k) => {
      blankDays[k] = {
        ...blankDays[k],
        exercises: [],
      };
    });
    persistPlan({
      ...weeklyPlan,
      days: blankDays,
      updatedAt: new Date().toISOString(),
    });
    setShowConfirmClearWeek(false);
  };

  // Quick navigation between days
  const cycleDay = (dir: 'prev' | 'next') => {
    const currIdx = ORDERED_DAYS.indexOf(selectedDayKey);
    if (dir === 'prev') {
      const newIdx = (currIdx - 1 + ORDERED_DAYS.length) % ORDERED_DAYS.length;
      setSelectedDayKey(ORDERED_DAYS[newIdx]);
    } else {
      const newIdx = (currIdx + 1) % ORDERED_DAYS.length;
      setSelectedDayKey(ORDERED_DAYS[newIdx]);
    }
  };

  // Filter exercises in picker
  const filteredPickerExercises = useMemo(() => {
    return allAvailableExercises.filter((ex) => {
      // Search filter
      const matchesSearch =
        ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
        ex.primaryMuscle.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
        ex.secondaryMuscles.some((m) => m.toLowerCase().includes(exerciseSearchTerm.toLowerCase()));
      if (!matchesSearch) return false;

      // Muscle group filter
      if (exerciseMuscleFilter !== 'all') {
        if (ex.primaryMuscle !== exerciseMuscleFilter) return false;
      } else if (currentDayPlan.muscleGroups.length > 0 && !exerciseSearchTerm) {
        // If no explicit search and muscle groups are chosen, default to relevant muscles
        const relevant = currentDayPlan.muscleGroups.some(
          (m) =>
            ex.primaryMuscle === m ||
            ex.secondaryMuscles.some((sec) => sec.toLowerCase().includes(m))
        );
        if (!relevant) return false;
      }

      // Equipment filter
      if (exerciseEquipmentFilter !== 'all') {
        if (ex.equipment !== exerciseEquipmentFilter) return false;
      }

      // Difficulty filter
      if (exerciseDifficultyFilter !== 'all') {
        if (ex.difficulty !== exerciseDifficultyFilter) return false;
      }

      // Favorites only filter
      if (onlyFavoritesFilter) {
        if (!favoriteIds.includes(ex.id)) return false;
      }

      return true;
    });
  }, [
    allAvailableExercises,
    exerciseSearchTerm,
    exerciseMuscleFilter,
    exerciseEquipmentFilter,
    exerciseDifficultyFilter,
    onlyFavoritesFilter,
    currentDayPlan.muscleGroups,
    favoriteIds,
  ]);

  return (
    <div className="space-y-8 pb-16">
      {/* Exercise Detail Modal */}
      <ExerciseModal
        exercise={selectedExerciseForModal}
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
      />

      {/* Execution Mode Modal */}
      <WorkoutExecutionModal
        isOpen={showExecutionModal}
        dayTitle={`${currentDayPlan.dayName}: ${currentDayPlan.targetTitle}`}
        dayExercises={currentDayPlan.exercises}
        exerciseMap={exerciseMap}
        onClose={() => setShowExecutionModal(false)}
        onFinishWorkout={(session) => {
          onSaveSession(session);
          setShowExecutionModal(false);
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#84cc16', '#22c55e', '#a3e635', '#ffffff'],
            });
          } catch {
            // fallback
          }
        }}
      />

      {/* Confirm Overwrite Template Modal */}
      <ConfirmModal
        isOpen={showConfirmTemplate}
        title="Apply Workout Split Template?"
        message={`Applying "${pendingTemplate?.name}" will replace your current weekly schedule. Your previous exercise customizer changes will be overwritten with this starting split.`}
        confirmLabel="Replace Schedule"
        isDestructive={false}
        onConfirm={handleApplyPendingTemplate}
        onCancel={() => {
          setShowConfirmTemplate(false);
          setPendingTemplate(null);
        }}
      />

      {/* Confirm Reset to Default Modal */}
      <ConfirmModal
        isOpen={showConfirmReset}
        title="Reset to Default Split?"
        message="This will reset your 7-day plan back to GymSaathi's recommended starter split. Any custom exercises added to the days will be replaced."
        confirmLabel="Reset Plan"
        isDestructive={true}
        onConfirm={handleResetToDefault}
        onCancel={() => setShowConfirmReset(false)}
      />

      {/* Confirm Clear Week Modal */}
      <ConfirmModal
        isOpen={showConfirmClearWeek}
        title="Clear Entire Week's Exercises?"
        message="This will remove all exercises from all 7 days so you can build completely from scratch."
        confirmLabel="Clear All Exercises"
        isDestructive={true}
        onConfirm={handleClearWeek}
        onCancel={() => setShowConfirmClearWeek(false)}
      />

      {/* Notification Toast */}
      {saveSuccessNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-lime-500 text-zinc-950 font-bold shadow-xl animate-bounce">
          <Check className="w-5 h-5" />
          <span>Workout plan saved successfully!</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
              <Calendar className="w-4 h-4" />
              <span>Full Customization Engine</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-semibold">{weeklyPlan.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              7-Day Custom Workout Planner
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Design and control your exact weekly training split. Customize muscle groups, add or reorder exercises, inspect real-time weekly volume, and train step-by-step with animated form demos.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-all hover:scale-102"
              title="Apply pre-built workout splits"
            >
              <Layers className="w-4 h-4 text-lime-400" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setShowVolumeSummary(!showVolumeSummary)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border transition-all hover:scale-102 ${
                showVolumeSummary
                  ? 'bg-lime-500/20 text-lime-400 border-lime-500/50'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
              title="Check weekly sets and recovery balance"
            >
              <Activity className="w-4 h-4 text-lime-400" />
              <span>Volume & Recovery ({volumeReport.recoveryWarnings.length})</span>
            </button>

            <button
              onClick={() => {
                StorageService.saveCustomWorkoutPlan(weeklyPlan);
                setSaveSuccessNotification(true);
                setTimeout(() => setSaveSuccessNotification(false), 2200);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs transition-all shadow-md shadow-lime-950/40 hover:scale-102"
              title="Save current custom schedule"
            >
              <Save className="w-4 h-4" />
              <span>Save Plan</span>
            </button>
          </div>
        </div>

        {/* Action bar sub-controls: Clear Week, Reset */}
        <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              Plan status: <strong className="text-white">{volumeReport.totalWorkoutDays} Workout Days</strong> / <strong className="text-zinc-300">{volumeReport.totalRestDays} Rest Days</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Total Weekly Sets: <strong className="text-lime-400">{volumeReport.totalWeeklySets}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirmClearWeek(true)}
              className="hover:text-red-400 transition-colors"
            >
              Clear Week
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Volume & Recovery Drawer / Accordion */}
      {showVolumeSummary && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-lime-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-lime-400" />
              <div>
                <h3 className="font-black text-lg text-white">Weekly Training Volume & Recovery Audit</h3>
                <p className="text-xs text-zinc-400">
                  Calculates your planned working sets per muscle group and checks for sufficient recovery between sessions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVolumeSummary(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Recovery Warnings */}
          {volumeReport.recoveryWarnings.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Recovery & Volume Guidance</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {volumeReport.recoveryWarnings.map((warn, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      warn.severity === 'warning'
                        ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                        : 'bg-blue-950/20 border-blue-900/40 text-blue-200'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>{warn.title}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{warn.description}</p>
                    <div className="pt-1 text-[11px] text-lime-400 font-medium">
                      💡 <strong>Safer Alternative:</strong> {warn.saferAlternative}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-xs text-lime-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />
              <span>
                Optimal recovery distribution! Every trained muscle group has adequate rest windows and balanced volume.
              </span>
            </div>
          )}

          {/* Muscle Group Sets Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Planned Sets per Muscle Group (Weekly Total)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(volumeReport.muscleStats).map(([key, stat]) => {
                const isOptimal = stat.status === 'optimal';
                const isHigh = stat.status === 'high';
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      isHigh
                        ? 'bg-amber-950/20 border-amber-800/40'
                        : stat.weeklySets > 0
                        ? 'bg-zinc-900/80 border-zinc-800'
                        : 'bg-zinc-900/30 border-zinc-900 text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-zinc-200 capitalize truncate">{stat.displayName}</span>
                      <span
                        className={`text-sm font-black ${
                          isHigh
                            ? 'text-amber-400'
                            : stat.weeklySets > 0
                            ? 'text-lime-400'
                            : 'text-zinc-600'
                        }`}
                      >
                        {stat.weeklySets}s
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isHigh ? 'bg-amber-400' : 'bg-lime-400'
                        }`}
                        style={{ width: `${Math.min(100, (stat.weeklySets / 20) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                      <span>{stat.statusNote}</span>
                      {isOptimal && <span className="text-lime-400 font-bold">Optimal</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Interactive Calendar Header Grid */}
      <div className="p-4 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
              <Calendar className="w-4 h-4" />
              <span>Weekly Schedule (Monday – Sunday)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Select Day to Customize
            </h2>
          </div>

          {/* Quick Prev / Next Day navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => cycleDay('prev')}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-300 min-w-[70px] text-center capitalize">
              {currentDayPlan.dayName}
            </span>
            <button
              onClick={() => cycleDay('next')}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Tab Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ORDERED_DAYS.map((dKey) => {
            const plan = weeklyPlan.days[dKey];
            const isSelected = selectedDayKey === dKey;
            const isToday = currentTodayKey === dKey;
            const isRest = plan?.isRestDay;

            return (
              <button
                key={dKey}
                onClick={() => setSelectedDayKey(dKey)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[100px] ${
                  isSelected
                    ? 'bg-lime-500/15 border-lime-400 shadow-md shadow-lime-950/20'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-white capitalize">{dKey.slice(0, 3)}</span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded-md bg-lime-500 text-zinc-950 text-[9px] font-black uppercase">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-semibold text-zinc-300 truncate">
                    {isRest ? (
                      <span className="text-zinc-500 italic">Rest Day</span>
                    ) : (
                      plan?.muscleGroups.map((m) => m.slice(0, 4)).join(', ') || 'Training'
                    )}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                  {isRest ? (
                    <span className="text-zinc-500">Recovery</span>
                  ) : (
                    <>
                      <span className="text-lime-400 font-bold">{plan?.exercises?.length || 0} Ex</span>
                      <span className="text-zinc-400">{plan?.durationMinutes || 60}m</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Customizer Main Workspace */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-8">
        {/* Day Header with Rest Toggle & Execution Launch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Editing Schedule for
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase bg-zinc-800 text-white">
                {currentDayPlan.dayName}
              </span>
              {currentTodayKey === selectedDayKey && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-lime-500 text-zinc-950">
                  Today's Session
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">
              {currentDayPlan.targetTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Rest Day Switch Button */}
            <button
              onClick={handleToggleRestDay}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                currentDayPlan.isRestDay
                  ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {currentDayPlan.isRestDay ? '✓ Scheduled as Rest Day' : 'Mark as Rest Day'}
            </button>

            {/* Launch Guided Workout Execution Mode */}
            {!currentDayPlan.isRestDay && currentDayPlan.exercises.length > 0 && (
              <button
                onClick={() => setShowExecutionModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-lime-950/40 hover:scale-102"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Workout Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* If Rest Day: Rest Guidance View */}
        {currentDayPlan.isRestDay ? (
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-300 flex items-center justify-center mx-auto text-xl">
              🧘
            </div>
            <h3 className="text-xl font-black text-white">Active Recovery & Repair Day</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Muscles do not grow during workouts; they grow during recovery while sleeping and synthesizing dietary proteins. Focus on 3+ liters of hydration, 8 hours of restful sleep, and 20-30 minutes of gentle walking or foam rolling.
            </p>
            <button
              onClick={handleToggleRestDay}
              className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              Switch this to a Workout Day
            </button>
          </div>
        ) : (
          /* Workout Day Configuration */
          <div className="space-y-8">
            {/* 1. Muscle Groups Multi-Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-lime-400">
                    1. Target Muscle Groups (Select One or Multiple)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Mix and match to build any split (e.g. Chest + Triceps, Back + Biceps, Legs + Core).
                  </p>
                </div>
                <span className="text-xs font-semibold text-zinc-400">
                  {currentDayPlan.muscleGroups.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_MUSCLE_GROUPS.map((m) => {
                  const isChecked = currentDayPlan.muscleGroups.includes(m.key);
                  return (
                    <button
                      key={m.key}
                      onClick={() => handleToggleMuscleGroup(m.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isChecked
                          ? 'bg-lime-500/20 text-lime-300 border-lime-500 shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-lime-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Duration & Intensity Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-lime-400" />
                    <span>Estimated Training Duration</span>
                  </span>
                  <span className="text-lime-400 font-black">{currentDayPlan.durationMinutes || 60} mins</span>
                </label>
                <div className="flex items-center gap-2">
                  {[30, 45, 60, 75, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => updateCurrentDay({ durationMinutes: mins })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        currentDayPlan.durationMinutes === mins
                          ? 'bg-lime-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-lime-400" />
                    <span>Workout Intensity / Difficulty</span>
                  </span>
                  <span className="text-zinc-300 capitalize font-bold">{currentDayPlan.intensity}</span>
                </label>
                <div className="flex items-center gap-2">
                  {INTENSITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateCurrentDay({ intensity: opt.value })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        currentDayPlan.intensity === opt.value
                          ? opt.badgeClass
                          : 'bg-zinc-800 text-zinc-400 border-transparent hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Exercises Scheduled for this Day */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-lime-400">
                    2. Exercises to Perform ({currentDayPlan.exercises.length})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Reorder sequence with arrows, adjust sets/reps/rest, or click any exercise to view the cartoon animation guide.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddExerciseDrawer(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Exercise</span>
                  </button>

                  <button
                    onClick={() => setShowCreateCustomExerciseModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 transition-colors"
                  >
                    <span>+ Custom Exercise</span>
                  </button>
                </div>
              </div>

              {/* Exercise List */}
              {currentDayPlan.exercises.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                  <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-sm font-bold text-zinc-300">No exercises added yet for {currentDayPlan.dayName}</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Choose from 42+ exercises with cartoon form demos filtered by your target muscles ({currentDayPlan.muscleGroups.join(', ') || 'all'}).
                  </p>
                  <button
                    onClick={() => setShowAddExerciseDrawer(true)}
                    className="px-4 py-2 rounded-xl bg-lime-500 text-zinc-950 font-bold text-xs hover:bg-lime-400"
                  >
                    Browse Exercise Library
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDayPlan.exercises.map((item, idx) => {
                    const ex = exerciseMap.get(item.exerciseId);
                    if (!ex) return null;
                    const isFav = favoriteIds.includes(ex.id);

                    return (
                      <div
                        key={`${item.exerciseId}-${idx}`}
                        className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Left: Reorder arrows + Exercise Title + Info */}
                        <div className="flex items-start gap-3">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-1 items-center flex-shrink-0">
                            <button
                              onClick={() => handleReorderExercise(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-bold text-zinc-500">{idx + 1}</span>
                            <button
                              onClick={() => handleReorderExercise(idx, 'down')}
                              disabled={idx === currentDayPlan.exercises.length - 1}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
                                {ex.primaryMuscle}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300">
                                {ex.equipmentDisplay}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <h4
                                onClick={() => setSelectedExerciseForModal(ex)}
                                className="font-bold text-white text-base hover:text-lime-400 cursor-pointer transition-colors"
                              >
                                {ex.name}
                              </h4>

                              <button
                                onClick={() => handleToggleFavorite(ex.id)}
                                className="text-zinc-500 hover:text-red-400 transition-colors"
                                title="Add to favorites"
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    isFav ? 'text-red-500 fill-current' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            <p className="text-xs text-zinc-400 line-clamp-1">
                              Target: {ex.targetMuscleDisplay}
                            </p>

                            {/* Equipment Substitution Tip if available */}
                            {ex.beginnerAlternative && (
                              <div className="text-[11px] text-zinc-400 pt-0.5">
                                <span className="text-zinc-500">Sub / Alt:</span> {ex.beginnerAlternative}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Sets, Reps, Rest Steppers & Actions */}
                        <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                          {/* Sets Stepper */}
                          <div className="flex flex-col text-center">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Sets</span>
                            <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
                              <button
                                onClick={() =>
                                  handleUpdateExerciseParams(idx, {
                                    sets: Math.max(1, item.sets - 1),
                                  })
                                }
                                className="px-2 py-1 text-zinc-400 hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold text-lime-400 text-xs min-w-[24px]">
                                {item.sets}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateExerciseParams(idx, {
                                    sets: Math.min(8, item.sets + 1),
                                  })
                                }
                                className="px-2 py-1 text-zinc-400 hover:text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Reps Input */}
                          <div className="flex flex-col text-center">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Reps</span>
                            <input
                              type="text"
                              value={item.reps}
                              onChange={(e) =>
                                handleUpdateExerciseParams(idx, { reps: e.target.value })
                              }
                              className="w-16 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white text-center font-bold"
                            />
                          </div>

                          {/* Rest Seconds */}
                          <div className="flex flex-col text-center">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Rest</span>
                            <select
                              value={item.restSeconds}
                              onChange={(e) =>
                                handleUpdateExerciseParams(idx, {
                                  restSeconds: Number(e.target.value),
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                            >
                              <option value={30}>30s</option>
                              <option value={45}>45s</option>
                              <option value={60}>60s</option>
                              <option value={75}>75s</option>
                              <option value={90}>90s</option>
                              <option value={120}>120s</option>
                            </select>
                          </div>

                          {/* View Animated Form Guide */}
                          <button
                            onClick={() => setSelectedExerciseForModal(ex)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-lime-400 font-bold text-xs transition-colors"
                            title="Open animated skeletal demonstration"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Animation</span>
                          </button>

                          {/* Delete Exercise */}
                          <button
                            onClick={() => handleRemoveExerciseFromDay(idx)}
                            className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                            title="Remove exercise from day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Split Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-2xl my-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="templates-modal-title"
          >
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
              <div>
                <h3 id="templates-modal-title" className="text-xl font-black text-white">
                  Choose Starting Split Template
                </h3>
                <p className="text-xs text-zinc-400">
                  Select a proven training framework. All templates populate as 100% editable starting schedules.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {WORKOUT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{tmpl.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
                        {tmpl.daysPerWeek} Days/Wk
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{tmpl.description}</p>
                  </div>

                  <button
                    onClick={() => handleSelectTemplateForPreview(tmpl)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs transition-colors flex-shrink-0"
                  >
                    <span>Apply Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Modal / Drawer */}
      {showAddExerciseDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-4xl my-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exercise-picker-title"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
              <div>
                <h3 id="exercise-picker-title" className="text-xl font-black text-white">
                  Add Exercises to {currentDayPlan.dayName}
                </h3>
                <p className="text-xs text-zinc-400">
                  Showing exercises for: <strong className="text-lime-400">{currentDayPlan.muscleGroups.join(', ') || 'All Muscles'}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowAddExerciseDrawer(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search exercises by name, primary or secondary muscle..."
                  value={exerciseSearchTerm}
                  onChange={(e) => setExerciseSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* Muscle Filter */}
                <select
                  value={exerciseMuscleFilter}
                  onChange={(e) => setExerciseMuscleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200"
                >
                  <option value="all">Day's Target Muscles</option>
                  {ALL_MUSCLE_GROUPS.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* Equipment Filter */}
                <select
                  value={exerciseEquipmentFilter}
                  onChange={(e) => setExerciseEquipmentFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200"
                >
                  {EQUIPMENT_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={exerciseDifficultyFilter}
                  onChange={(e) => setExerciseDifficultyFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                {/* Favorites Only Toggle */}
                <button
                  onClick={() => setOnlyFavoritesFilter(!onlyFavoritesFilter)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                    onlyFavoritesFilter
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${onlyFavoritesFilter ? 'fill-current' : ''}`} />
                  <span>Favorites Only</span>
                </button>
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-6 overflow-y-auto space-y-3">
              {filteredPickerExercises.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No matching exercises found. Try selecting "All Muscles" or searching another term.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredPickerExercises.map((ex) => {
                    const alreadyAdded = currentDayPlan.exercises.some((e) => e.exerciseId === ex.id);
                    const isFav = favoriteIds.includes(ex.id);

                    return (
                      <div
                        key={ex.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          alreadyAdded
                            ? 'bg-zinc-950/40 border-lime-500/30'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
                              {ex.primaryMuscle}
                            </span>
                            <button
                              onClick={() => handleToggleFavorite(ex.id)}
                              className="text-zinc-500 hover:text-red-400"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-current' : ''}`} />
                            </button>
                          </div>

                          <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {ex.equipmentDisplay} • {ex.defaultSets} Sets × {ex.defaultReps}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedExerciseForModal(ex)}
                            className="text-[11px] text-zinc-400 hover:text-lime-400 flex items-center gap-1"
                          >
                            <Flame className="w-3 h-3 text-lime-400" />
                            <span>Animation Demo</span>
                          </button>

                          <button
                            onClick={() => handleAddExerciseToDay(ex.id)}
                            disabled={alreadyAdded}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                              alreadyAdded
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-lime-500 hover:bg-lime-400 text-zinc-950'
                            }`}
                          >
                            {alreadyAdded ? '✓ Added' : '+ Add to Day'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {currentDayPlan.exercises.length} exercises in this session
              </span>
              <button
                onClick={() => setShowAddExerciseDrawer(false)}
                className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Exercise Modal */}
      {showCreateCustomExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-lg my-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-exercise-modal-title"
          >
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
              <div>
                <h3 id="create-exercise-modal-title" className="text-xl font-black text-white">
                  Add Custom Exercise
                </h3>
                <p className="text-xs text-zinc-400">
                  Create your own specialized exercise to add to your workout plan.
                </p>
              </div>
              <button
                onClick={() => setShowCreateCustomExerciseModal(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-bold">Exercise Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Incline Cable Fly, Decline Push-Up"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold">Primary Muscle</label>
                  <select
                    value={newExercisePrimaryMuscle}
                    onChange={(e) => setNewExercisePrimaryMuscle(e.target.value as MuscleGroup)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  >
                    {ALL_MUSCLE_GROUPS.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold">Equipment Required</label>
                  <select
                    value={newExerciseEquipment}
                    onChange={(e) => setNewExerciseEquipment(e.target.value as EquipmentType)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="dumbbell">Dumbbell</option>
                    <option value="barbell">Barbell</option>
                    <option value="cable">Cable Machine</option>
                    <option value="machine">Machine</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="bench">Bench</option>
                    <option value="bands">Resistance Bands</option>
                    <option value="pullup_bar">Pull-up Bar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold">Default Sets</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={newExerciseSets}
                    onChange={(e) => setNewExerciseSets(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold">Target Reps</label>
                  <input
                    type="text"
                    value={newExerciseReps}
                    onChange={(e) => setNewExerciseReps(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold">Rest Seconds</label>
                  <input
                    type="number"
                    value={newExerciseRest}
                    onChange={(e) => setNewExerciseRest(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-center"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-bold">Setup & Technique Guidance</label>
                <textarea
                  rows={2}
                  placeholder="Body alignment cues, joint angles..."
                  value={newExerciseSetup}
                  onChange={(e) => setNewExerciseSetup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateCustomExerciseModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomExercise}
                disabled={!newExerciseName.trim()}
                className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs disabled:opacity-40"
              >
                Save & Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
