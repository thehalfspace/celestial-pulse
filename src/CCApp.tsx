import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Dumbbell, Flame, RefreshCw, Save, Upload, Trophy, CalendarDays, ClipboardList, Link as LinkIcon, HeartPulse } from "lucide-react";

// ---------------------------------------------------------------------------
// Celestial Pulse: Workout Log — Convict Conditioning + Skills + Cardio (TSX)
// ---------------------------------------------------------------------------
// - Strength: Big Six progressions with sets × reps; XP = base step XP × sets × reps
// - Skill: Isometric holds; XP = base step XP (difficulty-scaled)
// - Cardio: Generic duration logger; XP = minutes × 1 (tweakable)
// - LocalStorage persistence; Export/Import JSON; Weekly overview
// ---------------------------------------------------------------------------

// ---------------------------- Types & Data ---------------------------------

type MovementKey = "pushup" | "squat" | "pullup" | "legraise" | "bridge" | "handstand";

type SkillKey =
  | "handstand_hold"
  | "lsit"
  | "hollow_hold"
  | "arch_hold"
  | "front_lever"
  | "back_lever"
  | "frog_stand"
  | "ring_support";

type Step = { id: string; label: string; xp: number }; // xp represents base difficulty weight

type Movement = { key: MovementKey; name: string; steps: Step[]; targetPerWeek: number };

type Skill = { key: SkillKey; name: string; steps: Step[] };

const MOVEMENTS: Movement[] = [
  {
    key: "pushup",
    name: "Pushup",
    targetPerWeek: 2,
    steps: [
      { id: "P1", label: "Wall pushup", xp: 5 },
      { id: "P2", label: "Incline pushup", xp: 6 },
      { id: "P3", label: "Knee pushup", xp: 7 },
      { id: "P4", label: "Half pushup", xp: 8 },
      { id: "P5", label: "Full pushup", xp: 10 },
      { id: "P6", label: "Close pushup", xp: 11 },
      { id: "P7", label: "Uneven pushup", xp: 12 },
      { id: "P8", label: "Half one-arm pushup", xp: 14 },
      { id: "P9", label: "Assisted one-arm pushup", xp: 16 },
      { id: "P10", label: "One-arm pushup", xp: 20 },
    ],
  },
  {
    key: "squat",
    name: "Squat",
    targetPerWeek: 2,
    steps: [
      { id: "S1", label: "Shoulder stand squat", xp: 5 },
      { id: "S2", label: "Jackknife squat", xp: 6 },
      { id: "S3", label: "Supported squat", xp: 7 },
      { id: "S4", label: "Half squat", xp: 8 },
      { id: "S5", label: "Full squat", xp: 10 },
      { id: "S6", label: "Close squat", xp: 11 },
      { id: "S7", label: "Uneven squat", xp: 12 },
      { id: "S8", label: "Half one-leg squat", xp: 14 },
      { id: "S9", label: "Assisted pistol squat", xp: 16 },
      { id: "S10", label: "Pistol squat", xp: 20 },
    ],
  },
  {
    key: "pullup",
    name: "Pullup",
    targetPerWeek: 2,
    steps: [
      { id: "U1", label: "Vertical pull", xp: 5 },
      { id: "U2", label: "Horizontal pull", xp: 6 },
      { id: "U3", label: "Jackknife pull", xp: 7 },
      { id: "U4", label: "Half pullup", xp: 8 },
      { id: "U5", label: "Full pullup", xp: 10 },
      { id: "U6", label: "Close pullup", xp: 11 },
      { id: "U7", label: "Uneven pullup", xp: 12 },
      { id: "U8", label: "Half one-arm pull", xp: 14 },
      { id: "U9", label: "Assisted one-arm pullup", xp: 16 },
      { id: "U10", label: "One-arm pullup", xp: 20 },
    ],
  },
  {
    key: "legraise",
    name: "Leg raise",
    targetPerWeek: 2,
    steps: [
      { id: "L1", label: "Knee tucks lying", xp: 5 },
      { id: "L2", label: "Flat knee raise", xp: 6 },
      { id: "L3", label: "Flat straight leg raise", xp: 7 },
      { id: "L4", label: "Hanging knee raise", xp: 8 },
      { id: "L5", label: "Hanging bent leg raise", xp: 10 },
      { id: "L6", label: "Hanging straight leg raise", xp: 12 },
      { id: "L7", label: "Hanging L raise", xp: 14 },
      { id: "L8", label: "Hanging L hold", xp: 15 },
      { id: "L9", label: "Hanging V raise", xp: 18 },
      { id: "L10", label: "Strict V raise", xp: 20 },
    ],
  },
  {
    key: "bridge",
    name: "Bridge",
    targetPerWeek: 2,
    steps: [
      { id: "B1", label: "Short bridge", xp: 5 },
      { id: "B2", label: "Straight bridge", xp: 6 },
      { id: "B3", label: "Angled bridge", xp: 7 },
      { id: "B4", label: "Head bridge", xp: 8 },
      { id: "B5", label: "Half bridge", xp: 10 },
      { id: "B6", label: "Full bridge", xp: 12 },
      { id: "B7", label: "Close bridge", xp: 14 },
      { id: "B8", label: "Uneven bridge", xp: 16 },
      { id: "B9", label: "Wall walk down", xp: 18 },
      { id: "B10", label: "Stand to bridge and back", xp: 22 },
    ],
  },
  {
    key: "handstand",
    name: "Handstand pushup",
    targetPerWeek: 2,
    steps: [
      { id: "H1", label: "Wall headstand", xp: 5 },
      { id: "H2", label: "Crow stand", xp: 6 },
      { id: "H3", label: "Wall handstand", xp: 7 },
      { id: "H4", label: "Short range HSPU", xp: 8 },
      { id: "H5", label: "Half HSPU", xp: 10 },
      { id: "H6", label: "Full HSPU", xp: 12 },
      { id: "H7", label: "Close grip HSPU", xp: 14 },
      { id: "H8", label: "Uneven HSPU", xp: 16 },
      { id: "H9", label: "Assisted one-arm HSPU", xp: 18 },
      { id: "H10", label: "One-arm HSPU", xp: 24 },
    ],
  },
];

// Skills (isometrics) — inspired by CC & r/bodyweightfitness RR
const SKILLS: Skill[] = [
  {
    key: "handstand_hold",
    name: "Handstand hold",
    steps: [
      { id: "HS1", label: "Wall headstand hold", xp: 6 },
      { id: "HS2", label: "Wall handstand hold", xp: 8 },
      { id: "HS3", label: "Chest-to-wall handstand", xp: 10 },
      { id: "HS4", label: "Freestanding handstand hold", xp: 14 },
    ],
  },
  {
    key: "lsit",
    name: "L-sit",
    steps: [
      { id: "LS1", label: "Tuck support hold", xp: 6 },
      { id: "LS2", label: "One leg out support", xp: 8 },
      { id: "LS3", label: "Parallel bars L-sit", xp: 12 },
      { id: "LS4", label: "Advanced L / V progress", xp: 16 },
    ],
  },
  {
    key: "hollow_hold",
    name: "Hollow body hold",
    steps: [
      { id: "HB1", label: "Hollow tuck hold", xp: 5 },
      { id: "HB2", label: "Hollow body hold", xp: 8 },
      { id: "HB3", label: "Advanced hollow hold", xp: 12 },
    ],
  },
  {
    key: "arch_hold",
    name: "Arch/Superman hold",
    steps: [
      { id: "AR1", label: "Superman hold", xp: 5 },
      { id: "AR2", label: "Superman arms overhead", xp: 7 },
      { id: "AR3", label: "Arch rock hold", xp: 10 },
    ],
  },
  {
    key: "front_lever",
    name: "Front lever",
    steps: [
      { id: "FL1", label: "Tuck front lever", xp: 10 },
      { id: "FL2", label: "Advanced tuck front lever", xp: 14 },
      { id: "FL3", label: "Straddle front lever", xp: 18 },
      { id: "FL4", label: "Full front lever", xp: 24 },
    ],
  },
  {
    key: "back_lever",
    name: "Back lever",
    steps: [
      { id: "BL1", label: "Tuck back lever", xp: 10 },
      { id: "BL2", label: "Advanced tuck back lever", xp: 14 },
      { id: "BL3", label: "Straddle back lever", xp: 18 },
      { id: "BL4", label: "Full back lever", xp: 24 },
    ],
  },
  {
    key: "frog_stand",
    name: "Frog stand",
    steps: [
      { id: "FR1", label: "Crow stand hold", xp: 6 },
      { id: "FR2", label: "Frog stand hold", xp: 8 },
      { id: "FR3", label: "Frog to handstand taps", xp: 12 },
    ],
  },
  {
    key: "ring_support",
    name: "Ring support hold",
    steps: [
      { id: "RS1", label: "Ring support hold (assisted)", xp: 8 },
      { id: "RS2", label: "Ring support hold", xp: 12 },
      { id: "RS3", label: "Ring support turned-out", xp: 16 },
    ],
  },
];

// ---------------------------- State & Storage -------------------------------

const KEY = "cc-tracker-v4"; // bump to migrate safely

type Mode = "strength" | "skill";

type WorkoutLog =
  | {
      id: string;
      date: string;
      mode: "strength";
      type: "movement";
      key: MovementKey;
      stepIndex: number;
      sets: number;
      reps: number;
      xpAwarded: number;
      notes?: string;
    }
  | {
      id: string;
      date: string;
      mode: "skill";
      type: "skill";
      key: SkillKey;
      stepIndex: number;
      xpAwarded: number;
      notes?: string;
    }
  | {
      id: string;
      date: string;
      mode: "cardio";
      type: "cardio";
      minutes: number;
      xpAwarded: number;
      notes?: string;
    };

type ProgressState = {
  currentStepByMovement: Record<MovementKey, number>;
  currentStepBySkill: Record<SkillKey, number>;
  logs: WorkoutLog[];
  xp: number;
};

function defaultState(): ProgressState {
  const currentStepByMovement: Record<MovementKey, number> = {
    pushup: 4,
    squat: 4,
    pullup: 3,
    legraise: 2,
    bridge: 2,
    handstand: 2,
  };
  const currentStepBySkill: Record<SkillKey, number> = {
    handstand_hold: 1,
    lsit: 1,
    hollow_hold: 1,
    arch_hold: 0,
    front_lever: 0,
    back_lever: 0,
    frog_stand: 0,
    ring_support: 0,
  };
  return { currentStepByMovement, currentStepBySkill, logs: [], xp: 0 };
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as ProgressState;
  } catch {
    return defaultState();
  }
}

function saveState(s: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

// ------------------------------- Utilities ---------------------------------

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function startOfWeek(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7; // Monday start
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function inThisWeek(dateISO: string) {
  const s = startOfWeek();
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  const t = new Date(dateISO);
  return t >= s && t < e;
}

function googleSearchUrl(label: string) {
  const q = encodeURIComponent(label + " exercise");
  return `https://www.google.com/search?q=${q}`;
}

function calcStrengthXP(step: Step, sets: number, reps: number) {
  const s = Math.max(1, Number(sets) || 1);
  const r = Math.max(1, Number(reps) || 1);
  return step.xp * s * r;
}

function calcSkillXP(step: Step) {
  return step.xp; // constant per difficulty
}

function calcCardioXP(minutes: number) {
  const m = Math.max(1, Math.floor(minutes) || 0);
  return m * 1; // tweak multiplier if desired
}

// ---------------------------- UI Primitives --------------------------------

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl shadow p-4 bg-white/5 border border-white/10 ${className}`}>{children}</div>;
}

function SectionTitle({ icon, title, right }: { icon?: React.ReactNode; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">{icon}{title}</h2>
      {right}
    </div>
  );
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="inline-flex rounded-xl overflow-hidden border border-white/10">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={`px-3 py-1 text-sm ${value === o.value ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}>{o.label}</button>
      ))}
    </div>
  );
}

// --------------------------------- App -------------------------------------

export default function CCApp() {
  const [state, setState] = useState<ProgressState>(() => loadState());
  const [mode, setMode] = useState<Mode>("strength");
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [cardioMinutes, setCardioMinutes] = useState(20);

  useEffect(() => { saveState(state); }, [state]);

  // Weekly summaries
  const weeklyStrengthCounts = useMemo(() => {
    const counts: Record<MovementKey, number> = { pushup: 0, squat: 0, pullup: 0, legraise: 0, bridge: 0, handstand: 0 };
    for (const log of state.logs) if (log.type === "movement" && inThisWeek(log.date)) counts[log.key]++;
    return counts;
  }, [state.logs]);

  const strengthTotalTargets = MOVEMENTS.reduce((a, m) => a + m.targetPerWeek, 0);
  const strengthDone = Object.values(weeklyStrengthCounts).reduce((a, n) => a + n, 0);
  const strengthPct = Math.min(100, Math.round((strengthDone / strengthTotalTargets) * 100));

  const weeklySkillSessions = useMemo(() => state.logs.filter((l) => l.type === "skill" && inThisWeek(l.date)).length, [state.logs]);
  const SKILL_WEEKLY_TARGET = 3;
  const skillPct = Math.min(100, Math.round((weeklySkillSessions / SKILL_WEEKLY_TARGET) * 100));

  const weeklyCardioMinutes = useMemo(() => state.logs.filter((l) => l.type === "cardio" && inThisWeek(l.date)).reduce((a, l: any) => a + (l.minutes || 0), 0), [state.logs]);
  const CARDIO_WEEKLY_TARGET = 120;
  const cardioPct = Math.min(100, Math.round((weeklyCardioMinutes / CARDIO_WEEKLY_TARGET) * 100));

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
  function logMovement(m: Movement) {
    const stepIndex = state.currentStepByMovement[m.key];
    const step = m.steps[stepIndex];
    const xp = calcStrengthXP(step, sets, reps);
    const entry: WorkoutLog = { id: uid(), date: new Date().toISOString(), mode: "strength", type: "movement", key: m.key, stepIndex, sets, reps, xpAwarded: xp, notes: notes || undefined };
    setState((s) => ({ ...s, logs: [entry, ...s.logs], xp: s.xp + xp }));
    setNotes("");
  }

  function logSkill(sk: Skill) {
    const stepIndex = state.currentStepBySkill[sk.key];
    const step = sk.steps[stepIndex];
    const xp = calcSkillXP(step);
    const entry: WorkoutLog = { id: uid(), date: new Date().toISOString(), mode: "skill", type: "skill", key: sk.key, stepIndex, xpAwarded: xp, notes: notes || undefined };
    setState((s) => ({ ...s, logs: [entry, ...s.logs], xp: s.xp + xp }));
    setNotes("");
  }

  function logCardio() {
    const mins = Math.max(1, Math.floor(cardioMinutes));
    const xp = calcCardioXP(mins);
    const entry: WorkoutLog = { id: uid(), date: new Date().toISOString(), mode: "cardio", type: "cardio", minutes: mins, xpAwarded: xp, notes: notes || undefined } as any;
    setState((s) => ({ ...s, logs: [entry, ...s.logs], xp: s.xp + xp }));
    setNotes("");
  }

  // Export / Import / Reset
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `celestial-pulse-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  }

  function importData() {
    const input = document.createElement("input"); input.type = "file"; input.accept = "application/json";
    input.onchange = () => { const f = input.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { setState(JSON.parse(String(r.result))); } catch { alert("Invalid JSON"); } }; r.readAsText(f); };
    input.click();
  }

  function resetAll() { if (confirm("Reset all data?")) setState(defaultState()); }

  // ------------------------------- Render ----------------------------------

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-slate-100">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">🌌 Celestial Pulse: Workout Log</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10" onClick={exportData} title="Export JSON"><Save className="w-4 h-4"/></button>
          <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10" onClick={importData} title="Import JSON"><Upload className="w-4 h-4"/></button>
          <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10" onClick={resetAll} title="Reset"><RefreshCw className="w-4 h-4"/></button>
        </div>
      </header>

      {/* Weekly Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <SectionTitle icon={<CalendarDays className="w-5 h-5"/>} title="Strength Exposures" right={<span className="text-sm text-slate-300">{strengthDone}/{strengthTotalTargets}</span>} />
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-3 bg-emerald-400" style={{ width: `${strengthPct}%` }} /></div>
          <p className="text-xs mt-2 text-slate-300">Goal: 2 per movement per week.</p>
        </Card>
        <Card>
          <SectionTitle icon={<CalendarDays className="w-5 h-5"/>} title="Skill Sessions" right={<span className="text-sm text-slate-300">{weeklySkillSessions}/{SKILL_WEEKLY_TARGET}</span>} />
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-3 bg-indigo-400" style={{ width: `${skillPct}%` }} /></div>
          <p className="text-xs mt-2 text-slate-300">Pick any isometric progression.</p>
        </Card>
        <Card>
          <SectionTitle icon={<HeartPulse className="w-5 h-5"/>} title="Cardio Minutes" right={<span className="text-sm text-slate-300">{weeklyCardioMinutes}/{CARDIO_WEEKLY_TARGET}</span>} />
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-3 bg-pink-400" style={{ width: `${cardioPct}%` }} /></div>
          <p className="text-xs mt-2 text-slate-300">Generic cardio total this week.</p>
        </Card>
      </div>

      {/* Mode Switch */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-300">Log mode:</span>
        <Segmented value={mode} onChange={(v) => setMode(v as Mode)} options={[{ value: "strength", label: "Strength" }, { value: "skill", label: "Skill" }]} />
      </div>

      {/* Strength Cards */}
      {mode === "strength" && (
        <div className="grid md:grid-cols-2 gap-4">
          {MOVEMENTS.map((m) => {
            const idx = state.currentStepByMovement[m.key];
            const step = m.steps[idx];
            const lvl = idx + 1;
            const count = weeklyStrengthCounts[m.key] || 0;
            const pct = Math.round(((idx + 1) / m.steps.length) * 100);
            return (
              <Card key={m.key}>
                <SectionTitle
                  icon={<Flame className="w-5 h-5"/>}
                  title={`${m.name} — Level ${lvl}/${m.steps.length}`}
                  right={<a className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 inline-flex items-center gap-1" href={googleSearchUrl(step.label)} target="_blank" rel="noopener noreferrer" title={`Search: ${step.label}`}><LinkIcon className="w-3 h-3"/> Guide</a>}
                />

                <div className="flex items-center gap-2 mb-2">
                  <button className="px-2 py-1 rounded-lg bg-white/10 border border-white/10" onClick={() => adjustLevelMovement(m.key, -1)}><ChevronDown className="w-4 h-4"/></button>
                  <div className="flex-1">
                    <div className="font-medium">Current step</div>
                    <div className="text-sm text-slate-300">{step.label}</div>
                  </div>
                  <button className="px-2 py-1 rounded-lg bg-white/10 border border-white/10" onClick={() => adjustLevelMovement(m.key, 1)}><ChevronUp className="w-4 h-4"/></button>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3"><div className="h-2 bg-indigo-400" style={{ width: `${pct}%` }} /></div>

                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm text-slate-300">Sets</label>
                  <input type="number" min={1} value={sets} onChange={(e) => setSets(parseInt(e.target.value || "1", 10))} className="w-16 px-2 py-1 rounded-lg bg-black/20 border border-white/10" />
                  <label className="text-sm text-slate-300">Reps</label>
                  <input type="number" min={1} value={reps} onChange={(e) => setReps(parseInt(e.target.value || "1", 10))} className="w-16 px-2 py-1 rounded-lg bg-black/20 border border-white/10" />
                  <span className="text-xs text-slate-400">XP preview: {calcStrengthXP(step, sets, reps)}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-white/10 focus:outline-none" placeholder="Notes, tempo, RPE…" />
                  <button className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium" onClick={() => logMovement(m)} title="Log session"><Check className="w-4 h-4 inline-block mr-1"/> Log</button>
                </div>

                <div className="mt-2 text-xs text-slate-400">This week: {count}/{m.targetPerWeek} exposures</div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Skill Cards */}
      {mode === "skill" && (
        <div className="grid md:grid-cols-2 gap-4">
          {SKILLS.map((sk) => {
            const idx = state.currentStepBySkill[sk.key];
            const step = sk.steps[idx];
            const lvl = idx + 1;
            const pct = Math.round(((idx + 1) / sk.steps.length) * 100);
            return (
              <Card key={sk.key}>
                <SectionTitle
                  icon={<Flame className="w-5 h-5"/>}
                  title={`${sk.name} — Level ${lvl}/${sk.steps.length}`}
                  right={<a className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 inline-flex items-center gap-1" href={googleSearchUrl(step.label)} target="_blank" rel="noopener noreferrer" title={`Search: ${step.label}`}><LinkIcon className="w-3 h-3"/> Guide</a>}
                />

                <div className="flex items-center gap-2 mb-2">
                  <button className="px-2 py-1 rounded-lg bg-white/10 border border-white/10" onClick={() => adjustLevelSkill(sk.key, -1)}><ChevronDown className="w-4 h-4"/></button>
                  <div className="flex-1">
                    <div className="font-medium">Current step</div>
                    <div className="text-sm text-slate-300">{step.label}</div>
                  </div>
                  <button className="px-2 py-1 rounded-lg bg-white/10 border border-white/10" onClick={() => adjustLevelSkill(sk.key, 1)}><ChevronUp className="w-4 h-4"/></button>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3"><div className="h-2 bg-indigo-400" style={{ width: `${pct}%` }} /></div>

                <div className="flex gap-2 items-center">
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-white/10 focus:outline-none" placeholder="Notes, duration cues, holds…" />
                  <button className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium" onClick={() => logSkill(sk)} title="Log skill session"><Check className="w-4 h-4 inline-block mr-1"/> Log</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cardio */}
      <div className="grid md:grid-cols-1 gap-4 mt-6">
        <Card>
          <SectionTitle icon={<HeartPulse className="w-5 h-5"/>} title="Cardio" right={<span className="text-sm text-slate-300">This week: {weeklyCardioMinutes} min</span>} />
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-slate-300">Minutes</label>
            <input type="number" min={1} value={cardioMinutes} onChange={(e) => setCardioMinutes(parseInt(e.target.value || "1", 10))} className="w-24 px-2 py-1 rounded-lg bg-black/20 border border-white/10" />
            <span className="text-xs text-slate-400">XP preview: {calcCardioXP(cardioMinutes)}</span>
          </div>
          <div className="flex gap-2 items-center">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-black/20 border border-white/10 focus:outline-none" placeholder="Notes, type (run, bike), route…" />
            <button className="px-3 py-2 rounded-xl bg-pink-400 hover:bg-pink-500 text-black font-medium" onClick={logCardio} title="Log cardio session"><Check className="w-4 h-4 inline-block mr-1"/> Log</button>
          </div>
        </Card>
      </div>

      {/* XP & Recent Logs */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Card>
          <SectionTitle icon={<Trophy className="w-5 h-5"/>} title="XP & Levels" />
          <p className="text-sm text-slate-300">Total XP: <span className="font-semibold text-white">{state.xp}</span></p>
          <p className="text-sm text-slate-300">Level: <span className="font-semibold text-white">{Math.floor(state.xp / 100) + 1}</span> (every 100 XP = +1 level)</p>
          <div className="mt-2 text-sm text-slate-400">Strength XP = base×sets×reps • Skill XP = base • Cardio XP = minutes.</div>
        </Card>

        <Card>
          <SectionTitle icon={<ClipboardList className="w-5 h-5"/>} title="Recent Logs" />
          <ul className="max-h-64 overflow-auto space-y-2 pr-1">
            {state.logs.slice(0, 16).map((log) => {
              if (log.type === "movement") {
                const m = MOVEMENTS.find((mm) => mm.key === log.key)!;
                const step = m.steps[log.stepIndex];
                return (
                  <li key={log.id} className="text-sm text-slate-200 flex justify-between gap-3">
                    <span className="truncate">{new Date(log.date).toLocaleString()} • {m.name} • {step.label} • {log.sets}x{log.reps}{log.notes ? ` — ${log.notes}` : ""}</span>
                    <span className="text-emerald-300 shrink-0">+{log.xpAwarded} XP</span>
                  </li>
                );
              } else if (log.type === "skill") {
                const s = SKILLS.find((ss) => ss.key === log.key)!;
                const step = s.steps[log.stepIndex];
                return (
                  <li key={log.id} className="text-sm text-slate-200 flex justify-between gap-3">
                    <span className="truncate">{new Date(log.date).toLocaleString()} • {s.name} • {step.label}{log.notes ? ` — ${log.notes}` : ""}</span>
                    <span className="text-emerald-300 shrink-0">+{log.xpAwarded} XP</span>
                  </li>
                );
              } else {
                return (
                  <li key={log.id} className="text-sm text-slate-200 flex justify-between gap-3">
                    <span className="truncate">{new Date(log.date).toLocaleString()} • Cardio • {log.minutes} min{log.notes ? ` — ${log.notes}` : ""}</span>
                    <span className="text-emerald-300 shrink-0">+{log.xpAwarded} XP</span>
                  </li>
                );
              }
            })}
            {state.logs.length === 0 && <li className="text-sm text-slate-400">No logs yet. Log a session above.</li>}
          </ul>
        </Card>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400">Data is stored locally in your browser. Add to iPhone Home Screen via Safari to use like an app.</footer>
    </div>
  );
}

