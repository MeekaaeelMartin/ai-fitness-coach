"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAssessmentStore } from "@/lib/store/assessment-store";

function storesHydrated() {
  return useAuthStore.persist.hasHydrated() && useAssessmentStore.persist.hasHydrated();
}

export function useAppHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (storesHydrated()) {
      setHydrated(true);
      return;
    }

    const onHydrated = () => {
      if (storesHydrated()) setHydrated(true);
    };

    const unsubAuth = useAuthStore.persist.onFinishHydration(onHydrated);
    const unsubAssessment = useAssessmentStore.persist.onFinishHydration(onHydrated);

    return () => {
      unsubAuth();
      unsubAssessment();
    };
  }, []);

  return hydrated;
}
