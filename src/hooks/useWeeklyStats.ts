import { useMemo } from 'react';
import { ProgressState, MovementKey } from '../types';
import { MOVEMENTS } from '../data/workouts';
import { inThisWeek } from '../utils';

export function useWeeklyStats(state: ProgressState) {
  const weeklyStrengthCounts = useMemo(() => {
    const counts: Record<MovementKey, number> = {
      pushup: 0,
      squat: 0,
      pullup: 0,
      legraise: 0,
      bridge: 0,
      handstand: 0,
    };
    for (const log of state.logs) {
      if (log.type === "movement" && inThisWeek(log.date)) {
        counts[log.key]++;
      }
    }
    return counts;
  }, [state.logs]);

  const strengthTotalTargets = MOVEMENTS.reduce((a, m) => a + m.targetPerWeek, 0);
  const strengthDone = Object.values(weeklyStrengthCounts).reduce((a, n) => a + n, 0);
  const strengthPct = Math.min(100, Math.round((strengthDone / strengthTotalTargets) * 100));

  const weeklySkillSessions = useMemo(
    () => state.logs.filter((l) => l.type === "skill" && inThisWeek(l.date)).length,
    [state.logs]
  );
  const SKILL_WEEKLY_TARGET = 3;
  const skillPct = Math.min(100, Math.round((weeklySkillSessions / SKILL_WEEKLY_TARGET) * 100));

  const weeklyCardioMinutes = useMemo(
    () =>
      state.logs
        .filter((l) => l.type === "cardio" && inThisWeek(l.date))
        .reduce((a, l: any) => a + (l.minutes || 0), 0),
    [state.logs]
  );
  const CARDIO_WEEKLY_TARGET = 120;
  const cardioPct = Math.min(100, Math.round((weeklyCardioMinutes / CARDIO_WEEKLY_TARGET) * 100));

  return {
    weeklyStrengthCounts,
    strengthTotalTargets,
    strengthDone,
    strengthPct,
    weeklySkillSessions,
    SKILL_WEEKLY_TARGET,
    skillPct,
    weeklyCardioMinutes,
    CARDIO_WEEKLY_TARGET,
    cardioPct,
  };
}