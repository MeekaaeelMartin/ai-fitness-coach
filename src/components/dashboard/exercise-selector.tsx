"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Exercise } from "@/lib/types/plan";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  getExerciseImageSrc,
  resolveExerciseGuide,
  slugifyExerciseName,
} from "@/lib/exercises/catalog";
import { cn } from "@/lib/utils/cn";

interface ExerciseSelectorProps {
  exercise: Exercise;
  exerciseKey: string;
}

export function ExerciseSelector({ exercise, exerciseKey }: ExerciseSelectorProps) {
  const { getExerciseSelection, setExerciseSelection } = useAuthStore();
  const selected = getExerciseSelection(exerciseKey) ?? exercise.name;
  const alternatives = exercise.alternatives ?? [];
  const allOptions = [exercise.name, ...alternatives.filter((a) => a !== exercise.name)];
  const guide = resolveExerciseGuide(selected);
  const detailHref = `/exercise/${slugifyExerciseName(selected)}?from=dashboard`;
  const hasImage = Boolean(guide.imageFile);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex gap-3">
        <Link
          href={detailHref}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-20 sm:w-20"
          aria-label={`Open guide for ${selected}`}
        >
          {hasImage ? (
            <Image
              src={getExerciseImageSrc(guide)}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] text-foreground/40">
              Guide
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={detailHref}
            className="group inline-flex max-w-full items-center gap-1.5 font-medium text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <span className="underline-offset-2 group-hover:underline">{selected}</span>
            <ChevronRight className="h-4 w-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-0.5 text-xs text-foreground/45">Tap for form guide &amp; photo</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-foreground/50">
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
                  "min-h-10 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
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
