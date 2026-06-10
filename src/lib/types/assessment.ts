export type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say";

export type FitnessGoal =
  | "lose-fat"
  | "build-muscle"
  | "improve-fitness"
  | "gain-strength"
  | "athletic-performance"
  | "general-health";

export type FitnessExperience = "beginner" | "intermediate" | "advanced";

export type ActivityLevel =
  | "sedentary"
  | "lightly-active"
  | "moderately-active"
  | "very-active";

export type GymAccess =
  | "full-gym"
  | "home-gym"
  | "dumbbells-only"
  | "resistance-bands"
  | "no-equipment";

export type TrainingTime = "early-morning" | "morning" | "afternoon" | "evening";

export type DietaryPreference =
  | "no-restriction"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "paleo"
  | "mediterranean"
  | "halal"
  | "kosher";

export type StressLevel = "low" | "moderate" | "high" | "very-high";

export interface AssessmentData {
  name: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  targetWeight: number;
  fitnessGoals: FitnessGoal[];
  fitnessExperience: FitnessExperience;
  activityLevel: ActivityLevel;
  gymAccess: GymAccess;
  daysPerWeek: number;
  workoutDuration: number;
  preferredTrainingTimes: TrainingTime[];
  previousInjuries: string;
  jointIssues: string;
  mobilityLimitations: string;
  otherHealthConsiderations: string;
  dietaryPreference: DietaryPreference;
  allergies: string;
  foodsDisliked: string;
  foodsEnjoyed: string;
  dailyFoodBudget: number;
  mealsPerDay: number;
  averageSleepHours: number;
  dailyWaterIntake: number;
  stressLevel: StressLevel;
  motivationWhy: string;
  motivationBarriers: string;
  motivationMeaning: string;
}

export const FITNESS_GOAL_LABELS: Record<FitnessGoal, string> = {
  "lose-fat": "Lose Fat",
  "build-muscle": "Build Muscle",
  "improve-fitness": "Improve Fitness",
  "gain-strength": "Gain Strength",
  "athletic-performance": "Athletic Performance",
  "general-health": "General Health",
};

export const defaultAssessmentData: AssessmentData = {
  name: "",
  age: 0,
  gender: "prefer-not-to-say",
  height: 0,
  weight: 0,
  targetWeight: 0,
  fitnessGoals: [],
  fitnessExperience: "beginner",
  activityLevel: "sedentary",
  gymAccess: "full-gym",
  daysPerWeek: 3,
  workoutDuration: 45,
  preferredTrainingTimes: [],
  previousInjuries: "",
  jointIssues: "",
  mobilityLimitations: "",
  otherHealthConsiderations: "",
  dietaryPreference: "no-restriction",
  allergies: "",
  foodsDisliked: "",
  foodsEnjoyed: "",
  dailyFoodBudget: 120,
  mealsPerDay: 3,
  averageSleepHours: 7,
  dailyWaterIntake: 2,
  stressLevel: "moderate",
  motivationWhy: "",
  motivationBarriers: "",
  motivationMeaning: "",
};
