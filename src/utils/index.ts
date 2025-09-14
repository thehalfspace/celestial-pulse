import { Step } from '../types';

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function startOfWeek(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7; // Monday start
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function inThisWeek(dateISO: string) {
  const s = startOfWeek();
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  const t = new Date(dateISO);
  return t >= s && t < e;
}

export function googleSearchUrl(label: string) {
  const q = encodeURIComponent(label + " exercise");
  return `https://www.google.com/search?q=${q}`;
}

export function calcStrengthXP(step: Step, sets: number, reps: number) {
  const s = Math.max(1, Number(sets) || 1);
  const r = Math.max(1, Number(reps) || 1);
  return step.xp * s * r;
}

export function calcSkillXP(step: Step) {
  return step.xp; // constant per difficulty
}

export function calcCardioXP(minutes: number) {
  const m = Math.max(1, Math.floor(minutes) || 0);
  return m * 1; // tweak multiplier if desired
}