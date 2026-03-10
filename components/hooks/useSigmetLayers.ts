// components/hooks/useSigmetLayers.ts (atau path hook Anda)
import { useState, useEffect } from 'react';

export function useSigmetLayers() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // PERUBAHAN DI SINI: Panggil API Route lokal kita
        const res = await fetch("/api/sigmet"); 
        
        if (!res.ok) throw new Error("Gagal mengambil data dari proxy lokal");
        
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Gagal mengambil data SIGMET:", error);
      }
    };

    fetchData();

    // Update setiap 5 menit
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
}