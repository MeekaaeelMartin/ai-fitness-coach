"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Crown, LogOut, Dumbbell, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { getSubscriptionAccess, MONTHLY_PRICE } from "@/lib/utils/subscription";
import { formatZARPerMonth } from "@/lib/utils/currency";
import { formatDateZA } from "@/lib/utils/date";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/dashboard/level-badge";

export default function ProfilePage() {
  const router = useRouter();
  const { getCurrentUser, logout, subscribe } = useAuthStore();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const access = getSubscriptionAccess(user.subscription);

  return (
    <div className="gradient-mesh min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

        <div className="space-y-6">
          <LevelBadge points={user.points ?? 0} />

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-foreground/50">{user.email}</p>
                <p className="text-xs text-foreground/40">
                  Member since {formatDateZA(new Date(user.createdAt))}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold">Subscription</h3>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {access.status === "trial"
                      ? "Free Access"
                      : access.status === "active"
                        ? "Pro"
                        : "Expired"}
                  </p>
                  <p className="text-sm text-foreground/50">{access.message}</p>
                </div>
                {access.status !== "active" && (
                  <Button size="sm" onClick={() => subscribe()}>
                    {access.status === "trial" ? "Upgrade Early" : "Subscribe"}{" "}
                    at {formatZARPerMonth(MONTHLY_PRICE)}
                  </Button>
                )}
              </div>
              {access.status === "trial" && (
                <p className="mt-3 text-xs text-foreground/40">
                  After your first 7 days: {formatZARPerMonth(MONTHLY_PRICE)} for full access
                </p>
              )}
            </div>
          </GlassCard>

          {user.generatedPlan ? (
            <GlassCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-medium">Your Fitness Plan</p>
                    <p className="text-sm text-foreground/50">Active personalised plan</p>
                  </div>
                </div>
                <Link href="/dashboard">
                  <Button size="sm" variant="secondary">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <p className="text-foreground/60">No plan yet.</p>
              <Link href="/assessment" className="mt-4 inline-block">
                <Button>Take Assessment</Button>
              </Link>
            </GlassCard>
          )}

          <Button
            variant="ghost"
            className="w-full text-foreground/50 hover:text-red-400"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
