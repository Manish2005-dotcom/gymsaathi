import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle2, Wind, Dumbbell, Compass, Flame, AlertCircle, Video } from 'lucide-react';
import { Exercise } from '../types/fitness';
import { AnimatedExercise } from './AnimatedExercise';

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({ exercise, isOpen, onClose }) => {
  if (!isOpen || !exercise) return null;

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoSearchQuery)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="w-full max-w-3xl my-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 bg-zinc-900/90 sticky top-0 z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
                {exercise.primaryMuscle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                {exercise.equipmentDisplay}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 capitalize">
                {exercise.difficulty}
              </span>
            </div>
            <h2 id="exercise-modal-title" className="text-xl sm:text-2xl font-black text-white">
              {exercise.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Target: <span className="text-zinc-200 font-semibold">{exercise.targetMuscleDisplay}</span>
              {exercise.secondaryMuscles.length > 0 && ` • Secondary: ${exercise.secondaryMuscles.join(', ')}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-zinc-300 leading-relaxed">
          {/* In-App Animated Demonstration (Feature 2) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-lime-400" />
                <span>Animated Movement Demonstration</span>
              </h3>
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                2D Skeletal Dynamics
              </span>
            </div>
            <AnimatedExercise
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              compact={false}
              autoPlay={true}
            />
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center">
            <div>
              <div className="text-xs text-zinc-400">Recommended Sets</div>
              <div className="text-lg font-black text-lime-400 mt-0.5">{exercise.defaultSets} Sets</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Target Reps</div>
              <div className="text-lg font-black text-white mt-0.5">{exercise.defaultReps}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Rest Interval</div>
              <div className="text-lg font-black text-white mt-0.5">{exercise.restSeconds}s</div>
            </div>
          </div>

          {/* Setup & Starting Position */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>1. Setup & Starting Position</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-zinc-300">
              {exercise.setup}
            </p>
          </div>

          {/* Body Alignment */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              <span>2. Correct Body Alignment</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-zinc-300">
              {exercise.bodyAlignment}
            </p>
          </div>

          {/* Movement Steps */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Step-by-Step Movement Execution</span>
            </h3>
            <div className="space-y-2">
              {exercise.movementSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 text-xs font-bold flex items-center justify-center border border-lime-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-zinc-200">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breathing Guidance */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <span>4. Breathing Guidance</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-lime-950/20 border border-lime-900/40 text-lime-100/90">
              {exercise.breathing}
            </p>
          </div>

          {/* Posture Cues */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400">
              5. Golden Posture Cues
            </h3>
            <ul className="space-y-1.5 list-disc list-inside p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-zinc-300">
              {exercise.postureCues.map((cue, idx) => (
                <li key={idx} className="text-zinc-300">
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes & Injury Prevention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-xl bg-red-950/20 border border-red-900/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Common Mistakes to Avoid</span>
              </h4>
              <ul className="space-y-1 text-xs text-red-200/90 list-disc list-inside">
                {exercise.commonMistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-amber-950/20 border border-amber-900/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Injury Prevention Advice</span>
              </h4>
              <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
                {exercise.injuryPreventionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Alternatives */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Alternatives & Home Substitutions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block mb-0.5">Beginner-Friendly:</span>
                <span className="font-semibold text-white">{exercise.beginnerAlternative}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block mb-0.5">Home Workout:</span>
                <span className="font-semibold text-white">{exercise.homeAlternative}</span>
              </div>
            </div>
          </div>

          {/* Secondary External Reference */}
          <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="text-zinc-400 flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              <span>Looking for live human footage?</span>
            </div>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-lime-400 hover:text-lime-300 hover:underline flex items-center gap-1"
            >
              <span>Search YouTube Tutorial</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
