import { useState } from "react";
import { Mode, MovementKey, SkillKey, WorkoutLog } from './types';
import { MOVEMENTS, SKILLS } from './data/workouts';
import { uid, calcStrengthXP, calcSkillXP, calcCardioXP } from './utils';
import { useWorkoutState } from './hooks/useWorkoutState';
import { useWeeklyStats } from './hooks/useWeeklyStats';
import { useUserManager } from './hooks/useUserManager';
import { Segmented } from './components/ui';
import { Header, WeeklyOverview, StrengthCard, SkillCard, CardioSection, XPAndLogs } from './components';
import { UserSelector } from './components/UserSelector';

export default function CCApp() {
  const {
    currentUser,
    users,
    isLoading,
    error,
    createUser,
    loginUser,
    updateUserProgress,
    logoutUser,
    deleteUser,
    clearError,
  } = useUserManager();

  const { state, setState, exportData, importData, resetAll } = useWorkoutState(
    currentUser,
    updateUserProgress
  );
  const { weeklyStrengthCounts, weeklyCardioMinutes } = useWeeklyStats(state);

  const [mode, setMode] = useState<Mode>("strength");
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [cardioMinutes, setCardioMinutes] = useState(20);

  // Adjusters
  function adjustLevelMovement(m: MovementKey, dir: 1 | -1) {
    setState((s) => {
      const idx = s.currentStepByMovement[m];
      const mv = MOVEMENTS.find((mm) => mm.key === m)!;
      const newIdx = Math.max(0, Math.min(mv.steps.length - 1, idx + dir));
      return { ...s, currentStepByMovement: { ...s.currentStepByMovement, [m]: newIdx } };
    });
  }

  function adjustLevelSkill(k: SkillKey, dir: 1 | -1) {
    setState((s) => {
      const idx = s.currentStepBySkill[k];
      const sk = SKILLS.find((ss) => ss.key === k)!;
      const newIdx = Math.max(0, Math.min(sk.steps.length - 1, idx + dir));
      return { ...s, currentStepBySkill: { ...s.currentStepBySkill, [k]: newIdx } };
    });
  }

  // Loggers
  function logMovement(m: typeof MOVEMENTS[0]) {
    const stepIndex = state.currentStepByMovement[m.key];
    const step = m.steps[stepIndex];
    const xp = calcStrengthXP(step, sets, reps);
    const entry: WorkoutLog = {
      id: uid(),
      date: new Date().toISOString(),
      mode: "strength",
      type: "movement",
      key: m.key,
      stepIndex,
      sets,
      reps,
      xpAwarded: xp,
      notes: notes || undefined,
    };
    setState((s) => ({ ...s, logs: [entry, ...s.logs], xp: s.xp + xp }));
    setNotes("");
  }

  function logSkill(sk: typeof SKILLS[0]) {
    const stepIndex = state.currentStepBySkill[sk.key];
    const step = sk.steps[stepIndex];
    const xp = calcSkillXP(step);
    const entry: WorkoutLog = {
      id: uid(),
      date: new Date().toISOString(),
      mode: "skill",
      type: "skill",
      key: sk.key,
      stepIndex,
      xpAwarded: xp,
      notes: notes || undefined,
    };
    setState((s) => ({ ...s, logs: [entry, ...s.logs], xp: s.xp + xp }));
    setNotes("");
  }

  function logCardio() {
    const mins = Math.max(1, Math.floor(cardioMinutes));
    const xp = calcCardioXP(mins);
    const entry: WorkoutLog = {
      id: uid(),
      date: new Date().toISOString(),
      mode: "cardio",
      type: "cardio",
      minutes: mins,
      xpAwarded: xp,
      notes: notes || undefined,
    } as any;
    setState((s) => ({ ...s, logs: [entry, ...s.logs], xp: s.xp + xp }));
    setNotes("");
  }

  // Show user selector if no user is logged in
  if (!currentUser) {
    return (
      <UserSelector
        users={users}
        isLoading={isLoading}
        error={error}
        onCreateUser={createUser}
        onLoginUser={loginUser}
        onDeleteUser={deleteUser}
        onClearError={clearError}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-slate-100">
      <Header
        currentUser={currentUser}
        onExport={exportData}
        onImport={importData}
        onReset={resetAll}
        onLogout={logoutUser}
      />

      <WeeklyOverview state={state} />

      {/* Mode Switch */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-300">Log mode:</span>
        <Segmented
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "strength", label: "Strength" },
            { value: "skill", label: "Skill" },
          ]}
        />
      </div>

      {/* Strength Cards */}
      {mode === "strength" && (
        <div className="grid md:grid-cols-2 gap-4">
          {MOVEMENTS.map((m) => (
            <StrengthCard
              key={m.key}
              movement={m}
              state={state}
              weeklyCount={weeklyStrengthCounts[m.key] || 0}
              sets={sets}
              reps={reps}
              notes={notes}
              onAdjustLevel={(dir) => adjustLevelMovement(m.key, dir)}
              onLog={() => logMovement(m)}
              onSetsChange={setSets}
              onRepsChange={setReps}
              onNotesChange={setNotes}
            />
          ))}
        </div>
      )}

      {/* Skill Cards */}
      {mode === "skill" && (
        <div className="grid md:grid-cols-2 gap-4">
          {SKILLS.map((sk) => (
            <SkillCard
              key={sk.key}
              skill={sk}
              state={state}
              notes={notes}
              onAdjustLevel={(dir) => adjustLevelSkill(sk.key, dir)}
              onLog={() => logSkill(sk)}
              onNotesChange={setNotes}
            />
          ))}
        </div>
      )}

      <CardioSection
        cardioMinutes={cardioMinutes}
        weeklyCardioMinutes={weeklyCardioMinutes}
        notes={notes}
        onLog={logCardio}
        onCardioMinutesChange={setCardioMinutes}
        onNotesChange={setNotes}
      />

      <XPAndLogs state={state} />

      <footer className="mt-8 text-center text-xs text-slate-400">
        Your workout data is saved automatically to your local database. Add to iPhone Home Screen via Safari to use like an app.
      </footer>
    </div>
  );
}

