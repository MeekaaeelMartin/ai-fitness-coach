"use client";

import { motion } from "framer-motion";
import { Dumbbell, Utensils, TrendingUp, CheckCircle2 } from "lucide-react";

const previewItems = [
  { icon: Dumbbell, label: "Custom Workouts", value: "4 days/week" },
  { icon: Utensils, label: "Meal Plan", value: "2,150 kcal" },
  { icon: TrendingUp, label: "Progress", value: "Week 1 ✓" },
];

export function PlanPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 text-xs text-foreground/40">Your Plan</span>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground/50">Welcome back</p>
              <p className="font-semibold">Alex&apos;s Plan</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
              Active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {previewItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
              >
                <item.icon className="mx-auto h-4 w-4 text-emerald-400" />
                <p className="mt-1.5 text-[10px] text-foreground/50">{item.label}</p>
                <p className="text-xs font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-medium text-emerald-400">Today&apos;s Workout</p>
            <div className="space-y-2">
              {["Barbell Squat 4×8", "Romanian Deadlift 3×10", "Bench Press 4×8"].map(
                (exercise, i) => (
                  <motion.div
                    key={exercise}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-center gap-2 text-xs text-foreground/70"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/60" />
                    {exercise}
                  </motion.div>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <p className="text-xs text-emerald-400">Plan generated in under 60 seconds</p>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 -bottom-4 rounded-xl border border-white/15 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-md"
      >
        <p className="text-xs text-foreground/50">Avg. results</p>
        <p className="text-lg font-bold text-emerald-400">-8kg in 12 wks</p>
      </motion.div>
    </motion.div>
  );
}
