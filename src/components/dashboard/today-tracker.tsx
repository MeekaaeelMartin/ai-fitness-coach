"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Dumbbell, Utensils, Plus } from "lucide-react";
import type { GeneratedPlan } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import { getTodayWeekday, formatDateZA, toDateKey } from "@/lib/utils/date";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExerciseSelector } from "./exercise-selector";
import { cn } from "@/lib/utils/cn";

interface TodayTrackerProps {
  plan: GeneratedPlan;
}

export function TodayTracker({ plan }: TodayTrackerProps) {
  const {
    toggleWorkout,
    toggleMeal,
    getDayProgress,
    setCustomMeal,
    setMealSubstitution,
    getExerciseSelection,
  } = useAuthStore();
  const [customMealInput, setCustomMealInput] = useState<Record<string, string>>({});
  const [showCustom, setShowCustom] = useState<string | null>(null);

  const today = getTodayWeekday();
  const dateKey = toDateKey();
  const progress = getDayProgress(dateKey);

  const todayWorkout = plan.fitnessPlan.dailyWorkouts.find((w) => w.day === today);
  const meals = plan.nutritionPlan.meals;

  const totalItems = (todayWorkout?.exercises.length ?? 0) + meals.length;
  const completedItems = progress.workouts.length + progress.meals.length;
  const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-foreground/50">Today&apos;s Tracker</p>
            <h2 className="text-xl font-bold">{formatDateZA()}</h2>
          </div>
          <div className="text-left sm:text-right">
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
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold">
              {todayWorkout.focus} · {todayWorkout.duration}
            </h3>
          </div>
          <div className="space-y-4">
            {todayWorkout.exercises.map((exercise) => {
              const exerciseKey = `${todayWorkout.day}-${exercise.name}`;
              const selectedName = getExerciseSelection(exerciseKey) ?? exercise.name;
              const checkKey = `${todayWorkout.day}-${selectedName}`;
              const done = progress.workouts.includes(checkKey) || progress.workouts.includes(exerciseKey);

              return (
                <div key={exerciseKey} className="space-y-2">
                  <ExerciseSelector exercise={exercise} exerciseKey={exerciseKey} />
                  <button
                    type="button"
                    onClick={() => toggleWorkout(checkKey, dateKey)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      done
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-foreground/30" />
                    )}
                    Mark {selectedName} complete
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="text-center">
          <p className="text-foreground/60">Rest day. No workout scheduled for {today}.</p>
        </GlassCard>
      )}

      <GlassCard>
        <div className="mb-4 flex items-center gap-2">
          <Utensils className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold">Today&apos;s Meals</h3>
        </div>
        <div className="space-y-4">
          {meals.map((meal) => {
            const done = progress.meals.includes(meal.name);
            const substitution = progress.mealSubstitutions[meal.name];
            const customLogged = progress.customMeals[meal.name];

            return (
              <div key={meal.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-xs text-foreground/50">
                      {substitution ? `Having: ${substitution}` : meal.foods.join(" · ")}
                    </p>
                    {customLogged && (
                      <p className="mt-1 text-xs text-emerald-400">Logged: {customLogged}</p>
                    )}
                  </div>
                  <span className="text-xs text-foreground/40">{meal.calories} kcal</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {meal.alternatives.map((alt) => (
                    <button
                      key={alt}
                      type="button"
                      onClick={() => setMealSubstitution(meal.name, alt, dateKey)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs transition-all",
                        substitution === alt
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      {alt}
                    </button>
                  ))}
                </div>

                {showCustom === meal.name ? (
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="What did you actually eat?"
                      value={customMealInput[meal.name] ?? ""}
                      onChange={(e) =>
                        setCustomMealInput({ ...customMealInput, [meal.name]: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const val = customMealInput[meal.name]?.trim();
                        if (val) {
                          setCustomMeal(meal.name, val, dateKey);
                          setShowCustom(null);
                        }
                      }}
                    >
                      Log
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCustom(meal.name)}
                    className="mt-3 flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Log different meal
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleMeal(meal.name, dateKey)}
                  className={cn(
                    "mt-3 flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                    done
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 text-foreground/30" />}
                  {done ? "Meal logged ✓" : "Mark meal as eaten"}
                </button>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
