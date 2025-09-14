// Core types for the workout tracking app
export type MovementKey = "pushup" | "squat" | "pullup" | "legraise" | "bridge" | "handstand";

export type SkillKey =
  | "handstand_hold"
  | "lsit"
  | "hollow_hold"
  | "arch_hold"
  | "front_lever"
  | "back_lever"
  | "frog_stand"
  | "ring_support";

export type Step = { 
  id: string; 
  label: string; 
  xp: number; // base difficulty weight
};

export type Movement = { 
  key: MovementKey; 
  name: string; 
  steps: Step[]; 
  targetPerWeek: number; 
};

export type Skill = { 
  key: SkillKey; 
  name: string; 
  steps: Step[]; 
};

export type Mode = "strength" | "skill";

export type WorkoutLog =
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

export type ProgressState = {
  currentStepByMovement: Record<MovementKey, number>;
  currentStepBySkill: Record<SkillKey, number>;
  logs: WorkoutLog[];
  xp: number;
};