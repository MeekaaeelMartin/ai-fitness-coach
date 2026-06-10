"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Lost 12kg in 4 months",
    initials: "SM",
    content:
      "I cancelled my R2,000/month trainer after this. The meal plan fits my budget, the workouts fit my schedule, and I actually stick to it.",
    rating: 5,
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "James Chen",
    role: "Built 5kg muscle",
    initials: "JC",
    content:
      "My shoulder injury used to stop me from every program. This was the first plan that modified exercises specifically for me. Game changer.",
    rating: 5,
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Emma Rodriguez",
    role: "Improved overall fitness",
    initials: "ER",
    content:
      "10 minutes for the assessment, and I had a full plan before my coffee got cold. 45 min workouts, 4 days a week — I'm in the best shape of my life.",
    rating: 5,
    color: "from-green-500 to-emerald-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            They Stopped Guessing.{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              They Started Winning.
            </span>
          </h2>
          <p className="mt-4 text-foreground/60">
            Real people. Real results. Real plans built just for them.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard className="relative h-full">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-500/10" />
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-bold text-white shadow-lg`}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-emerald-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/70">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
