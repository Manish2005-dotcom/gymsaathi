import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { AuthModal } from './components/AuthModal';
import { SupabaseSetupGuideModal } from './components/SupabaseSetupGuideModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { StorageService } from './services/storage';
import { SupabaseDbService } from './services/supabaseDb';
import {
  UserProfile,
  DayWorkoutSession,
  GeneratedDietPlan,
  KitchenIngredientItem,
  ProgressEntry,
  AppSettings,
} from './types/fitness';
import { Sparkles, LogIn, Database, ShieldCheck, Dumbbell, ArrowRight } from 'lucide-react';

function AppContent() {
  const {
    user,
    loading: authLoading,
    isConfigured,
    isOnboarded,
    isGuestMode,
    setGuestMode,
    profile,
    updateProfile,
  } = useAuth();

  // Navigation state
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTabParam = urlParams?.get('tab') as NavTab | null;

  const [currentTab, setCurrentTab] = useState<NavTab>(
    initialTabParam || 'dashboard'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWorkoutDayKey, setSelectedWorkoutDayKey] = useState<string | undefined>(undefined);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);

  // Application State backed by localStorage and Supabase sync
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

  // Cloud sync effect when user logs in
  useEffect(() => {
    if (!user?.id || !isConfigured) return;

    let isSubscribed = true;

    async function syncCloudData() {
      try {
        // 1. Sync custom workout plan
        const cloudPlan = await SupabaseDbService.getWorkoutPlan(user.id);
        if (cloudPlan && isSubscribed) {
          StorageService.saveCustomWorkoutPlan(cloudPlan);
        }

        // 2. Sync workout logs
        const cloudLogs = await SupabaseDbService.getWorkoutLogs(user.id);
        if (cloudLogs && isSubscribed) {
          setWorkoutLogs((prev) => ({ ...prev, ...cloudLogs }));
          Object.values(cloudLogs).forEach((s) => StorageService.saveWorkoutSession(s));
        }

        // 3. Sync diet preferences
        const cloudDiet = await SupabaseDbService.getDietPreferences(user.id);
        if (cloudDiet && isSubscribed) {
          if (cloudDiet.activePlan) {
            setActiveDietPlan(cloudDiet.activePlan);
            StorageService.setActiveDietPlan(cloudDiet.activePlan);
          }
          if (cloudDiet.savedPlans?.length) {
            setSavedDietPlans(cloudDiet.savedPlans);
          }
          if (cloudDiet.kitchenInventory?.length) {
            setKitchenInventory(cloudDiet.kitchenInventory);
            StorageService.saveKitchenInventory(cloudDiet.kitchenInventory);
          }
        }

        // 4. Sync progress entries
        const cloudProgress = await SupabaseDbService.getProgressEntries(user.id);
        if (cloudProgress && isSubscribed) {
          setProgressEntries(cloudProgress);
          cloudProgress.forEach((p) => StorageService.saveProgressEntry(p));
        }
      } catch (err) {
        console.warn('Background Supabase cloud synchronization error:', err);
      }
    }

    syncCloudData();

    return () => {
      isSubscribed = false;
    };
  }, [user?.id, isConfigured]);

  // Tab navigation
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Profile handlers
  const handleSaveProfile = async (newProfile: UserProfile) => {
    await updateProfile(newProfile);
  };

  // Workout handlers
  const handleSaveWorkoutSession = async (session: DayWorkoutSession) => {
    const updated = { ...workoutLogs, [session.date]: session };
    setWorkoutLogs(updated);
    StorageService.saveWorkoutSession(session);

    if (user?.id && isConfigured) {
      await SupabaseDbService.saveWorkoutLog(user.id, session);
    }
  };

  // Diet handlers
  const handleSaveActiveDietPlan = async (plan: GeneratedDietPlan) => {
    setActiveDietPlan(plan);
    StorageService.setActiveDietPlan(plan);

    if (user?.id && isConfigured) {
      await SupabaseDbService.saveDietPreferences(user.id, {
        activePlan: plan,
        savedPlans,
        kitchenInventory,
      });
    }
  };

  const handleSavePlanToBookmarks = async (plan: GeneratedDietPlan) => {
    StorageService.saveDietPlan(plan);
    const updatedPlans = StorageService.getSavedDietPlans();
    setSavedDietPlans(updatedPlans);

    if (user?.id && isConfigured) {
      await SupabaseDbService.saveDietPreferences(user.id, {
        activePlan,
        savedPlans: updatedPlans,
        kitchenInventory,
      });
    }
  };

  const handleDeleteBookmark = async (planId: string) => {
    StorageService.deleteSavedDietPlan(planId);
    const updatedPlans = StorageService.getSavedDietPlans();
    const updatedActive = StorageService.getActiveDietPlan();
    setSavedDietPlans(updatedPlans);
    setActiveDietPlan(updatedActive);

    if (user?.id && isConfigured) {
      await SupabaseDbService.saveDietPreferences(user.id, {
        activePlan: updatedActive,
        savedPlans: updatedPlans,
        kitchenInventory,
      });
    }
  };

  // Kitchen inventory handlers
  const handleUpdateKitchenInventory = async (inventory: KitchenIngredientItem[]) => {
    setKitchenInventory(inventory);
    StorageService.saveKitchenInventory(inventory);

    if (user?.id && isConfigured) {
      await SupabaseDbService.saveDietPreferences(user.id, {
        activePlan,
        savedPlans,
        kitchenInventory: inventory,
      });
    }
  };

  // Progress entries handlers
  const handleAddProgressEntry = async (entry: ProgressEntry) => {
    StorageService.saveProgressEntry(entry);
    const updated = StorageService.getProgressEntries();
    setProgressEntries(updated);

    if (user?.id && isConfigured) {
      await SupabaseDbService.saveProgressEntry(user.id, entry);
    }
  };

  const handleDeleteProgressEntry = async (id: string) => {
    StorageService.deleteProgressEntry(id);
    const updated = StorageService.getProgressEntries();
    setProgressEntries(updated);

    if (user?.id && isConfigured) {
      await SupabaseDbService.deleteProgressEntry(user.id, id);
    }
  };

  const handleClearProgress = () => {
    setProgressEntries([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gymsaathi_progress_entries');
    }
  };

  // Settings handlers
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleResetComplete = () => {
    setWorkoutLogs({});
    setKitchenInventory(StorageService.getKitchenInventory());
    setSavedDietPlans([]);
    setActiveDietPlan(null);
    setProgressEntries([]);
    setSettings(StorageService.getSettings());
    setCurrentTab('dashboard');
  };

  // Open Auth modal with specific tab
  const openAuth = (tab: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthModalInitialTab(tab);
    setAuthModalOpen(true);
  };

  // Loading state during initial session retrieval
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c100e] text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 mb-4 animate-bounce">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-white flex items-center gap-2">
          <span>Loading GymSaathi...</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Restoring authentication session</p>
      </div>
    );
  }

  // 1. If signed in but not yet completed onboarding: Show Fitness Onboarding Flow
  if (user && !isOnboarded) {
    return (
      <div className="min-h-screen bg-[#0c100e] text-zinc-100 flex flex-col font-sans selection:bg-lime-500 selection:text-black">
        <Header
          currentTab="profile"
          onSelectTab={handleSelectTab}
          onOpenMobileMenu={() => {}}
          profile={profile}
          onOpenAuthModal={() => openAuth('signin')}
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <OnboardingFlow onComplete={() => setCurrentTab('dashboard')} />
        </main>
        <SupabaseSetupGuideModal
          isOpen={setupGuideOpen}
          onClose={() => setSetupGuideOpen(false)}
        />
      </div>
    );
  }

  // 2. If NOT signed in AND NOT in guest mode: Show Welcome / Auth Gate
  if (!user && !isGuestMode) {
    return (
      <div className="min-h-screen bg-[#0c100e] text-zinc-100 flex flex-col justify-between font-sans selection:bg-lime-500 selection:text-black">
        {/* Top Minimal Bar */}
        <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-black text-lg text-white">GymSaathi</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSetupGuideOpen(true)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900"
            >
              <Database className="w-3.5 h-3.5 text-lime-400" />
              <span>Supabase Guide</span>
            </button>
            <button
              onClick={() => openAuth('signin')}
              className="px-4 py-1.5 bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Gate Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-20 text-center flex-1 flex flex-col justify-center items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Supabase Cloud Authentication & Custom Workout Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl">
            Your Personal Fitness & Indian Diet Companion.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-xl">
            Fully customizable 7-day workout planner, animated character demonstrations, budget Indian diet plans, and airtight Row Level Security backed by Supabase.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full max-w-md">
            <button
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto flex-1 py-3 px-6 bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Create Account</span>
            </button>
            <button
              onClick={() => openAuth('signin')}
              className="w-full sm:w-auto flex-1 py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl border border-zinc-800 transition-colors"
            >
              <span>Sign In</span>
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setGuestMode(true)}
              className="text-xs text-zinc-500 hover:text-lime-400 underline transition-colors"
            >
              Or explore with Guest / Offline Preview mode
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 text-left w-full">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-400 flex items-center justify-center mb-3">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Custom 7-Day Splits</h3>
              <p className="text-xs text-zinc-400">
                Design custom workouts with targeted volume, muscle picker, and 2D animated exercise movement.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Airtight Supabase RLS</h3>
              <p className="text-xs text-zinc-400">
                Row Level Security ensures only you have access to your personal weight, diet, and training history.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Pocket-Friendly Diets</h3>
              <p className="text-xs text-zinc-400">
                Automatic meal generator & kitchen inventory planner using paneer, soya, sattu, and eggs.
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalInitialTab}
          onOpenSetupGuide={() => {
            setAuthModalOpen(false);
            setSetupGuideOpen(true);
          }}
        />
        <SupabaseSetupGuideModal
          isOpen={setupGuideOpen}
          onClose={() => setSetupGuideOpen(false)}
        />
      </div>
    );
  }

  // 3. User is signed in OR exploring as Guest: Render Main Dashboard & Navigation
  return (
    <div className="min-h-screen bg-[#0c100e] text-zinc-100 flex flex-col font-sans selection:bg-lime-500 selection:text-black">
      {/* Guest Mode Banner */}
      {!user && isGuestMode && (
        <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>Guest / Offline Mode:</strong> Changes are saved to local browser storage. Sign in to sync across devices via Supabase.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuth('signin')}
              className="text-xs underline font-bold hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg text-[11px]"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        {/* Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          profile={profile}
          onOpenAuthModal={() => openAuth('signin')}
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
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

      {/* Auth & Setup Guide Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalInitialTab}
        onOpenSetupGuide={() => {
          setAuthModalOpen(false);
          setSetupGuideOpen(true);
        }}
      />
      <SupabaseSetupGuideModal
        isOpen={setupGuideOpen}
        onClose={() => setSetupGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
