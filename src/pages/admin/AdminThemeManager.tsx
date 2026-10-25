import React, { useState } from 'react';
import {
  Palette,
  Check,
  Moon,
  Sun,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useTheme, PREDEFINED_THEMES } from '../../context/ThemeContext';

export const AdminThemeManager: React.FC = () => {
  const { theme, setAccentColor, setAppearance, saveGlobalTheme, loading } = useTheme();

  const [selectedColor, setSelectedColor] = useState(theme.accentColor);
  const [selectedName, setSelectedName] = useState(theme.accentName);
  const [selectedMode, setSelectedMode] = useState<'dark' | 'light'>(theme.appearance);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectPreset = (name: string, color: string) => {
    setSelectedColor(color);
    setSelectedName(name);
    setAccentColor(color, name);
  };

  const handleSaveDefault = async () => {
    const success = await saveGlobalTheme({
      accentColor: selectedColor,
      accentName: selectedName,
      appearance: selectedMode,
    });
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-lime-400" />
          <span>Site Theme & Brand Appearance</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Define the default neon accent glow, contrast themes, and visual branding deployed across GymSaathi.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Global theme successfully updated in Supabase! All new and guest visitors will inherit this brand style.</span>
        </div>
      )}

      {/* Preset Accent Palettes */}
      <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lime-400" />
          <span>Curated SaaS Neon Palettes</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Click any preset to preview the application live:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PREDEFINED_THEMES.map((preset) => {
            const isSelected = selectedColor.toLowerCase() === preset.color.toLowerCase();
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset.name, preset.color)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-white bg-zinc-900 shadow-xl'
                    : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: preset.color }}
                >
                  {isSelected && <Check className="w-4 h-4 text-black font-black" />}
                </div>
                <div className="text-xs font-bold text-white">{preset.name}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{preset.color}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Selector & Appearance Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Hex Picker */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Custom Brand Hex Code</h2>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                setSelectedName('Custom Neon');
                setAccentColor(e.target.value, 'Custom Neon');
              }}
              className="w-12 h-12 rounded-xl border border-zinc-800 bg-transparent cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  if (e.target.value.startsWith('#')) {
                    setAccentColor(e.target.value);
                  }
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-lime-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Hex code with #</span>
            </div>
          </div>
        </div>

        {/* Appearance Default Mode */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Default Appearance Mode</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedMode('dark');
                setAppearance('dark');
              }}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                selectedMode === 'dark'
                  ? 'bg-zinc-900 border-lime-400 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-lime-400" />
              <span>Dark Charcoal (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('light');
                setAppearance('light');
              }}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                selectedMode === 'light'
                  ? 'bg-zinc-900 border-lime-400 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Sample Card */}
      <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
        <h2 className="text-sm font-bold text-white">Live User Interface Preview</h2>
        <div className="p-5 rounded-2xl bg-[#0c100e] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black"
              style={{ backgroundColor: selectedColor }}
            >
              GS
            </div>
            <div>
              <div className="text-sm font-bold text-white">GymSaathi Personal Fitness</div>
              <div className="text-xs text-zinc-400">Current Theme: {selectedName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-black font-extrabold text-xs shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: selectedColor }}
            >
              Start Workout Demo
            </button>
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300"
            >
              Explore Split
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => handleSelectPreset('Neon Lime', '#84CC16')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default Neon Lime</span>
        </button>

        <button
          type="button"
          onClick={handleSaveDefault}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-extrabold shadow-lg shadow-lime-500/10 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving to Database...' : 'Deploy Global Brand Theme'}</span>
        </button>
      </div>
    </div>
  );
};
