import React from 'react';
import { Check, ChevronDown, ChevronUp, Flame, Link as LinkIcon } from 'lucide-react';
import { Card, SectionTitle } from './ui';
import { Movement, ProgressState } from '../types';
import { googleSearchUrl, calcStrengthXP } from '../utils';

interface StrengthCardProps {
  movement: Movement;
  state: ProgressState;
  weeklyCount: number;
  sets: number;
  reps: number;
  notes: string;
  onAdjustLevel: (dir: 1 | -1) => void;
  onLog: () => void;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
  onNotesChange: (notes: string) => void;
}

export function StrengthCard({
  movement,
  state,
  weeklyCount,
  sets,
  reps,
  notes,
  onAdjustLevel,
  onLog,
  onSetsChange,
  onRepsChange,
  onNotesChange,
}: StrengthCardProps) {
  const idx = state.currentStepByMovement[movement.key];
  const step = movement.steps[idx];
  const lvl = idx + 1;
  const pct = Math.round(((idx + 1) / movement.steps.length) * 100);

  return (
    <Card>
      <SectionTitle
        icon={<Flame className="w-5 h-5" />}
        title={`${movement.name} — Level ${lvl}/${movement.steps.length}`}
        right={
          <a
            className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 inline-flex items-center gap-1"
            href={googleSearchUrl(step.label)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search: ${step.label}`}
          >
            <LinkIcon className="w-3 h-3" /> Guide
          </a>
        }
      />

      <div className="flex items-center gap-2 mb-2">
        <button
          className="px-2 py-1 rounded-lg bg-white/10 border border-white/10"
          onClick={() => onAdjustLevel(-1)}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="font-medium">Current step</div>
          <div className="text-sm text-slate-300">{step.label}</div>
        </div>
        <button
          className="px-2 py-1 rounded-lg bg-white/10 border border-white/10"
          onClick={() => onAdjustLevel(1)}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-2 bg-indigo-400" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm text-slate-300">Sets</label>
        <input
          type="number"
          min={1}
          value={sets}
          onChange={(e) => onSetsChange(parseInt(e.target.value || "1", 10))}
          className="w-16 px-2 py-1 rounded-lg bg-black/20 border border-white/10"
        />
        <label className="text-sm text-slate-300">Reps</label>
        <input
          type="number"
          min={1}
          value={reps}
          onChange={(e) => onRepsChange(parseInt(e.target.value || "1", 10))}
          className="w-16 px-2 py-1 rounded-lg bg-black/20 border border-white/10"
        />
        <span className="text-xs text-slate-400">
          XP preview: {calcStrengthXP(step, sets, reps)}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-white/10 focus:outline-none"
          placeholder="Notes, tempo, RPE…"
        />
        <button
          className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
          onClick={onLog}
          title="Log session"
        >
          <Check className="w-4 h-4 inline-block mr-1" /> Log
        </button>
      </div>

      <div className="mt-2 text-xs text-slate-400">
        This week: {weeklyCount}/{movement.targetPerWeek} exposures
      </div>
    </Card>
  );
}