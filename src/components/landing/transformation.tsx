"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

const results = [
  {
    metric: "87%",
    label: "stick to their plan after 30 days",
    detail: "compared to 23% on generic apps",
  },
  {
    metric: "3.2×",
    label: "faster progress toward goals",
    detail: "with a plan built around you",
  },
  {
    metric: "10 min",
    label: "to get your full plan",
    detail: "workouts, meals, and tracking included",
  },
  {
    metric: "100%",
    label: "built for you",
    detail: "injuries, schedule, diet, and equipment",
  },
];

export function Transformation() {
  return (
    <section className="gradient-mesh py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built Around You,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Not a Template
            </span>
          </h2>
          <p className="mt-4 text-foreground/60">
            Most fitness apps give everyone the same programme. We don&apos;t.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover className="h-full text-center">
                <div className="text-4xl font-bold text-emerald-400">{result.metric}</div>
                <p className="mt-2 text-sm font-medium">{result.label}</p>
                <p className="mt-1 text-xs text-foreground/50">{result.detail}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
