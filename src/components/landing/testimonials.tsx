"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils/cn";

const testimonials = [
  {
    name: "Aisha Patel",
    location: "Durban",
    role: "Lost 9kg in 3 months",
    initials: "AP",
    content:
      "I needed halal meals within my budget. The plan uses foods from Checkers and the spaza, not fancy imported stuff. My family eats the same dinners now.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    name: "Nomsa Dlamini",
    location: "Soweto, JHB",
    role: "Down 2 dress sizes",
    initials: "ND",
    content:
      "Single mom, no time for the gym. Home workouts with resistance bands work for me. I log meals on my phone between meetings.",
    color: "from-emerald-600 to-green-500",
  },
  {
    name: "James van der Merwe",
    location: "Cape Town",
    role: "Gained 6kg muscle",
    initials: "JV",
    content:
      "My lower back could not handle deadlifts. The app swapped them for hip thrusts and I kept making progress. Best move I made this year.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Tyrone Williams",
    location: "Port Elizabeth",
    role: "Built strength",
    initials: "TW",
    content:
      "Finally something that gets SA life. R120 a day food budget, training after work, exercises I can do at Planet Fitness.",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Fatima Hassan",
    location: "Pretoria",
    role: "Improved energy and fitness",
    initials: "FH",
    content:
      "The lifestyle tips matched my routine. Sleep, stress, hydration. It knew I train in the evening and adjusted around that.",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "Sipho Mokoena",
    location: "Bloemfontein",
    role: "Lost 14kg",
    initials: "SM",
    content:
      "I was unsure at first but the weak muscle question caught my lagging shoulders. Three months later my bench and posture are both better.",
    color: "from-amber-600 to-orange-500",
  },
  {
    name: "Emma Botha",
    location: "Stellenbosch",
    role: "Marathon prep",
    initials: "EB",
    content:
      "Used this to structure my running and strength days. The calendar export put everything in Google Calendar. My coach liked the setup.",
    color: "from-sky-500 to-blue-400",
  },
  {
    name: "Zaid Khan",
    location: "Sandton, JHB",
    role: "Busy professional",
    initials: "ZK",
    content:
      "Between meetings and school fetch I needed something simple. I log a boerie roll lunch when I have to. The manual meal input helps on busy days.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    name: "Lerato Molefe",
    location: "Polokwane",
    role: "Post-pregnancy fitness",
    initials: "LM",
    content:
      "After my second child I needed gentle progressions. I skip exercises that do not feel right and use the alternatives. Gold level now.",
    color: "from-fuchsia-500 to-pink-500",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const cardWidth = el.firstElementChild?.clientWidth ?? 1;
    const gap = 24;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, testimonials.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 320;
    el.scrollBy({ left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What South Africans Are Saying
          </h2>
          <p className="mt-4 text-foreground/60">
            From Durban to Cape Town. Real people, real results.
          </p>
        </div>

        <div className="relative mt-12">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous review"
            className={cn(
              "absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-opacity sm:flex",
              !canScrollLeft && "opacity-30 pointer-events-none"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="w-[85vw] shrink-0 snap-center sm:w-[380px] md:w-[400px]"
              >
                <GlassCard className="relative h-full">
                  <Quote className="absolute top-5 right-5 h-7 w-7 text-emerald-500/10" />
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white shadow-lg`}
                    >
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{t.name}</div>
                      <div className="text-xs text-foreground/50">{t.location}</div>
                      <div className="text-sm text-emerald-400">{t.role}</div>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next review"
            className={cn(
              "absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-opacity sm:flex",
              !canScrollRight && "opacity-30 pointer-events-none"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardWidth = el.firstElementChild?.clientWidth ?? 320;
                el.scrollTo({ left: i * (cardWidth + 24), behavior: "smooth" });
              }}
              className={cn(
                "h-2 rounded-full transition-all",
                i === activeIndex ? "w-6 bg-emerald-400" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
