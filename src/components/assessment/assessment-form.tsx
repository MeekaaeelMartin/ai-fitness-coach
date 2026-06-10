"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useAssessmentStore } from "@/lib/store/assessment-store";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  assessmentSchema,
  type AssessmentFormData,
} from "@/lib/validation/assessment-schema";
import { defaultAssessmentData } from "@/lib/types/assessment";
import { FITNESS_GOAL_LABELS } from "@/lib/types/assessment";
import type { FitnessGoal, TrainingTime } from "@/lib/types/assessment";
import { generatePlan } from "@/lib/ai/generate-plan";
import { ProgressIndicator } from "./progress-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils/cn";

const TOTAL_STEPS = 6;

const STEP_TITLES = [
  "Personal Information",
  "Fitness Goals & Experience",
  "Schedule & Equipment",
  "Health Information",
  "Nutrition Preferences",
  "Lifestyle & Motivation",
];

const STEP_DESCRIPTIONS = [
  "Tell us about yourself so we can personalize your plan.",
  "What are you working toward and what's your training background?",
  "Help us design a plan that fits your schedule and equipment.",
  "We'll modify exercises based on your health history.",
  "Your meal plan will match your dietary needs and preferences.",
  "Understanding your motivation helps us keep you on track.",
];

export function AssessmentForm() {
  const router = useRouter();
  const {
    assessment,
    currentStep,
    setAssessment,
    setCurrentStep,
    setGeneratedPlan,
    setIsGenerating,
    isGenerating,
  } = useAssessmentStore();
  const { getCurrentUser, saveUserPlan } = useAuthStore();

  const [direction, setDirection] = useState(1);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      ...defaultAssessmentData,
      ...assessment,
      age: assessment.age || undefined,
      height: assessment.height || undefined,
      weight: assessment.weight || undefined,
      targetWeight: assessment.targetWeight || undefined,
    },
    mode: "onBlur",
  });

  const fitnessGoals = watch("fitnessGoals") || [];
  const trainingTimes = watch("preferredTrainingTimes") || [];

  const toggleGoal = (goal: FitnessGoal) => {
    const current = fitnessGoals;
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    setValue("fitnessGoals", updated, { shouldValidate: true });
  };

  const toggleTrainingTime = (time: TrainingTime) => {
    const current = trainingTimes;
    const updated = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time];
    setValue("preferredTrainingTimes", updated, { shouldValidate: true });
  };

  const stepFields: (keyof AssessmentFormData)[][] = [
    ["name", "age", "gender", "height", "weight", "targetWeight"],
    ["fitnessGoals", "fitnessExperience", "activityLevel", "gymAccess"],
    ["daysPerWeek", "workoutDuration", "preferredTrainingTimes"],
    [
      "previousInjuries",
      "jointIssues",
      "mobilityLimitations",
      "weakMuscleGroups",
      "otherHealthConsiderations",
    ],
    [
      "dietaryPreference",
      "allergies",
      "foodsDisliked",
      "foodsEnjoyed",
      "dailyFoodBudget",
      "mealsPerDay",
    ],
    [
      "averageSleepHours",
      "dailyWaterIntake",
      "stressLevel",
      "motivationWhy",
      "motivationBarriers",
      "motivationMeaning",
    ],
  ];

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const isValid = await trigger(fields);
    if (!isValid) return;

    const values = watch();
    setAssessment(values);

    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      setAssessment(watch());
    }
  };

  const onSubmit = async (data: AssessmentFormData) => {
    setAssessment(data);
    setIsGenerating(true);

    try {
      const plan = await generatePlan(data);
      setGeneratedPlan(plan);
      const user = getCurrentUser();
      if (user) {
        saveUserPlan(data, plan);
        router.push("/dashboard");
      } else {
        router.push("/signup?from=assessment");
      }
    } catch {
      setIsGenerating(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  if (isGenerating) {
    return (
      <GlassCard className="mx-auto max-w-lg text-center">
        <div className="py-12">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-400" />
          <h2 className="mt-6 text-xl font-semibold">
            Building Your Plan
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            We are putting together your workouts and meals based on your answers...
          </p>
          <div className="mx-auto mt-8 max-w-xs">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <GlassCard className="mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{STEP_TITLES[currentStep]}</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {STEP_DESCRIPTIONS[currentStep]}
          </p>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {currentStep === 0 && (
              <>
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Age"
                    type="number"
                    placeholder="25"
                    error={errors.age?.message}
                    {...register("age", { valueAsNumber: true })}
                  />
                  <Select
                    label="Gender"
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "non-binary", label: "Non-binary" },
                      { value: "prefer-not-to-say", label: "Prefer not to say" },
                    ]}
                    error={errors.gender?.message}
                    {...register("gender")}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Input
                    label="Height (cm)"
                    type="number"
                    placeholder="175"
                    error={errors.height?.message}
                    {...register("height", { valueAsNumber: true })}
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    placeholder="75"
                    error={errors.weight?.message}
                    {...register("weight", { valueAsNumber: true })}
                  />
                  <Input
                    label="Target Weight (kg)"
                    type="number"
                    placeholder="70"
                    error={errors.targetWeight?.message}
                    {...register("targetWeight", { valueAsNumber: true })}
                  />
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground/80">
                    Fitness Goals (select all that apply)
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      Object.entries(FITNESS_GOAL_LABELS) as [FitnessGoal, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleGoal(value)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                          fitnessGoals.includes(value)
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.fitnessGoals && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.fitnessGoals.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Fitness Experience"
                    options={[
                      { value: "beginner", label: "Beginner" },
                      { value: "intermediate", label: "Intermediate" },
                      { value: "advanced", label: "Advanced" },
                    ]}
                    error={errors.fitnessExperience?.message}
                    {...register("fitnessExperience")}
                  />
                  <Select
                    label="Current Activity Level"
                    options={[
                      { value: "sedentary", label: "Sedentary" },
                      { value: "lightly-active", label: "Lightly Active" },
                      { value: "moderately-active", label: "Moderately Active" },
                      { value: "very-active", label: "Very Active" },
                    ]}
                    error={errors.activityLevel?.message}
                    {...register("activityLevel")}
                  />
                </div>
                <Select
                  label="Gym / Equipment Access"
                  options={[
                    { value: "full-gym", label: "Full Gym" },
                    { value: "home-gym", label: "Home Gym" },
                    { value: "dumbbells-only", label: "Dumbbells Only" },
                    { value: "resistance-bands", label: "Resistance Bands" },
                    { value: "no-equipment", label: "No Equipment" },
                  ]}
                  error={errors.gymAccess?.message}
                  {...register("gymAccess")}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Days Available Per Week"
                    type="number"
                    min={1}
                    max={7}
                    error={errors.daysPerWeek?.message}
                    {...register("daysPerWeek", { valueAsNumber: true })}
                  />
                  <Input
                    label="Preferred Workout Duration (minutes)"
                    type="number"
                    min={20}
                    max={120}
                    error={errors.workoutDuration?.message}
                    {...register("workoutDuration", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground/80">
                    Preferred Training Times (select all that apply)
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ["early-morning", "Early Morning (5-7 AM)"],
                        ["morning", "Morning (7-11 AM)"],
                        ["afternoon", "Afternoon (12-5 PM)"],
                        ["evening", "Evening (5-9 PM)"],
                      ] as [TrainingTime, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleTrainingTime(value)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                          trainingTimes.includes(value)
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.preferredTrainingTimes && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.preferredTrainingTimes.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Textarea
                  label="Previous Injuries"
                  placeholder="Describe any previous injuries, or type 'None'"
                  error={errors.previousInjuries?.message}
                  {...register("previousInjuries")}
                />
                <Textarea
                  label="Joint Issues"
                  placeholder="Describe any joint issues, or type 'None'"
                  error={errors.jointIssues?.message}
                  {...register("jointIssues")}
                />
                <Textarea
                  label="Mobility Limitations"
                  placeholder="Describe any mobility limitations, or type 'None'"
                  error={errors.mobilityLimitations?.message}
                  {...register("mobilityLimitations")}
                />
                <Textarea
                  label="Weak or Underdeveloped Muscle Groups"
                  placeholder="e.g. Weak glutes, underdeveloped shoulders, lagging hamstrings. Or type 'None'"
                  error={errors.weakMuscleGroups?.message}
                  {...register("weakMuscleGroups")}
                />
                <Textarea
                  label="Other Health Considerations"
                  placeholder="Any other health conditions or considerations, or type 'None'"
                  error={errors.otherHealthConsiderations?.message}
                  {...register("otherHealthConsiderations")}
                />
              </>
            )}

            {currentStep === 4 && (
              <>
                <Select
                  label="Dietary Preference"
                  options={[
                    { value: "no-restriction", label: "No Restriction" },
                    { value: "vegetarian", label: "Vegetarian" },
                    { value: "vegan", label: "Vegan" },
                    { value: "pescatarian", label: "Pescatarian" },
                    { value: "keto", label: "Keto" },
                    { value: "paleo", label: "Paleo" },
                    { value: "mediterranean", label: "Mediterranean" },
                    { value: "halal", label: "Halal" },
                    { value: "kosher", label: "Kosher" },
                  ]}
                  error={errors.dietaryPreference?.message}
                  {...register("dietaryPreference")}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Textarea
                    label="Allergies"
                    placeholder="List any food allergies, or type 'None'"
                    error={errors.allergies?.message}
                    {...register("allergies")}
                  />
                  <Textarea
                    label="Foods You Dislike"
                    placeholder="Foods to avoid, or type 'None'"
                    error={errors.foodsDisliked?.message}
                    {...register("foodsDisliked")}
                  />
                </div>
                <Textarea
                  label="Foods You Enjoy"
                  placeholder="List your favorite foods and meals"
                  error={errors.foodsEnjoyed?.message}
                  {...register("foodsEnjoyed")}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Daily Food Budget (R)"
                    type="number"
                    min={30}
                    error={errors.dailyFoodBudget?.message}
                    {...register("dailyFoodBudget", { valueAsNumber: true })}
                  />
                  <Input
                    label="Number of Meals Per Day"
                    type="number"
                    min={2}
                    max={6}
                    error={errors.mealsPerDay?.message}
                    {...register("mealsPerDay", { valueAsNumber: true })}
                  />
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Input
                    label="Average Sleep (hours)"
                    type="number"
                    step="0.5"
                    min={4}
                    max={12}
                    error={errors.averageSleepHours?.message}
                    {...register("averageSleepHours", { valueAsNumber: true })}
                  />
                  <Input
                    label="Daily Water Intake (liters)"
                    type="number"
                    step="0.5"
                    min={1}
                    max={6}
                    error={errors.dailyWaterIntake?.message}
                    {...register("dailyWaterIntake", { valueAsNumber: true })}
                  />
                  <Select
                    label="Stress Level"
                    options={[
                      { value: "low", label: "Low" },
                      { value: "moderate", label: "Moderate" },
                      { value: "high", label: "High" },
                      { value: "very-high", label: "Very High" },
                    ]}
                    error={errors.stressLevel?.message}
                    {...register("stressLevel")}
                  />
                </div>
                <Textarea
                  label="Why do you want to achieve this goal?"
                  placeholder="Share your motivation and what drives you..."
                  error={errors.motivationWhy?.message}
                  {...register("motivationWhy")}
                />
                <Textarea
                  label="What has stopped you from succeeding previously?"
                  placeholder="Be honest about past challenges..."
                  error={errors.motivationBarriers?.message}
                  {...register("motivationBarriers")}
                />
                <Textarea
                  label="What would achieving this goal mean to you?"
                  placeholder="Describe the impact on your life..."
                  error={errors.motivationMeaning?.message}
                  {...register("motivationMeaning")}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(currentStep === 0 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < TOTAL_STEPS - 1 ? (
            <Button type="button" onClick={handleNext}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit">
              Generate My Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </GlassCard>
    </form>
  );
}
