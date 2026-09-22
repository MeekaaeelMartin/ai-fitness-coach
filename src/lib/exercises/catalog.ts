import catalogData from "./catalog-data.json";

export interface ExerciseGuide {
  name: string;
  slug: string;
  imageId: string;
  imageFile: string;
  equipment: string;
  level: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  summary: string;
  steps: string[];
  tips: string[];
}

const exercises = catalogData.exercises as ExerciseGuide[];

const bySlug = new Map(exercises.map((e) => [e.slug, e]));
const byName = new Map(exercises.map((e) => [normalizeName(e.name), e]));

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/['’]/g, "");
}

export function slugifyExerciseName(name: string): string {
  return normalizeName(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getExerciseBySlug(slug: string): ExerciseGuide | undefined {
  return bySlug.get(slug);
}

export function getExerciseByName(name: string): ExerciseGuide | undefined {
  const normalized = normalizeName(name);
  return byName.get(normalized) ?? bySlug.get(slugifyExerciseName(name));
}

export function getExerciseImageSrc(guide: ExerciseGuide): string {
  return `/exercises/${guide.imageFile}`;
}

export function getAllExerciseGuides(): ExerciseGuide[] {
  return exercises;
}

/** Fallback guide when an exercise name is not in the curated catalog. */
export function buildFallbackGuide(name: string): ExerciseGuide {
  const slug = slugifyExerciseName(name);
  return {
    name,
    slug,
    imageId: "",
    imageFile: "",
    equipment: "varies",
    level: "beginner",
    category: "strength",
    primaryMuscles: [],
    secondaryMuscles: [],
    summary: `${name} is part of your personalised plan. Use controlled form, a pain-free range of motion, and stop if you feel sharp joint pain.`,
    steps: [
      `Set up in a stable stance for ${name}.`,
      "Brace your core and move through the prescribed range with control.",
      "Pause briefly in the hardest position, then return to the start.",
      "Complete all sets and reps listed in your plan, resting as prescribed.",
    ],
    tips: [
      "Watch your joints — mild muscle effort is fine, sharp pain is not.",
      "Reduce load or range if form breaks down.",
      "Ask a coach if you are unsure about technique.",
    ],
  };
}

export function resolveExerciseGuide(name: string): ExerciseGuide {
  return getExerciseByName(name) ?? buildFallbackGuide(name);
}
