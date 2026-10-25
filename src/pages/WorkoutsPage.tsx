import React, { useState } from 'react';
import { Dumbbell, BookOpen, Layers } from 'lucide-react';
import { WorkoutPlannerPage } from './WorkoutPlannerPage';
import { ExerciseLibraryPage } from './ExerciseLibraryPage';
import { UserProfile, DayWorkoutSession } from '../types/fitness';

interface WorkoutsPageProps {
  profile: UserProfile;
  workoutLogs: Record<string, DayWorkoutSession>;
  onSaveSession: (session: DayWorkoutSession) => void;
  initialDayKey?: string;
  initialSubTab?: 'planner' | 'library';
}

export const WorkoutsPage: React.FC<WorkoutsPageProps> = ({
  profile,
  workoutLogs,
  onSaveSession,
  initialDayKey,
  initialSubTab = 'planner',
}) => {
  const [subTab, setSubTab] = useState<'planner' | 'library'>(initialSubTab);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => setSubTab('planner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'planner'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>7-Day Workout Planner & Splits</span>
          </button>
          <button
            onClick={() => setSubTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'library'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2D Animated Exercise Library</span>
          </button>
        </div>

        <span className="text-xs text-zinc-500 hidden sm:block">
          {subTab === 'planner'
            ? 'Fully customizable Monday–Sunday schedule'
            : 'Interactive character demonstrations & form cues'}
        </span>
      </div>

      {/* Render selected module */}
      {subTab === 'planner' ? (
        <WorkoutPlannerPage
          profile={profile}
          workoutLogs={workoutLogs}
          onSaveSession={onSaveSession}
          initialDayKey={initialDayKey}
        />
      ) : (
        <ExerciseLibraryPage />
      )}
    </div>
  );
};
