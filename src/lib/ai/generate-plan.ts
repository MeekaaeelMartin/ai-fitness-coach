import type { AssessmentData } from "@/lib/types/assessment";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import type { GeneratedPlan, Meal } from "@/lib/types/plan";
import { buildAIPrompt } from "./build-prompt";
import { getExercisesForPlan } from "./exercise-library";
import { buildPersonalizedLifestyle } from "./lifestyle-personalizer";

function calculateCalories(data: AssessmentData): number {
  const bmr =
    data.gender === "male"
      ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
      : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    "lightly-active": 1.375,
    "moderately-active": 1.55,
    "very-active": 1.725,
  };

  const tdee = bmr * (activityMultipliers[data.activityLevel] ?? 1.375);

  if (data.fitnessGoals.includes("lose-fat")) return Math.round(tdee - 500);
  if (data.fitnessGoals.includes("build-muscle")) return Math.round(tdee + 300);
  return Math.round(tdee);
}

function getWorkoutFocus(data: AssessmentData): string[] {
  const focuses: string[] = [];
  if (data.fitnessGoals.includes("lose-fat")) focuses.push("Metabolic Conditioning");
  if (data.fitnessGoals.includes("build-muscle")) focuses.push("Hypertrophy Training");
  if (data.fitnessGoals.includes("gain-strength")) focuses.push("Strength Development");
  if (data.fitnessGoals.includes("athletic-performance")) focuses.push("Power & Agility");
  if (data.fitnessGoals.includes("improve-fitness")) focuses.push("Cardiovascular Endurance");
  if (data.fitnessGoals.includes("general-health")) focuses.push("Functional Movement");
  return focuses.length > 0 ? focuses : ["Full Body Conditioning"];
}

function buildMeals(data: AssessmentData, calories: number, protein: number, carbs: number, fats: number): Meal[] {
  const isHalal = data.dietaryPreference === "halal";
  const isVegan = data.dietaryPreference === "vegan";
  const enjoyed = data.foodsEnjoyed.toLowerCase();

  const templates: Meal[] = [
    {
      name: "Breakfast",
      foods: isVegan
        ? ["Oats", "Plant protein", "Banana", "Peanut butter"]
        : ["Eggs or oats", "Fruit", "Yoghurt or milk"],
      portionSizes: "1 bowl or 2-3 eggs with sides",
      calories: Math.round(calories * 0.25),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.3),
      fats: Math.round(fats * 0.2),
      alternatives: ["Pap with eggs", "Smoothie bowl", "Protein oats", "Avocado toast"],
    },
    {
      name: "Lunch",
      foods: isHalal
        ? ["Grilled chicken or beef", "Rice or pap", "Salad", "Vegetables"]
        : ["Lean protein", "Carb source", "Vegetables"],
      portionSizes: "Palm-sized protein, fist-sized carbs, 2 cups veg",
      calories: Math.round(calories * 0.3),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.35),
      fats: Math.round(fats * 0.3),
      alternatives: ["Chicken wrap", "Tuna salad", "Bean stew with rice", "Leftover dinner"],
    },
    {
      name: "Dinner",
      foods: ["Protein of choice", "Sweet potato or rice", "Greens", "Healthy fats"],
      portionSizes: "150g protein, 1 cup carbs, generous vegetables",
      calories: Math.round(calories * 0.3),
      protein: Math.round(protein * 0.3),
      carbs: Math.round(carbs * 0.25),
      fats: Math.round(fats * 0.35),
      alternatives: ["Stir-fry", "Curry with rice", "Grilled fish", "Lentil bowl"],
    },
    {
      name: "Snack",
      foods: ["Protein shake or biltong", "Fruit", "Nuts"],
      portionSizes: "1 snack portion within your R budget",
      calories: Math.round(calories * 0.15),
      protein: Math.round(protein * 0.1),
      carbs: Math.round(carbs * 0.1),
      fats: Math.round(fats * 0.15),
      alternatives: ["Fruit & nuts", "Rice cakes & cottage cheese", "Boiled eggs", "Yoghurt"],
    },
  ];

  if (enjoyed.includes("pap")) {
    templates[1].foods.push("Pap");
    templates[1].alternatives.unshift("Pap and stew");
  }

  return templates.slice(0, data.mealsPerDay);
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function generatePlan(data: AssessmentData): Promise<GeneratedPlan> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const aiPrompt = buildAIPrompt(data);
  const calories = calculateCalories(data);
  const protein = Math.round(data.weight * 2);
  const fats = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4);
  const focuses = getWorkoutFocus(data);
  const primaryGoal = data.fitnessGoals[0]
    ? FITNESS_GOAL_LABELS[data.fitnessGoals[0]]
    : "General Fitness";

  const constraints = {
    previousInjuries: data.previousInjuries,
    jointIssues: data.jointIssues,
    mobilityLimitations: data.mobilityLimitations,
    weakMuscleGroups: data.weakMuscleGroups,
  };

  const workoutDays = DAYS.slice(0, data.daysPerWeek);
  const dailyWorkouts = workoutDays.map((day, index) => {
    const focus = focuses[index % focuses.length];
    return {
      day,
      focus,
      exercises: getExercisesForPlan(data.gymAccess, focus, constraints),
      duration: `${data.workoutDuration} min`,
      notes:
        data.weakMuscleGroups.toLowerCase() !== "none"
          ? `Extra focus on weak areas: ${data.weakMuscleGroups}. Swap exercises anytime in your dashboard.`
          : data.previousInjuries.toLowerCase() !== "none"
            ? `Modified for: ${data.previousInjuries}`
            : "Warm up 5–10 minutes. Swap any exercise if needed from the alternatives provided.",
    };
  });

  const meals = buildMeals(data, calories, protein, carbs, fats);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userProfile: data,
    aiPrompt,
    personalAssessment: {
      summary: `${data.name} is a ${data.age}-year-old ${data.fitnessExperience} trainee in South Africa, focused on ${primaryGoal.toLowerCase()}. With ${data.daysPerWeek} training days, ${data.gymAccess.replace("-", " ")} access, and a daily food budget of R${data.dailyFoodBudget}, we've built a plan around your life — not a generic template.`,
      strengths: [
        `Clear goal orientation toward ${primaryGoal.toLowerCase()}`,
        `${data.daysPerWeek} days/week commitment shows strong dedication`,
        data.fitnessExperience !== "beginner"
          ? `${data.fitnessExperience} experience provides a solid foundation`
          : "Beginner status allows for rapid initial progress",
        data.motivationWhy.length > 20
          ? "Strong personal motivation identified from your assessment"
          : "Committed to completing a comprehensive assessment",
      ],
      weaknesses: [
        data.weakMuscleGroups.toLowerCase() !== "none"
          ? `Weak areas to address: ${data.weakMuscleGroups}`
          : data.activityLevel === "sedentary"
            ? "Low baseline activity — gradual progression needed"
            : "Recovery capacity may limit volume increases",
        data.stressLevel === "high" || data.stressLevel === "very-high"
          ? "Elevated stress may impact recovery and adherence"
          : "Nutrition tracking consistency still developing",
        data.averageSleepHours < 7
          ? `Sleep averaging ${data.averageSleepHours}h may hinder results`
          : "Progressive overload tracking not yet established",
      ],
      keyFocusAreas: [
        `Progressive ${primaryGoal.toLowerCase()} programming`,
        data.weakMuscleGroups.toLowerCase() !== "none"
          ? `Strengthening ${data.weakMuscleGroups}`
          : "Movement quality and injury prevention",
        `Nutrition within R${data.dailyFoodBudget}/day ${data.dietaryPreference.replace("-", " ")} budget`,
        data.stressLevel !== "low" ? "Stress management and recovery" : "Sustainable habit building",
      ],
    },
    fitnessPlan: {
      weeklySchedule: `Your ${data.daysPerWeek}-day programme alternates ${focuses.join(", ")} in ${data.workoutDuration}-minute sessions. Every exercise includes alternatives you can swap in your dashboard.`,
      dailyWorkouts,
      progressiveOverload: [
        "Week 1-2: Master form and establish baseline weights",
        "Week 3-4: Add 2.5-5kg or 1-2 reps per set",
        "Week 5-6: Introduce tempo work on final sets",
        "Week 7-8: Deload — reduce volume by 40%",
        "Ongoing: Swap exercises as needed and track in your dashboard",
      ],
    },
    nutritionPlan: {
      calorieTarget: calories,
      macros: { protein, carbs, fats },
      meals,
      hydrationNote: `Target ${data.dailyWaterIntake + 0.5}L daily on training days. Log custom meals in your dashboard when you eat something different.`,
    },
    lifestyleRecommendations: buildPersonalizedLifestyle(data),
    progressTracking: {
      weeklyMilestones: [
        "Week 1: Complete all workouts, log meals daily, earn your first points",
        "Week 2: Hit calorie target 5/7 days, try one exercise alternative",
        "Week 3: Reach Silver level, add 1 rep to compound movements",
        "Week 4: Progress photos, assess energy, review lifestyle recommendations",
      ],
      monthlyTargets: [
        `Month 1: Establish routine, target ${data.fitnessGoals.includes("lose-fat") ? "0.5-1kg" : "0.25-0.5kg"} progress`,
        "Month 2: Increase intensity, refine meal substitutions",
        "Month 3: Reach Gold level, reassess goals and weak muscle groups",
      ],
      adjustmentRecommendations: [
        "If weight loss stalls: reduce calories by 100-150 or add a cardio session",
        "If energy is low: increase carbs by 25-50g on training days",
        "Can't do an exercise? Swap it in your dashboard — alternatives are built in",
        "Don't have planned food? Log what you ate manually and pick a close alternative",
      ],
    },
  };
}
