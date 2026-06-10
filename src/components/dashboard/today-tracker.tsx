"use client";

import { CheckCircle2, Circle, Dumbbell, Utensils } from "lucide-react";
import type { GeneratedPlan } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import { getTodayWeekday, formatDateZA, toDateKey } from "@/lib/utils/date";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils/cn";

interface TodayTrackerProps {
  plan: GeneratedPlan;
}

export function TodayTracker({ plan }: TodayTrackerProps) {
  const { toggleWorkout, toggleMeal, getDayProgress } = useAuthStore();
  const today = getTodayWeekday();
  const dateKey = toDateKey();
  const progress = getDayProgress(dateKey);

  const todayWorkout = plan.fitnessPlan.dailyWorkouts.find(
    (w) => w.day === today
  );
  const meals = plan.nutritionPlan.meals;

  const workoutComplete = todayWorkout
    ? todayWorkout.exercises.every((e) =>
        progress.workouts.includes(`${todayWorkout.day}-${e.name}`)
      )
    : false;

  const mealsComplete = meals.every((m) => progress.meals.includes(m.name));
  const totalItems =
    (todayWorkout?.exercises.length ?? 0) + meals.length;
  const completedItems =
    progress.workouts.length + progress.meals.length;
  const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-foreground/50">Today&apos;s Tracker</p>
            <h2 className="text-xl font-bold">{formatDateZA()}</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-400">{completionPct}%</p>
            <p className="text-xs text-foreground/50">Daily completion</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </GlassCard>

      {todayWorkout ? (
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold">
                {todayWorkout.focus} · {todayWorkout.duration}
              </h3>
            </div>
            {workoutComplete && (
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                Complete ✓
              </span>
            )}
          </div>
          <div className="space-y-2">
            {todayWorkout.exercises.map((exercise) => {
              const key = `${todayWorkout.day}-${exercise.name}`;
              const done = progress.workouts.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleWorkout(key, dateKey)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                    done
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-foreground/30" />
                  )}
                  <div>
                    <p className={cn("font-medium", done && "text-emerald-400")}>
                      {exercise.name}
                    </p>
                    <p className="text-xs text-foreground/50">
                      {exercise.sets} sets × {exercise.reps} · Rest {exercise.rest}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="text-center">
          <p className="text-foreground/60">Rest day — no workout scheduled for {today}</p>
          <p className="mt-1 text-sm text-foreground/40">Focus on recovery, hydration, and nutrition</p>
        </GlassCard>
      )}

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold">Today&apos;s Meals</h3>
          </div>
          {mealsComplete && meals.length > 0 && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              All logged ✓
            </span>
          )}
        </div>
        <div className="space-y-2">
          {meals.map((meal) => {
            const done = progress.meals.includes(meal.name);
            return (
              <button
                key={meal.name}
                type="button"
                onClick={() => toggleMeal(meal.name, dateKey)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  done
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-foreground/30" />
                )}
                <div className="flex-1">
                  <p className={cn("font-medium", done && "text-emerald-400")}>
                    {meal.name}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {meal.foods.join(" · ")} · {meal.calories} kcal
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
