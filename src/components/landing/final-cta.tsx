"use client";

import { motion } from "framer-motion";
import { PrimaryCta } from "@/components/ui/primary-cta";
import { formatZARPerMonth, MONTHLY_PRICE } from "@/lib/utils/currency";

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
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Get a Plan That Fits{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Your Life
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/60">
            Answer a few questions and get your workout and meal plan. Start for free.
            Continue at {formatZARPerMonth(MONTHLY_PRICE)} only if you want to.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <PrimaryCta className="min-w-[240px]" />
          </div>

          <p className="mt-6 text-sm text-foreground/40">
            No credit card. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
