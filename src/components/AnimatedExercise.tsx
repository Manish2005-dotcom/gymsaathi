import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { AnimationView, ExerciseAnimationDef, JointPosition2D } from '../types/fitness';
import { getExerciseAnimation, interpolateJoints } from '../data/exerciseAnimations';

interface AnimatedExerciseProps {
  exerciseId: string;
  exerciseName?: string;
  autoPlay?: boolean;
  compact?: boolean;
  className?: string;
}

export const AnimatedExercise: React.FC<AnimatedExerciseProps> = ({
  exerciseId,
  exerciseName,
  autoPlay = true,
  compact = false,
  className = '',
}) => {
  const animDef = getExerciseAnimation(exerciseId);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<AnimationView>(animDef.defaultView);
  const [activeTab, setActiveTab] = useState<'tips' | 'mistakes'>('tips');

  // Animation timeline state: 0 to 1
  const [progress, setProgress] = useState<number>(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const durationMs = (animDef.durationSeconds * 1000) * (isSlowMo ? 2.0 : 1.0);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = (elapsed % durationMs) / durationMs;

      setProgress(rawProgress);

      // Determine current phase
      const phases = animDef.phases;
      let accPercent = 0;
      let foundIdx = 0;
      for (let i = 0; i < phases.length; i++) {
        accPercent += phases[i].durationPercent / 100;
        if (rawProgress <= accPercent) {
          foundIdx = i;
          break;
        }
      }
      setCurrentPhaseIndex(foundIdx);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isSlowMo, durationMs, animDef]);

  // Compute interpolated joints between current phase and next phase
  const phases = animDef.phases;
  const numPhases = phases.length;
  const currentPhase = phases[currentPhaseIndex] || phases[0];
  const nextPhase = phases[(currentPhaseIndex + 1) % numPhases];

  // Calculate local progress within this specific phase
  let phaseStartT = 0;
  for (let i = 0; i < currentPhaseIndex; i++) {
    phaseStartT += phases[i].durationPercent / 100;
  }
  const phaseDurationT = currentPhase.durationPercent / 100;
  const localPhaseProgress = Math.max(0, Math.min(1, (progress - phaseStartT) / (phaseDurationT || 1)));

  // Smooth ease in-out
  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  const smoothedT = easeInOut(localPhaseProgress);

  const currentJoints: JointPosition2D = interpolateJoints(
    currentPhase.joints,
    nextPhase.joints,
    smoothedT
  );

  const handleRestart = () => {
    startTimeRef.current = null;
    setProgress(0);
    setCurrentPhaseIndex(0);
    setIsPlaying(true);
  };

  // Color theme definitions for cartoon fitness model
  const skinColor = '#fdba74'; // warm skin tone
  const jointColor = '#84cc16'; // lime green pivot highlight
  const shirtColor = '#18181b'; // dark athletic compression shirt
  const shortsColor = '#27272a'; // dark athletic shorts
  const shoeColor = '#84cc16'; // vibrant neon green kicks
  const barbellColor = '#94a3b8'; // steel bar
  const plateColor = '#22c55e'; // lime green bumper plates

  return (
    <div className={`rounded-3xl bg-zinc-950 border border-zinc-800/90 overflow-hidden flex flex-col ${className}`}>
      {/* Header bar with phase indicator */}
      <div className="p-3 sm:p-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-xs font-black text-white truncate">
            {exerciseName || animDef.exerciseName}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-lime-500/15 text-lime-400 border border-lime-500/30">
            {currentPhase.name.split(':')[1]?.trim() || currentPhase.name}
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 flex items-center justify-center overflow-hidden">
        {/* Subtle Gym floor grid lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Phase Cue Banner */}
        <div className="absolute top-2.5 inset-x-3 text-center pointer-events-none z-10">
          <div className="inline-block px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-zinc-800 text-[11px] font-semibold text-zinc-200 shadow-md">
            {currentPhase.cue}
          </div>
        </div>

        {/* Animated Character SVG */}
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full max-h-[300px] select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          {/* Floor Mat or Ground Line */}
          <line x1="20" y1="216" x2="180" y2="216" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
          {currentJoints.floorMat && (
            <rect x="25" y="214" width="150" height="4" rx="2" fill="#3f3f46" opacity="0.6" />
          )}

          {/* Bench Prop */}
          {currentJoints.bench && (
            <g>
              <rect
                x={currentJoints.bench.x}
                y={currentJoints.bench.y}
                width={currentJoints.bench.width}
                height={currentJoints.bench.height}
                rx="6"
                fill="#27272a"
                stroke="#3f3f46"
                strokeWidth="2"
              />
              <line x1={currentJoints.bench.x + 10} y1={currentJoints.bench.y + currentJoints.bench.height} x2={currentJoints.bench.x + 10} y2="215" stroke="#3f3f46" strokeWidth="4" />
              <line x1={currentJoints.bench.x + currentJoints.bench.width - 10} y1={currentJoints.bench.y + currentJoints.bench.height} x2={currentJoints.bench.x + currentJoints.bench.width - 10} y2="215" stroke="#3f3f46" strokeWidth="4" />
            </g>
          )}

          {/* Torso & Core */}
          <line
            x1={currentJoints.neck[0]}
            y1={currentJoints.neck[1]}
            x2={currentJoints.pelvis[0]}
            y2={currentJoints.pelvis[1]}
            stroke={shirtColor}
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Active target muscle glow highlight */}
          <line
            x1={currentJoints.chest[0]}
            y1={currentJoints.chest[1]}
            x2={currentJoints.pelvis[0]}
            y2={currentJoints.pelvis[1]}
            stroke="#84cc16"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Head & Athletic Cap/Headband */}
          <g>
            <circle
              cx={currentJoints.head[0]}
              cy={currentJoints.head[1]}
              r="12"
              fill={skinColor}
              stroke="#09090b"
              strokeWidth="2"
            />
            {/* Fitness Headband */}
            <rect
              x={currentJoints.head[0] - 12}
              y={currentJoints.head[1] - 4}
              width="24"
              height="5"
              rx="2"
              fill="#84cc16"
            />
          </g>

          {/* Left Leg: Hip -> Knee -> Ankle */}
          <line
            x1={currentJoints.leftHip[0]}
            y1={currentJoints.leftHip[1]}
            x2={currentJoints.leftKnee[0]}
            y2={currentJoints.leftKnee[1]}
            stroke={shortsColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1={currentJoints.leftKnee[0]}
            y1={currentJoints.leftKnee[1]}
            x2={currentJoints.leftAnkle[0]}
            y2={currentJoints.leftAnkle[1]}
            stroke={skinColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Left Foot / Shoe */}
          <ellipse
            cx={currentJoints.leftAnkle[0] + 4}
            cy={currentJoints.leftAnkle[1]}
            rx="7"
            ry="4"
            fill={shoeColor}
          />

          {/* Right Leg: Hip -> Knee -> Ankle */}
          <line
            x1={currentJoints.rightHip[0]}
            y1={currentJoints.rightHip[1]}
            x2={currentJoints.rightKnee[0]}
            y2={currentJoints.rightKnee[1]}
            stroke={shortsColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1={currentJoints.rightKnee[0]}
            y1={currentJoints.rightKnee[1]}
            x2={currentJoints.rightAnkle[0]}
            y2={currentJoints.rightAnkle[1]}
            stroke={skinColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Right Foot / Shoe */}
          <ellipse
            cx={currentJoints.rightAnkle[0] + 4}
            cy={currentJoints.rightAnkle[1]}
            rx="7"
            ry="4"
            fill={shoeColor}
          />

          {/* Left Arm: Shoulder -> Elbow -> Wrist */}
          <line
            x1={currentJoints.leftShoulder[0]}
            y1={currentJoints.leftShoulder[1]}
            x2={currentJoints.leftElbow[0]}
            y2={currentJoints.leftElbow[1]}
            stroke={skinColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1={currentJoints.leftElbow[0]}
            y1={currentJoints.leftElbow[1]}
            x2={currentJoints.leftWrist[0]}
            y2={currentJoints.leftWrist[1]}
            stroke={skinColor}
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Right Arm: Shoulder -> Elbow -> Wrist */}
          <line
            x1={currentJoints.rightShoulder[0]}
            y1={currentJoints.rightShoulder[1]}
            x2={currentJoints.rightElbow[0]}
            y2={currentJoints.rightElbow[1]}
            stroke={skinColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1={currentJoints.rightElbow[0]}
            y1={currentJoints.rightElbow[1]}
            x2={currentJoints.rightWrist[0]}
            y2={currentJoints.rightWrist[1]}
            stroke={skinColor}
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Joint Pivot Rings */}
          <circle cx={currentJoints.leftElbow[0]} cy={currentJoints.leftElbow[1]} r="3" fill={jointColor} />
          <circle cx={currentJoints.rightElbow[0]} cy={currentJoints.rightElbow[1]} r="3" fill={jointColor} />
          <circle cx={currentJoints.leftKnee[0]} cy={currentJoints.leftKnee[1]} r="3" fill={jointColor} />
          <circle cx={currentJoints.rightKnee[0]} cy={currentJoints.rightKnee[1]} r="3" fill={jointColor} />

          {/* Equipment Prop: Barbell */}
          {currentJoints.barbell && (
            <g>
              <line
                x1={currentJoints.barbell[0]}
                y1={currentJoints.barbell[1]}
                x2={currentJoints.barbell[2]}
                y2={currentJoints.barbell[3]}
                stroke={barbellColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Left Plates */}
              <rect
                x={currentJoints.barbell[0] - 4}
                y={currentJoints.barbell[1] - 12}
                width="6"
                height="24"
                rx="2"
                fill={plateColor}
                stroke="#15803d"
                strokeWidth="1.5"
              />
              {/* Right Plates */}
              <rect
                x={currentJoints.barbell[2] - 2}
                y={currentJoints.barbell[3] - 12}
                width="6"
                height="24"
                rx="2"
                fill={plateColor}
                stroke="#15803d"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Equipment Props: Dumbbells */}
          {currentJoints.leftDumbbell && (
            <g>
              <line
                x1={currentJoints.leftDumbbell[0] - 8}
                y1={currentJoints.leftDumbbell[1]}
                x2={currentJoints.leftDumbbell[0] + 8}
                y2={currentJoints.leftDumbbell[1]}
                stroke={barbellColor}
                strokeWidth="3"
              />
              <rect x={currentJoints.leftDumbbell[0] - 10} y={currentJoints.leftDumbbell[1] - 7} width="4" height="14" rx="1.5" fill="#27272a" />
              <rect x={currentJoints.leftDumbbell[0] + 6} y={currentJoints.leftDumbbell[1] - 7} width="4" height="14" rx="1.5" fill="#27272a" />
            </g>
          )}

          {currentJoints.rightDumbbell && (
            <g>
              <line
                x1={currentJoints.rightDumbbell[0] - 8}
                y1={currentJoints.rightDumbbell[1]}
                x2={currentJoints.rightDumbbell[0] + 8}
                y2={currentJoints.rightDumbbell[1]}
                stroke={barbellColor}
                strokeWidth="3"
              />
              <rect x={currentJoints.rightDumbbell[0] - 10} y={currentJoints.rightDumbbell[1] - 7} width="4" height="14" rx="1.5" fill="#27272a" />
              <rect x={currentJoints.rightDumbbell[0] + 6} y={currentJoints.rightDumbbell[1] - 7} width="4" height="14" rx="1.5" fill="#27272a" />
            </g>
          )}
        </svg>

        {/* Repetition Timeline Progress Strip */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-zinc-900">
          <div
            className="h-full bg-lime-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-3 sm:p-4 bg-zinc-900 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold transition-all shadow-sm"
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Restart from beginning"
            aria-label="Replay demonstration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsSlowMo(!isSlowMo)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-colors ${
              isSlowMo
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Toggle 0.5x Slow Motion"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{isSlowMo ? '0.5x' : '1.0x'}</span>
          </button>
        </div>

        {/* View Switcher: Front vs Side */}
        {animDef.supportedViews.length > 1 && (
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setViewMode('front')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                viewMode === 'front' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setViewMode('side')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                viewMode === 'side' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Side View
            </button>
          </div>
        )}
      </div>

      {/* Form Tips and Mistakes Tabs (if not compact) */}
      {!compact && (
        <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
            <button
              onClick={() => setActiveTab('tips')}
              className={`text-xs font-bold pb-1 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'tips'
                  ? 'border-lime-400 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Correct Posture Cues</span>
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className={`text-xs font-bold pb-1 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'mistakes'
                  ? 'border-red-400 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Common Mistakes</span>
            </button>
          </div>

          <div className="text-xs text-zinc-300">
            {activeTab === 'tips' ? (
              <ul className="space-y-1 list-disc list-inside text-zinc-300">
                {animDef.formTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 list-disc list-inside text-red-300/90">
                {animDef.mistakesToAvoid.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
