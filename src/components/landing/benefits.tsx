"use client";

import { motion } from "framer-motion";
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  Clock,
  HeartPulse,
  Apple,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const benefits = [
  {
    icon: Dumbbell,
    title: "Personalized Workouts",
    description:
      "Custom exercise programs designed for your equipment, experience level, and specific fitness goals.",
  },
  {
    icon: Utensils,
    title: "Personalized Meal Plans",
    description:
      "Nutrition plans with exact portions, macros, and meals tailored to your dietary preferences and budget.",
  },
  {
    icon: TrendingUp,
    title: "Goal Tracking",
    description:
      "Weekly milestones and monthly targets to keep you accountable and measure real progress.",
  },
  {
    icon: Clock,
    title: "Lifestyle Adjustments",
    description:
      "Plans that fit your schedule, training times, and daily routine — not the other way around.",
  },
  {
    icon: HeartPulse,
    title: "Injury Considerations",
    description:
      "Exercise modifications and precautions based on your injury history and mobility limitations.",
  },
  {
    icon: Apple,
    title: "Nutrition Guidance",
    description:
      "Expert macro targets, hydration guidelines, and alternative food options for every meal.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="gradient-mesh py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-foreground/60">
            A complete coaching experience powered by AI, designed like a premium
            fitness service
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <GlassCard hover className="h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <benefit.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {benefit.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
