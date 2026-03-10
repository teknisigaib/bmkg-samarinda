"use client";

import { useState, useEffect } from "react";

export function useRadarLatest() {
  const [layerData, setLayerData] = useState<{ url: string; timeLabel: string } | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // 1. Tanya API Status Radar
        const res = await fetch(`/api/radar/status?t=${Date.now()}`);
        const status = await res.json();

        if (status.available && status.latest_time_code) {
          // 2. Susun URL
          // Kita tambahkan cache buster &t=... di URL tile juga untuk memaksa refresh gambar
          const cacheBuster = Date.now();
          const urlTemplate = `/api/tiles/radar?z={z}&x={x}&y={y}&time=${status.latest_time_code}&t=${cacheBuster}`;

          // 3. Format Waktu
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
        console.error("Radar Layer Error:", e);
        setIsOffline(true);
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { layerData, isOffline };
}