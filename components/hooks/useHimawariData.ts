// components/hooks/useHimawariData.ts
"use client";

import { useState, useEffect } from 'react';
import { TimeFrame } from './useTimeMachine'; // Pastikan path importnya sesuai

const BMKG_API_MODELRUN = "https://satellite.bmkg.go.id/api22/modelrun";

export function useHimawariData() {
  const [frames, setFrames] = useState<TimeFrame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchSatelliteData = async () => {
    try {
      setIsLoading(true);
      
      // 1. Ambil daftar waktu dari BMKG
      // Tambahkan timestamp untuk menghindari cache bawaan browser
      const response = await fetch(`${BMKG_API_MODELRUN}?t=${Date.now()}`, {
          cache: 'no-store' 
      });
      
      if (!response.ok) throw new Error("Gagal mengambil modelrun BMKG");
      
      const data = await response.json();
      const himawariDates: string[] = data.himawari9 || [];

      if (himawariDates.length === 0) {
          throw new Error("Data himawari kosong");
      }

      // 2. Olah Data untuk Time Machine
      // BMKG memberikan urutan: [Paling Baru -> Paling Lama]
      // Kita ambil 12 terbaru, lalu di REVERSE agar pemutar jalan maju: [Lama -> Baru]
      const recentDates = himawariDates.slice(0, 12).reverse();

      // 3. Ubah menjadi format TimeFrame
      const processedFrames: TimeFrame[] = recentDates.map((isoStr) => {
        const d = new Date(isoStr);
        
        // Buat Template URL Tile untuk jam ini
        const tileUrl = `https://satellite.bmkg.go.id/api22/tile/{z}/{x}/{y}.png?tiletype=himawari9&modelname=himawari9&param=EH&baserun=${isoStr}`;

        return {
          timestamp: d,
          label: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC',
          dateLabel: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'UTC' }),
          url: tileUrl
        };
      });

      setFrames(processedFrames);
      setIsError(false);

    } catch (error) {
      console.error("Error fetching BMKG Satellite API:", error);
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

  return { frames, isLoading, isError };
}