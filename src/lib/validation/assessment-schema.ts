import { z } from "zod";

const numberField = (min: number, max: number, minMsg: string, maxMsg: string) =>
  z
    .number({ error: "This field is required" })
    .min(min, minMsg)
    .max(max, maxMsg);

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: numberField(16, 100, "Must be at least 16 years old", "Please enter a valid age"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]),
  height: numberField(100, 250, "Height must be at least 100 cm", "Please enter a valid height"),
  weight: numberField(30, 300, "Weight must be at least 30 kg", "Please enter a valid weight"),
  targetWeight: numberField(
    30,
    300,
    "Target weight must be at least 30 kg",
    "Please enter a valid target weight"
  ),
});

const fitnessGoalsSchema = z.object({
  fitnessGoals: z
    .array(
      z.enum([
        "lose-fat",
        "build-muscle",
        "improve-fitness",
        "gain-strength",
        "athletic-performance",
        "general-health",
      ])
    )
    .min(1, "Select at least one fitness goal"),
  fitnessExperience: z.enum(["beginner", "intermediate", "advanced"]),
  activityLevel: z.enum([
    "sedentary",
    "lightly-active",
    "moderately-active",
    "very-active",
  ]),
  gymAccess: z.enum([
    "full-gym",
    "home-gym",
    "dumbbells-only",
    "resistance-bands",
    "no-equipment",
  ]),
});

const scheduleSchema = z.object({
  daysPerWeek: numberField(1, 7, "Select at least 1 day per week", "Maximum 7 days per week"),
  workoutDuration: numberField(
    20,
    120,
    "Minimum 20 minutes per workout",
    "Maximum 120 minutes per workout"
  ),
  preferredTrainingTimes: z
    .array(z.enum(["early-morning", "morning", "afternoon", "evening"]))
    .min(1, "Select at least one preferred training time"),
});

const healthSchema = z.object({
  previousInjuries: z.string().min(1, "Please describe injuries or enter 'None'"),
  jointIssues: z.string().min(1, "Please describe joint issues or enter 'None'"),
  mobilityLimitations: z
    .string()
    .min(1, "Please describe mobility limitations or enter 'None'"),
  otherHealthConsiderations: z
    .string()
    .min(1, "Please describe health considerations or enter 'None'"),
});

const nutritionSchema = z.object({
  dietaryPreference: z.enum([
    "no-restriction",
    "vegetarian",
    "vegan",
    "pescatarian",
    "keto",
    "paleo",
    "mediterranean",
    "halal",
    "kosher",
  ]),
  allergies: z.string().min(1, "Please list allergies or enter 'None'"),
  foodsDisliked: z.string().min(1, "Please list disliked foods or enter 'None'"),
  foodsEnjoyed: z.string().min(1, "Please list foods you enjoy"),
  dailyFoodBudget: numberField(10, 500, "Minimum budget is $10/day", "Please enter a realistic daily budget"),
  mealsPerDay: numberField(2, 6, "Minimum 2 meals per day", "Maximum 6 meals per day"),
});

const lifestyleSchema = z.object({
  averageSleepHours: numberField(4, 12, "Minimum 4 hours of sleep", "Maximum 12 hours"),
  dailyWaterIntake: numberField(1, 6, "Minimum 1 liter per day", "Maximum 6 liters per day"),
  stressLevel: z.enum(["low", "moderate", "high", "very-high"]),
  motivationWhy: z.string().min(10, "Please share at least 10 characters"),
  motivationBarriers: z.string().min(10, "Please share at least 10 characters"),
  motivationMeaning: z.string().min(10, "Please share at least 10 characters"),
});

export const assessmentSchema = personalInfoSchema
  .merge(fitnessGoalsSchema)
  .merge(scheduleSchema)
  .merge(healthSchema)
  .merge(nutritionSchema)
  .merge(lifestyleSchema);

export const stepSchemas = [
  personalInfoSchema,
  fitnessGoalsSchema,
  scheduleSchema,
  healthSchema,
  nutritionSchema,
  lifestyleSchema,
] as const;

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
