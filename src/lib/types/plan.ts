import type { AssessmentData } from "./assessment";

export interface PersonalAssessment {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  keyFocusAreas: string[];
}

export interface Exercise {
  name: string;
  alternatives: string[];
  sets: number;
  reps: string;
  rest: string;
  explanation: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: string;
  notes: string;
}

export interface FitnessPlan {
  weeklySchedule: string;
  dailyWorkouts: DailyWorkout[];
  progressiveOverload: string[];
}

export interface Meal {
  name: string;
  foods: string[];
  portionSizes: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  alternatives: string[];
}

export interface NutritionPlan {
  calorieTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  hydrationNote: string;
}

export interface LifestyleRecommendations {
  sleep: string[];
  hydration: string[];
  recovery: string[];
}

export interface ProgressTracking {
  weeklyMilestones: string[];
  monthlyTargets: string[];
  adjustmentRecommendations: string[];
}

export interface GeneratedPlan {
  id: string;
  createdAt: string;
  userProfile: AssessmentData;
  personalAssessment: PersonalAssessment;
  fitnessPlan: FitnessPlan;
  nutritionPlan: NutritionPlan;
  lifestyleRecommendations: LifestyleRecommendations;
  progressTracking: ProgressTracking;
  aiPrompt: string;
}
