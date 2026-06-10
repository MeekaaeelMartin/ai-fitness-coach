import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentData } from "@/lib/types/assessment";
import type { GeneratedPlan } from "@/lib/types/plan";
import {
  type UserAccount,
  type UserProgress,
  createDefaultProgress,
  createTrialSubscription,
} from "@/lib/types/auth";
import { activateSubscription } from "@/lib/utils/subscription";
import { toDateKey } from "@/lib/utils/date";

function hashPassword(password: string): string {
  return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

interface AuthStore {
  users: Record<string, UserAccount>;
  currentUserId: string | null;
  signup: (email: string, password: string, name: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  getCurrentUser: () => UserAccount | null;
  saveUserPlan: (assessment: AssessmentData, plan: GeneratedPlan) => void;
  toggleWorkout: (exerciseKey: string, date?: string) => void;
  toggleMeal: (mealName: string, date?: string) => void;
  getDayProgress: (date?: string) => { workouts: string[]; meals: string[] };
  subscribe: () => { success: boolean; error?: string };
  updateProfile: (name: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: {},
      currentUserId: null,

      signup: (email, password, name) => {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = Object.values(get().users).find(
          (u) => u.email === normalizedEmail
        );
        if (existing) {
          return { success: false, error: "An account with this email already exists" };
        }
        if (password.length < 6) {
          return { success: false, error: "Password must be at least 6 characters" };
        }

        const id = crypto.randomUUID();
        const user: UserAccount = {
          id,
          email: normalizedEmail,
          passwordHash: hashPassword(password),
          name: name.trim(),
          createdAt: new Date().toISOString(),
          assessment: null,
          generatedPlan: null,
          progress: createDefaultProgress(),
          subscription: createTrialSubscription(),
        };

        set((state) => ({
          users: { ...state.users, [id]: user },
          currentUserId: id,
        }));

        return { success: true };
      },

      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = Object.values(get().users).find(
          (u) => u.email === normalizedEmail
        );

        if (!user || !verifyPassword(password, user.passwordHash)) {
          return { success: false, error: "Invalid email or password" };
        }

        set({ currentUserId: user.id });
        return { success: true };
      },

      logout: () => set({ currentUserId: null }),

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        return currentUserId ? users[currentUserId] ?? null : null;
      },

      saveUserPlan: (assessment, plan) => {
        const user = get().getCurrentUser();
        if (!user) return;

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: {
              ...user,
              assessment,
              generatedPlan: plan,
              name: assessment.name || user.name,
            },
          },
        }));
      },

      toggleWorkout: (exerciseKey, date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return;

        const progress = { ...user.progress.byDate };
        const day = progress[date] ?? { workouts: [], meals: [] };
        const workouts = day.workouts.includes(exerciseKey)
          ? day.workouts.filter((w) => w !== exerciseKey)
          : [...day.workouts, exerciseKey];

        progress[date] = { ...day, workouts };

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, progress: { byDate: progress } },
          },
        }));
      },

      toggleMeal: (mealName, date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return;

        const progress = { ...user.progress.byDate };
        const day = progress[date] ?? { workouts: [], meals: [] };
        const meals = day.meals.includes(mealName)
          ? day.meals.filter((m) => m !== mealName)
          : [...day.meals, mealName];

        progress[date] = { ...day, meals };

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, progress: { byDate: progress } },
          },
        }));
      },

      getDayProgress: (date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return { workouts: [], meals: [] };
        return user.progress.byDate[date] ?? { workouts: [], meals: [] };
      },

      subscribe: () => {
        const user = get().getCurrentUser();
        if (!user) return { success: false, error: "Not logged in" };

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: {
              ...user,
              subscription: activateSubscription(user.subscription),
            },
          },
        }));

        return { success: true };
      },

      updateProfile: (name) => {
        const user = get().getCurrentUser();
        if (!user) return;

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, name: name.trim() },
          },
        }));
      },
    }),
    { name: "ai-fitness-coach-auth" }
  )
);
