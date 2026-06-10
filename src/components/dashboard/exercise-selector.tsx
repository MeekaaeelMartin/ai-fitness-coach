"use client";

import type { Exercise } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import { cn } from "@/lib/utils/cn";

interface ExerciseSelectorProps {
  exercise: Exercise;
  exerciseKey: string;
}

export function ExerciseSelector({ exercise, exerciseKey }: ExerciseSelectorProps) {
  const { getExerciseSelection, setExerciseSelection } = useAuthStore();
  const selected = getExerciseSelection(exerciseKey) ?? exercise.name;
  const allOptions = [exercise.name, ...exercise.alternatives.filter((a) => a !== exercise.name)];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="font-medium text-emerald-400">{selected}</p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-foreground/50">
            <span>{exercise.sets} sets</span>
            <span>{exercise.reps} reps</span>
            <span>Rest {exercise.rest}</span>
          </div>
          <p className="mt-2 text-sm text-foreground/60">{exercise.explanation}</p>
        </div>
      </div>
      {allOptions.length > 1 && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-medium text-foreground/50">Swap exercise</p>
          <div className="flex flex-wrap gap-2">
            {allOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setExerciseSelection(exerciseKey, option)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                  selected === option
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : "border-white/10 bg-white/5 text-foreground/60 hover:border-white/20"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
