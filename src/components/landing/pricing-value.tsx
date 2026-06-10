"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

const included = [
  "Full personalized workout program",
  "Custom meal plan with macros & portions",
  "Injury & mobility modifications",
  "Progressive overload roadmap",
  "Weekly milestones & monthly targets",
  "Lifestyle & recovery recommendations",
  "Downloadable PDF plan",
  "Unlimited plan regeneration",
];

const comparisons = [
  { label: "Personal Trainer", price: "$150–300/mo", highlight: false },
  { label: "Nutrition Coach", price: "$100–200/mo", highlight: false },
  { label: "AI Fitness Coach", price: "Free to start", highlight: true },
];

export function PricingValue() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            Premium coaching. Zero guesswork.
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a $500/mo Coach Gives You —{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Personalized by AI
            </span>
          </h2>
          <p className="mt-4 text-foreground/60">
            Stop paying for generic programs. Get a blueprint built around your body,
            schedule, and goals.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {comparisons.map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border px-5 py-3 text-center ${
                item.highlight
                  ? "border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-sm text-foreground/50">{item.label}</p>
              <p
                className={`mt-0.5 font-bold ${
                  item.highlight ? "text-emerald-400" : "text-foreground/70"
                }`}
              >
                {item.price}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-lg"
        >
          <GlassCard className="relative overflow-hidden !p-8">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative">
              <div className="text-center">
                <p className="text-sm text-foreground/50">Your complete plan includes</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-emerald-400">$0</span>
                  <span className="text-foreground/50">to start</span>
                </div>
                <p className="mt-1 text-xs text-foreground/40">
                  No credit card · No commitment
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/assessment" className="mt-8 block">
                <Button size="lg" className="group w-full">
                  Get My Free Plan Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="mt-4 text-center text-xs text-foreground/40">
                Join 10,000+ people who stopped guessing and started progressing
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
