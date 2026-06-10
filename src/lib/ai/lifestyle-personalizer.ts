import type { AssessmentData } from "@/lib/types/assessment";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import type { LifestyleRecommendations } from "@/lib/types/plan";

export function buildPersonalizedLifestyle(data: AssessmentData): LifestyleRecommendations {
  const goals = data.fitnessGoals.map((g) => FITNESS_GOAL_LABELS[g].toLowerCase()).join(" and ");
  const trainingTimes = data.preferredTrainingTimes.map((t) => t.replace("-", " ")).join(" or ");

  const sleep: string[] = [
    `You said you sleep about ${data.averageSleepHours} hours. Aim for ${Math.max(7, Math.ceil(data.averageSleepHours))} hours to support your ${goals} goals.`,
  ];

  if (data.preferredTrainingTimes.includes("evening")) {
    sleep.push(
      "You train in the evening. Try to avoid caffeine after 2pm and finish workouts at least 90 minutes before bed."
    );
  } else if (data.preferredTrainingTimes.includes("early-morning")) {
    sleep.push(
      "You train early. A consistent bedtime helps. Keep wake-up times within a 30-minute window when you can."
    );
  }

  if (data.stressLevel === "high" || data.stressLevel === "very-high") {
    sleep.push(
      `Your stress is ${data.stressLevel.replace("-", " ")}. Try 10 minutes of stretching or reading before bed. No screens in the last 30 minutes.`
    );
  } else {
    sleep.push(
      "Keep your room cool (around 18°C), dark, and quiet. A regular wind-down routine makes a difference over time."
    );
  }

  if (data.motivationBarriers.toLowerCase().includes("time") || data.motivationBarriers.toLowerCase().includes("busy")) {
    sleep.push(
      "You mentioned time is tight. Treat sleep like an appointment. Even 30 extra minutes a night helps training and eating habits."
    );
  }

  const hydration: string[] = [
    `You drink about ${data.dailyWaterIntake}L a day. On training days, aim for ${data.dailyWaterIntake + 0.5}L.`,
    "Have 500ml of water before coffee or breakfast, especially in warmer weather.",
  ];

  if (data.activityLevel === "very-active" || data.daysPerWeek >= 5) {
    hydration.push(
      `With ${data.daysPerWeek} training days a week, add 500 to 750ml per session. Consider electrolytes on sessions longer than 45 minutes.`
    );
  }

  if (data.fitnessGoals.includes("lose-fat")) {
    hydration.push(
      "Drink a glass of water before snacking. Thirst can feel like hunger."
    );
  }

  hydration.push(
    "Keep a bottle nearby during the day. Pale yellow urine usually means you are on track."
  );

  const recovery: string[] = [];

  if (data.previousInjuries.toLowerCase() !== "none") {
    recovery.push(
      `You noted: ${data.previousInjuries}. Warm up properly and do not push through pain. Use ice or heat after sessions as needed.`
    );
  }

  if (data.jointIssues.toLowerCase() !== "none") {
    recovery.push(
      `Joint issues (${data.jointIssues}): do 5 minutes of mobility before each session. Move gently on rest days.`
    );
  }

  if (data.weakMuscleGroups.toLowerCase() !== "none") {
    recovery.push(
      `Weak areas (${data.weakMuscleGroups}): light activation work on rest days helps. Try band pull-aparts, glute bridges, or wall slides.`
    );
  }

  if (data.stressLevel !== "low") {
    recovery.push(
      `You said ${data.motivationBarriers.slice(0, 80)}${data.motivationBarriers.length > 80 ? "..." : ""} has held you back before. Block out one rest activity each week. A walk, prayer, or time with family counts.`
    );
    recovery.push(
      "On stressful days, try 5 minutes of box breathing: 4 seconds in, 4 hold, 4 out."
    );
  } else {
    recovery.push(
      "Foam roll quads, lats, and upper back 2 to 3 times a week, especially after leg days."
    );
  }

  recovery.push(
    `You train ${data.daysPerWeek} days a week. Take ${7 - data.daysPerWeek} full rest day${7 - data.daysPerWeek === 1 ? "" : "s"}. Off days are part of the plan.`
  );

  recovery.push(
    `Have protein within 2 hours of your ${trainingTimes} sessions. With a ${data.dietaryPreference.replace("-", " ")} diet and R${data.dailyFoodBudget}/day budget, prep one meal ahead on training days if you can.`
  );

  if (data.motivationMeaning.length > 20) {
    recovery.push(
      `You said achieving this goal means: "${data.motivationMeaning.slice(0, 120)}${data.motivationMeaning.length > 120 ? "..." : ""}". Keep that in mind on hard days.`
    );
  }

  return { sleep, hydration, recovery };
}
