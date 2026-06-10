"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { cn } from "@/lib/utils/cn";

interface PrimaryCtaProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}

export function PrimaryCta({ size = "lg", className, fullWidth }: PrimaryCtaProps) {
  const hydrated = useAppHydrated();
  const user = useCurrentUser();
  const loggedIn = hydrated && !!user;
  const href = loggedIn ? "/dashboard" : "/assessment";
  const label = loggedIn ? "My Dashboard" : "Start for Free";

  return (
    <Link href={href} className={cn(fullWidth && "block w-full", className)}>
      <Button size={size} className={cn("group", fullWidth && "w-full")}>
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  );
}
