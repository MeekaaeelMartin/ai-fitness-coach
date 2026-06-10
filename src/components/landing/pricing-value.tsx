"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { formatZAR, formatZARPerMonth, MONTHLY_PRICE, TRIAL_DAYS } from "@/lib/utils/currency";

const included = [
  "Full personalised workout programme",
  "Custom meal plan with macros & portions",
  "Daily workout & meal tracking",
  "Exercise alternatives & meal substitutions",
  "Points, levels & achievement tracking",
  "Injury & weak muscle modifications",
  "Export to PDF, Notes & Calendar",
  "Unlimited plan regeneration",
];

export function PricingValue() {
  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            Built for South Africans
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Premium Coaching, Priced for Real Life
          </h2>
          <p className="mt-4 text-foreground/60">
            Start for free — explore everything with no commitment.
            Love it? Continue for just {formatZARPerMonth(MONTHLY_PRICE)}.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-lg"
        >
          <GlassCard className="relative overflow-hidden !p-6 sm:!p-8">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative">
              <div className="text-center">
                <p className="text-sm text-foreground/50">Get started today</p>
                <div className="mt-2 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-emerald-400">{formatZAR(0)}</span>
                  <span className="text-foreground/50">to begin</span>
                </div>
                <p className="mt-2 text-sm text-foreground/60">
                  Full access for {TRIAL_DAYS} days, then {formatZARPerMonth(MONTHLY_PRICE)}
                </p>
                <p className="mt-1 text-xs text-foreground/40">
                  No credit card · No pressure · Cancel anytime
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
                  Start for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="mt-4 text-center text-xs text-foreground/40">
                Join thousands of South Africans already on their journey
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
