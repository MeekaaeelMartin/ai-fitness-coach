import type { GeneratedPlan } from "@/lib/types/plan";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import { formatZAR } from "@/lib/utils/currency";
import { formatDateZA } from "@/lib/utils/date";

export function planToMarkdown(plan: GeneratedPlan): string {
  const { userProfile: p } = plan;
  const goals = p.fitnessGoals.map((g) => FITNESS_GOAL_LABELS[g]).join(", ");

  let md = `# ${p.name}'s Fitness Plan\n\n`;
  md += `*Generated ${formatDateZA(new Date(plan.createdAt))} · South Africa*\n\n`;
  md += `---\n\n`;

  md += `## Profile\n`;
  md += `- **Goals:** ${goals}\n`;
  md += `- **Experience:** ${p.fitnessExperience}\n`;
  md += `- **Schedule:** ${p.daysPerWeek} days/week, ${p.workoutDuration} min\n`;
  md += `- **Daily food budget:** ${formatZAR(p.dailyFoodBudget)}\n\n`;

  md += `## Personal Assessment\n\n${plan.personalAssessment.summary}\n\n`;
  md += `### Strengths\n`;
  plan.personalAssessment.strengths.forEach((s) => (md += `- ${s}\n`));
  md += `\n### Key Focus Areas\n`;
  plan.personalAssessment.keyFocusAreas.forEach((s) => (md += `- ${s}\n`));

  md += `\n## Fitness Plan\n\n${plan.fitnessPlan.weeklySchedule}\n\n`;
  plan.fitnessPlan.dailyWorkouts.forEach((w) => {
    md += `### ${w.day}: ${w.focus} (${w.duration})\n\n`;
    w.exercises.forEach((e) => {
      md += `- **${e.name}**: ${e.sets}×${e.reps}, rest ${e.rest}\n`;
      md += `  ${e.explanation}\n`;
    });
    md += `\n`;
  });

  md += `## Nutrition Plan\n\n`;
  md += `**Daily target:** ${plan.nutritionPlan.calorieTarget} kcal\n`;
  md += `**Macros:** P ${plan.nutritionPlan.macros.protein}g · C ${plan.nutritionPlan.macros.carbs}g · F ${plan.nutritionPlan.macros.fats}g\n\n`;
  plan.nutritionPlan.meals.forEach((m) => {
    md += `### ${m.name} (${m.calories} kcal)\n`;
    md += `${m.foods.join(", ")}\n`;
    md += `*Portions: ${m.portionSizes}*\n`;
    md += `*Alternatives: ${m.alternatives.join(", ")}*\n\n`;
  });

  md += `## Progress Milestones\n\n`;
  plan.progressTracking.weeklyMilestones.forEach((m) => (md += `- ${m}\n`));

  md += `\n---\n*Not medical advice. Consult a physician before starting any fitness program.*\n`;
  return md;
}

export function planToICS(plan: GeneratedPlan): string {
  const uid = plan.id;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//AI Fitness Coach//EN\r\nCALSCALE:GREGORIAN\r\n`;

  plan.fitnessPlan.dailyWorkouts.forEach((workout, index) => {
    const dayMap: Record<string, number> = {
      Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4,
      Friday: 5, Saturday: 6, Sunday: 0,
    };
    const targetDay = dayMap[workout.day] ?? index;
    const start = new Date();
    const currentDay = start.getDay();
    const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
    start.setDate(start.getDate() + daysUntil);
    start.setHours(7, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + parseInt(workout.duration) || 45);

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const exercises = workout.exercises.map((e) => `${e.name} ${e.sets}x${e.reps}`).join(", ");

    ics += `BEGIN:VEVENT\r\n`;
    ics += `UID:${uid}-${workout.day}@aifitnesscoach.co.za\r\n`;
    ics += `DTSTAMP:${now}\r\n`;
    ics += `DTSTART:${fmt(start)}\r\n`;
    ics += `DTEND:${fmt(end)}\r\n`;
    ics += `SUMMARY:${workout.focus} Workout\r\n`;
    ics += `DESCRIPTION:${exercises}\r\n`;
    ics += `RRULE:FREQ=WEEKLY\r\n`;
    ics += `END:VEVENT\r\n`;
  });

  ics += `END:VCALENDAR\r\n`;
  return ics;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function planToPdfHtml(plan: GeneratedPlan): string {
  const { userProfile: p } = plan;
  const goals = p.fitnessGoals.map((g) => FITNESS_GOAL_LABELS[g]).join(", ");

  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
  <meta charset="UTF-8" />
  <title>${p.name}'s Fitness Plan</title>
  <style>
    @page { margin: 2cm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #0f1419; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px 32px; }
    .header { border-bottom: 3px solid #10b981; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 13px; font-weight: 700; color: #10b981; letter-spacing: 0.05em; text-transform: uppercase; }
    h1 { font-size: 28px; margin: 8px 0 4px; color: #0f1419; }
    .meta { color: #64748b; font-size: 14px; }
    h2 { font-size: 18px; color: #047857; margin: 32px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #d1fae5; }
    h3 { font-size: 15px; color: #065f46; margin: 20px 0 8px; }
    .card { background: #f0fdf4; border-radius: 10px; padding: 16px 20px; margin-bottom: 12px; }
    .exercise { border-left: 3px solid #10b981; padding: 10px 16px; margin-bottom: 10px; background: #f8faf9; border-radius: 0 8px 8px 0; }
    .exercise strong { color: #047857; }
    .exercise .sets { color: #64748b; font-size: 13px; }
    .meal { background: #f0fdf4; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; }
    .meal-header { display: flex; justify-content: space-between; font-weight: 600; color: #047857; margin-bottom: 6px; }
    .macros { display: flex; gap: 16px; background: #ecfdf5; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .macro { text-align: center; flex: 1; }
    .macro-value { font-size: 22px; font-weight: 700; color: #10b981; }
    .macro-label { font-size: 12px; color: #64748b; }
    ul { padding-left: 20px; }
    li { margin-bottom: 4px; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
    .badge { display: inline-block; background: #d1fae5; color: #047857; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AI Fitness Coach · South Africa</div>
    <h1>${p.name}'s Personalised Plan</h1>
    <p class="meta">Generated ${formatDateZA(new Date(plan.createdAt))} · Tailored for your goals, schedule &amp; budget</p>
  </div>

  <h2>Profile Summary</h2>
  <div class="card">
    <p><strong>Goals:</strong> ${goals}</p>
    <p><strong>Experience:</strong> ${p.fitnessExperience} · <strong>Activity:</strong> ${p.activityLevel.replace(/-/g, " ")}</p>
    <p><strong>Schedule:</strong> ${p.daysPerWeek} days/week · ${p.workoutDuration} min sessions</p>
    <p><strong>Daily food budget:</strong> ${formatZAR(p.dailyFoodBudget)}</p>
  </div>

  <h2>Personal Assessment</h2>
  <p>${plan.personalAssessment.summary}</p>
  <h3>Strengths</h3>
  <ul>${plan.personalAssessment.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
  <h3>Key Focus Areas</h3>
  <ul>${plan.personalAssessment.keyFocusAreas.map((s) => `<li>${s}</li>`).join("")}</ul>

  <h2>Fitness Plan</h2>
  <p>${plan.fitnessPlan.weeklySchedule}</p>
  ${plan.fitnessPlan.dailyWorkouts.map((w) => `
    <h3>${w.day}: <span class="badge">${w.focus}</span> · ${w.duration}</h3>
    ${w.exercises.map((e) => `
      <div class="exercise">
        <strong>${e.name}</strong>
        <span class="sets"> · ${e.sets} sets × ${e.reps} · Rest ${e.rest}</span>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${e.explanation}</p>
      </div>
    `).join("")}
  `).join("")}

  <h2>Nutrition Plan</h2>
  <div class="macros">
    <div class="macro"><div class="macro-value">${plan.nutritionPlan.calorieTarget}</div><div class="macro-label">kcal/day</div></div>
    <div class="macro"><div class="macro-value">${plan.nutritionPlan.macros.protein}g</div><div class="macro-label">Protein</div></div>
    <div class="macro"><div class="macro-value">${plan.nutritionPlan.macros.carbs}g</div><div class="macro-label">Carbs</div></div>
    <div class="macro"><div class="macro-value">${plan.nutritionPlan.macros.fats}g</div><div class="macro-label">Fats</div></div>
  </div>
  ${plan.nutritionPlan.meals.map((m) => `
    <div class="meal">
      <div class="meal-header"><span>${m.name}</span><span>${m.calories} kcal</span></div>
      <p style="margin:0;font-size:14px;">${m.foods.join(" · ")}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#64748b;">Portions: ${m.portionSizes}</p>
    </div>
  `).join("")}

  <h2>Weekly Milestones</h2>
  <ul>${plan.progressTracking.weeklyMilestones.map((m) => `<li>${m}</li>`).join("")}</ul>

  <div class="footer">
    AI Fitness Coach · aifitnesscoach.co.za · Not medical advice. Consult your physician before starting any fitness programme.
  </div>
</body>
</html>`;
}
