import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Lightbulb, ListOrdered } from "lucide-react";
import type { ExerciseGuide } from "@/lib/exercises/catalog";
import { getExerciseImageSrc } from "@/lib/exercises/catalog";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

interface ExerciseDetailProps {
  guide: ExerciseGuide;
  backHref?: string;
}

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ExerciseDetail({ guide, backHref = "/dashboard" }: ExerciseDetailProps) {
  const hasImage = Boolean(guide.imageFile);
  const muscles = [...guide.primaryMuscles, ...guide.secondaryMuscles];

  return (
    <div className="gradient-mesh min-h-screen pb-16 pt-8 sm:pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href={backHref}
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plan
        </Link>

        <GlassCard className="!p-0 overflow-hidden">
          <div className="relative aspect-[16/10] w-full bg-black/40 sm:aspect-[16/9]">
            {hasImage ? (
              <Image
                src={getExerciseImageSrc(guide)}
                alt={`${guide.name} demonstration`}
                fill
                priority
                className="object-contain bg-gradient-to-b from-black/20 to-black/50"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-foreground/50">
                <Dumbbell className="h-12 w-12" />
                <p className="text-sm">Demonstration photo coming soon</p>
              </div>
            )}
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Exercise guide
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{guide.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
                {guide.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground/70">
                {titleCase(guide.equipment)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground/70">
                {titleCase(guide.level)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground/70">
                {titleCase(guide.category)}
              </span>
            </div>

            {muscles.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-foreground/90">Muscles worked</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {guide.primaryMuscles.map((muscle) => (
                    <span
                      key={`primary-${muscle}`}
                      className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-400"
                    >
                      {titleCase(muscle)}
                    </span>
                  ))}
                  {guide.secondaryMuscles.map((muscle) => (
                    <span
                      key={`secondary-${muscle}`}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground/60"
                    >
                      {titleCase(muscle)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-foreground/90">How to do it</h2>
              </div>
              <ol className="space-y-3">
                {guide.steps.map((step, index) => (
                  <li
                    key={`${guide.slug}-step-${index}`}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/75">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-foreground/90">Form tips</h2>
              </div>
              <ul className="space-y-2">
                {guide.tips.map((tip) => (
                  <li
                    key={tip}
                    className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-sm leading-relaxed text-foreground/75"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <Link href={backHref} className="block sm:inline-block">
              <Button className="w-full min-h-11 sm:w-auto">Back to my plan</Button>
            </Link>

            <p className="text-[11px] leading-relaxed text-foreground/40">
              Demonstration photos are matched to each exercise from the free-exercise-db
              open dataset so the movement you see matches the movement in your plan.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
