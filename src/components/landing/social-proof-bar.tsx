"use client";

import { Shield, Users, Award, Clock } from "lucide-react";

const items = [
  { icon: Users, text: "10,000+ plans created" },
  { icon: Award, text: "4.9/5 average rating" },
  { icon: Shield, text: "Injury-aware programming" },
  { icon: Clock, text: "Ready in under 60 seconds" },
];

export function SocialProofBar() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-4 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-sm text-foreground/60"
            >
              <item.icon className="h-4 w-4 text-emerald-400" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
