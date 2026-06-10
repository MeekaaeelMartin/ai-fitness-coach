import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentData } from "@/lib/types/assessment";
import type { GeneratedPlan } from "@/lib/types/plan";
import {
  type UserAccount,
  createDefaultProgress,
  createTrialSubscription,
  createEmptyDayProgress,
} from "@/lib/types/auth";
import { activateSubscription } from "@/lib/utils/subscription";
import { toDateKey } from "@/lib/utils/date";
import { POINTS } from "@/lib/utils/gamification";

function hashPassword(password: string): string {
  return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function awardPoints(user: UserAccount, amount: number): number {
  return user.points + amount;
}

interface AuthStore {
  users: Record<string, UserAccount>;
  currentUserId: string | null;
  signup: (email: string, password: string, name: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  getCurrentUser: () => UserAccount | null;
  saveUserPlan: (assessment: AssessmentData, plan: GeneratedPlan) => void;
  updateAssessment: (data: Partial<AssessmentData>) => void;
  toggleWorkout: (exerciseKey: string, date?: string) => void;
  toggleMeal: (mealName: string, date?: string) => void;
  setCustomMeal: (mealName: string, description: string, date?: string) => void;
  setMealSubstitution: (mealName: string, substitution: string, date?: string) => void;
  setExerciseSelection: (exerciseKey: string, exerciseName: string) => void;
  getDayProgress: (date?: string) => DayProgressReturn;
  getExerciseSelection: (exerciseKey: string) => string | undefined;
  subscribe: () => { success: boolean; error?: string };
  updateProfile: (name: string) => void;
}

type DayProgressReturn = {
  workouts: string[];
  meals: string[];
  customMeals: Record<string, string>;
  mealSubstitutions: Record<string, string>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: {},
      currentUserId: null,

      signup: (email, password, name) => {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = Object.values(get().users).find((u) => u.email === normalizedEmail);
        if (existing) return { success: false, error: "An account with this email already exists" };
        if (password.length < 6) return { success: false, error: "Password must be at least 6 characters" };

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
          points: 0,
          exerciseSelections: {},
        };

        set((state) => ({
          users: { ...state.users, [id]: user },
          currentUserId: id,
        }));
        return { success: true };
      },

      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = Object.values(get().users).find((u) => u.email === normalizedEmail);
        if (!user || !verifyPassword(password, user.passwordHash)) {
          return { success: false, error: "Invalid email or password" };
        }
        set({ currentUserId: user.id });
        return { success: true };
      },

      logout: () => set({ currentUserId: null }),

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        const user = currentUserId ? users[currentUserId] ?? null : null;
        if (user && user.points === undefined) {
          return { ...user, points: 0, exerciseSelections: user.exerciseSelections ?? {} };
        }
        return user;
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

      updateAssessment: (data) => {
        const user = get().getCurrentUser();
        if (!user?.assessment) return;
        const updated = { ...user.assessment, ...data };
        set((state) => ({
          users: {
            ...state.users,
            [user.id]: {
              ...user,
              assessment: updated,
              generatedPlan: user.generatedPlan
                ? { ...user.generatedPlan, userProfile: updated }
                : null,
            },
          },
        }));
      },

      toggleWorkout: (exerciseKey, date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return;

        const progress = { ...user.progress.byDate };
        const day = progress[date] ?? createEmptyDayProgress();
        const isCompleting = !day.workouts.includes(exerciseKey);
        const workouts = isCompleting
          ? [...day.workouts, exerciseKey]
          : day.workouts.filter((w) => w !== exerciseKey);

        progress[date] = { ...day, workouts };
        let points = user.points ?? 0;
        if (isCompleting) points = awardPoints(user, POINTS.WORKOUT_EXERCISE);

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, progress: { byDate: progress }, points },
          },
        }));
      },

      toggleMeal: (mealName, date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return;

        const progress = { ...user.progress.byDate };
        const day = progress[date] ?? createEmptyDayProgress();
        const isCompleting = !day.meals.includes(mealName);
        const meals = isCompleting
          ? [...day.meals, mealName]
          : day.meals.filter((m) => m !== mealName);

        progress[date] = { ...day, meals };
        let points = user.points ?? 0;
        if (isCompleting) points = awardPoints(user, POINTS.MEAL_LOGGED);

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, progress: { byDate: progress }, points },
          },
        }));
      },

      setCustomMeal: (mealName, description, date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return;

        const progress = { ...user.progress.byDate };
        const day = progress[date] ?? createEmptyDayProgress();
        const customMeals = { ...day.customMeals, [mealName]: description };
        progress[date] = { ...day, customMeals };

        const points = awardPoints(user, POINTS.CUSTOM_MEAL);

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, progress: { byDate: progress }, points },
          },
        }));
      },

      setMealSubstitution: (mealName, substitution, date = toDateKey()) => {
        const user = get().getCurrentUser();
        if (!user) return;

        const progress = { ...user.progress.byDate };
        const day = progress[date] ?? createEmptyDayProgress();
        const mealSubstitutions = { ...day.mealSubstitutions, [mealName]: substitution };
        progress[date] = { ...day, mealSubstitutions };

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, progress: { byDate: progress } },
          },
        }));
      },

      setExerciseSelection: (exerciseKey, exerciseName) => {
        const user = get().getCurrentUser();
        if (!user) return;

        set((state) => ({
          users: {
            ...state.users,
            [user.id]: {
              ...user,
              exerciseSelections: { ...user.exerciseSelections, [exerciseKey]: exerciseName },
            },
          },
        }));
      },

      getDayProgress: (date = toDateKey()): DayProgressReturn => {
        const user = get().getCurrentUser();
        const empty = createEmptyDayProgress();
        if (!user) return empty;
        const day = user.progress.byDate[date];
        if (!day) return empty;
        return {
          workouts: day.workouts ?? [],
          meals: day.meals ?? [],
          customMeals: day.customMeals ?? {},
          mealSubstitutions: day.mealSubstitutions ?? {},
        };
      },

      getExerciseSelection: (exerciseKey) => {
        const user = get().getCurrentUser();
        return user?.exerciseSelections?.[exerciseKey];
      },

      subscribe: () => {
        const user = get().getCurrentUser();
        if (!user) return { success: false, error: "Not logged in" };
        set((state) => ({
          users: {
            ...state.users,
            [user.id]: { ...user, subscription: activateSubscription(user.subscription) },
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
