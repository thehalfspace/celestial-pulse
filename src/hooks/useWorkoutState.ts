import { useState, useEffect } from 'react';
import { ProgressState, MovementKey, SkillKey } from '../types';

const KEY = "cc-tracker-v4";

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

export function useWorkoutState() {
  const [state, setState] = useState<ProgressState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `celestial-pulse-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          setState(JSON.parse(String(r.result)));
        } catch {
          alert("Invalid JSON");
        }
      };
      r.readAsText(f);
    };
    input.click();
  };

  const resetAll = () => {
    if (confirm("Reset all data?")) setState(defaultState());
  };

  return {
    state,
    setState,
    exportData,
    importData,
    resetAll,
  };
}