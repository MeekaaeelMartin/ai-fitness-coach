"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Dumbbell,
  Utensils,
  Heart,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  CalendarCheck,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAssessmentStore } from "@/lib/store/assessment-store";
import { useAppHydrated } from "@/lib/hooks/use-app-hydrated";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import type { GeneratedPlan } from "@/lib/types/plan";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import { getSubscriptionAccess } from "@/lib/utils/subscription";
import { formatZAR } from "@/lib/utils/currency";
import { Tabs } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { SubscriptionBanner } from "./subscription-banner";
import { PaywallOverlay } from "./paywall-overlay";
import { TodayTracker } from "./today-tracker";
import { PlanIntegrations } from "./plan-integrations";
import { LevelBadge } from "./level-badge";
import { ProfileEditor } from "./profile-editor";
import { MealPlanner } from "./meal-planner";
import { ExerciseSelector } from "./exercise-selector";
import { cn } from "@/lib/utils/cn";

function normalizePlan(plan: GeneratedPlan): GeneratedPlan {
  return {
    ...plan,
    lifestyleRecommendations: plan.lifestyleRecommendations ?? {
      sleep: [],
      hydration: [],
      recovery: [],
    },
    progressTracking: plan.progressTracking ?? {
      weeklyMilestones: [],
      monthlyTargets: [],
      adjustmentRecommendations: [],
    },
  };
}

function Paywalled({ locked, children }: { locked: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      {locked && <PaywallOverlay />}
    </div>
  );
}

export function DashboardContent() {
  const router = useRouter();
  const hydrated = useAppHydrated();
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const user = useCurrentUser();
  const saveUserPlan = useAuthStore((state) => state.saveUserPlan);
  const guestPlan = useAssessmentStore((state) => state.generatedPlan);
  const assessment = useAssessmentStore((state) => state.assessment);
  const [activeTab, setActiveTab] = useState("today");
  const [openWorkout, setOpenWorkout] = useState<number | null>(0);

  const rawPlan = user?.generatedPlan ?? guestPlan;
  const generatedPlan = rawPlan ? normalizePlan(rawPlan) : null;

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    if (!generatedPlan) {
      router.push("/assessment");
      return;
    }
    if (user && !user.generatedPlan && guestPlan) {
      saveUserPlan(assessment, guestPlan);
    }
  }, [hydrated, currentUserId, user, generatedPlan, guestPlan, assessment, router, saveUserPlan]);

  if (!hydrated || !currentUserId || !user || !generatedPlan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const access = getSubscriptionAccess(user.subscription);
  const locked = !access.hasFullAccess;

  const { userProfile, personalAssessment, fitnessPlan, nutritionPlan, lifestyleRecommendations, progressTracking } =
    generatedPlan;

  const tabs = [
    { id: "today", label: "Today", icon: <CalendarCheck className="h-4 w-4" /> },
    { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
    { id: "workouts", label: "Workouts", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "nutrition", label: "Nutrition", icon: <Utensils className="h-4 w-4" /> },
    { id: "lifestyle", label: "Lifestyle", icon: <Heart className="h-4 w-4" /> },
    { id: "progress", label: "Progress", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="gradient-mesh min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {userProfile.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-foreground/60">
              Your personalised fitness and nutrition plan
            </p>
          </div>
          <PlanIntegrations plan={generatedPlan} />
        </motion.div>

        <div className="mb-6 space-y-4">
          <SubscriptionBanner subscription={user.subscription} />
          <LevelBadge points={user.points ?? 0} />
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-8 overflow-x-auto" />

        {activeTab === "today" && (
          <Paywalled locked={locked}>
            <TodayTracker plan={generatedPlan} />
          </Paywalled>
        )}

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <GlassCard>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <User className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Profile Summary</h2>
                </div>
                <dl className="space-y-3 text-sm">
                  {[
                    ["Age", `${userProfile.age} years`],
                    ["Height / Weight", `${userProfile.height} cm / ${userProfile.weight} kg`],
                    ["Target Weight", `${userProfile.targetWeight} kg`],
                    ["Experience", userProfile.fitnessExperience],
                    ["Activity Level", userProfile.activityLevel.replace("-", " ")],
                    ["Equipment", userProfile.gymAccess.replace("-", " ")],
                    ["Schedule", `${userProfile.daysPerWeek} days/week, ${userProfile.workoutDuration} min`],
                    ["Food Budget", `${formatZAR(userProfile.dailyFoodBudget)}/day`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-white/5 pb-2">
                      <dt className="text-foreground/50">{label}</dt>
                      <dd className="font-medium capitalize">{value}</dd>
                    </div>
                  ))}
                </dl>
              </GlassCard>

              <GlassCard>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Target className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Goal Summary</h2>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {userProfile.fitnessGoals.map((goal) => (
                    <span
                      key={goal}
                      className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
                    >
                      {FITNESS_GOAL_LABELS[goal]}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {personalAssessment.summary}
                </p>
              </GlassCard>
            </div>

            <ProfileEditor assessment={userProfile} />

            <GlassCard>
              <h2 className="mb-6 text-lg font-semibold">Personal Assessment</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {personalAssessment.strengths.map((item) => (
                      <li key={item} className="text-sm text-foreground/70">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {personalAssessment.weaknesses.map((item) => (
                      <li key={item} className="text-sm text-foreground/70">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-400">
                    <Target className="h-4 w-4" />
                    Key Focus Areas
                  </h3>
                  <ul className="space-y-2">
                    {personalAssessment.keyFocusAreas.map((item) => (
                      <li key={item} className="text-sm text-foreground/70">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "workouts" && (
          <Paywalled locked={locked}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <GlassCard>
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                <p className="mt-2 text-sm text-foreground/70">{fitnessPlan.weeklySchedule}</p>
              </GlassCard>

              {fitnessPlan.dailyWorkouts.map((workout, index) => (
                <GlassCard key={workout.day} className="overflow-hidden !p-0">
                  <button
                    type="button"
                    onClick={() => setOpenWorkout(openWorkout === index ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div>
                      <h3 className="font-semibold">{workout.day}</h3>
                      <p className="text-sm text-emerald-400">
                        {workout.focus} · {workout.duration}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-foreground/40 transition-transform",
                        openWorkout === index && "rotate-180"
                      )}
                    />
                  </button>
                  {openWorkout === index && (
                    <div className="border-t border-white/10 px-6 pb-6">
                      <p className="mb-4 mt-4 text-xs text-foreground/50">{workout.notes}</p>
                    <div className="space-y-4">
                      {workout.exercises.map((exercise) => (
                        <ExerciseSelector
                          key={exercise.name}
                          exercise={exercise}
                          exerciseKey={`${workout.day}-${exercise.name}`}
                        />
                      ))}
                    </div>
                    </div>
                  )}
                </GlassCard>
              ))}

              <GlassCard>
                <h3 className="mb-4 font-semibold">Progressive Overload</h3>
                <ul className="space-y-2">
                  {fitnessPlan.progressiveOverload.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-foreground/70">
                      <span className="text-emerald-400">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </Paywalled>
        )}

        {activeTab === "nutrition" && (
          <Paywalled locked={locked}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Calories", value: nutritionPlan.calorieTarget, unit: "kcal" },
                  { label: "Protein", value: nutritionPlan.macros.protein, unit: "g" },
                  { label: "Carbs", value: nutritionPlan.macros.carbs, unit: "g" },
                  { label: "Fats", value: nutritionPlan.macros.fats, unit: "g" },
                ].map((macro) => (
                  <GlassCard key={macro.label} className="text-center !p-4">
                    <div className="text-xl font-bold text-emerald-400 sm:text-2xl">
                      {macro.value}
                      <span className="text-xs font-normal text-foreground/50 sm:text-sm">{macro.unit}</span>
                    </div>
                    <div className="mt-1 text-xs text-foreground/50 sm:text-sm">{macro.label}</div>
                  </GlassCard>
                ))}
              </div>
              <MealPlanner meals={nutritionPlan.meals} />
              <GlassCard>
                <p className="text-sm text-foreground/70">{nutritionPlan.hydrationNote}</p>
              </GlassCard>
            </motion.div>
          </Paywalled>
        )}

        {activeTab === "lifestyle" && (
          <Paywalled locked={locked}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <GlassCard className="border-emerald-500/20 bg-emerald-500/5">
                <h3 className="font-semibold text-emerald-400">Built for {userProfile.name.split(" ")[0]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  Every recommendation below is based on your assessment. Your {userProfile.averageSleepHours}h sleep,
                  {userProfile.stressLevel.replace("-", " ")} stress, {userProfile.dailyWaterIntake}L water intake,
                  {userProfile.dietaryPreference.replace("-", " ")} diet, and training at{" "}
                  {userProfile.preferredTrainingTimes.map((t) => t.replace("-", " ")).join(" or ")}.
                </p>
              </GlassCard>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Sleep", items: lifestyleRecommendations.sleep, icon: "🌙" },
                  { title: "Hydration", items: lifestyleRecommendations.hydration, icon: "💧" },
                  { title: "Recovery", items: lifestyleRecommendations.recovery, icon: "🧘" },
                ].map((section) => (
                  <GlassCard key={section.title} className="h-full">
                    <h3 className="mb-4 text-lg font-semibold">
                      {section.icon} {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="text-sm leading-relaxed text-foreground/70">
                          <span className="text-emerald-400">→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </Paywalled>
        )}

        {activeTab === "progress" && (
          <Paywalled locked={locked}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <GlassCard>
                <h3 className="mb-4 font-semibold">Weekly Milestones</h3>
                <div className="space-y-3">
                  {progressTracking.weeklyMilestones.map((milestone, i) => (
                    <div
                      key={milestone}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
                        W{i + 1}
                      </div>
                      <p className="text-sm text-foreground/70">{milestone}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="mb-4 font-semibold">Monthly Targets</h3>
                <ul className="space-y-2">
                  {progressTracking.monthlyTargets.map((target) => (
                    <li key={target} className="text-sm text-foreground/70">• {target}</li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h3 className="mb-4 font-semibold">Adjustment Recommendations</h3>
                <ul className="space-y-2">
                  {progressTracking.adjustmentRecommendations.map((rec) => (
                    <li key={rec} className="flex gap-2 text-sm text-foreground/70">
                      <span className="text-emerald-400">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </Paywalled>
        )}
      </div>
    </div>
  );
}
