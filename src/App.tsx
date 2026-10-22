import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilePage';
import { WorkoutPlannerPage } from './pages/WorkoutPlannerPage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { DietPlannerPage } from './pages/DietPlannerPage';
import { KitchenPlannerPage } from './pages/KitchenPlannerPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ProgressTrackerPage } from './pages/ProgressTrackerPage';
import { EducationPage } from './pages/EducationPage';
import { SettingsPage } from './pages/SettingsPage';
import { StorageService } from './services/storage';
import {
  UserProfile,
  DayWorkoutSession,
  GeneratedDietPlan,
  KitchenIngredientItem,
  ProgressEntry,
  AppSettings,
} from './types/fitness';

export default function App() {
  // Parse query param e.g. ?autostart=1 or ?tab=dashboard
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTabParam = urlParams?.get('tab') as NavTab | null;
  const hasAutostart = urlParams?.has('autostart');

  const [currentTab, setCurrentTab] = useState<NavTab>(
    initialTabParam || (hasAutostart ? 'dashboard' : 'dashboard')
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWorkoutDayKey, setSelectedWorkoutDayKey] = useState<string | undefined>(undefined);

  // Application State backed by localStorage
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, DayWorkoutSession>>(() =>
    StorageService.getWorkoutLogs()
  );
  const [kitchenInventory, setKitchenInventory] = useState<KitchenIngredientItem[]>(() =>
    StorageService.getKitchenInventory()
  );
  const [savedDietPlans, setSavedDietPlans] = useState<GeneratedDietPlan[]>(() =>
    StorageService.getSavedDietPlans()
  );
  const [activeDietPlan, setActiveDietPlan] = useState<GeneratedDietPlan | null>(() =>
    StorageService.getActiveDietPlan()
  );
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>(() =>
    StorageService.getProgressEntries()
  );
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());

  // Scroll to top when changing tab
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Profile handlers
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  // Workout handlers
  const handleSaveWorkoutSession = (session: DayWorkoutSession) => {
    const updated = { ...workoutLogs, [session.date]: session };
    setWorkoutLogs(updated);
    StorageService.saveWorkoutSession(session);
  };

  // Diet handlers
  const handleSaveActiveDietPlan = (plan: GeneratedDietPlan) => {
    setActiveDietPlan(plan);
    StorageService.setActiveDietPlan(plan);
  };

  const handleSavePlanToBookmarks = (plan: GeneratedDietPlan) => {
    StorageService.saveDietPlan(plan);
    setSavedDietPlans(StorageService.getSavedDietPlans());
  };

  const handleDeleteBookmark = (planId: string) => {
    StorageService.deleteSavedDietPlan(planId);
    setSavedDietPlans(StorageService.getSavedDietPlans());
    setActiveDietPlan(StorageService.getActiveDietPlan());
  };

  // Kitchen inventory handlers
  const handleUpdateKitchenInventory = (inventory: KitchenIngredientItem[]) => {
    setKitchenInventory(inventory);
    StorageService.saveKitchenInventory(inventory);
  };

  // Progress entries handlers
  const handleAddProgressEntry = (entry: ProgressEntry) => {
    StorageService.saveProgressEntry(entry);
    setProgressEntries(StorageService.getProgressEntries());
  };

  const handleDeleteProgressEntry = (id: string) => {
    StorageService.deleteProgressEntry(id);
    setProgressEntries(StorageService.getProgressEntries());
  };

  const handleClearProgress = () => {
    setProgressEntries([]);
    localStorage.removeItem('gymsaathi_progress_entries');
  };

  // Settings handlers
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleResetComplete = () => {
    setProfile(StorageService.getProfile());
    setWorkoutLogs({});
    setKitchenInventory(StorageService.getKitchenInventory());
    setSavedDietPlans([]);
    setActiveDietPlan(null);
    setProgressEntries([]);
    setSettings(StorageService.getSettings());
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0c100e] text-zinc-100 flex flex-col font-sans selection:bg-lime-500 selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        {/* Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          profile={profile}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'home' && (
            <LandingPage onNavigate={handleSelectTab} />
          )}

          {currentTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              workoutLogs={workoutLogs}
              activeDietPlan={activeDietPlan}
              onNavigate={handleSelectTab}
              onSelectWorkoutDay={(dayKey) => {
                setSelectedWorkoutDayKey(dayKey);
                handleSelectTab('workout-planner');
              }}
            />
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              initialProfile={profile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentTab === 'workout-planner' && (
            <WorkoutPlannerPage
              profile={profile}
              workoutLogs={workoutLogs}
              onSaveSession={handleSaveWorkoutSession}
              initialDayKey={selectedWorkoutDayKey}
            />
          )}

          {currentTab === 'exercise-library' && (
            <ExerciseLibraryPage />
          )}

          {currentTab === 'diet-planner' && (
            <DietPlannerPage
              profile={profile}
              activePlan={activeDietPlan}
              savedPlans={savedDietPlans}
              kitchenInventory={kitchenInventory}
              onSaveActivePlan={handleSaveActiveDietPlan}
              onSavePlanToBookmarks={handleSavePlanToBookmarks}
              onDeleteBookmark={handleDeleteBookmark}
              onUpdateInventory={handleUpdateKitchenInventory}
              initialMode="automatic"
            />
          )}

          {currentTab === 'kitchen-planner' && (
            <KitchenPlannerPage
              profile={profile}
              activePlan={activeDietPlan}
              savedPlans={savedDietPlans}
              kitchenInventory={kitchenInventory}
              onSaveActivePlan={handleSaveActiveDietPlan}
              onSavePlanToBookmarks={handleSavePlanToBookmarks}
              onDeleteBookmark={handleDeleteBookmark}
              onUpdateInventory={handleUpdateKitchenInventory}
            />
          )}

          {currentTab === 'calculator' && (
            <CalculatorPage profile={profile} />
          )}

          {currentTab === 'progress-tracker' && (
            <ProgressTrackerPage
              entries={progressEntries}
              onAddEntry={handleAddProgressEntry}
              onDeleteEntry={handleDeleteProgressEntry}
              onClearAll={handleClearProgress}
            />
          )}

          {currentTab === 'education' && (
            <EducationPage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetComplete={handleResetComplete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
