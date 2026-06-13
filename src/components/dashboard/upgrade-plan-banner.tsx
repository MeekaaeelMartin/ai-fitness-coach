"use client";

import { Crown, Lock } from "lucide-react";
import { MONTHLY_PRICE } from "@/lib/utils/subscription";
import { formatZARPerMonth } from "@/lib/utils/currency";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { PaymentTrustBadges } from "@/components/ui/payment-trust-badges";

interface UpgradePlanBannerProps {
  lockedWeeks?: number;
  variant?: "inline" | "overlay";
}

export function UpgradePlanBanner({ lockedWeeks = 3, variant = "inline" }: UpgradePlanBannerProps) {
  const { subscribe } = useAuthStore();

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
        <div className="mx-4 max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <Lock className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold">Unlock Your Full Plan</h3>
          <p className="mt-2 text-sm text-foreground/60">
            Your free trial includes Week 1 only. Subscribe for{" "}
            {formatZARPerMonth(MONTHLY_PRICE)} to unlock {lockedWeeks} more weeks of
            workouts, meals, and progress tracking.
          </p>
          <Button className="mt-6 w-full" onClick={() => subscribe()}>
            <Crown className="h-4 w-4" />
            Upgrade to Full Plan
          </Button>
          <div className="mt-4 flex justify-center">
            <PaymentTrustBadges compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-amber-400">
            {lockedWeeks} more week{lockedWeeks === 1 ? "" : "s"} locked
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Your free trial includes 7 days (Week 1). Upgrade to unlock the full
            4-week workout and meal programme.
          </p>
        </div>
        <Button onClick={() => subscribe()} className="shrink-0">
          <Crown className="h-4 w-4" />
          Upgrade at {formatZARPerMonth(MONTHLY_PRICE)}
        </Button>
      </div>
    </div>
  );
}
