import React from 'react';
import { CalendarDays, HeartPulse } from 'lucide-react';
import { Card, SectionTitle } from './ui';
import { useWeeklyStats } from '../hooks/useWeeklyStats';
import { ProgressState } from '../types';

interface WeeklyOverviewProps {
  state: ProgressState;
}

export function WeeklyOverview({ state }: WeeklyOverviewProps) {
  const {
    strengthDone,
    strengthTotalTargets,
    strengthPct,
    weeklySkillSessions,
    SKILL_WEEKLY_TARGET,
    skillPct,
    weeklyCardioMinutes,
    CARDIO_WEEKLY_TARGET,
    cardioPct,
  } = useWeeklyStats(state);

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card>
        <SectionTitle
          icon={<CalendarDays className="w-5 h-5" />}
          title="Strength Exposures"
          right={<span className="text-sm text-slate-300">{strengthDone}/{strengthTotalTargets}</span>}
        />
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-3 bg-emerald-400" style={{ width: `${strengthPct}%` }} />
        </div>
        <p className="text-xs mt-2 text-slate-300">Goal: 2 per movement per week.</p>
      </Card>

      <Card>
        <SectionTitle
          icon={<CalendarDays className="w-5 h-5" />}
          title="Skill Sessions"
          right={<span className="text-sm text-slate-300">{weeklySkillSessions}/{SKILL_WEEKLY_TARGET}</span>}
        />
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-3 bg-indigo-400" style={{ width: `${skillPct}%` }} />
        </div>
        <p className="text-xs mt-2 text-slate-300">Pick any isometric progression.</p>
      </Card>

      <Card>
        <SectionTitle
          icon={<HeartPulse className="w-5 h-5" />}
          title="Cardio Minutes"
          right={<span className="text-sm text-slate-300">{weeklyCardioMinutes}/{CARDIO_WEEKLY_TARGET}</span>}
        />
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-3 bg-pink-400" style={{ width: `${cardioPct}%` }} />
        </div>
        <p className="text-xs mt-2 text-slate-300">Generic cardio total this week.</p>
      </Card>
    </div>
  );
}