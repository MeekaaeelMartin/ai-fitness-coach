"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import type { DailyWorkout, Exercise } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";

interface WorkoutPlanEditorProps {
  dailyWorkouts: DailyWorkout[];
}

export function WorkoutPlanEditor({ dailyWorkouts }: WorkoutPlanEditorProps) {
  const { updateExerciseInPlan } = useAuthStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Exercise>>({});

  const startEdit = (workoutDay: string, exercise: Exercise) => {
    const key = `${workoutDay}-${exercise.name}`;
    setEditing(key);
    setDraft({ sets: exercise.sets, reps: exercise.reps, rest: exercise.rest });
  };

  const saveEdit = (workoutDay: string, exerciseName: string) => {
    updateExerciseInPlan(workoutDay, exerciseName, draft);
    setEditing(null);
    setDraft({});
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft({});
  };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Adjust Workout Plan</h3>
          <p className="mt-1 text-sm text-foreground/50">
            As a Pro member, you can tweak sets, reps, and rest times to match your progress.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {dailyWorkouts.map((workout) => (
          <div key={workout.day} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-sm font-medium text-emerald-400">
              {workout.day} · {workout.focus}
            </p>
            <div className="space-y-3">
              {workout.exercises.map((exercise) => {
                const key = `${workout.day}-${exercise.name}`;
                const isEditing = editing === key;

                return (
                  <div key={key} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{exercise.name}</p>
                      {!isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => startEdit(workout.day, exercise)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <Input
                          label="Sets"
                          type="number"
                          min={1}
                          value={draft.sets ?? ""}
                          onChange={(e) => setDraft({ ...draft, sets: Number(e.target.value) })}
                        />
                        <Input
                          label="Reps"
                          value={draft.reps ?? ""}
                          onChange={(e) => setDraft({ ...draft, reps: e.target.value })}
                        />
                        <Input
                          label="Rest"
                          value={draft.rest ?? ""}
                          onChange={(e) => setDraft({ ...draft, rest: e.target.value })}
                        />
                        <div className="flex gap-2 sm:col-span-3">
                          <Button size="sm" onClick={() => saveEdit(workout.day, exercise.name)}>
                            <Save className="h-3.5 w-3.5" />
                            Save
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-foreground/50">
                        {exercise.sets} sets × {exercise.reps} · Rest {exercise.rest}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
