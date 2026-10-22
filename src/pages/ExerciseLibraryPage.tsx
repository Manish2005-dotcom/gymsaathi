import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Flame,
  HelpCircle,
  Dumbbell,
  Compass,
  Home,
  Building,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Exercise, MuscleGroup, EquipmentType, ExerciseDifficulty } from '../types/fitness';
import { EXERCISES } from '../data/exercises';
import { ExerciseModal } from '../components/ExerciseModal';
import { AnimatedExercise } from '../components/AnimatedExercise';
import { StorageService } from '../services/storage';

export const ExerciseLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'gym' | 'home'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);
  const [expandedAnimationId, setExpandedAnimationId] = useState<string | null>(null);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    StorageService.getFavoriteExercises()
  );

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageService.toggleFavoriteExercise(id);
    setFavoriteIds(updated);
  };

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      // Search filter
      const matchesSearch =
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.targetMuscleDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.secondaryMuscles.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Muscle filter
      if (selectedMuscle !== 'all' && ex.primaryMuscle !== selectedMuscle) return false;

      // Equipment filter
      if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;

      // Favorites only
      if (onlyFavorites && !favoriteIds.includes(ex.id)) return false;

      // Home vs Gym filter
      if (locationFilter === 'home') {
        const isHomeFriendly =
          ex.equipment === 'bodyweight' ||
          ex.equipment === 'dumbbell' ||
          ex.homeAlternative.length > 0;
        if (!isHomeFriendly) return false;
      }

      return true;
    });
  }, [searchTerm, selectedMuscle, selectedEquipment, selectedDifficulty, onlyFavorites, favoriteIds, locationFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* Exercise Detail Modal with Embedded Animated Character */}
      <ExerciseModal
        exercise={activeModalExercise}
        isOpen={!!activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
          <BookOpen className="w-4 h-4" />
          <span>Exercise Encyclopedia & Motion Lab</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Exercise Technique & Animated Movement Library
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Master proper biomechanics, starting postures, joint angles, and controlled repetitions with our in-website 2D animated fitness character demos across 42+ exercises.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises by name, target muscle (e.g. Lat Pulldown, Hamstrings, Incline Press)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:border-lime-400 transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Muscle Group</label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
            >
              <option value="all">All Muscle Groups</option>
              <option value="back">Back & Lats</option>
              <option value="biceps">Biceps & Arms</option>
              <option value="chest">Chest (Pectorals)</option>
              <option value="triceps">Triceps</option>
              <option value="shoulders">Shoulders (Deltoids)</option>
              <option value="abs">Abs & Core</option>
              <option value="legs">Legs (Quads / Hams / Glutes)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
            >
              <option value="all">All Equipment</option>
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbells</option>
              <option value="cable">Cable Machine</option>
              <option value="machine">Weight Machines</option>
              <option value="bodyweight">Bodyweight Only</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Experience Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner Friendly</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Environment</label>
            <div className="flex p-0.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <button
                type="button"
                onClick={() => setLocationFilter('all')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] ${
                  locationFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setLocationFilter('home')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] ${
                  locationFilter === 'home' ? 'bg-lime-500 text-zinc-950 font-black' : 'text-zinc-400'
                }`}
              >
                Home
              </button>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Bookmarks</label>
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-colors border ${
                onlyFavorites
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-red-400' : ''}`} />
              <span>Favorites ({favoriteIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
          <span>Showing {filteredExercises.length} of {EXERCISES.length} curated exercises</span>
          <span className="text-lime-400 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Interactive 2D Animated Demonstrations</span>
          </span>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
            <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="font-bold text-white text-base">No matching exercises found</h3>
            <p className="text-xs text-zinc-400">Try clearing your filters or searching with another keyword.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMuscle('all');
                setSelectedEquipment('all');
                setSelectedDifficulty('all');
                setLocationFilter('all');
                setOnlyFavorites(false);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-lime-400 border border-zinc-800 hover:bg-zinc-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((ex) => {
              const isFav = favoriteIds.includes(ex.id);
              const isInlineOpen = expandedAnimationId === ex.id;

              return (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-lime-500/40 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2.5">
                    {/* Top Chips & Heart Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
                          {ex.primaryMuscle}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {ex.equipmentDisplay}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-400 capitalize">
                          {ex.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleFavorite(ex.id, e)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label="Toggle favorite"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-current' : ''}`} />
                      </button>
                    </div>

                    <h3
                      onClick={() => setActiveModalExercise(ex)}
                      className="text-base font-black text-white group-hover:text-lime-400 transition-colors cursor-pointer"
                    >
                      {ex.name}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {ex.setup}
                    </p>

                    <div className="text-[11px] text-zinc-300 font-semibold pt-1">
                      Sets: <span className="text-lime-400 font-bold">{ex.defaultSets}</span> • Reps: <span className="text-white">{ex.defaultReps}</span> • Rest: {ex.restSeconds}s
                    </div>

                    {/* Substitution tip */}
                    {ex.beginnerAlternative && (
                      <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[10px] text-zinc-400">
                        <span className="text-zinc-500 font-bold">Sub:</span> {ex.beginnerAlternative}
                      </div>
                    )}
                  </div>

                  {/* Inline Animation Dropdown */}
                  {isInlineOpen && (
                    <div className="mt-2 pt-2 border-t border-zinc-900">
                      <AnimatedExercise exerciseId={ex.id} exerciseName={ex.name} compact={true} />
                    </div>
                  )}

                  {/* Bottom Action Buttons */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => setExpandedAnimationId(isInlineOpen ? null : ex.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{isInlineOpen ? 'Hide Demo' : 'Quick Demo'}</span>
                      {isInlineOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setActiveModalExercise(ex)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold border border-zinc-800 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-lime-400" />
                      <span>Full Form Guide</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
