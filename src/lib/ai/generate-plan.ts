import type { AssessmentData } from "@/lib/types/assessment";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import type { GeneratedPlan, Meal, PlanWeek } from "@/lib/types/plan";
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

const WEEK_MEAL_VARIATIONS = [
  { breakfast: ["Oats", "Plant protein", "Banana"], lunch: ["Grilled chicken", "Rice", "Salad"], dinner: ["Fish", "Sweet potato", "Greens"] },
  { breakfast: ["Eggs", "Avocado toast", "Fruit"], lunch: ["Beef stir-fry", "Noodles", "Vegetables"], dinner: ["Chicken curry", "Pap", "Salad"] },
  { breakfast: ["Smoothie bowl", "Granola", "Berries"], lunch: ["Tuna wrap", "Side salad"], dinner: ["Lentil stew", "Rice", "Roast veg"] },
  { breakfast: ["Protein oats", "Peanut butter", "Apple"], lunch: ["Pap and stew", "Vegetables"], dinner: ["Grilled steak", "Potato", "Broccoli"] },
];

function buildWeekMeals(
  data: AssessmentData,
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  weekIndex: number
): Meal[] {
  const base = buildMeals(data, calories, protein, carbs, fats);
  const variation = WEEK_MEAL_VARIATIONS[weekIndex % WEEK_MEAL_VARIATIONS.length];
  return base.map((meal, i) => {
    const foods =
      i === 0 ? variation.breakfast : i === 1 ? variation.lunch : i === 2 ? variation.dinner : meal.foods;
    return { ...meal, foods, name: weekIndex > 0 ? `${meal.name} (Week ${weekIndex + 1})` : meal.name };
  });
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WEEK_NOTES = [
  "Warm up 5–10 minutes. Focus on form and establish baseline weights.",
  "Add 2.5–5kg or 1–2 reps where form allows. Push slightly harder than last week.",
  "Introduce tempo on final sets. Track your progress in the dashboard.",
  "Deload week — reduce volume by 30–40%. Focus on recovery and technique.",
];

function buildWeekWorkouts(
  data: AssessmentData,
  focuses: string[],
  constraints: { previousInjuries: string; jointIssues: string; mobilityLimitations: string; weakMuscleGroups: string },
  weekIndex: number
) {
  const workoutDays = DAYS.slice(0, data.daysPerWeek);
  const intensityBoost = weekIndex === 1 ? 1 : weekIndex === 2 ? 2 : weekIndex === 3 ? 0 : 0;

  return workoutDays.map((day, index) => {
    const focus = focuses[(index + weekIndex) % focuses.length];
    const exercises = getExercisesForPlan(data.gymAccess, focus, constraints).map((ex) => ({
      ...ex,
      sets: ex.sets + (weekIndex === 3 ? -1 : weekIndex > 0 ? 0 : 0),
      reps: weekIndex === 1 ? ex.reps.replace(/\d+/, (m) => String(Number(m) + 1)) : ex.reps,
      rest: weekIndex === 2 ? ex.rest.replace(/\d+/, (m) => String(Math.max(30, Number(m) - 15))) : ex.rest,
    }));

    return {
      day: weekIndex > 0 ? `${day} (W${weekIndex + 1})` : day,
      focus: weekIndex === 3 ? `${focus} (Deload)` : focus,
      exercises,
      duration: `${data.workoutDuration + intensityBoost * 5} min`,
      notes: WEEK_NOTES[weekIndex] ?? WEEK_NOTES[0],
    };
  });
}

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

  const weeks: PlanWeek[] = Array.from({ length: 4 }, (_, weekIndex) => ({
    weekNumber: weekIndex + 1,
    label: `Week ${weekIndex + 1}`,
    dailyWorkouts: buildWeekWorkouts(data, focuses, constraints, weekIndex),
    meals: buildWeekMeals(data, calories, protein, carbs, fats, weekIndex),
  }));

  const dailyWorkouts = weeks[0].dailyWorkouts;
  const meals = weeks[0].meals;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userProfile: data,
    aiPrompt,
    personalAssessment: {
      summary: `${data.name} is ${data.age}, ${data.fitnessExperience} level, focused on ${primaryGoal.toLowerCase()}. You train ${data.daysPerWeek} days a week with ${data.gymAccess.replace("-", " ")} access and a food budget of R${data.dailyFoodBudget}/day. This plan is built around your life, not a generic template.`,
      strengths: [
        `Clear goal orientation toward ${primaryGoal.toLowerCase()}`,
        `${data.daysPerWeek} days/week commitment shows strong dedication`,
        data.fitnessExperience !== "beginner"
          ? `${data.fitnessExperience} experience provides a solid foundation`
          : "Beginner status allows for rapid initial progress",
        data.motivationWhy.length > 20
          ? "Strong personal motivation identified from your assessment"
          : "Completed a full fitness assessment",
      ],
      weaknesses: [
        data.weakMuscleGroups.toLowerCase() !== "none"
          ? `Weak areas to address: ${data.weakMuscleGroups}`
          : data.activityLevel === "sedentary"
            ? "Low baseline activity. Build up gradually."
            : "Recovery capacity may limit volume increases",
        data.stressLevel === "high" || data.stressLevel === "very-high"
          ? "High stress may affect recovery and sticking to the plan"
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
        "Week 7-8: Deload week. Reduce volume by 40%.",
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
        "Can't do an exercise? Swap it in your dashboard. Alternatives are built in.",
        "Don't have planned food? Log what you ate manually and pick a close alternative",
      ],
    },
    weeks,
  };
}
