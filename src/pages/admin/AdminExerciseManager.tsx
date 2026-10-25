import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Dumbbell,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Edit,
  Sparkles,
  AlertTriangle,
  Play,
  FileVideo,
  Image,
  RefreshCw,
  X,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { PublicExercise } from '../../types/admin';
import { MuscleGroup, EquipmentType, ExerciseDifficulty } from '../../types/fitness';
import { AnimatedExercise } from '../../components/AnimatedExercise';
import { EXERCISE_ANIMATIONS } from '../../data/exerciseAnimations';

export const AdminExerciseManager: React.FC = () => {
  const [exercises, setExercises] = useState<PublicExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Partial<PublicExercise> | null>(null);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);
  const [previewMediaType, setPreviewMediaType] = useState<'animation' | 'video' | 'gif'>('animation');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchExercises = async () => {
    setLoading(true);
    const data = await AdminService.getExercises(true);
    setExercises(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleOpenCreate = () => {
    setEditingExercise({
      name: '',
      description: '',
      primaryMuscle: 'chest',
      secondaryMuscles: [],
      equipment: 'dumbbell',
      difficulty: 'beginner',
      instructions: ['Set up with stable posture and engaged core.', 'Perform controlled repetition.'],
      commonMistakes: ['Swinging or using momentum instead of target muscle.'],
      formTips: ['Breathe steadily throughout the movement.'],
      defaultSets: 3,
      defaultReps: '10-12',
      durationSeconds: 60,
      demonstrationType: 'animation',
      animationKey: 'bicep-curl',
      isPublished: true,
    });
    setPreviewMediaUrl(null);
    setPreviewMediaType('animation');
    setFormError(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (ex: PublicExercise) => {
    setEditingExercise(ex);
    setPreviewMediaUrl(ex.demonstrationUrl || null);
    setPreviewMediaType(ex.demonstrationType || 'animation');
    setFormError(null);
    setEditorOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setFormError(null);

    const result = await AdminService.uploadMediaAsset(file);
    setUploadLoading(false);

    if (result.success && result.url) {
      setPreviewMediaUrl(result.url);
      const isVideo = file.type.startsWith('video');
      const isGif = file.type === 'image/gif';
      const detectedType = isVideo ? 'video' : isGif ? 'gif' : 'animation';
      setPreviewMediaType(detectedType);
      setEditingExercise((prev) => ({
        ...prev,
        demonstrationUrl: result.url,
        demonstrationType: detectedType,
      }));
    } else {
      setFormError(result.error || 'Failed to upload media file.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise?.name?.trim()) {
      setFormError('Exercise name is required.');
      return;
    }

    setSaveLoading(true);
    setFormError(null);

    const res = await AdminService.saveExercise(editingExercise);
    setSaveLoading(false);

    if (res.success) {
      setEditorOpen(false);
      fetchExercises();
    } else {
      setFormError(res.error || 'Failed to save exercise in Supabase.');
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await AdminService.toggleExercisePublish(id, current);
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, isPublished: !current } : ex))
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await AdminService.deleteExercise(deleteId);
    setDeleteId(null);
    fetchExercises();
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleFilter === 'all' || ex.primaryMuscle === muscleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && ex.isPublished) ||
      (statusFilter === 'draft' && !ex.isPublished);
    return matchesSearch && matchesMuscle && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-lime-400" />
            <span>Exercise & Animation Manager</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create, edit, publish, or upload video/GIF/SVG demonstrations visible in the user workout library.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchExercises}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
            title="Refresh exercise list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-lime-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs shadow-md shadow-lime-500/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Exercise</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search exercises, muscles, equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500"
          />
        </div>

        <div>
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500 capitalize"
          >
            <option value="all">All Muscle Groups</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="biceps">Biceps</option>
            <option value="triceps">Triceps</option>
            <option value="shoulders">Shoulders</option>
            <option value="abs">Abs / Core</option>
            <option value="quadriceps">Quadriceps</option>
            <option value="hamstrings">Hamstrings</option>
            <option value="glutes">Glutes</option>
            <option value="calves">Calves</option>
            <option value="full_body">Full Body</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500"
          >
            <option value="all">All Statuses (Published & Drafts)</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Exercises Table / Card Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading exercises from Supabase...</span>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="p-12 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
            <Dumbbell className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white">No exercises found</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create your first exercise or sync default exercises to start building your public workout library.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold rounded-xl"
          >
            Create Exercise
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Exercise Name</th>
                  <th className="px-4 py-3">Muscle / Gear</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Demonstration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredExercises.map((ex) => (
                  <tr key={ex.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-lime-400" />
                        <span>{ex.name}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-normal truncate max-w-xs">
                        {ex.description || 'No description provided.'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="capitalize font-medium text-zinc-200">{ex.primaryMuscle}</span>
                      <span className="text-zinc-500 text-[11px] block capitalize">{ex.equipment}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        ex.difficulty === 'beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ex.difficulty === 'intermediate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {ex.difficulty}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-300">
                        {ex.demonstrationType === 'video' ? (
                          <FileVideo className="w-3 h-3 text-sky-400" />
                        ) : ex.demonstrationType === 'gif' ? (
                          <Image className="w-3 h-3 text-amber-400" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-lime-400" />
                        )}
                        <span className="capitalize">{ex.demonstrationType}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(ex.id, ex.isPublished)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          ex.isPublished
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {ex.isPublished ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{ex.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(ex)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Edit Exercise"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(ex.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete Exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {editorOpen && editingExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-[#111513] border border-zinc-800 rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                <span>{editingExercise.id ? 'Edit Exercise' : 'Create New Exercise'}</span>
              </h2>
              <button
                onClick={() => setEditorOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Exercise Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Incline Dumbbell Press"
                    value={editingExercise.name || ''}
                    onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Muscle Group</label>
                  <select
                    value={editingExercise.primaryMuscle || 'chest'}
                    onChange={(e) => setEditingExercise({ ...editingExercise, primaryMuscle: e.target.value as MuscleGroup })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500 capitalize"
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="biceps">Biceps</option>
                    <option value="triceps">Triceps</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="abs">Abs / Core</option>
                    <option value="quadriceps">Quadriceps</option>
                    <option value="hamstrings">Hamstrings</option>
                    <option value="glutes">Glutes</option>
                    <option value="calves">Calves</option>
                    <option value="full_body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Equipment</label>
                  <select
                    value={editingExercise.equipment || 'dumbbell'}
                    onChange={(e) => setEditingExercise({ ...editingExercise, equipment: e.target.value as EquipmentType })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500 capitalize"
                  >
                    <option value="dumbbell">Dumbbells</option>
                    <option value="barbell">Barbells</option>
                    <option value="cable">Cable Machine</option>
                    <option value="machine">Weight Machine</option>
                    <option value="bodyweight">Bodyweight Only</option>
                    <option value="bands">Resistance Bands</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Difficulty Level</label>
                  <select
                    value={editingExercise.difficulty || 'beginner'}
                    onChange={(e) => setEditingExercise({ ...editingExercise, difficulty: e.target.value as ExerciseDifficulty })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500 capitalize"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Sets & Reps</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      value={editingExercise.defaultSets || 3}
                      onChange={(e) => setEditingExercise({ ...editingExercise, defaultSets: Number(e.target.value) || 3 })}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 10-12"
                      value={editingExercise.defaultReps || '10-12'}
                      onChange={(e) => setEditingExercise({ ...editingExercise, defaultReps: e.target.value })}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>
              </div>

              {/* Demonstration Asset Upload & Preview */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-lime-400" />
                    <span>Demonstration Asset (GIF, Video, or SVG Animation)</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Max 15MB</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-lime-500/50 rounded-xl p-4 cursor-pointer bg-zinc-900/40 hover:bg-zinc-900 transition-colors">
                      <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                      <span className="text-xs font-semibold text-zinc-300">
                        {uploadLoading ? 'Uploading to Supabase...' : 'Click to Upload Asset'}
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">GIF, MP4, WebM, SVG or PNG</span>
                      <input
                        type="file"
                        accept="image/gif,image/svg+xml,image/png,image/jpeg,video/mp4,video/webm"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or select SVG Animation Key */}
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[11px] text-zinc-400 font-semibold">Or use Built-in 2D Animated Character:</label>
                    <select
                      value={editingExercise.animationKey || 'bicep-curl'}
                      onChange={(e) => {
                        setEditingExercise({ ...editingExercise, animationKey: e.target.value, demonstrationType: 'animation' });
                        setPreviewMediaType('animation');
                        setPreviewMediaUrl(null);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500"
                    >
                      {Object.keys(EXERCISE_ANIMATIONS).map((k) => (
                        <option key={k} value={k}>
                          {EXERCISE_ANIMATIONS[k].exerciseName} (2D Humanoid Demo)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Demonstration Preview Box */}
                <div className="mt-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Live Demonstration Preview</p>
                  {previewMediaUrl ? (
                    previewMediaType === 'video' ? (
                      <video src={previewMediaUrl} controls autoPlay loop className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <img src={previewMediaUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                    )
                  ) : (
                    <div className="max-w-[280px] mx-auto bg-zinc-950 rounded-xl p-2 border border-zinc-800">
                      <AnimatedExercise
                        exerciseId={editingExercise.animationKey || 'bicep-curl'}
                        exerciseName={editingExercise.name || 'Exercise Demo'}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Movement Instructions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={(editingExercise.instructions || []).join('\n')}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      instructions: e.target.value.split('\n').filter((s) => s.trim()),
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-lime-500 font-sans"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={editingExercise.isPublished ?? true}
                  onChange={(e) => setEditingExercise({ ...editingExercise, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-lime-500 focus:ring-lime-500 bg-zinc-950 border-zinc-800"
                />
                <label htmlFor="pub-check" className="text-xs font-semibold text-zinc-200 cursor-pointer">
                  Publish to users immediately (visible in the public exercise library)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  {saveLoading ? 'Saving to Database...' : 'Save & Publish Exercise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121614] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-white">Delete Exercise?</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to permanently delete this exercise? This action will remove it from the public library.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
