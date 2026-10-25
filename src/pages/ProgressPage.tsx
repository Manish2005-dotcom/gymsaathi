import React, { useState } from 'react';
import { LineChart, Calculator, GraduationCap } from 'lucide-react';
import { ProgressTrackerPage } from './ProgressTrackerPage';
import { CalculatorPage } from './CalculatorPage';
import { EducationPage } from './EducationPage';
import { ProgressEntry, UserProfile } from '../types/fitness';

interface ProgressPageProps {
  entries: ProgressEntry[];
  profile: UserProfile;
  onAddEntry: (entry: ProgressEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  initialSubTab?: 'tracker' | 'calculator' | 'education';
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  entries,
  profile,
  onAddEntry,
  onDeleteEntry,
  onClearAll,
  initialSubTab = 'tracker',
}) => {
  const [subTab, setSubTab] = useState<'tracker' | 'calculator' | 'education'>(initialSubTab);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => setSubTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'tracker'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Consistency & Weight Tracker</span>
          </button>
          <button
            onClick={() => setSubTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'calculator'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calorie, Protein & BMI</span>
          </button>
          <button
            onClick={() => setSubTab('education')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'education'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Science & Safety</span>
          </button>
        </div>

        <span className="text-xs text-zinc-500 hidden sm:block">
          {subTab === 'tracker'
            ? 'Track weight & weekly consistency'
            : subTab === 'calculator'
            ? 'Metabolic science & Asian-Indian BMI'
            : 'Injury prevention & recovery guides'}
        </span>
      </div>

      {subTab === 'tracker' && (
        <ProgressTrackerPage
          entries={entries}
          onAddEntry={onAddEntry}
          onDeleteEntry={onDeleteEntry}
          onClearAll={onClearAll}
        />
      )}

      {subTab === 'calculator' && (
        <CalculatorPage profile={profile} />
      )}

      {subTab === 'education' && (
        <EducationPage />
      )}
    </div>
  );
};
