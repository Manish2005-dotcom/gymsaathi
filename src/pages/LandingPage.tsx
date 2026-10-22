import React, { useState } from 'react';
import {
  Flame,
  Dumbbell,
  UtensilsCrossed,
  LineChart,
  ShieldCheck,
  Calculator,
  Video,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { NavTab } from '../components/Sidebar';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is GymSaathi really free, and do I need to buy expensive supplements?',
      a: 'GymSaathi is 100% free with no paid API keys or subscription paywalls. Furthermore, our philosophy prioritizes real, budget-friendly Indian grocery staples like soy chunks, eggs, curd, peanuts, and dal before recommending any commercial supplements.',
    },
    {
      q: 'How does the "Kitchen Ingredients Planner" work?',
      a: "Simply open 'What's in Your Kitchen?', pick the ingredients you currently have at home (eggs, milk, rice, oats, dal, etc.) along with their quantities. GymSaathi calculates realistic Indian meals using only those foods, shows how much you used, and highlights any protein gaps honestly.",
    },
    {
      q: 'Can beginners follow the 7-day Monday to Saturday workout split?',
      a: 'Yes! While the split covers Monday (Back), Tuesday (Biceps), Wednesday (Chest), Thursday (Triceps), Friday (Shoulders + Abs), Saturday (Legs), and Sunday (Rest), the default plan assigns exactly 6 beginner-friendly exercises with detailed setup, posture cues, breathing instructions, and alternatives for home workouts.',
    },
    {
      q: 'Is my personal data uploaded to any remote server?',
      a: 'No. GymSaathi stores all your workout logs, kitchen inventories, and personal metrics locally inside your own browser using localStorage. Your data stays entirely in your hands, and you can export or backup a copy anytime from Settings.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-6 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-lime-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold tracking-wide">
            <Flame className="w-4 h-4 fill-lime-400/20 text-lime-400" />
            <span>Built for Gym Beginners & Students in India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Your Fitness Journey <br />
            <span className="text-lime-400">Starts Here.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl leading-relaxed">
            Personalized workouts, practical Indian diet plans, and progress tracking — all in one place.
            Science-informed, affordable, and built specifically for your lifestyle.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-sm sm:text-base transition-all shadow-xl shadow-lime-950/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Build My Fitness Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('workout-planner')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm sm:text-base border border-zinc-700 hover:border-zinc-600 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-lime-400" />
              <span>Explore Workouts</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">42+</div>
              <div className="text-xs text-zinc-400">Guided Exercises</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-lime-400">₹12/50g</div>
              <div className="text-xs text-zinc-400">High-Protein Staples</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">2 Modes</div>
              <div className="text-xs text-zinc-400">Indian Diet Planning</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-lime-400">100%</div>
              <div className="text-xs text-zinc-400">Free & Private</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Everything You Need to Succeed</h2>
          <p className="text-sm text-zinc-400">
            Engineered to replace confusion with structured, science-backed guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            onClick={() => onNavigate('workout-planner')}
            className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-lime-500/15 text-lime-400 flex items-center justify-center border border-lime-500/20 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors">
              Personalized Workout Plans
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Targeted 7-day Monday to Saturday split with Back, Biceps, Chest, Triceps, Shoulders + Abs, and Legs, plus Sunday recovery.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-lime-400">
              <span>View Split</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('diet-planner')}
            className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Smart Indian Diet Planner
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Wholesome vegetarian, eggetarian, and non-veg meals tailored with rotis, rice, dal, paneer, and soy chunks with live cost tracking.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>Plan Meals</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('kitchen-planner')}
            className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Kitchen Inventory Planner
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Cook with what you already have. Select your eggs, milk, oats, and bananas; GymSaathi generates your exact day's nutrition.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Use Kitchen Foods</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('exercise-library')}
            className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
              Exercise Video & Posture Library
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Searchable catalog with 42+ exercises featuring step-by-step cues, breathing mechanics, mistakes to avoid, and video tutorial search links.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-sky-400">
              <span>Browse Exercises</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('calculator')}
            className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              Calorie & Protein Calculator
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Mifflin-St Jeor metabolic equations, activity multipliers, target macro distribution, and Asian-Indian BMI context.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-purple-400">
              <span>Calculate Targets</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('progress-tracker')}
            className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
              Progress & Habit Tracker
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Log body weight, waist, and workouts completed. Visualize trends over time and export your records as CSV anytime.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <span>Open Tracker</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Step 1 to 4) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/90 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-lime-400">Simple 4-Step Process</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">How GymSaathi Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative">
            <span className="text-2xl font-black text-lime-400">01</span>
            <h3 className="text-base font-bold text-white">Enter Fitness Details</h3>
            <p className="text-xs text-zinc-400">
              Fill in your age, height, weight, fitness experience, dietary preference, and daily food budget.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative">
            <span className="text-2xl font-black text-lime-400">02</span>
            <h3 className="text-base font-bold text-white">Choose Goal & Food</h3>
            <p className="text-xs text-zinc-400">
              Select muscle gain, fat loss, or general fitness. Pick automatic plans or select what's in your kitchen.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative">
            <span className="text-2xl font-black text-lime-400">03</span>
            <h3 className="text-base font-bold text-white">Get Personalized Plan</h3>
            <p className="text-xs text-zinc-400">
              Receive your 7-day workout schedule with 6 targeted exercises per day, plus complete daily Indian meals.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative">
            <span className="text-2xl font-black text-lime-400">04</span>
            <h3 className="text-base font-bold text-white">Train & Track Progress</h3>
            <p className="text-xs text-zinc-400">
              Follow safe posture cues, check off completed workouts, log weights, and watch yourself transform.
            </p>
          </div>
        </div>
      </section>

      {/* Why GymSaathi & Sample Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Why GymSaathi?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            Designed for Real Indian Lifters, Not Western Fitness Influencers
          </h2>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Affordable Protein Reality:</strong> We don't prescribe ₹5,000 salmon or imported supplements. We show you how ₹12 soy chunks or ₹14 eggs deliver optimal amino acids.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Beginner Safety First:</strong> Detailed posture instructions, elbow angles, and breathing patterns so you never injure your rotator cuffs or lower spine.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Bro-Science:</strong> Backed by peer-reviewed exercise science, debunking myths about soy, dal, and sweat suits.
              </span>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('education')}
              className="inline-flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300"
            >
              <span>Read Science & Education Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sample Meal & Workout Preview Box */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-lime-400" />
              <span>Sample Indian High-Protein Day</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-500/15 text-lime-400 font-bold border border-lime-500/30">
              ~130g Protein
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Breakfast</span>
                <span className="text-zinc-400">Rolled Oats + Toned Milk + 1 Banana + Peanut Butter</span>
              </div>
              <span className="font-semibold text-lime-400">22g Protein</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Lunch</span>
                <span className="text-zinc-400">2 Rotis + Rice + 50g Soy Chunks Curry + Curd</span>
              </div>
              <span className="font-semibold text-lime-400">38g Protein</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Snack</span>
                <span className="text-zinc-400">Roasted Peanuts (30g) + 1 Glass Milk</span>
              </div>
              <span className="font-semibold text-lime-400">16g Protein</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Dinner</span>
                <span className="text-zinc-400">2 Rotis + 150g Paneer/Egg Curry + Mixed Sabzi</span>
              </div>
              <span className="font-semibold text-lime-400">32g Protein</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('diet-planner')}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition-colors"
          >
            Customize in Diet Planner
          </button>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-zinc-400">Have questions? We have direct, clear answers.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-lime-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180 text-lime-400' : 'text-zinc-500'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-zinc-800 space-y-6 text-xs text-zinc-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-lime-400" />
            <span className="font-black text-white text-sm">GymSaathi</span>
            <span>— Your Personal Fitness Companion</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white">Dashboard</button>
            <button onClick={() => onNavigate('workout-planner')} className="hover:text-white">Workouts</button>
            <button onClick={() => onNavigate('diet-planner')} className="hover:text-white">Diet</button>
            <button onClick={() => onNavigate('calculator')} className="hover:text-white">Calculator</button>
            <button onClick={() => onNavigate('education')} className="hover:text-white">Safety</button>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-zinc-500 text-center sm:text-left">
          <strong>Health & Safety Disclaimer:</strong> The nutritional calculations, workouts, and educational guidance in GymSaathi are for general educational purposes only and do not constitute medical advice. Consult a healthcare professional before initiating new exercise or diet regimens, especially if under 18, pregnant, or managing medical conditions.
        </p>
      </footer>
    </div>
  );
};
