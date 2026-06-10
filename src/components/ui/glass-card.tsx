import { cn } from "@/lib/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md dark:bg-white/[0.03]",
        hover &&
          "transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.08] hover:shadow-emerald-500/5",
        className
      )}
    >
      {children}
    </div>
  );
}
