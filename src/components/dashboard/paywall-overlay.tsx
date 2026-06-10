"use client";

import { Crown, Lock } from "lucide-react";
import { MONTHLY_PRICE } from "@/lib/utils/subscription";
import { formatZARPerMonth } from "@/lib/utils/currency";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";

export function PaywallOverlay() {
  const { subscribe } = useAuthStore();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
      <div className="mx-4 max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <Lock className="h-7 w-7 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold">Get Full Access</h3>
        <p className="mt-2 text-sm text-foreground/60">
          Your free access period has ended. Subscribe for{" "}
          {formatZARPerMonth(MONTHLY_PRICE)} to access workouts, meals, tracking,
          and exports.
        </p>
        <Button className="mt-6 w-full" onClick={() => subscribe()}>
          <Crown className="h-4 w-4" />
          Subscribe at {formatZARPerMonth(MONTHLY_PRICE)}
        </Button>
        <p className="mt-3 text-xs text-foreground/40">
          Cancel anytime · Payment gateway coming soon
        </p>
      </div>
    </div>
  );
}
