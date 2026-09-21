"use client";

import { Accordion } from "@/components/ui/accordion";
import { PrimaryCta } from "@/components/ui/primary-cta";
import { FAQ_ITEMS } from "@/lib/seo/faq-data";

export function FAQ() {
  return (
    <section id="faq" className="gradient-mesh py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-foreground/60">
            Common questions about AI fitness coaching, workout plans, and meal plans in South Africa
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={[...FAQ_ITEMS]} />
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
