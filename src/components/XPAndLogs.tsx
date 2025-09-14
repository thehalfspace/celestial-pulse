import React from 'react';
import { Trophy, ClipboardList } from 'lucide-react';
import { Card, SectionTitle } from './ui';
import { ProgressState } from '../types';
import { MOVEMENTS, SKILLS } from '../data/workouts';

interface XPAndLogsProps {
  state: ProgressState;
}

export function XPAndLogs({ state }: XPAndLogsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <Card>
        <SectionTitle icon={<Trophy className="w-5 h-5" />} title="XP & Levels" />
        <p className="text-sm text-slate-300">
          Total XP: <span className="font-semibold text-white">{state.xp}</span>
        </p>
        <p className="text-sm text-slate-300">
          Level: <span className="font-semibold text-white">{Math.floor(state.xp / 100) + 1}</span>{" "}
          (every 100 XP = +1 level)
        </p>
        <div className="mt-2 text-sm text-slate-400">
          Strength XP = base×sets×reps • Skill XP = base • Cardio XP = minutes.
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<ClipboardList className="w-5 h-5" />} title="Recent Logs" />
        <ul className="max-h-64 overflow-auto space-y-2 pr-1">
          {state.logs.slice(0, 16).map((log) => {
            if (log.type === "movement") {
              const m = MOVEMENTS.find((mm) => mm.key === log.key)!;
              const step = m.steps[log.stepIndex];
              return (
                <li key={log.id} className="text-sm text-slate-200 flex justify-between gap-3">
                  <span className="truncate">
                    {new Date(log.date).toLocaleString()} • {m.name} • {step.label} • {log.sets}x
                    {log.reps}
                    {log.notes ? ` — ${log.notes}` : ""}
                  </span>
                  <span className="text-emerald-300 shrink-0">+{log.xpAwarded} XP</span>
                </li>
              );
            } else if (log.type === "skill") {
              const s = SKILLS.find((ss) => ss.key === log.key)!;
              const step = s.steps[log.stepIndex];
              return (
                <li key={log.id} className="text-sm text-slate-200 flex justify-between gap-3">
                  <span className="truncate">
                    {new Date(log.date).toLocaleString()} • {s.name} • {step.label}
                    {log.notes ? ` — ${log.notes}` : ""}
                  </span>
                  <span className="text-emerald-300 shrink-0">+{log.xpAwarded} XP</span>
                </li>
              );
            } else {
              return (
                <li key={log.id} className="text-sm text-slate-200 flex justify-between gap-3">
                  <span className="truncate">
                    {new Date(log.date).toLocaleString()} • Cardio • {log.minutes} min
                    {log.notes ? ` — ${log.notes}` : ""}
                  </span>
                  <span className="text-emerald-300 shrink-0">+{log.xpAwarded} XP</span>
                </li>
              );
            }
          })}
          {state.logs.length === 0 && (
            <li className="text-sm text-slate-400">No logs yet. Log a session above.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}