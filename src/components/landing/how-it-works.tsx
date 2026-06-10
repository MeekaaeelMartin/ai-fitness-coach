"use client";

import { motion } from "framer-motion";
import { ClipboardList, Brain, FileCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Tell us about yourself",
    description:
      "Answer questions about your goals, schedule, health, injuries, and what you like to eat. Takes about 10 minutes.",
  },
  {
    icon: Brain,
    step: "02",
    title: "We build your plan",
    description:
      "Your answers are used to create workouts and meals that fit your equipment, budget, and daily routine.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Follow your plan",
    description:
      "Get your workouts, meals, lifestyle tips, and progress tracking. Log what you do each day in your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-foreground/60">
            Three steps to a plan that actually fits your life
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <GlassCard hover className="relative h-full">
                <div className="absolute -top-3 right-6 text-5xl font-bold text-emerald-500/10">
                  {step.step}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {step.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
