import { defaultAssessmentData } from "@/lib/types/assessment";
import type { GeneratedPlan } from "@/lib/types/plan";

export function normalizePlan(plan: GeneratedPlan): GeneratedPlan {
  return {
    id: plan.id ?? crypto.randomUUID(),
    createdAt: plan.createdAt ?? new Date().toISOString(),
    aiPrompt: plan.aiPrompt ?? "",
    userProfile: {
      ...defaultAssessmentData,
      ...plan.userProfile,
      name: plan.userProfile?.name || "Member",
      fitnessGoals: plan.userProfile?.fitnessGoals ?? [],
      preferredTrainingTimes: plan.userProfile?.preferredTrainingTimes ?? [],
      weakMuscleGroups: plan.userProfile?.weakMuscleGroups ?? "",
    },
    personalAssessment: {
      summary: plan.personalAssessment?.summary ?? "",
      strengths: plan.personalAssessment?.strengths ?? [],
      weaknesses: plan.personalAssessment?.weaknesses ?? [],
      keyFocusAreas: plan.personalAssessment?.keyFocusAreas ?? [],
    },
    fitnessPlan: {
      weeklySchedule: plan.fitnessPlan?.weeklySchedule ?? "",
      dailyWorkouts: (plan.fitnessPlan?.dailyWorkouts ?? []).map((workout) => ({
        day: workout.day ?? "Monday",
        focus: workout.focus ?? "Training",
        duration: workout.duration ?? "45 min",
        notes: workout.notes ?? "",
        exercises: (workout.exercises ?? []).map((exercise) => ({
          name: exercise.name ?? "Exercise",
          alternatives: exercise.alternatives ?? [],
          sets: exercise.sets ?? 3,
          reps: exercise.reps ?? "10",
          rest: exercise.rest ?? "60s",
          explanation: exercise.explanation ?? "",
        })),
      })),
      progressiveOverload: plan.fitnessPlan?.progressiveOverload ?? [],
    },
    nutritionPlan: {
      calorieTarget: plan.nutritionPlan?.calorieTarget ?? 2000,
      macros: {
        protein: plan.nutritionPlan?.macros?.protein ?? 150,
        carbs: plan.nutritionPlan?.macros?.carbs ?? 200,
        fats: plan.nutritionPlan?.macros?.fats ?? 65,
      },
      meals: (plan.nutritionPlan?.meals ?? []).map((meal) => ({
        name: meal.name ?? "Meal",
        foods: meal.foods ?? [],
        portionSizes: meal.portionSizes ?? "",
        calories: meal.calories ?? 0,
        protein: meal.protein ?? 0,
        carbs: meal.carbs ?? 0,
        fats: meal.fats ?? 0,
        alternatives: meal.alternatives ?? [],
      })),
      hydrationNote: plan.nutritionPlan?.hydrationNote ?? "",
    },
    lifestyleRecommendations: {
      sleep: plan.lifestyleRecommendations?.sleep ?? [],
      hydration: plan.lifestyleRecommendations?.hydration ?? [],
      recovery: plan.lifestyleRecommendations?.recovery ?? [],
    },
    progressTracking: {
      weeklyMilestones: plan.progressTracking?.weeklyMilestones ?? [],
      monthlyTargets: plan.progressTracking?.monthlyTargets ?? [],
      adjustmentRecommendations: plan.progressTracking?.adjustmentRecommendations ?? [],
    },
  };
}
