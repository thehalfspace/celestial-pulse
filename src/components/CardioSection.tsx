import React from 'react';
import { Check, HeartPulse } from 'lucide-react';
import { Card, SectionTitle } from './ui';
import { calcCardioXP } from '../utils';

interface CardioSectionProps {
  cardioMinutes: number;
  weeklyCardioMinutes: number;
  notes: string;
  onLog: () => void;
  onCardioMinutesChange: (minutes: number) => void;
  onNotesChange: (notes: string) => void;
}

export function CardioSection({ cardioMinutes, weeklyCardioMinutes, notes, onLog, onCardioMinutesChange, onNotesChange }: CardioSectionProps) {
  return (
    <div className="grid md:grid-cols-1 gap-4 mt-6">
      <Card>
        <SectionTitle
          icon={<HeartPulse className="w-5 h-5" />}
          title="Cardio"
          right={<span className="text-sm text-slate-300">This week: {weeklyCardioMinutes} min</span>}
        />
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm text-slate-300">Minutes</label>
          <input
            type="number"
            min={1}
            value={cardioMinutes}
            onChange={(e) => onCardioMinutesChange(parseInt(e.target.value || "1", 10))}
            className="w-24 px-2 py-1 rounded-lg bg-black/20 border border-white/10"
          />
          <span className="text-xs text-slate-400">
            XP preview: {calcCardioXP(cardioMinutes)}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-white/10 focus:outline-none"
            placeholder="Notes, type (run, bike), route…"
          />
          <button
            className="px-3 py-2 rounded-xl bg-pink-400 hover:bg-pink-500 text-black font-medium"
            onClick={onLog}
            title="Log cardio session"
          >
            <Check className="w-4 h-4 inline-block mr-1" /> Log
          </button>
        </div>
      </Card>
    </div>
  );
}