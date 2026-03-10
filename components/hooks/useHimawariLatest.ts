"use client";

import { useState, useEffect } from "react";

export function useHimawariLatest() {
  const [layerData, setLayerData] = useState<{ url: string; timeLabel: string } | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // 1. Tanya API Status Satelit
        // Tambahkan query t=Date.now() agar tidak kena cache browser
        const res = await fetch(`/api/satellite/status?t=${Date.now()}`);
        const status = await res.json();

        if (status.available && status.latest_time_code) {
          // 2. Susun URL
          const urlTemplate = `/api/tiles/satellite?z={z}&x={x}&y={y}&time=${status.latest_time_code}`;

          // 3. Format Waktu (WITA/WIB)
          const d = new Date(status.timestamp);
          const timeLabel = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " UTC";

          setLayerData({
            url: urlTemplate,
            timeLabel: timeLabel
          });
          setIsOffline(false);
        } else {
          setIsOffline(true);
        }
      } catch (e) {
        console.error("Himawari Layer Error:", e);
        setIsOffline(true);
      }
    };

    fetchLatest();
    // Cek update setiap 5 menit
    const interval = setInterval(fetchLatest, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { layerData, isOffline };
}