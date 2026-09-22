import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExerciseDetail } from "@/components/exercises/exercise-detail";
import {
  getAllExerciseGuides,
  getExerciseBySlug,
  resolveExerciseGuide,
} from "@/lib/exercises/catalog";

interface ExercisePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateStaticParams() {
  return getAllExerciseGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: ExercisePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getExerciseBySlug(slug) ?? resolveExerciseGuide(slug.replace(/-/g, " "));
  return {
    title: guide.name,
    description: guide.summary,
    robots: { index: false, follow: false },
  };
}

export default async function ExercisePage({ params, searchParams }: ExercisePageProps) {
  const { slug } = await params;
  const { from } = await searchParams;

  const known = getExerciseBySlug(slug);
  if (!known && !slug) notFound();

  const guide = known ?? resolveExerciseGuide(slug.replace(/-/g, " "));
  const backHref = from === "dashboard" || !from ? "/dashboard" : from.startsWith("/") ? from : "/dashboard";

  return <ExerciseDetail guide={guide} backHref={backHref} />;
}
