import type { Exercise } from "@/lib/types/plan";

interface ExerciseTemplate extends Exercise {
  avoidKeywords?: string[];
}

const STRENGTH_EXERCISES: ExerciseTemplate[] = [
  {
    name: "Barbell Squat",
    alternatives: ["Goblet Squat", "Leg Press", "Box Squat", "Wall Sit"],
    sets: 4,
    reps: "8-10",
    rest: "90-120 sec",
    explanation: "Drive through your heels, keep chest up, and maintain a neutral spine.",
    avoidKeywords: ["knee", "back", "spine"],
  },
  {
    name: "Romanian Deadlift",
    alternatives: ["Hip Thrust", "Glute Bridge", "Cable Pull-Through", "Single-Leg RDL"],
    sets: 3,
    reps: "10-12",
    rest: "90 sec",
    explanation: "Hinge at the hips with a slight knee bend. Feel the stretch in hamstrings.",
    avoidKeywords: ["back", "spine", "disc", "deadlift", "lower back"],
  },
  {
    name: "Bench Press",
    alternatives: ["Dumbbell Bench Press", "Push-ups", "Machine Chest Press", "Floor Press"],
    sets: 4,
    reps: "8-10",
    rest: "90 sec",
    explanation: "Retract shoulder blades, lower with control, press explosively.",
    avoidKeywords: ["shoulder", "chest injury"],
  },
  {
    name: "Dumbbell Row",
    alternatives: ["Cable Row", "Resistance Band Row", "Chest-Supported Row", "Inverted Row"],
    sets: 3,
    reps: "10-12 each",
    rest: "60 sec",
    explanation: "Pull elbow back toward hip, squeeze shoulder blade at the top.",
    avoidKeywords: ["lower back"],
  },
  {
    name: "Overhead Press",
    alternatives: ["Landmine Press", "Arnold Press", "Pike Push-ups", "Seated Dumbbell Press"],
    sets: 3,
    reps: "8-10",
    rest: "90 sec",
    explanation: "Brace core, press vertically without arching your lower back.",
    avoidKeywords: ["shoulder", "rotator"],
  },
  {
    name: "Lat Pulldown",
    alternatives: ["Assisted Pull-ups", "Band Pulldown", "Dumbbell Pullover", "Inverted Row"],
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    explanation: "Pull elbows down and back, squeeze lats at the bottom.",
    avoidKeywords: [],
  },
];

const CONDITIONING_EXERCISES: ExerciseTemplate[] = [
  {
    name: "Bodyweight Squats",
    alternatives: ["Chair Squats", "Box Squats", "Goblet Squat", "Step-ups"],
    sets: 3,
    reps: "15-20",
    rest: "45 sec",
    explanation: "Keep knees tracking over toes, thighs parallel to floor.",
    avoidKeywords: ["knee"],
  },
  {
    name: "Walking Lunges",
    alternatives: ["Stationary Lunges", "Step-ups", "Reverse Lunges", "Bulgarian Split Squat"],
    sets: 3,
    reps: "12 each leg",
    rest: "60 sec",
    explanation: "Long stride, drop back knee toward floor, drive through front heel.",
    avoidKeywords: ["knee"],
  },
  {
    name: "Push-ups",
    alternatives: ["Incline Push-ups", "Knee Push-ups", "Dumbbell Press", "Band Chest Press"],
    sets: 3,
    reps: "12-15",
    rest: "45 sec",
    explanation: "Straight line from head to heels. Lower with control.",
    avoidKeywords: ["shoulder", "wrist"],
  },
  {
    name: "Plank Hold",
    alternatives: ["Dead Bug", "Bird Dog", "Side Plank", "Wall Plank"],
    sets: 3,
    reps: "30-45 sec",
    rest: "30 sec",
    explanation: "Brace core, squeeze glutes, keep hips level.",
    avoidKeywords: [],
  },
];

function shouldAvoid(exercise: ExerciseTemplate, constraints: string): boolean {
  if (!exercise.avoidKeywords?.length) return false;
  const lower = constraints.toLowerCase();
  return exercise.avoidKeywords.some((kw) => lower.includes(kw));
}

function pickExercise(template: ExerciseTemplate, constraints: string): Exercise {
  if (!shouldAvoid(template, constraints)) {
    return {
      name: template.name,
      alternatives: template.alternatives,
      sets: template.sets,
      reps: template.reps,
      rest: template.rest,
      explanation: template.explanation,
    };
  }
  const alt = template.alternatives[0] ?? template.name;
  return {
    name: alt,
    alternatives: [template.name, ...template.alternatives.filter((a) => a !== alt)],
    sets: template.sets,
    reps: template.reps,
    rest: template.rest,
    explanation: `${template.explanation} (Swapped from ${template.name} based on your profile.)`,
  };
}

export function getExercisesForPlan(
  gymAccess: string,
  focus: string,
  data: { previousInjuries: string; jointIssues: string; mobilityLimitations: string; weakMuscleGroups: string }
): Exercise[] {
  const constraints = [
    data.previousInjuries,
    data.jointIssues,
    data.mobilityLimitations,
    data.weakMuscleGroups,
  ].join(" ");

  const isStrength = focus.includes("Strength") || focus.includes("Hypertrophy");
  const pool = isStrength ? STRENGTH_EXERCISES : CONDITIONING_EXERCISES;

  const hasBarbell = gymAccess === "full-gym" || gymAccess === "home-gym";
  const hasDumbbells =
    gymAccess === "full-gym" || gymAccess === "home-gym" || gymAccess === "dumbbells-only";

  let exercises = pool.slice(0, 4).map((t) => pickExercise(t, constraints));

  if (!hasBarbell) {
    exercises = exercises.map((e) => {
      if (e.name.includes("Barbell")) {
        const alt = e.alternatives[0];
        return { ...e, name: alt, alternatives: [e.name, ...e.alternatives.slice(1)] };
      }
      return e;
    });
  }

  if (!hasDumbbells && gymAccess === "resistance-bands") {
    exercises = exercises.map((e) => {
      if (e.name.includes("Dumbbell")) {
        const bandAlt = e.alternatives.find((a) => a.includes("Band") || a.includes("Push")) ?? e.alternatives[0];
        return { ...e, name: bandAlt, alternatives: [e.name, ...e.alternatives] };
      }
      return e;
    });
  }

  return exercises;
}
