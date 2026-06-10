import type { AssessmentData } from "@/lib/types/assessment";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";

const formatList = (items: string[]) =>
  items.length > 0 ? items.join(", ") : "Not specified";

export function buildAIPrompt(data: AssessmentData): string {
  const goals = data.fitnessGoals.map((g) => FITNESS_GOAL_LABELS[g]);

  return `You are an elite personal trainer and certified nutritionist. Create a comprehensive, personalized fitness and nutrition plan based on the following client profile.

## CLIENT PROFILE

### Personal Information
- Name: ${data.name}
- Age: ${data.age}
- Gender: ${data.gender}
- Height: ${data.height} cm
- Current Weight: ${data.weight} kg
- Target Weight: ${data.targetWeight} kg
- Weight Change Goal: ${(data.targetWeight - data.weight).toFixed(1)} kg

### Fitness Goals & Experience
- Primary Goals: ${formatList(goals)}
- Experience Level: ${data.fitnessExperience}
- Current Activity Level: ${data.activityLevel.replace("-", " ")}
- Gym/Equipment Access: ${data.gymAccess.replace("-", " ")}

### Training Schedule
- Days Available Per Week: ${data.daysPerWeek}
- Preferred Workout Duration: ${data.workoutDuration} minutes
- Preferred Training Times: ${formatList(data.preferredTrainingTimes.map((t) => t.replace("-", " ")))}

### Health Information
- Previous Injuries: ${data.previousInjuries}
- Joint Issues: ${data.jointIssues}
- Mobility Limitations: ${data.mobilityLimitations}
- Weak / Underdeveloped Muscle Groups: ${data.weakMuscleGroups}
- Other Health Considerations: ${data.otherHealthConsiderations}

### Nutrition Preferences
- Dietary Preference: ${data.dietaryPreference.replace("-", " ")}
- Allergies: ${data.allergies}
- Foods Disliked: ${data.foodsDisliked}
- Foods Enjoyed: ${data.foodsEnjoyed}
- Daily Food Budget: R${data.dailyFoodBudget} (South African Rand)
- Meals Per Day: ${data.mealsPerDay}

### Lifestyle
- Average Sleep: ${data.averageSleepHours} hours/night
- Daily Water Intake: ${data.dailyWaterIntake} liters
- Stress Level: ${data.stressLevel}

### Motivation & Mindset
- Why they want to achieve this goal: ${data.motivationWhy}
- What has stopped them previously: ${data.motivationBarriers}
- What achieving this goal means to them: ${data.motivationMeaning}

## REQUIRED OUTPUT

Generate a detailed plan with the following sections:

1. **Personal Assessment**
   - Summary of user profile
   - Strengths (3-5 points)
   - Weaknesses/areas for improvement (3-5 points)
   - Key focus areas (3-5 points)

2. **Fitness Plan**
   - Weekly workout schedule overview
   - Daily workouts with specific exercises, sets, reps, rest periods
   - Exercise explanations and form cues
   - Progressive overload recommendations

3. **Nutrition Plan**
   - Estimated daily calorie target
   - Macronutrient targets (protein, carbs, fats in grams)
   - Detailed meal plan with portion sizes
   - Alternative food options for each meal

4. **Lifestyle Recommendations**
   - Sleep optimization tips
   - Hydration guidelines
   - Recovery strategies

5. **Progress Tracking**
   - Weekly milestones for the first 4 weeks
   - Monthly targets for months 1-3
   - Adjustment recommendations based on progress

Ensure all recommendations account for injuries, equipment access, schedule constraints, dietary preferences, and budget. Be specific, actionable, and encouraging.`;
}
