"use client";

import { useState, useCallback } from "react";

export function useNowcastData() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNowcast = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/nowcast');
      if (!res.ok) throw new Error("Gagal fetch nowcast");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching Nowcasting:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { nowcastData: data, isLoadingWarning: isLoading, fetchNowcast };
}