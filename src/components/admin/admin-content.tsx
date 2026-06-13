"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Crown,
  Dumbbell,
  Utensils,
  TrendingUp,
  RefreshCw,
  Shield,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useIsAdmin } from "@/lib/hooks/use-is-admin";
import { isAdminEmail } from "@/lib/constants/admin";
import { fetchAdminRegistry } from "@/lib/registry/sync-client";
import type { RegistryUser, UserRegistry } from "@/lib/registry/types";
import { registryStats } from "@/lib/registry/types";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { SocialPostCreator } from "./social-post-creator";
import { formatDateZA } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

const ADMIN_KEY_STORAGE = "ai-fitness-admin-key";

export function AdminContent() {
  const router = useRouter();
  const hydrated = useAppHydrated();
  const user = useCurrentUser();
  const isAdmin = useIsAdmin();
  const [tab, setTab] = useState("overview");
  const [userFilter, setUserFilter] = useState<"all" | "trial" | "active" | "expired">("all");
  const [registry, setRegistry] = useState<UserRegistry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdminEmail(user.email)) {
      router.push("/dashboard");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) setAdminKey(stored);
  }, []);

  const loadData = useCallback(async (key?: string) => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminRegistry(user.email, key ?? adminKey);
      setRegistry(data.registry);
      setNeedsKey(false);
      if (key) {
        sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
        setAdminKey(key);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        setNeedsKey(true);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user, adminKey]);

  useEffect(() => {
    if (hydrated && user && isAdmin) {
      loadData();
    }
  }, [hydrated, user, isAdmin, loadData]);

  if (!hydrated || !user || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (needsKey && !registry) {
    return (
      <div className="gradient-mesh min-h-screen py-12">
        <div className="mx-auto max-w-md px-4">
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h1 className="text-xl font-bold">Admin Access</h1>
            </div>
            <p className="text-sm text-foreground/60">
              Enter your admin key to view user analytics. Set <code className="text-emerald-400">ADMIN_SECRET</code> in
              Netlify environment variables.
            </p>
            <div className="mt-4 space-y-3">
              <Input
                label="Admin Key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Your admin secret"
              />
              <Button className="w-full" onClick={() => loadData(keyInput)}>
                Unlock Admin Panel
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  const stats = registry ? registryStats(registry) : null;
  const allUsers = registry ? Object.values(registry.users).sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt)) : [];
  const users =
    userFilter === "all"
      ? allUsers
      : allUsers.filter((u) => u.subscriptionStatus === userFilter);

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "posts", label: "Create Posts", icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="gradient-mesh min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <Shield className="h-3.5 w-3.5" />
              Admin Panel
            </div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-foreground/60">User analytics, subscriptions, and social content</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => loadData()} disabled={loading} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {error && !needsKey && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
            {error}
          </div>
        )}

        <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} className="mb-8" />

        {tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-emerald-400" },
                { label: "Paid Members", value: stats.subscribed, icon: Crown, color: "text-amber-400" },
                { label: "Free Trial", value: stats.onTrial, icon: TrendingUp, color: "text-teal-400" },
                { label: "Expired", value: stats.expired, icon: Shield, color: "text-foreground/50" },
                { label: "With Plans", value: stats.withPlan, icon: Dumbbell, color: "text-emerald-400" },
              ].map((item) => (
                <GlassCard key={item.label} className="!p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground/50">{item.label}</p>
                      <p className="mt-1 text-3xl font-bold">{item.value}</p>
                    </div>
                    <item.icon className={cn("h-8 w-8 opacity-60", item.color)} />
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <GlassCard className="!p-5">
                <p className="text-sm text-foreground/50">Workouts Logged</p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">{stats.totalWorkoutsLogged}</p>
              </GlassCard>
              <GlassCard className="!p-5">
                <p className="text-sm text-foreground/50">Meals Logged</p>
                <p className="mt-1 text-2xl font-bold text-teal-400">{stats.totalMealsLogged}</p>
              </GlassCard>
              <GlassCard className="!p-5">
                <p className="text-sm text-foreground/50">Avg Points</p>
                <p className="mt-1 text-2xl font-bold">{stats.avgPoints}</p>
              </GlassCard>
            </div>

            <GlassCard>
              <h3 className="mb-4 font-semibold">Recent Sign-ups</h3>
              {users.length === 0 ? (
                <p className="text-sm text-foreground/50">No users synced yet. Users appear here when they sign up or log in.</p>
              ) : (
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <UserRow key={u.id} user={u} compact />
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {tab === "users" && (
          <GlassCard className="overflow-x-auto">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">All Users ({users.length})</h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "trial", label: "Free Trial" },
                    { id: "active", label: "Paid" },
                    { id: "expired", label: "Expired" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setUserFilter(f.id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      userFilter === f.id
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/5 text-foreground/60 hover:border-white/20"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {users.length === 0 ? (
              <p className="text-sm text-foreground/50">No users match this filter.</p>
            ) : (
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-foreground/50">
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Trial / Plan</th>
                    <th className="pb-3 pr-4 font-medium">Progress</th>
                    <th className="pb-3 pr-4 font-medium">Points</th>
                    <th className="pb-3 font-medium">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-foreground/50">{u.email}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={u.subscriptionStatus} />
                      </td>
                      <td className="py-3 pr-4 text-xs text-foreground/60">
                        {u.subscriptionStatus === "trial" && u.trialEndsAt ? (
                          <span>Trial ends {formatDateZA(new Date(u.trialEndsAt))}</span>
                        ) : u.subscriptionStatus === "active" ? (
                          <span>Paid · {u.hasPlan ? "Has plan" : "No plan"}</span>
                        ) : (
                          <span>{u.hasPlan ? "Plan · expired" : "No plan"}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-3 text-xs text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" /> {u.workoutsLogged}
                          </span>
                          <span className="flex items-center gap-1">
                            <Utensils className="h-3 w-3" /> {u.mealsLogged}
                          </span>
                          <span>{u.daysActive}d active</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4">{u.points}</td>
                      <td className="py-3 text-xs text-foreground/50">
                        {formatDateZA(new Date(u.lastSeenAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </GlassCard>
        )}

        {tab === "posts" && <SocialPostCreator />}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RegistryUser["subscriptionStatus"] }) {
  const styles = {
    active: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    trial: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    expired: "bg-white/5 text-foreground/50 border-white/10",
  };
  const labels = { active: "Paid", trial: "Free Trial", expired: "Expired" };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {labels[status]}
    </span>
  );
}

function UserRow({ user, compact }: { user: RegistryUser; compact?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-foreground/50">{user.email}</p>
      </div>
      <div className="flex items-center gap-3">
        {!compact && <StatusBadge status={user.subscriptionStatus} />}
        <span className="text-sm text-foreground/50">{user.points} pts</span>
      </div>
    </div>
  );
}
