"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRIAL_DAYS, formatZARPerMonth, MONTHLY_PRICE } from "@/lib/utils/currency";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <Timer className="h-4 w-4" />
            {TRIAL_DAYS}-day free trial · No credit card
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Your Body Deserves a Plan{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Built for You
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/60">
            Every day without a personalized plan is another day of wasted effort.
            Start now — your custom workout and meal blueprint is one assessment away.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/assessment">
              <Button size="lg" className="group min-w-[240px] text-base">
                Start My Free Trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-foreground/40">
            {TRIAL_DAYS} days free · Then {formatZARPerMonth(MONTHLY_PRICE)} · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
