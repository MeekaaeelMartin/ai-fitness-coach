"use client";

import { useState } from "react";
import { Crown, Clock, Zap } from "lucide-react";
import type { Subscription } from "@/lib/types/auth";
import { getSubscriptionAccess, MONTHLY_PRICE } from "@/lib/utils/subscription";
import { formatZARPerMonth } from "@/lib/utils/currency";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface SubscriptionBannerProps {
  subscription: Subscription;
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
  const { subscribe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const access = getSubscriptionAccess(subscription);

  const handleSubscribe = () => {
    setLoading(true);
    subscribe();
    setLoading(false);
  };

  if (access.status === "active") {
    return (
      <GlassCard className="!py-3 !px-5 flex items-center justify-between gap-4 border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Pro Member</p>
            <p className="text-xs text-foreground/50">{access.message}</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (access.status === "trial") {
    return (
      <GlassCard className="!py-3 !px-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium">Free Trial Active</p>
            <p className="text-xs text-foreground/50">
              {access.daysRemaining} day{access.daysRemaining === 1 ? "" : "s"} left ·
              Week 1 workout &amp; meal plan included ·
              Then {formatZARPerMonth(MONTHLY_PRICE)} for the full 4-week plan
            </p>
          </div>
        </div>
        <Button size="sm" onClick={handleSubscribe} disabled={loading}>
          <Zap className="h-3.5 w-3.5" />
          Subscribe at {formatZARPerMonth(MONTHLY_PRICE)}
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="!py-4 !px-5 border-amber-500/30 bg-amber-500/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-amber-400">Your free trial has ended</p>
          <p className="mt-1 text-sm text-foreground/60">
            Subscribe for {formatZARPerMonth(MONTHLY_PRICE)} to unlock weeks 2–4 of
            your workout and meal plan, plus full tracking and exports.
          </p>
        </div>
        <Button onClick={handleSubscribe} disabled={loading} className="shrink-0">
          <Crown className="h-4 w-4" />
          Subscribe at {formatZARPerMonth(MONTHLY_PRICE)}
        </Button>
      </div>
      <p className="mt-3 text-xs text-foreground/40">
        Payment gateway coming soon. Click to activate demo subscription.
      </p>
    </GlassCard>
  );
}
