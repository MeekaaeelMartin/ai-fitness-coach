"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEP_LABELS = [
  "Personal",
  "Fitness",
  "Schedule",
  "Health",
  "Nutrition",
  "Lifestyle",
];

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground/80">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-foreground/50">
          {STEP_LABELS[currentStep]}
        </span>
      </div>

      <div className="relative">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>

        <div className="mt-4 hidden justify-between sm:flex">
          {STEP_LABELS.map((label, index) => (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-1.5",
                index <= currentStep ? "text-emerald-400" : "text-foreground/30"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  index < currentStep
                    ? "bg-emerald-500 text-white"
                    : index === currentStep
                      ? "border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border border-white/20 bg-white/5"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
