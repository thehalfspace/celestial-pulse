import { useState, useEffect } from 'react';
import { ProgressState } from '../types';
import { User } from '../types/user';

export function useWorkoutState(currentUser: User | null, onUpdateUser?: (state: ProgressState) => void) {
  const [state, setState] = useState<ProgressState>(() => 
    currentUser?.progressState || {
      currentStepByMovement: {
        pushup: 4,
        squat: 4,
        pullup: 3,
        legraise: 2,
        bridge: 2,
        handstand: 2,
      },
      currentStepBySkill: {
        handstand_hold: 1,
        lsit: 1,
        hollow_hold: 1,
        arch_hold: 0,
        front_lever: 0,
        back_lever: 0,
        frog_stand: 0,
        ring_support: 0,
      },
      logs: [],
      xp: 0,
    }
  );

  // Update state when user changes
  useEffect(() => {
    if (currentUser) {
      setState(currentUser.progressState);
    }
  }, [currentUser]);

  // Save to database when state changes
  useEffect(() => {
    if (currentUser && onUpdateUser) {
      onUpdateUser(state);
    }
  }, [state, currentUser, onUpdateUser]);

  const exportData = () => {
    const filename = currentUser 
      ? `celestial-pulse-${currentUser.username}-${new Date().toISOString().slice(0, 10)}.json`
      : `celestial-pulse-${new Date().toISOString().slice(0, 10)}.json`;
    
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
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
          const importedState = JSON.parse(String(r.result));
          setState(importedState);
        } catch {
          alert("Invalid JSON file");
        }
      };
      r.readAsText(f);
    };
    input.click();
  };

  const resetAll = () => {
    if (confirm("Reset all workout data? This cannot be undone.")) {
      const defaultState: ProgressState = {
        currentStepByMovement: {
          pushup: 4,
          squat: 4,
          pullup: 3,
          legraise: 2,
          bridge: 2,
          handstand: 2,
        },
        currentStepBySkill: {
          handstand_hold: 1,
          lsit: 1,
          hollow_hold: 1,
          arch_hold: 0,
          front_lever: 0,
          back_lever: 0,
          frog_stand: 0,
          ring_support: 0,
        },
        logs: [],
        xp: 0,
      };
      setState(defaultState);
    }
  };

  return {
    state,
    setState,
    exportData,
    importData,
    resetAll,
  };
}