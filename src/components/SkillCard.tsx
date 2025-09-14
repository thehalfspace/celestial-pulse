import React from 'react';
import { Check, ChevronDown, ChevronUp, Flame, Link as LinkIcon } from 'lucide-react';
import { Card, SectionTitle } from './ui';
import { Skill, ProgressState } from '../types';
import { googleSearchUrl } from '../utils';

interface SkillCardProps {
  skill: Skill;
  state: ProgressState;
  notes: string;
  onAdjustLevel: (dir: 1 | -1) => void;
  onLog: () => void;
  onNotesChange: (notes: string) => void;
}

export function SkillCard({ skill, state, notes, onAdjustLevel, onLog, onNotesChange }: SkillCardProps) {
  const idx = state.currentStepBySkill[skill.key];
  const step = skill.steps[idx];
  const lvl = idx + 1;
  const pct = Math.round(((idx + 1) / skill.steps.length) * 100);

  return (
    <Card>
      <SectionTitle
        icon={<Flame className="w-5 h-5" />}
        title={`${skill.name} — Level ${lvl}/${skill.steps.length}`}
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

      <div className="flex gap-2 items-center">
        <input
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-white/10 focus:outline-none"
          placeholder="Notes, duration cues, holds…"
        />
        <button
          className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
          onClick={onLog}
          title="Log skill session"
        >
          <Check className="w-4 h-4 inline-block mr-1" /> Log
        </button>
      </div>
    </Card>
  );
}