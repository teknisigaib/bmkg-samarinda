"use client";

import { useState, useCallback } from "react";
import { HotspotData } from "@/lib/data-karhutla";

export function useHotspotData() {
  const [data, setData] = useState<HotspotData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHotspot = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hotspots');
      if (!res.ok) throw new Error("Gagal fetch hotspot");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching Hotspot:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { hotspotData: data, isLoadingHotspot: isLoading, fetchHotspot };
}