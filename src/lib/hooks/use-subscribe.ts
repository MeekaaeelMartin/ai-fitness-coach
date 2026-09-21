"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

export function useSubscribe() {
  const subscribe = useAuthStore((state) => state.subscribe);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSubscribe = async () => {
    setLoading(true);
    setError(null);
    const result = await subscribe();
    if (!result.success && result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  return { startSubscribe, loading, error };
}
