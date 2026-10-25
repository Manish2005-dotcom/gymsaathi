import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Sparkles,
  RefreshCw,
  X,
  Calendar,
  Dumbbell,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { PublicWorkoutTemplate } from '../../types/admin';
import { WORKOUT_TEMPLATES } from '../../data/workoutTemplates';
import { FitnessGoal, ExerciseDifficulty } from '../../types/fitness';

export const AdminWorkoutManager: React.FC = () => {
  const [templates, setTemplates] = useState<PublicWorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<PublicWorkoutTemplate> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    const data = await AdminService.getWorkoutTemplates(true);
    // If database is empty, initialize with built-in templates
    if (data.length === 0) {
      const seeded: PublicWorkoutTemplate[] = WORKOUT_TEMPLATES.map((t) => ({
        id: t.id,
        title: t.name,
        description: t.description,
        splitType: t.name,
        daysPerWeek: t.daysPerWeek,
        difficulty: t.experienceLevel,
        goal: 'muscle_gain',
        daysData: t.planFactory(),
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setTemplates(seeded);
    } else {
      setTemplates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleOpenCreate = () => {
    setEditingTemplate({
      title: '',
      description: '',
      splitType: 'Custom Split',
      daysPerWeek: 4,
      difficulty: 'beginner',
      goal: 'muscle_gain',
      isPublished: true,
    });
    setEditorOpen(true);
  };

  const handleOpenEdit = (tmpl: PublicWorkoutTemplate) => {
    setEditingTemplate(tmpl);
    setEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate?.title?.trim()) return;

    setSaveLoading(true);
    await AdminService.saveWorkoutTemplate(editingTemplate);
    setSaveLoading(false);
    setEditorOpen(false);
    fetchTemplates();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await AdminService.toggleTemplatePublish(id, current);
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPublished: !current } : t))
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await AdminService.deleteWorkoutTemplate(deleteId);
    setDeleteId(null);
    fetchTemplates();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-lime-400" />
            <span>Workout Split Templates Manager</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure preset weekly workout splits (Push/Pull/Legs, Bro Split, Upper/Lower, 6-Day) for user calendars.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchTemplates}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-lime-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs shadow-md shadow-lime-500/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 px-2 py-0.5 rounded-md bg-lime-500/10 border border-lime-500/20">
                  {tmpl.splitType || 'Split Template'}
                </span>
                <button
                  onClick={() => handleTogglePublish(tmpl.id, tmpl.isPublished)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    tmpl.isPublished
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {tmpl.isPublished ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{tmpl.isPublished ? 'Published' : 'Draft'}</span>
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{tmpl.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {tmpl.description || 'Targeted training schedule for optimal recovery and progressive overload.'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {tmpl.daysPerWeek} days/week
                </span>
                <span className="capitalize">{tmpl.difficulty}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800/80">
              <span className="text-[10px] text-zinc-500">Live for users</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(tmpl)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(tmpl.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editorOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121614] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">
                {editingTemplate.id ? 'Edit Workout Template' : 'New Workout Template'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Template Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Day Upper / Lower Hypertrophy"
                  value={editingTemplate.title || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summarize the split structure..."
                  value={editingTemplate.description || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Days Per Week</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={editingTemplate.daysPerWeek || 4}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, daysPerWeek: Number(e.target.value) || 4 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Target Goal</label>
                  <select
                    value={editingTemplate.goal || 'muscle_gain'}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, goal: e.target.value as FitnessGoal })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="tpl-pub"
                  checked={editingTemplate.isPublished ?? true}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-lime-500"
                />
                <label htmlFor="tpl-pub" className="text-zinc-300 font-semibold cursor-pointer">
                  Make available in user workout split templates list
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl"
                >
                  {saveLoading ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121614] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white text-center">Delete Template?</h3>
            <p className="text-xs text-zinc-400 text-center">
              Are you sure you want to remove this workout template from the public library?
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
