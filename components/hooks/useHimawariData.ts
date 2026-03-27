// components/hooks/useHimawariData.ts
"use client";

import { useState, useEffect } from 'react';

// 1. Kita buat tipe data mandiri khusus untuk Satelit
export interface HimawariFrame {
  timeUTC: string;
  label: string;
  dateLabel: string;
  url: string;
}

export function useHimawariData() {
  // 2. Gunakan tipe data mandiri tersebut di sini
  const [frames, setFrames] = useState<HimawariFrame[]>([]);
  const [latest, setLatest] = useState<HimawariFrame | null>(null);
  const [serverTime, setServerTime] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchSatelliteData = async () => {
    try {
      setIsLoading(true);
      
      // Ambil data dari API internal Next.js kita sendiri (Sangat aman dan tersembunyi)
      const response = await fetch(`/api/himawari/info?t=${Date.now()}`, { cache: 'no-store' });
      
      if (!response.ok) throw new Error("Gagal mengambil data dari API lokal");
      
      const data = await response.json();

      setFrames(data.frames);
      setLatest(data.latest);
      setServerTime(data.serverTimeUTC);
      setIsError(false);

    } catch (error) {
      console.error("Himawari Fetch Error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSatelliteData();
    
    // Auto Update setiap 5 menit
    const interval = setInterval(fetchSatelliteData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

 return { frames, latest, serverTime, isLoading, isError, refresh: fetchSatelliteData };
}