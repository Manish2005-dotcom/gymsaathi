import React, { useState } from 'react';
import { UtensilsCrossed, Refrigerator, Sparkles } from 'lucide-react';
import { DietPlannerPage } from './DietPlannerPage';
import { KitchenPlannerPage } from './KitchenPlannerPage';
import {
  UserProfile,
  GeneratedDietPlan,
  KitchenIngredientItem,
} from '../types/fitness';

interface DietPageProps {
  profile: UserProfile;
  activePlan: GeneratedDietPlan | null;
  savedPlans: GeneratedDietPlan[];
  kitchenInventory: KitchenIngredientItem[];
  onSaveActivePlan: (plan: GeneratedDietPlan) => void;
  onSavePlanToBookmarks: (plan: GeneratedDietPlan) => void;
  onDeleteBookmark: (planId: string) => void;
  onUpdateInventory: (inventory: KitchenIngredientItem[]) => void;
  initialSubTab?: 'automatic' | 'kitchen';
}

export const DietPage: React.FC<DietPageProps> = ({
  profile,
  activePlan,
  savedPlans,
  kitchenInventory,
  onSaveActivePlan,
  onSavePlanToBookmarks,
  onDeleteBookmark,
  onUpdateInventory,
  initialSubTab = 'automatic',
}) => {
  const [subTab, setSubTab] = useState<'automatic' | 'kitchen'>(initialSubTab);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => setSubTab('automatic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'automatic'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Smart Indian Meal Planner</span>
          </button>
          <button
            onClick={() => setSubTab('kitchen')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'kitchen'
                ? 'bg-lime-400 text-black shadow-md shadow-lime-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Refrigerator className="w-4 h-4" />
            <span>What's in Your Kitchen?</span>
          </button>
        </div>

        <span className="text-xs text-zinc-500 hidden sm:block">
          {subTab === 'automatic'
            ? 'Budget Indian macros with paneer, soya, sattu & eggs'
            : 'Calculate recipes from ingredients currently in your fridge'}
        </span>
      </div>

      {subTab === 'automatic' ? (
        <DietPlannerPage
          profile={profile}
          activePlan={activePlan}
          savedPlans={savedPlans}
          kitchenInventory={kitchenInventory}
          onSaveActivePlan={onSaveActivePlan}
          onSavePlanToBookmarks={onSavePlanToBookmarks}
          onDeleteBookmark={onDeleteBookmark}
          onUpdateInventory={onUpdateInventory}
          initialMode="automatic"
        />
      ) : (
        <KitchenPlannerPage
          profile={profile}
          activePlan={activePlan}
          savedPlans={savedPlans}
          kitchenInventory={kitchenInventory}
          onSaveActivePlan={onSaveActivePlan}
          onSavePlanToBookmarks={onSavePlanToBookmarks}
          onDeleteBookmark={onDeleteBookmark}
          onUpdateInventory={onUpdateInventory}
        />
      )}
    </div>
  );
};
