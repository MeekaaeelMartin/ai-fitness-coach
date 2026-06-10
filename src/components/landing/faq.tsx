"use client";

import { Accordion } from "@/components/ui/accordion";
import { PrimaryCta } from "@/components/ui/primary-cta";

const faqItems = [
  {
    title: "How is this different from other fitness apps?",
    content:
      "Most apps give everyone the same workouts. We build your plan from your profile: injuries, equipment, schedule, dietary preferences, and budget. Every recommendation is specific to you.",
  },
  {
    title: "How long does the assessment take?",
    content:
      "About 10 to 15 minutes. It is a step-by-step form with a progress bar so you always know where you are.",
  },
  {
    title: "Do I need gym equipment?",
    content:
      "No. You tell us what you have access to, from a full gym to bodyweight only at home. Your plan is built around that.",
  },
  {
    title: "Can the plan account for injuries?",
    content:
      "Yes. We ask about previous injuries, joint issues, and mobility limitations. Exercises can be swapped and alternatives are included.",
  },
  {
    title: "How often is my plan updated?",
    content:
      "Your plan includes progressive overload guidance and weekly milestones. As you log progress, you can adjust exercises and meals in your dashboard.",
  },
  {
    title: "Is this a replacement for a personal trainer?",
    content:
      "It gives you structured programming similar to working with a coach, but it is not medical advice. Speak to your doctor before starting any new fitness programme.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="gradient-mesh py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-foreground/60">
            Common questions before you get started
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={faqItems} />
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold">Ready to get your plan?</h3>
          <p className="mt-2 text-foreground/60">
            Start for free. No credit card. Your plan is ready in under a minute.
          </p>
          <div className="mt-6 inline-block">
            <PrimaryCta />
          </div>
        </div>
      </div>
    </section>
  );
}
