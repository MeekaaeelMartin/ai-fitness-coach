"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { formatZAR, formatZARPerMonth, MONTHLY_PRICE, TRIAL_DAYS } from "@/lib/utils/currency";

const included = [
  "Full personalised workout programme",
  "Custom meal plan with macros & portions",
  "Daily workout & meal tracking",
  "Injury & mobility modifications",
  "Progressive overload roadmap",
  "Weekly milestones & monthly targets",
  "Export to PDF, Notes & Calendar",
  "Unlimited plan regeneration",
];

const comparisons = [
  { label: "SA Personal Trainer", price: "R800–2,500/mo", highlight: false },
  { label: "Nutrition Coach", price: "R500–1,500/mo", highlight: false },
  { label: "AI Fitness Coach", price: `${TRIAL_DAYS} days free`, highlight: true },
];

export function PricingValue() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            Built for South Africans
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Premium Coaching at a Fraction of the Cost
          </h2>
          <p className="mt-4 text-foreground/60">
            Try everything free for {TRIAL_DAYS} days. Then just {formatZARPerMonth(MONTHLY_PRICE)} —
            less than a single personal training session.
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
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <Clock className="h-3.5 w-3.5" />
                  {TRIAL_DAYS}-day free trial
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-emerald-400">{formatZAR(0)}</span>
                  <span className="text-foreground/50">for {TRIAL_DAYS} days</span>
                </div>
                <p className="mt-2 text-sm text-foreground/60">
                  Then <strong className="text-foreground">{formatZARPerMonth(MONTHLY_PRICE)}</strong> for full access
                </p>
                <p className="mt-1 text-xs text-foreground/40">
                  No credit card required to start
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
                  Start My {TRIAL_DAYS}-Day Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="mt-4 text-center text-xs text-foreground/40">
                Join 10,000+ South Africans transforming their fitness
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
