"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAssessmentStore } from "@/lib/store/assessment-store";

const AppReadyContext = createContext(false);

function storesHydrated() {
  return useAuthStore.persist.hasHydrated() && useAssessmentStore.persist.hasHydrated();
}

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const markReady = () => setReady(true);

    const check = () => {
      if (storesHydrated()) markReady();
    };

    check();

    const unsubAuth = useAuthStore.persist.onFinishHydration(check);
    const unsubAssessment = useAssessmentStore.persist.onFinishHydration(check);
    const timeout = window.setTimeout(markReady, 750);

    return () => {
      unsubAuth();
      unsubAssessment();
      window.clearTimeout(timeout);
    };
  }, []);

  return <AppReadyContext.Provider value={ready}>{children}</AppReadyContext.Provider>;
}

export function useAppHydrated() {
  return useContext(AppReadyContext);
}
