"use client";

import { cn } from "@/lib/utils/cn";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex min-h-11 shrink-0 snap-start items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 sm:gap-2 sm:px-4",
            activeTab === tab.id
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
          )}
        >
          {tab.icon}
          <span className={cn(tab.icon ? "hidden sm:inline" : undefined)}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
