export interface Level {
  id: string;
  name: string;
  minPoints: number;
  color: string;
  badge: string;
}

export const LEVELS: Level[] = [
  { id: "bronze", name: "Bronze", minPoints: 0, color: "from-amber-700 to-amber-500", badge: "🥉" },
  { id: "silver", name: "Silver", minPoints: 100, color: "from-slate-400 to-slate-300", badge: "🥈" },
  { id: "gold", name: "Gold", minPoints: 300, color: "from-yellow-500 to-amber-400", badge: "🥇" },
  { id: "platinum", name: "Platinum", minPoints: 600, color: "from-cyan-400 to-teal-300", badge: "💎" },
  { id: "diamond", name: "Diamond", minPoints: 1000, color: "from-violet-400 to-purple-300", badge: "👑" },
];

export const POINTS = {
  WORKOUT_EXERCISE: 15,
  MEAL_LOGGED: 10,
  DAILY_COMPLETE: 25,
  CUSTOM_MEAL: 5,
} as const;

export function getLevel(points: number): Level {
  return [...LEVELS].reverse().find((l) => points >= l.minPoints) ?? LEVELS[0];
}

export function getNextLevel(points: number): Level | null {
  const current = getLevel(points);
  const idx = LEVELS.findIndex((l) => l.id === current.id);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(points: number): number {
  const current = getLevel(points);
  const next = getNextLevel(points);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const progress = points - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}
