import type { AssessmentData } from "@/lib/types/assessment";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import type { GeneratedPlan } from "@/lib/types/plan";
import { buildAIPrompt } from "./build-prompt";

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

function getExercisesForEquipment(
  gymAccess: AssessmentData["gymAccess"],
  focus: string
) {
  const hasBarbell = gymAccess === "full-gym" || gymAccess === "home-gym";
  const hasDumbbells =
    gymAccess === "full-gym" ||
    gymAccess === "home-gym" ||
    gymAccess === "dumbbells-only";

  if (focus.includes("Strength") || focus.includes("Hypertrophy")) {
    return [
      {
        name: hasBarbell ? "Barbell Squat" : "Goblet Squat",
        sets: 4,
        reps: "8-10",
        rest: "90-120 sec",
        explanation:
          "Drive through your heels, keep chest up, and maintain a neutral spine throughout the movement.",
      },
      {
        name: hasBarbell ? "Romanian Deadlift" : "Dumbbell Romanian Deadlift",
        sets: 3,
        reps: "10-12",
        rest: "90 sec",
        explanation:
          "Hinge at the hips with a slight knee bend. Feel the stretch in your hamstrings before driving hips forward.",
      },
      {
        name: hasBarbell ? "Bench Press" : "Dumbbell Bench Press",
        sets: 4,
        reps: "8-10",
        rest: "90 sec",
        explanation:
          "Retract shoulder blades, lower with control to mid-chest, and press explosively while keeping wrists stacked.",
      },
      {
        name: hasDumbbells ? "Dumbbell Row" : "Resistance Band Row",
        sets: 3,
        reps: "10-12 each",
        rest: "60 sec",
        explanation:
          "Pull elbow back toward hip, squeeze shoulder blade at the top, and control the eccentric phase.",
      },
    ];
  }

  return [
    {
      name: "Bodyweight Squats",
      sets: 3,
      reps: "15-20",
      rest: "45 sec",
      explanation: "Keep knees tracking over toes and descend until thighs are parallel to the floor.",
    },
    {
      name: hasDumbbells ? "Dumbbell Lunges" : "Walking Lunges",
      sets: 3,
      reps: "12 each leg",
      rest: "60 sec",
      explanation: "Take a long stride, drop back knee toward the floor, and drive through front heel to stand.",
    },
    {
      name: gymAccess === "resistance-bands" ? "Band Chest Press" : "Push-ups",
      sets: 3,
      reps: "12-15",
      rest: "45 sec",
      explanation: "Maintain a straight line from head to heels. Lower with control and press through full range.",
    },
    {
      name: "Plank Hold",
      sets: 3,
      reps: "30-45 sec",
      rest: "30 sec",
      explanation: "Brace core, squeeze glutes, and keep hips level without sagging or piking.",
    },
  ];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function generatePlan(data: AssessmentData): Promise<GeneratedPlan> {
  // Simulate AI processing delay
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

  const workoutDays = DAYS.slice(0, data.daysPerWeek);
  const dailyWorkouts = workoutDays.map((day, index) => {
    const focus = focuses[index % focuses.length];
    return {
      day,
      focus,
      exercises: getExercisesForEquipment(data.gymAccess, focus),
      duration: `${data.workoutDuration} min`,
      notes:
        data.previousInjuries.toLowerCase() !== "none"
          ? `Modified for injury considerations: ${data.previousInjuries}`
          : "Focus on controlled tempo and proper form. Warm up 5-10 minutes before starting.",
    };
  });

  const mealTemplates = [
    {
      name: "Breakfast",
      foods: ["Greek yogurt", "Mixed berries", "Granola", "Honey drizzle"],
      portionSizes: "200g yogurt, 1 cup berries, 30g granola, 1 tsp honey",
      calories: Math.round(calories * 0.25),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.3),
      fats: Math.round(fats * 0.2),
      alternatives: ["Oatmeal with protein powder", "Egg white omelette with avocado toast"],
    },
    {
      name: "Lunch",
      foods: ["Grilled chicken breast", "Quinoa", "Mixed vegetables", "Olive oil dressing"],
      portionSizes: "150g chicken, 1 cup quinoa, 2 cups vegetables, 1 tbsp olive oil",
      calories: Math.round(calories * 0.3),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.35),
      fats: Math.round(fats * 0.3),
      alternatives: ["Turkey wrap with whole grain tortilla", "Salmon salad bowl"],
    },
    {
      name: "Dinner",
      foods: ["Lean beef or tofu", "Sweet potato", "Steamed broccoli", "Side salad"],
      portionSizes: "150g protein, 200g sweet potato, 1.5 cups broccoli",
      calories: Math.round(calories * 0.3),
      protein: Math.round(protein * 0.3),
      carbs: Math.round(carbs * 0.25),
      fats: Math.round(fats * 0.35),
      alternatives: ["Baked cod with rice", "Lentil curry with brown rice"],
    },
    {
      name: "Snack",
      foods: ["Protein shake", "Banana", "Almonds"],
      portionSizes: "1 scoop protein, 1 medium banana, 15g almonds",
      calories: Math.round(calories * 0.15),
      protein: Math.round(protein * 0.1),
      carbs: Math.round(carbs * 0.1),
      fats: Math.round(fats * 0.15),
      alternatives: ["Apple with peanut butter", "Rice cakes with cottage cheese"],
    },
  ];

  const meals = mealTemplates.slice(0, data.mealsPerDay);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userProfile: data,
    aiPrompt,
    personalAssessment: {
      summary: `${data.name} is a ${data.age}-year-old ${data.fitnessExperience} trainee focused on ${primaryGoal.toLowerCase()}. With ${data.daysPerWeek} training days per week and ${data.gymAccess.replace("-", " ")} access, we've designed a plan that fits your lifestyle while addressing your specific goals and constraints.`,
      strengths: [
        `Clear goal orientation toward ${primaryGoal.toLowerCase()}`,
        `${data.daysPerWeek} days/week commitment shows strong dedication`,
        data.fitnessExperience !== "beginner"
          ? `${data.fitnessExperience} experience provides a solid training foundation`
          : "Beginner status allows for rapid initial progress with proper programming",
        data.motivationWhy.length > 20
          ? "Strong intrinsic motivation identified from your assessment"
          : "Committed to completing a comprehensive fitness assessment",
      ],
      weaknesses: [
        data.activityLevel === "sedentary"
          ? "Low baseline activity level requires gradual volume progression"
          : "Recovery capacity may limit training frequency increases",
        data.stressLevel === "high" || data.stressLevel === "very-high"
          ? "Elevated stress levels may impact recovery and adherence"
          : "Consistency with nutrition tracking needs development",
        data.averageSleepHours < 7
          ? `Sleep averaging ${data.averageSleepHours}h may hinder recovery and results`
          : "Progressive overload tracking not yet established",
        Math.abs(data.targetWeight - data.weight) > 15
          ? "Ambitious weight goal requires sustained long-term commitment"
          : "Habit formation around training schedule still developing",
      ],
      keyFocusAreas: [
        `Progressive ${primaryGoal.toLowerCase()} programming`,
        data.previousInjuries.toLowerCase() !== "none"
          ? "Injury-aware exercise modifications"
          : "Movement quality and injury prevention",
        `Nutrition aligned with ${data.dietaryPreference.replace("-", " ")} preferences`,
        data.stressLevel !== "low" ? "Stress management and recovery optimization" : "Building sustainable training habits",
        "Weekly progress tracking and plan adjustments",
      ],
    },
    fitnessPlan: {
      weeklySchedule: `Your ${data.daysPerWeek}-day program alternates between ${focuses.join(", ")} with ${data.workoutDuration}-minute sessions. Rest days are strategically placed for optimal recovery.`,
      dailyWorkouts,
      progressiveOverload: [
        "Week 1-2: Focus on mastering form and establishing baseline weights",
        "Week 3-4: Add 2.5-5kg to compound lifts or increase reps by 1-2 per set",
        "Week 5-6: Introduce intensity techniques (tempo work, drop sets) on final sets",
        "Week 7-8: Deload week — reduce volume by 40% while maintaining intensity",
        "Ongoing: Track all workouts and aim for progressive overload every 1-2 weeks",
      ],
    },
    nutritionPlan: {
      calorieTarget: calories,
      macros: { protein, carbs, fats },
      meals,
      hydrationNote: `Target ${data.dailyWaterIntake + 0.5}L daily, increasing intake on training days. Add electrolytes during intense sessions.`,
    },
    lifestyleRecommendations: {
      sleep: [
        `Aim for ${Math.max(7, data.averageSleepHours)} hours of quality sleep nightly`,
        "Establish a consistent bedtime routine 30 minutes before sleep",
        "Avoid screens and heavy meals 2 hours before bed",
        "Keep bedroom temperature between 18-20°C for optimal recovery",
      ],
      hydration: [
        `Baseline: ${data.dailyWaterIntake}L daily minimum`,
        "Add 500ml per hour of exercise",
        "Start each morning with 500ml of water upon waking",
        "Monitor urine color — pale yellow indicates adequate hydration",
      ],
      recovery: [
        "Schedule at least 1 full rest day per week",
        "Include 10-15 minutes of daily mobility work post-workout",
        data.stressLevel !== "low"
          ? "Practice 5-10 minutes of breathwork or meditation daily"
          : "Use foam rolling on major muscle groups 2-3x per week",
        "Prioritize protein intake within 2 hours post-workout",
      ],
    },
    progressTracking: {
      weeklyMilestones: [
        "Week 1: Complete all scheduled workouts, log nutrition daily",
        "Week 2: Increase weights on 2+ exercises, hit calorie target 5/7 days",
        "Week 3: Add 1 rep to primary compound movements",
        "Week 4: Take progress photos and measurements, assess energy levels",
      ],
      monthlyTargets: [
        `Month 1: Establish consistent routine, target ${data.fitnessGoals.includes("lose-fat") ? "0.5-1kg" : "0.25-0.5kg"} progress toward goal`,
        "Month 2: Increase training intensity, refine nutrition timing around workouts",
        "Month 3: Reassess goals, adjust macros, introduce new exercise variations",
      ],
      adjustmentRecommendations: [
        "If weight loss stalls for 2+ weeks: reduce calories by 100-150 or add 1 cardio session",
        "If energy is low: increase carbs by 25-50g on training days",
        "If strength plateaus: implement a deload week and reassess recovery habits",
        "If adherence drops below 80%: simplify meals and reduce workout duration temporarily",
      ],
    },
  };
}
