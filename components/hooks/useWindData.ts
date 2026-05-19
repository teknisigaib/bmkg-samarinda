"use client";

import { useState, useCallback } from "react";

export function useWindData() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [windTime, setWindTime] = useState<string | null>(null);

  const fetchWind = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/wind');
      if (!res.ok) throw new Error("Gagal fetch angin");
      const result = await res.json();
      setData(result);
      
      // Ambil waktu referensi dari data ECMWF
      if (result && result.length > 0 && result[0].header) {
        const refTime = result[0].header.refTime;
        const timeString = new Date(refTime).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }) + " WITA";
        setWindTime(timeString);
      }
    } catch (err) {
      console.error("Error fetching Wind data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { windData: data, isLoadingWind: isLoading, windTime, fetchWind };
}