import React from 'react';
import { DietPlannerPage } from './DietPlannerPage';
import { UserProfile, GeneratedDietPlan, KitchenIngredientItem } from '../types/fitness';

interface KitchenPlannerPageProps {
  profile: UserProfile;
  activePlan: GeneratedDietPlan | null;
  savedPlans: GeneratedDietPlan[];
  kitchenInventory: KitchenIngredientItem[];
  onSaveActivePlan: (plan: GeneratedDietPlan) => void;
  onSavePlanToBookmarks: (plan: GeneratedDietPlan) => void;
  onDeleteBookmark: (planId: string) => void;
  onUpdateInventory: (inventory: KitchenIngredientItem[]) => void;
}

export const KitchenPlannerPage: React.FC<KitchenPlannerPageProps> = (props) => {
  return <DietPlannerPage {...props} initialMode="kitchen_inventory" />;
};
