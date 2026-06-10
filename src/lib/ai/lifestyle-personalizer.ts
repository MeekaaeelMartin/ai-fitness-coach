import type { AssessmentData } from "@/lib/types/assessment";
import type { LifestyleRecommendations } from "@/lib/types/plan";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";

export function buildPersonalizedLifestyle(data: AssessmentData): LifestyleRecommendations {
  const goals = data.fitnessGoals.map((g) => FITNESS_GOAL_LABELS[g].toLowerCase()).join(" and ");
  const trainingTimes = data.preferredTrainingTimes.map((t) => t.replace("-", " ")).join(" or ");

  const sleep: string[] = [
    `You reported averaging ${data.averageSleepHours} hours — aim for ${Math.max(7, Math.ceil(data.averageSleepHours))} hours to support your ${goals} goals.`,
  ];

  if (data.preferredTrainingTimes.includes("evening")) {
    sleep.push(
      "Since you train in the evening, avoid caffeine after 2pm and finish workouts at least 90 minutes before bed so sleep quality isn't affected."
    );
  } else if (data.preferredTrainingTimes.includes("early-morning")) {
    sleep.push(
      "With early-morning sessions, target a consistent bedtime — your body will adapt faster when wake-up times stay within a 30-minute window."
    );
  }

  if (data.stressLevel === "high" || data.stressLevel === "very-high") {
    sleep.push(
      `Your ${data.stressLevel.replace("-", " ")} stress level can disrupt sleep. Try 10 minutes of light stretching or reading before bed — no screens in the last 30 minutes.`
    );
  } else {
    sleep.push(
      "Keep your room cool (around 18°C), dark, and quiet. A consistent wind-down routine will compound your recovery over time."
    );
  }

  if (data.motivationBarriers.toLowerCase().includes("time") || data.motivationBarriers.toLowerCase().includes("busy")) {
    sleep.push(
      "You mentioned time constraints — protect sleep like an appointment. Even 30 extra minutes nightly will improve workout performance and meal adherence."
    );
  }

  const hydration: string[] = [
    `Based on your ${data.dailyWaterIntake}L daily intake, target ${data.dailyWaterIntake + 0.5}L on training days.`,
    "Start each morning with 500ml of water before coffee or breakfast — especially important in South Africa's warmer months.",
  ];

  if (data.activityLevel === "very-active" || data.daysPerWeek >= 5) {
    hydration.push(
      `With ${data.daysPerWeek} training days per week, add 500–750ml per session. Consider electrolytes during sessions longer than 45 minutes.`
    );
  }

  if (data.fitnessGoals.includes("lose-fat")) {
    hydration.push(
      "Proper hydration supports fat metabolism and can reduce false hunger signals — drink a glass of water before reaching for snacks."
    );
  }

  hydration.push(
    "Carry a bottle during your commute or at your desk. Pale yellow urine is a simple indicator you're on track."
  );

  const recovery: string[] = [];

  if (data.previousInjuries.toLowerCase() !== "none") {
    recovery.push(
      `Injury-aware recovery: given your history (${data.previousInjuries}), prioritise warm-ups and avoid pushing through pain. Ice or heat as appropriate post-session.`
    );
  }

  if (data.jointIssues.toLowerCase() !== "none") {
    recovery.push(
      `Joint care: with ${data.jointIssues}, include 5 minutes of joint mobility before every session and gentle movement on rest days.`
    );
  }

  if (data.weakMuscleGroups.toLowerCase() !== "none") {
    recovery.push(
      `Targeted recovery for weak areas (${data.weakMuscleGroups}): prioritise blood flow with light activation work on rest days — band pull-aparts, glute bridges, or wall slides.`
    );
  }

  if (data.stressLevel !== "low") {
    recovery.push(
      `You shared that ${data.motivationBarriers.slice(0, 80)}${data.motivationBarriers.length > 80 ? "…" : ""} has held you back before. Schedule one non-negotiable rest activity weekly — a walk, prayer, or time with family — to protect your mental recovery.`
    );
    recovery.push(
      "Practice 5 minutes of box breathing (4 sec in, 4 hold, 4 out) on high-stress days. Cortisol management directly impacts fat loss and muscle gain."
    );
  } else {
    recovery.push(
      "Use foam rolling on quads, lats, and upper back 2–3 times per week, especially after lower-body sessions."
    );
  }

  recovery.push(
    `Schedule ${7 - data.daysPerWeek} full rest day${7 - data.daysPerWeek === 1 ? "" : "s"} per week. Your plan runs ${data.daysPerWeek} days — honour the off days as part of the programme.`
  );

  recovery.push(
    `Eat protein within 2 hours of your ${trainingTimes} sessions. With a ${data.dietaryPreference.replace("-", " ")} diet and ${formatBudget(data.dailyFoodBudget)} daily budget, prep one meal ahead on training days.`
  );

  if (data.motivationMeaning.length > 20) {
    recovery.push(
      `Remember why you started: "${data.motivationMeaning.slice(0, 120)}${data.motivationMeaning.length > 120 ? "…" : ""}" — revisit this on tough days.`
    );
  }

  return { sleep, hydration, recovery };
}

function formatBudget(amount: number): string {
  return `R${amount}`;
}
