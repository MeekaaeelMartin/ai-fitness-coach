import type { UserAccount } from "@/lib/types/auth";

export interface RegistryUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  subscriptionStatus: "trial" | "active" | "expired";
  subscribedAt?: string;
  points: number;
  hasPlan: boolean;
  assessmentComplete: boolean;
  workoutsLogged: number;
  mealsLogged: number;
  daysActive: number;
  lastSeenAt: string;
  fitnessGoals: string[];
}

export interface UserRegistry {
  users: Record<string, RegistryUser>;
  updatedAt: string;
}

export function emptyRegistry(): UserRegistry {
  return { users: {}, updatedAt: new Date().toISOString() };
}

export function userToRegistryEntry(user: UserAccount): RegistryUser {
  const progress = user.progress?.byDate ?? {};
  const days = Object.values(progress);
  const workoutsLogged = days.reduce((sum, d) => sum + (d.workouts?.length ?? 0), 0);
  const mealsLogged = days.reduce((sum, d) => sum + (d.meals?.length ?? 0), 0);

  let subscriptionStatus: RegistryUser["subscriptionStatus"] = "expired";
  if (user.subscription?.status === "active") subscriptionStatus = "active";
  else if (user.subscription?.status === "trial") subscriptionStatus = "trial";

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    subscriptionStatus,
    subscribedAt: user.subscription?.subscribedAt,
    points: user.points ?? 0,
    hasPlan: !!user.generatedPlan,
    assessmentComplete: !!user.assessment,
    workoutsLogged,
    mealsLogged,
    daysActive: Object.keys(progress).length,
    lastSeenAt: new Date().toISOString(),
    fitnessGoals: user.assessment?.fitnessGoals ?? user.generatedPlan?.userProfile.fitnessGoals ?? [],
  };
}

export function registryStats(registry: UserRegistry) {
  const users = Object.values(registry.users);
  return {
    totalUsers: users.length,
    subscribed: users.filter((u) => u.subscriptionStatus === "active").length,
    onTrial: users.filter((u) => u.subscriptionStatus === "trial").length,
    withPlan: users.filter((u) => u.hasPlan).length,
    totalWorkoutsLogged: users.reduce((s, u) => s + u.workoutsLogged, 0),
    totalMealsLogged: users.reduce((s, u) => s + u.mealsLogged, 0),
    avgPoints: users.length
      ? Math.round(users.reduce((s, u) => s + u.points, 0) / users.length)
      : 0,
  };
}
