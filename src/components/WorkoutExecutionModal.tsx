import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
} from 'lucide-react';
import { CustomDayExercise, DayWorkoutSession, Exercise, SetLogItem } from '../types/fitness';
import { AnimatedExercise } from './AnimatedExercise';

interface WorkoutExecutionModalProps {
  isOpen: boolean;
  dayTitle: string;
  dayExercises: CustomDayExercise[];
  exerciseMap: Map<string, Exercise>;
  onClose: () => void;
  onFinishWorkout: (session: DayWorkoutSession) => void;
}

export const WorkoutExecutionModal: React.FC<WorkoutExecutionModalProps> = ({
  isOpen,
  dayTitle,
  dayExercises,
  exerciseMap,
  onClose,
  onFinishWorkout,
}) => {
  if (!isOpen || dayExercises.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = dayExercises[currentIndex];
  const currentExercise = exerciseMap.get(currentItem?.exerciseId);

  // Set-by-set completion and tracking
  // Record<exerciseId, SetLogItem[]>
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLogItem[]>>(() => {
    const initial: Record<string, SetLogItem[]> = {};
    dayExercises.forEach((item) => {
      initial[item.exerciseId] = Array.from({ length: item.sets }, (_, i) => ({
        setNumber: i + 1,
        completed: false,
        weightKg: undefined,
        repsCompleted: undefined,
      }));
    });
    return initial;
  });

  // Rest Timer State
  const defaultRest = currentItem?.restSeconds || 60;
  const [restSecondsLeft, setRestSecondsLeft] = useState(defaultRest);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Overall workout elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);

  // Workout stopwatch
  useEffect(() => {
    if (!isOpen || isWorkoutPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isWorkoutPaused]);

  // Rest countdown timer
  useEffect(() => {
    if (!isRestTimerActive || restSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRestTimerActive(false);
          // Play subtle tone if sound enabled
          if (soundEnabled && typeof window !== 'undefined' && 'AudioContext' in window) {
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 tone
              gain.gain.setValueAtTime(0.1, ctx.currentTime);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            } catch {
              // fallback
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRestTimerActive, restSecondsLeft, soundEnabled]);

  // Reset rest timer when moving to another exercise
  const handleSelectExercise = (idx: number) => {
    setCurrentIndex(idx);
    const item = dayExercises[idx];
    setRestSecondsLeft(item.restSeconds || 60);
    setIsRestTimerActive(false);
  };

  const handleToggleSetComplete = (setNum: number) => {
    if (!currentItem) return;
    const exId = currentItem.exerciseId;
    const sets = exerciseLogs[exId] || [];
    const updated = sets.map((s) => (s.setNumber === setNum ? { ...s, completed: !s.completed } : s));
    setExerciseLogs({ ...exerciseLogs, [exId]: updated });

    // Automatically trigger rest timer if set was marked completed
    const justCompleted = updated.find((s) => s.setNumber === setNum)?.completed;
    if (justCompleted) {
      setRestSecondsLeft(currentItem.restSeconds || 60);
      setIsRestTimerActive(true);
    }
  };

  const handleUpdateSetWeightReps = (setNum: number, weight?: number, reps?: number) => {
    if (!currentItem) return;
    const exId = currentItem.exerciseId;
    const sets = exerciseLogs[exId] || [];
    const updated = sets.map((s) =>
      s.setNumber === setNum
        ? {
            ...s,
            weightKg: weight !== undefined ? weight : s.weightKg,
            repsCompleted: reps !== undefined ? reps : s.repsCompleted,
          }
        : s
    );
    setExerciseLogs({ ...exerciseLogs, [exId]: updated });
  };

  // Workout summary & finish
  const totalSetsCount = dayExercises.reduce((acc, curr) => acc + curr.sets, 0);
  const completedSetsCount = Object.values(exerciseLogs).reduce(
    (acc, sets) => acc + sets.filter((s) => s.completed).length,
    0
  );
  const workoutProgressPercent = Math.round((completedSetsCount / (totalSetsCount || 1)) * 100);

  const handleFinish = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionExercises: DayWorkoutSession['exercises'] = {};

    dayExercises.forEach((item) => {
      const sets = exerciseLogs[item.exerciseId] || [];
      const isExDone = sets.some((s) => s.completed);
      const avgWeight = sets.find((s) => s.weightKg)?.weightKg;
      sessionExercises[item.exerciseId] = {
        exerciseId: item.exerciseId,
        completed: isExDone,
        actualWeightKg: avgWeight,
        setLogs: sets,
      };
    });

    const session: DayWorkoutSession = {
      date: todayStr,
      dayOfWeek: dayTitle,
      completed: true,
      completedAt: new Date().toISOString(),
      durationMinutes: Math.round(elapsedSeconds / 60) || 1,
      exercises: sessionExercises,
    };

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#84cc16', '#22c55e', '#a3e635', '#ffffff'],
      });
    } catch {
      // safe fallback
    }

    onFinishWorkout(session);
    onClose();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const currentSets = exerciseLogs[currentItem?.exerciseId || ''] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-4xl my-4 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-workout-title"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-500/15 text-lime-400 border border-lime-500/30 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 fill-lime-400/20 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-500/15 text-lime-400 border border-lime-500/30">
                  Active Execution Mode
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  Exercise {currentIndex + 1} of {dayExercises.length}
                </span>
              </div>
              <h2 id="active-workout-title" className="text-base sm:text-lg font-black text-white mt-0.5">
                {dayTitle}
              </h2>
            </div>
          </div>

          {/* Stopwatch & Close */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2 text-xs font-mono font-bold text-zinc-200">
              <Clock className="w-3.5 h-3.5 text-lime-400" />
              <span>{formatTime(elapsedSeconds)}</span>
              <button
                onClick={() => setIsWorkoutPaused(!isWorkoutPaused)}
                className="text-[10px] text-zinc-400 hover:text-white uppercase font-sans"
              >
                {isWorkoutPaused ? 'Resume' : 'Pause'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
              aria-label="Close workout session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-900">
          <div
            className="h-full bg-lime-400 transition-all duration-300"
            style={{ width: `${workoutProgressPercent}%` }}
          />
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 cols: Animated Exercise Component */}
            <div className="lg:col-span-6 space-y-3">
              <AnimatedExercise
                exerciseId={currentItem?.exerciseId || 'barbell-bench-press'}
                exerciseName={currentExercise?.name}
                autoPlay={true}
                compact={false}
              />
            </div>

            {/* Right 6 cols: Set Tracker & Rest Timer */}
            <div className="lg:col-span-6 space-y-5">
              {/* Exercise Details Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                    {currentExercise?.primaryMuscle}
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    Target: {currentItem?.sets} Sets × {currentItem?.reps} Reps
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{currentExercise?.name}</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{currentExercise?.setup}</p>
              </div>

              {/* Set Tracking Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-bold text-zinc-300 text-xs">
                  <span>Log Sets</span>
                  <span className="text-zinc-400 text-[11px]">
                    {currentSets.filter((s) => s.completed).length} of {currentSets.length} sets completed
                  </span>
                </div>

                <div className="space-y-2">
                  {currentSets.map((s) => (
                    <div
                      key={s.setNumber}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                        s.completed
                          ? 'bg-lime-950/20 border-lime-500/40 text-lime-200'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleSetComplete(s.setNumber)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          s.completed
                            ? 'bg-lime-500 text-zinc-950 shadow-md font-bold'
                            : 'border-2 border-zinc-700 hover:border-lime-400 text-transparent'
                        }`}
                        aria-label={`Mark set ${s.setNumber} complete`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>

                      <div className="font-bold text-white text-xs min-w-[50px]">
                        Set #{s.setNumber}
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="kg"
                            value={s.weightKg ?? ''}
                            onChange={(e) =>
                              handleUpdateSetWeightReps(
                                s.setNumber,
                                e.target.value ? Number(e.target.value) : undefined,
                                s.repsCompleted
                              )
                            }
                            className="w-14 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs text-right"
                          />
                          <span className="text-[10px] text-zinc-400">kg</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="reps"
                            value={s.repsCompleted ?? ''}
                            onChange={(e) =>
                              handleUpdateSetWeightReps(
                                s.setNumber,
                                s.weightKg,
                                e.target.value ? Number(e.target.value) : undefined
                              )
                            }
                            className="w-14 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs text-right"
                          />
                          <span className="text-[10px] text-zinc-400">reps</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Rest Timer */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-lime-400" />
                    <span>Rest Interval Timer</span>
                  </div>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-zinc-400 hover:text-white"
                    title={soundEnabled ? 'Mute buzzer' : 'Enable buzzer'}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-lime-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-3xl font-black font-mono text-white">
                    {formatTime(restSecondsLeft)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRestTimerActive(!isRestTimerActive)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        isRestTimerActive
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-lime-500 text-zinc-950 hover:bg-lime-400'
                      }`}
                    >
                      {isRestTimerActive ? 'Pause' : 'Start Rest'}
                    </button>

                    <button
                      onClick={() => setRestSecondsLeft((prev) => prev + 30)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold"
                    >
                      +30s
                    </button>

                    <button
                      onClick={() => {
                        setRestSecondsLeft(currentItem.restSeconds || 60);
                        setIsRestTimerActive(false);
                      }}
                      className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation and Finish Bar */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => handleSelectExercise(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold border transition-colors ${
              currentIndex === 0
                ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Exercise</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs sm:text-sm shadow-lg shadow-lime-950/40 hover:scale-105 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Finish Workout</span>
            </button>

            {currentIndex < dayExercises.length - 1 && (
              <button
                onClick={() => handleSelectExercise(currentIndex + 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                <span>Next Exercise</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
