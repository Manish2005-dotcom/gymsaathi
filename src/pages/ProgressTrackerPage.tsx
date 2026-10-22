import React, { useState } from 'react';
import {
  LineChart as ChartIcon,
  Plus,
  Trash2,
  Edit2,
  Download,
  AlertCircle,
  Calendar,
  Scale,
  TrendingUp,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ProgressEntry } from '../types/fitness';
import { ConfirmModal } from '../components/ConfirmModal';

interface ProgressTrackerPageProps {
  entries: ProgressEntry[];
  onAddEntry: (entry: ProgressEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

export const ProgressTrackerPage: React.FC<ProgressTrackerPageProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  onClearAll,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Form states
  const todayStr = new Date().toISOString().split('T')[0];
  const [formDate, setFormDate] = useState(todayStr);
  const [formWeight, setFormWeight] = useState<number>(68);
  const [formWaist, setFormWaist] = useState<string>('');
  const [formWorkouts, setFormWorkouts] = useState<number>(1);
  const [formCalories, setFormCalories] = useState<string>('');
  const [formProtein, setFormProtein] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (formWeight < 30 || formWeight > 250) return;

    const newEntry: ProgressEntry = {
      id: `entry-${Date.now()}`,
      date: formDate,
      weightKg: Number(formWeight),
      waistCm: formWaist ? Number(formWaist) : undefined,
      workoutsCompletedCount: Number(formWorkouts) || 0,
      dailyCalories: formCalories ? Number(formCalories) : undefined,
      dailyProtein: formProtein ? Number(formProtein) : undefined,
      notes: formNotes.trim() || undefined,
    };

    onAddEntry(newEntry);
    setShowAddForm(false);
    setFormNotes('');
  };

  // Filter entries by range
  const filteredEntries = entries.filter((e) => {
    if (selectedRange === 'all') return true;
    const days = Number(selectedRange);
    const entryDate = new Date(e.date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return entryDate >= cutoff;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (entries.length === 0) return;
    const headers = ['Date', 'Weight (kg)', 'Waist (cm)', 'Workouts Completed', 'Daily Calories', 'Daily Protein (g)', 'Notes'];
    const rows = entries.map((e) => [
      e.date,
      e.weightKg,
      e.waistCm || '',
      e.workoutsCompletedCount,
      e.dailyCalories || '',
      e.dailyProtein || '',
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gymsaathi_progress_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render SVG Line Chart
  const renderWeightChart = () => {
    if (filteredEntries.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center text-xs text-zinc-500 text-center p-4">
          Log at least 2 entries across different days to generate your weight trend line.
        </div>
      );
    }

    const weights = filteredEntries.map((e) => e.weightKg);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const rangeW = maxW - minW || 1;

    const width = 600;
    const height = 180;
    const padding = 35;

    const points = filteredEntries.map((e, idx) => {
      const x = padding + (idx / (filteredEntries.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((e.weightKg - minW) / rangeW) * (height - 2 * padding);
      return { x, y, ...e };
    });

    const pathData = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          {/* Horizontal grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#27272a" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#27272a" strokeDasharray="3 3" />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#3f3f46"
          />

          {/* Value labels */}
          <text x={padding - 5} y={padding + 4} fill="#71717a" fontSize="10" textAnchor="end">
            {maxW.toFixed(0)} kg
          </text>
          <text x={padding - 5} y={height - padding + 4} fill="#71717a" fontSize="10" textAnchor="end">
            {minW.toFixed(0)} kg
          </text>

          {/* Area fill */}
          <path
            d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#weightGradient)"
            opacity="0.25"
          />

          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Stroke Line */}
          <path d={pathData} fill="none" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#18181b" stroke="#84cc16" strokeWidth="2" />
              <text x={p.x} y={height - 12} fill="#71717a" fontSize="9" textAnchor="middle">
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Progress Entry?"
        message="Are you sure you want to delete this recorded log? This action cannot be reversed."
        confirmLabel="Delete Log"
        isDestructive={true}
        onConfirm={() => {
          if (deleteConfirmId) {
            onDeleteEntry(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <ConfirmModal
        isOpen={showClearAllConfirm}
        title="Clear All Progress Entries?"
        message="This will delete all logged body weight and progress entries. Your profile and workout split will remain safe."
        confirmLabel="Clear All Progress"
        isDestructive={true}
        onConfirm={() => {
          onClearAll();
          setShowClearAllConfirm(false);
        }}
        onCancel={() => setShowClearAllConfirm(false)}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
            <ChartIcon className="w-4 h-4" />
            <span>Habit & Measurement Tracking</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Progress & Consistency Tracker
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Track weight trends, waist measurements, and workouts. Your data stays 100% in your local browser.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {entries.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-800 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-lime-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Log Entry'}</span>
          </button>
        </div>
      </div>

      {/* Add New Entry Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateEntry}
          className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 animate-fade-in"
        >
          <div className="font-bold text-white text-sm border-b border-zinc-800 pb-2">
            Record New Measurement
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={formWeight}
                onChange={(e) => setFormWeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Waist (cm, opt)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 82"
                value={formWaist}
                onChange={(e) => setFormWaist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Workouts Done</label>
              <input
                type="number"
                min="0"
                max="2"
                value={formWorkouts}
                onChange={(e) => setFormWorkouts(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Daily Calories</label>
              <input
                type="number"
                placeholder="e.g. 2400"
                value={formCalories}
                onChange={(e) => setFormCalories(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Daily Protein (g)</label>
              <input
                type="number"
                placeholder="e.g. 125"
                value={formProtein}
                onChange={(e) => setFormProtein(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold text-xs mb-1">Notes</label>
            <input
              type="text"
              placeholder="e.g. Slept 8 hrs, hit all heavy row sets"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs shadow-md"
            >
              Save Log Entry
            </button>
          </div>
        </form>
      )}

      {/* Visual Chart Card */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-lime-400" />
            <h3 className="font-bold text-white text-base">Body Weight Over Time</h3>
          </div>

          {/* Range Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px]">
            <button
              onClick={() => setSelectedRange('7')}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                selectedRange === '7' ? 'bg-lime-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setSelectedRange('30')}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                selectedRange === '30' ? 'bg-lime-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setSelectedRange('90')}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                selectedRange === '90' ? 'bg-lime-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              90D
            </button>
            <button
              onClick={() => setSelectedRange('all')}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                selectedRange === 'all' ? 'bg-lime-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Chart render */}
        {renderWeightChart()}

        <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            Short-term fluctuations (±1 to 2 kg) reflect salt, water retention, and digestion rather than pure muscle or fat tissue.
          </span>
        </p>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Recorded Log History</h3>
          {entries.length > 0 && (
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              Clear All Entries
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <Scale className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="font-bold text-white text-sm">No progress records yet</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Start by logging today's body weight. Tracking consistently once or twice a week keeps you accountable.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl bg-lime-500 text-zinc-950 font-bold text-xs"
            >
              Add First Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Workouts</th>
                  <th className="p-3">Calories</th>
                  <th className="p-3">Protein</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {[...entries].reverse().map((e) => (
                  <tr key={e.id} className="hover:bg-zinc-900/40">
                    <td className="p-3 font-semibold text-white">{e.date}</td>
                    <td className="p-3 font-bold text-lime-400">{e.weightKg} kg</td>
                    <td className="p-3 text-zinc-400">{e.waistCm ? `${e.waistCm} cm` : '—'}</td>
                    <td className="p-3 text-zinc-400">{e.workoutsCompletedCount > 0 ? `${e.workoutsCompletedCount} done` : '—'}</td>
                    <td className="p-3 text-zinc-400">{e.dailyCalories ? `${e.dailyCalories} kcal` : '—'}</td>
                    <td className="p-3 text-zinc-400">{e.dailyProtein ? `${e.dailyProtein}g` : '—'}</td>
                    <td className="p-3 text-zinc-400 max-w-[180px] truncate">{e.notes || '—'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setDeleteConfirmId(e.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
