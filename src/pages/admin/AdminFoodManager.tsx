import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { PublicFoodItem } from '../../types/admin';
import { FoodItem } from '../../types/fitness';
import { INDIAN_FOOD_DATABASE } from '../../data/indianFoods';

export const AdminFoodManager: React.FC = () => {
  const [foods, setFoods] = useState<PublicFoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Partial<PublicFoodItem> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [nutritionWarning, setNutritionWarning] = useState<string | null>(null);

  const fetchFoods = async () => {
    setLoading(true);
    const data = await AdminService.getFoodItems(true);
    if (data.length === 0) {
      // Seed initial foods from built-in Indian database
      const initial: PublicFoodItem[] = INDIAN_FOOD_DATABASE.map((f: FoodItem) => ({
        id: f.id,
        name: f.name,
        hindiName: f.hindiName,
        category: f.category,
        dietType: f.dietType,
        servingUnit: f.servingUnit,
        servingGrams: f.servingGrams,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fats: f.fats,
        approxCostInr: f.approxCostInr,
        isPublished: true,
        createdAt: new Date().toISOString(),
      }));
      setFoods(initial);
    } else {
      setFoods(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleOpenCreate = () => {
    setEditingFood({
      name: '',
      hindiName: '',
      category: 'protein',
      dietType: 'vegetarian',
      servingUnit: 'g',
      servingGrams: 100,
      calories: 150,
      protein: 15,
      carbs: 10,
      fats: 5,
      approxCostInr: 30,
      isPublished: true,
    });
    setNutritionWarning(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (food: PublicFoodItem) => {
    setEditingFood(food);
    setNutritionWarning(null);
    setEditorOpen(true);
  };

  // Real-time nutrition validation
  const validateNutrition = (p: number, c: number, f: number, cal: number) => {
    const calculatedCal = p * 4 + c * 4 + f * 9;
    const diff = Math.abs(calculatedCal - cal);
    if (diff > 45) {
      setNutritionWarning(
        `Note: Stated calories (${cal} kcal) deviates from standard 4-4-9 macro sum (${calculatedCal} kcal by ${Math.round(diff)} kcal). Double check serving labels.`
      );
    } else {
      setNutritionWarning(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood?.name?.trim()) return;

    await AdminService.saveFoodItem(editingFood);
    setEditorOpen(false);
    fetchFoods();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await AdminService.toggleFoodPublish(id, current);
    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isPublished: !current } : f))
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await AdminService.deleteFoodItem(deleteId);
    setDeleteId(null);
    fetchFoods();
  };

  const filteredFoods = foods.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.hindiName && f.hindiName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-lime-400" />
            <span>Indian Food & Nutrition Database</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage affordable Indian staples (soya chunks, paneer, sattu, eggs, dals) with validated macros for the automatic meal generator.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchFoods}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-lime-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs shadow-md shadow-lime-500/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Search food by English or Hindi name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500 capitalize"
        >
          <option value="all">All Food Categories</option>
          <option value="protein">Protein Sources</option>
          <option value="carbs">Carbohydrate Staples</option>
          <option value="fats">Healthy Fats & Nuts</option>
          <option value="dairy">Dairy Products</option>
          <option value="fruits_veggies">Fruits & Vegetables</option>
        </select>
      </div>

      {/* Food Items Table */}
      <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Food Name</th>
                <th className="px-4 py-3">Diet Type</th>
                <th className="px-4 py-3">Serving Size</th>
                <th className="px-4 py-3">Calories</th>
                <th className="px-4 py-3">P / C / F</th>
                <th className="px-4 py-3">Approx Cost</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredFoods.map((food) => (
                <tr key={food.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">
                    <div>{food.name}</div>
                    {food.hindiName && (
                      <div className="text-[10px] text-zinc-500">{food.hindiName}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-300">{food.dietType}</td>
                  <td className="px-4 py-3">{food.servingGrams}{food.servingUnit}</td>
                  <td className="px-4 py-3 font-bold text-lime-400">{food.calories} kcal</td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span className="text-emerald-400">{food.protein}P</span> /{' '}
                    <span className="text-amber-400">{food.carbs}C</span> /{' '}
                    <span className="text-sky-400">{food.fats}F</span>
                  </td>
                  <td className="px-4 py-3">₹{food.approxCostInr}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(food.id, food.isPublished)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        food.isPublished
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {food.isPublished ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{food.isPublished ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(food)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(food.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
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

      {/* Editor Modal */}
      {editorOpen && editingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121614] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">
                {editingFood.id ? 'Edit Food Item' : 'New Food Item'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {nutritionWarning && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{nutritionWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soya Chunks"
                    value={editingFood.name || ''}
                    onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Hindi / Local Name</label>
                  <input
                    type="text"
                    placeholder="e.g. सोया बड़ी"
                    value={editingFood.hindiName || ''}
                    onChange={(e) => setEditingFood({ ...editingFood, hindiName: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingFood.category || 'protein'}
                    onChange={(e) => setEditingFood({ ...editingFood, category: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500 capitalize"
                  >
                    <option value="protein">Protein</option>
                    <option value="carbs">Carbs</option>
                    <option value="fats">Fats</option>
                    <option value="dairy">Dairy</option>
                    <option value="fruits_veggies">Fruits & Veggies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Diet Type</label>
                  <select
                    value={editingFood.dietType || 'vegetarian'}
                    onChange={(e) => setEditingFood({ ...editingFood, dietType: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500 capitalize"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Calories</label>
                  <input
                    type="number"
                    value={editingFood.calories || 0}
                    onChange={(e) => {
                      const cal = Number(e.target.value) || 0;
                      setEditingFood({ ...editingFood, calories: cal });
                      validateNutrition(editingFood.protein || 0, editingFood.carbs || 0, editingFood.fats || 0, cal);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingFood.protein || 0}
                    onChange={(e) => {
                      const p = Number(e.target.value) || 0;
                      setEditingFood({ ...editingFood, protein: p });
                      validateNutrition(p, editingFood.carbs || 0, editingFood.fats || 0, editingFood.calories || 0);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-400 font-semibold mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingFood.carbs || 0}
                    onChange={(e) => {
                      const c = Number(e.target.value) || 0;
                      setEditingFood({ ...editingFood, carbs: c });
                      validateNutrition(editingFood.protein || 0, c, editingFood.fats || 0, editingFood.calories || 0);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sky-400 font-semibold mb-1">Fats (g)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingFood.fats || 0}
                    onChange={(e) => {
                      const f = Number(e.target.value) || 0;
                      setEditingFood({ ...editingFood, fats: f });
                      validateNutrition(editingFood.protein || 0, editingFood.carbs || 0, f, editingFood.calories || 0);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Serving Grams</label>
                  <input
                    type="number"
                    value={editingFood.servingGrams || 100}
                    onChange={(e) => setEditingFood({ ...editingFood, servingGrams: Number(e.target.value) || 100 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Approx Cost (₹ INR)</label>
                  <input
                    type="number"
                    value={editingFood.approxCostInr || 0}
                    onChange={(e) => setEditingFood({ ...editingFood, approxCostInr: Number(e.target.value) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lime-500"
                  />
                </div>
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
                  className="px-5 py-2 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl"
                >
                  Save Food Item
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
            <h3 className="text-sm font-bold text-white text-center">Delete Food Item?</h3>
            <p className="text-xs text-zinc-400 text-center">
              Are you sure you want to remove this item from the food database?
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
