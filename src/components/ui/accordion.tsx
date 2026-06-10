"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div
          key={item.title}
          className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-white/5"
          >
            {item.title}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-200",
              openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-4 text-sm leading-relaxed text-foreground/70">
                {item.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
