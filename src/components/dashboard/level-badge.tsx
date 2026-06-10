"use client";

import { getLevel, getNextLevel, getLevelProgress } from "@/lib/utils/gamification";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils/cn";

interface LevelBadgeProps {
  points: number;
  compact?: boolean;
}

export function LevelBadge({ points, compact }: LevelBadgeProps) {
  const level = getLevel(points);
  const next = getNextLevel(points);
  const progress = getLevelProgress(points);

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
        <span>{level.badge}</span>
        <span className="text-sm font-semibold">{level.name}</span>
        <span className="text-xs text-foreground/50">{points} pts</span>
      </div>
    );
  }

  return (
    <GlassCard className="!p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-lg",
              level.color
            )}
          >
            {level.badge}
          </div>
          <div>
            <p className="text-sm text-foreground/50">Your Level</p>
            <p className="text-lg font-bold">{level.name}</p>
            <p className="text-xs text-emerald-400">{points} points earned</p>
          </div>
        </div>
        {next && (
          <div className="text-right">
            <p className="text-xs text-foreground/50">Next: {next.name}</p>
            <p className="text-sm font-medium">{next.minPoints - points} pts to go</p>
          </div>
        )}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", level.color)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </GlassCard>
  );
}
