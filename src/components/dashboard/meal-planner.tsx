"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Meal } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import { toDateKey } from "@/lib/utils/date";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface MealPlannerProps {
  meals: Meal[];
}

export function MealPlanner({ meals }: MealPlannerProps) {
  const { getDayProgress, setCustomMeal, setMealSubstitution } = useAuthStore();
  const progress = getDayProgress(toDateKey());
  const [customInput, setCustomInput] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      {meals.map((meal) => {
        const substitution = progress.mealSubstitutions[meal.name];
        const custom = progress.customMeals[meal.name];

        return (
          <GlassCard key={meal.name}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{meal.name}</h3>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                {meal.calories} kcal · P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
              </span>
            </div>

            <p className="text-sm text-foreground/70">
              {substitution ? (
                <span><strong className="text-emerald-400">Your choice:</strong> {substitution}</span>
              ) : (
                meal.foods.join(" · ")
              )}
            </p>
            <p className="mt-2 text-xs text-foreground/50">Portions: {meal.portionSizes}</p>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-foreground/50">Don&apos;t have this? Pick an alternative</p>
              <div className="flex flex-wrap gap-2">
                {(meal.alternatives ?? []).map((alt) => (
                  <button
                    key={alt}
                    type="button"
                    onClick={() => setMealSubstitution(meal.name, alt)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      substitution === alt
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-white/5 p-3">
              <p className="mb-2 text-xs font-medium text-foreground/50">
                <Plus className="mr-1 inline h-3 w-3" />
                Log what you actually ate
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="e.g. Chicken wrap from Woolworths"
                  value={customInput[meal.name] ?? custom ?? ""}
                  onChange={(e) => setCustomInput({ ...customInput, [meal.name]: e.target.value })}
                />
                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    const val = (customInput[meal.name] ?? "").trim();
                    if (val) setCustomMeal(meal.name, val);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
