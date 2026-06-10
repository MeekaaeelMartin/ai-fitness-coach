"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Lost 12kg in 4 months",
    content:
      "The personalized meal plan actually fits my budget and tastes. I've tried generic apps before, but this feels like having a real coach who knows me.",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Built 5kg muscle",
    content:
      "As someone with a previous shoulder injury, I was amazed how the workouts were modified for me. Every exercise had clear explanations.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Improved overall fitness",
    content:
      "The assessment was thorough but not overwhelming. My plan fits my busy schedule perfectly — 45 minutes, 4 days a week, and I'm seeing results.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-foreground/60">
            Real results from people who transformed their fitness with AI coaching
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
                <div className="mb-4 flex gap-0.5">
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
                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-emerald-400">{testimonial.role}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
