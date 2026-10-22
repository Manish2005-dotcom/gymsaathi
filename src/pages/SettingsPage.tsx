import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flame,
} from 'lucide-react';
import { AppSettings } from '../types/fitness';
import { StorageService } from '../services/storage';
import { ConfirmModal } from '../components/ConfirmModal';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetComplete: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetComplete,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportBackup = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gymsaathi_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = StorageService.importAllData(text);
        if (success) {
          setImportStatus('Backup restored successfully! Refreshing...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setImportStatus('Invalid backup file format.');
        }
      } catch (err) {
        setImportStatus('Failed to read file.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    StorageService.resetAllData();
    setShowResetModal(false);
    onResetComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All GymSaathi Data?"
        message="This will completely wipe your profile, workout completion history, custom kitchen ingredients, and progress logs from your browser. This action is irreversible."
        confirmLabel="Reset All Data"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
          <Settings className="w-4 h-4" />
          <span>System & Preferences</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Application Settings</h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Control your local storage data, create portable JSON backups, and manage display units.
        </p>
      </div>

      {/* Display Units */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
        <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
          1. Measurement Units
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Weight Unit</label>
            <select
              value={settings.weightUnit}
              onChange={(e) => onUpdateSettings({ ...settings, weightUnit: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm"
            >
              <option value="kg">Kilograms (kg) — Standard India</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Height Unit</label>
            <select
              value={settings.heightUnit}
              onChange={(e) => onUpdateSettings({ ...settings, heightUnit: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm"
            >
              <option value="cm">Centimeters (cm) — Standard India</option>
              <option value="ft_in">Feet & Inches</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">2. Data Portability & Backup</h3>
            <p className="text-xs text-zinc-400">
              Export your data so you can move it between devices or keep a personal copy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <span className="font-bold text-white text-sm block">Export JSON Backup</span>
            <p className="text-xs text-zinc-400">
              Downloads a complete JSON snapshot of your profile, workout logs, kitchen inventory, and progress records.
            </p>
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-lime-400" />
              <span>Download Backup File</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <span className="font-bold text-white text-sm block">Restore Backup</span>
            <p className="text-xs text-zinc-400">
              Upload a previously exported GymSaathi JSON backup file to restore your entire state.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-lime-400" />
              <span>Choose Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
            {importStatus && (
              <p className="text-xs text-lime-400 font-semibold">{importStatus}</p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-950/20 border border-red-900/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Reset All Application State</h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Permanently wipe all logged workouts, saved diets, and profile details stored in this browser.
            </p>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-950/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Everything</span>
          </button>
        </div>
      </div>

      {/* About App */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Flame className="w-4 h-4 text-lime-400" />
          <span>GymSaathi v1.0.0</span>
        </div>
        <p>
          Personal Fitness Companion engineered for gym beginners and students across India. Open-source design, zero telemetry, and complete local privacy.
        </p>
      </div>
    </div>
  );
};
