"use client";

import { Download } from "lucide-react";
import type { GeneratedPlan } from "@/lib/types/plan";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import { Button } from "@/components/ui/button";

interface DownloadPDFButtonProps {
  plan: GeneratedPlan;
}

export function DownloadPDFButton({ plan }: DownloadPDFButtonProps) {
  const handleDownload = () => {
    const { userProfile: p } = plan;
    const goals = p.fitnessGoals.map((g) => FITNESS_GOAL_LABELS[g]).join(", ");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AI Fitness Coach - ${p.name}'s Plan</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a1a; line-height: 1.6; }
          h1 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px; }
          h2 { color: #047857; margin-top: 30px; }
          h3 { color: #065f46; }
          .section { margin-bottom: 24px; }
          .meta { color: #666; font-size: 14px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 4px; }
          .meal { background: #f0fdf4; padding: 12px; border-radius: 8px; margin-bottom: 12px; }
          .exercise { border-left: 3px solid #059669; padding-left: 12px; margin-bottom: 12px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>AI Fitness Coach - Personalized Plan</h1>
        <p class="meta">Generated for ${p.name} on ${new Date(plan.createdAt).toLocaleDateString()}</p>

        <div class="section">
          <h2>Profile Summary</h2>
          <p><strong>Goals:</strong> ${goals}</p>
          <p><strong>Experience:</strong> ${p.fitnessExperience} | <strong>Activity:</strong> ${p.activityLevel}</p>
          <p><strong>Schedule:</strong> ${p.daysPerWeek} days/week, ${p.workoutDuration} min sessions</p>
        </div>

        <div class="section">
          <h2>Personal Assessment</h2>
          <p>${plan.personalAssessment.summary}</p>
          <h3>Strengths</h3>
          <ul>${plan.personalAssessment.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
          <h3>Key Focus Areas</h3>
          <ul>${plan.personalAssessment.keyFocusAreas.map((s) => `<li>${s}</li>`).join("")}</ul>
        </div>

        <div class="section">
          <h2>Fitness Plan</h2>
          <p>${plan.fitnessPlan.weeklySchedule}</p>
          ${plan.fitnessPlan.dailyWorkouts
            .map(
              (w) => `
            <h3>${w.day} - ${w.focus}</h3>
            ${w.exercises
              .map(
                (e) => `
              <div class="exercise">
                <strong>${e.name}</strong> - ${e.sets} sets x ${e.reps} | Rest: ${e.rest}<br>
                <em>${e.explanation}</em>
              </div>
            `
              )
              .join("")}
          `
            )
            .join("")}
        </div>

        <div class="section">
          <h2>Nutrition Plan</h2>
          <p><strong>Daily Calories:</strong> ${plan.nutritionPlan.calorieTarget} kcal</p>
          <p><strong>Macros:</strong> Protein ${plan.nutritionPlan.macros.protein}g | Carbs ${plan.nutritionPlan.macros.carbs}g | Fats ${plan.nutritionPlan.macros.fats}g</p>
          ${plan.nutritionPlan.meals
            .map(
              (m) => `
            <div class="meal">
              <h3>${m.name} (${m.calories} kcal)</h3>
              <p>${m.foods.join(", ")}</p>
              <p><em>Portions: ${m.portionSizes}</em></p>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section">
          <h2>Progress Tracking</h2>
          <h3>Weekly Milestones</h3>
          <ul>${plan.progressTracking.weeklyMilestones.map((m) => `<li>${m}</li>`).join("")}</ul>
        </div>

        <p class="meta" style="margin-top: 40px;">Not medical advice. Consult a physician before starting any fitness program.</p>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="h-4 w-4" />
      Download Plan PDF
    </Button>
  );
}
