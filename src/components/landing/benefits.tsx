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
    title: "Workouts for Your Setup",
    description:
      "Exercises matched to your equipment, experience, and goals. Swap any movement that does not work for you.",
  },
  {
    icon: Utensils,
    title: "Meals in Your Budget",
    description:
      "Meal plans with portions and macros based on what you eat, what you avoid, and what you can afford.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Log workouts and meals daily. Earn points, hit milestones, and see how you are doing over time.",
  },
  {
    icon: Clock,
    title: "Fits Your Schedule",
    description:
      "Training times and session length based on when you are actually free. Not the other way around.",
  },
  {
    icon: HeartPulse,
    title: "Injury-Aware Training",
    description:
      "We ask about injuries, joint issues, and weak muscles. Alternatives are built into every workout.",
  },
  {
    icon: Apple,
    title: "Flexible Nutrition",
    description:
      "Macro targets, meal alternatives, and a way to log what you actually ate when plans change.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="gradient-mesh py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What You Get
          </h2>
          <p className="mt-4 text-foreground/60">
            Workouts, meals, tracking, and support in one place
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
