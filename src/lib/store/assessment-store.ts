import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage/safe-storage";
import { normalizePlan } from "@/lib/utils/normalize-plan";
import type { AssessmentData } from "@/lib/types/assessment";
import { defaultAssessmentData } from "@/lib/types/assessment";
import type { GeneratedPlan } from "@/lib/types/plan";

interface AssessmentStore {
  assessment: AssessmentData;
  currentStep: number;
  generatedPlan: GeneratedPlan | null;
  isGenerating: boolean;
  setAssessment: (data: Partial<AssessmentData>) => void;
  setCurrentStep: (step: number) => void;
  setGeneratedPlan: (plan: GeneratedPlan | null) => void;
  setIsGenerating: (value: boolean) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      assessment: defaultAssessmentData,
      currentStep: 0,
      generatedPlan: null,
      isGenerating: false,
      setAssessment: (data) =>
        set((state) => ({
          assessment: { ...state.assessment, ...data },
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      setGeneratedPlan: (plan) => set({ generatedPlan: plan }),
      setIsGenerating: (value) => set({ isGenerating: value }),
      resetAssessment: () =>
        set({
          assessment: defaultAssessmentData,
          currentStep: 0,
          generatedPlan: null,
          isGenerating: false,
        }),
    }),
    {
      name: "ai-fitness-coach-storage",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        assessment: state.assessment,
        currentStep: state.currentStep,
        generatedPlan: state.generatedPlan,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<typeof current>;
        return {
          ...current,
          ...saved,
          isGenerating: false,
          generatedPlan: saved.generatedPlan ? normalizePlan(saved.generatedPlan) : null,
        };
      },
    }
  )
);
