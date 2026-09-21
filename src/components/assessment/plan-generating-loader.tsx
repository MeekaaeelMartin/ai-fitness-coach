"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Utensils,
  Heart,
  Sparkles,
  Target,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  {
    id: "profile",
    label: "Reading your profile",
    detail: "Age, goals, experience and schedule",
    Icon: Target,
  },
  {
    id: "workouts",
    label: "Building your workouts",
    detail: "Exercises matched to your equipment",
    Icon: Dumbbell,
  },
  {
    id: "meals",
    label: "Crafting your meal plan",
    detail: "Calories and macros in Rands-friendly foods",
    Icon: Utensils,
  },
  {
    id: "lifestyle",
    label: "Adding lifestyle tips",
    detail: "Recovery, sleep and habit cues",
    Icon: Heart,
  },
  {
    id: "polish",
    label: "Putting it all together",
    detail: "Your personalised 4-week plan",
    Icon: Sparkles,
  },
] as const;

export function PlanGeneratingLoader() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 900);

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        const next = p + Math.random() * 7 + 2;
        return Math.min(next, 92);
      });
    }, 280);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const active = STEPS[stepIndex];

  return (
    <GlassCard className="relative mx-auto max-w-lg overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
      <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative py-10 sm:py-12">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-dashed border-teal-400/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            key={active.id}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30"
          >
            <active.Icon className="h-6 w-6 text-white" />
          </motion.div>
        </div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight">
          Building your plan
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Hang tight — we&apos;re crafting workouts and meals just for you.
        </p>

        <div className="mx-auto mt-8 max-w-sm text-left">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-foreground/50">Progress</span>
            <span className="font-medium text-emerald-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400"
              initial={{ width: "8%" }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-sm space-y-2 text-left">
          {STEPS.map((step, index) => {
            const done = index < stepIndex;
            const current = index === stepIndex;
            const Icon = step.Icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all",
                  current
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : done
                      ? "border-white/5 bg-white/[0.03]"
                      : "border-transparent opacity-40"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    current
                      ? "bg-emerald-500/20 text-emerald-400"
                      : done
                        ? "text-emerald-400"
                        : "text-foreground/30"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className={cn("h-4 w-4", current && "animate-pulse")} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      current ? "text-emerald-300" : "text-foreground/80"
                    )}
                  >
                    {step.label}
                  </p>
                  <AnimatePresence mode="wait">
                    {current && (
                      <motion.p
                        key={step.detail}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="truncate text-xs text-foreground/50"
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
