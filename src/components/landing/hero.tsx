"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatZARPerMonth, MONTHLY_PRICE } from "@/lib/utils/currency";
import { PlanPreview } from "./plan-preview";

const trustPoints = [
  "Start for free",
  "No credit card required",
  "Built for South Africans",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-mesh">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
                🇿🇦 Built for South Africans
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              Your Workout and Meal Plan,{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Made for You
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-foreground/70"
            >
              A personalised workout and meal plan based on your body, goals, injuries,
              schedule, and budget. Start for free. Full access from{" "}
              {formatZARPerMonth(MONTHLY_PRICE)} when you want to continue.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/assessment">
                <Button size="lg" className="group w-full min-w-[220px] sm:w-auto">
                  Start for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See What&apos;s Included
                </Button>
              </a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5"
            >
              {trustPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-sm text-foreground/50"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {point}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8"
            >
              {[
                { value: "10K+", label: "Plans Created" },
                { value: "4.9★", label: "User Rating" },
                { value: "87%", label: "Stick to Plan" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-foreground/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:pl-4">
            <PlanPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
