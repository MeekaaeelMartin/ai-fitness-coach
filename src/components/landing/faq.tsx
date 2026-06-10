"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    title: "How is this different from other fitness apps?",
    content:
      "Unlike generic workout apps, AI Fitness Coach creates a fully personalized plan based on your complete profile — including injuries, equipment access, schedule, dietary preferences, and budget. Every recommendation is tailored specifically to you.",
  },
  {
    title: "How long does the assessment take?",
    content:
      "The comprehensive assessment takes approximately 10-15 minutes to complete. We've designed it to be thorough without being overwhelming, with a multi-step format and progress indicator.",
  },
  {
    title: "Do I need gym equipment?",
    content:
      "Not at all. During the assessment, you specify your equipment access — from a full commercial gym to bodyweight-only at home. Your plan is built around what you actually have available.",
  },
  {
    title: "Can the plan account for injuries?",
    content:
      "Yes. Our assessment includes detailed health questions about previous injuries, joint issues, and mobility limitations. The AI generates exercise modifications and precautions based on your responses.",
  },
  {
    title: "How often is my plan updated?",
    content:
      "Your initial plan includes progressive overload recommendations and adjustment guidelines. As you track progress, the plan adapts with weekly milestones and monthly targets to keep you progressing.",
  },
  {
    title: "Is this a replacement for a personal trainer?",
    content:
      "AI Fitness Coach provides comprehensive, personalized programming comparable to working with an elite coach. However, we always recommend consulting a physician before starting any new fitness program, especially if you have health conditions.",
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
            Everything you need to know before getting started
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={faqItems} />
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold">Ready to transform your fitness?</h3>
          <p className="mt-2 text-foreground/60">
            Start your personalized assessment today — it&apos;s free.
          </p>
          <Link href="/assessment" className="mt-6 inline-block">
            <Button size="lg" className="group">
              Create My Plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
