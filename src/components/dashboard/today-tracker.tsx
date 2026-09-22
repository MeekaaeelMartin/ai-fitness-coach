"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Dumbbell,
  Utensils,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { GeneratedPlan } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  formatDateZA,
  toDateKey,
  addDays,
  getWeekdayName,
  isSameDateKey,
  parseDateKey,
} from "@/lib/utils/date";
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

  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey());
  const [customMealInput, setCustomMealInput] = useState<Record<string, string>>({});
  const [customMealCalories, setCustomMealCalories] = useState<Record<string, string>>({});
  const [showCustom, setShowCustom] = useState<string | null>(null);

  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const weekday = getWeekdayName(selectedDate);
  const isToday = isSameDateKey(selectedDateKey);
  const progress = getDayProgress(selectedDateKey);

  const dayWorkout = plan.fitnessPlan.dailyWorkouts.find((w) => w.day === weekday);
  const meals = plan.nutritionPlan.meals ?? [];

  const totalItems = (dayWorkout?.exercises.length ?? 0) + meals.length;
  const completedItems = progress.workouts.length + progress.meals.length;
  const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const shiftDay = (delta: number) => {
    setSelectedDateKey(toDateKey(addDays(selectedDate, delta)));
    setShowCustom(null);
  };

  const goToToday = () => {
    setSelectedDateKey(toDateKey());
    setShowCustom(null);
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-foreground/50">
              {isToday ? "Today's Tracker" : "Logging for"}
            </p>
            <h2 className="text-xl font-bold">{formatDateZA(selectedDate)}</h2>
            <p className="mt-1 text-xs text-foreground/45">
              Missed a session? Switch the day to log it when you train.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-emerald-400">{completionPct}%</p>
            <p className="text-xs text-foreground/50">Day completion</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => shiftDay(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground/70 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-medium transition-all",
              isToday
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 hover:border-white/20"
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => shiftDay(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-foreground/70 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <input
            type="date"
            value={selectedDateKey}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDateKey(e.target.value);
                setShowCustom(null);
              }
            }}
            className="ml-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground/80 outline-none focus:border-emerald-500/40"
          />
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </GlassCard>

      {dayWorkout ? (
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold">
              {dayWorkout.focus} · {dayWorkout.duration}
            </h3>
          </div>
          <div className="space-y-4">
            {dayWorkout.exercises.map((exercise) => {
              const exerciseKey = `${dayWorkout.day}-${exercise.name}`;
              const selectedName = getExerciseSelection(exerciseKey) ?? exercise.name;
              const checkKey = `${dayWorkout.day}-${selectedName}`;
              const done =
                progress.workouts.includes(checkKey) || progress.workouts.includes(exerciseKey);

              return (
                <div key={exerciseKey} className="space-y-2">
                  <ExerciseSelector exercise={exercise} exerciseKey={exerciseKey} />
                  <button
                    type="button"
                    onClick={() => toggleWorkout(checkKey, selectedDateKey)}
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
          <p className="text-foreground/60">
            Rest day. No workout scheduled for {weekday}.
          </p>
        </GlassCard>
      )}

      <GlassCard>
        <div className="mb-4 flex items-center gap-2">
          <Utensils className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold">Meals</h3>
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
                      <p className="mt-1 text-xs text-emerald-400">
                        Logged: {customLogged.description}
                        {typeof customLogged.calories === "number"
                          ? ` · ${customLogged.calories} kcal`
                          : ""}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-foreground/40">{meal.calories} kcal</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(meal.alternatives ?? []).map((alt) => (
                    <button
                      key={alt}
                      type="button"
                      onClick={() => setMealSubstitution(meal.name, alt, selectedDateKey)}
                      className={cn(
                        "min-h-10 rounded-lg border px-3 py-2.5 text-xs transition-all",
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
                  <div className="mt-3 space-y-2">
                    <Input
                      placeholder="What did you actually eat?"
                      value={customMealInput[meal.name] ?? ""}
                      onChange={(e) =>
                        setCustomMealInput({ ...customMealInput, [meal.name]: e.target.value })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        step={10}
                        placeholder={`Calories (e.g. ${meal.calories})`}
                        value={customMealCalories[meal.name] ?? ""}
                        onChange={(e) =>
                          setCustomMealCalories({
                            ...customMealCalories,
                            [meal.name]: e.target.value,
                          })
                        }
                        className="w-40"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const val = customMealInput[meal.name]?.trim();
                          if (!val) return;
                          const kcalRaw = customMealCalories[meal.name]?.trim();
                          const kcal = kcalRaw ? Number(kcalRaw) : undefined;
                          setCustomMeal(
                            meal.name,
                            val,
                            selectedDateKey,
                            Number.isFinite(kcal) ? kcal : undefined
                          );
                          setShowCustom(null);
                        }}
                      >
                        Log
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustom(meal.name);
                      if (customLogged) {
                        setCustomMealInput({
                          ...customMealInput,
                          [meal.name]: customLogged.description,
                        });
                        setCustomMealCalories({
                          ...customMealCalories,
                          [meal.name]:
                            typeof customLogged.calories === "number"
                              ? String(customLogged.calories)
                              : "",
                        });
                      }
                    }}
                    className="mt-3 flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Log different meal
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleMeal(meal.name, selectedDateKey)}
                  className={cn(
                    "mt-3 flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                    done
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4 text-foreground/30" />
                  )}
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
