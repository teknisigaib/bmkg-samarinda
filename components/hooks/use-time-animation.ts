import { useState, useEffect, useRef, useMemo } from "react";
import { getInitialDate } from "@/lib/bmkg/aviation-utils";

export function useTimeAnimation(intervalMinutes: number, durationMinutes: number, animationSpeedMs: number = 2500) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Generate Steps (Memoized)
  // Selalu hitung mundur dari "Waktu Sekarang" (InitialDate)
  const steps = useMemo(() => {
    const arr: Date[] = [];
    const now = getInitialDate();
    const startTime = new Date(now.getTime() - durationMinutes * 60000);
    
    let t = startTime;
    while (t <= now) {
      arr.push(new Date(t));
      t = new Date(t.getTime() + intervalMinutes * 60000);
    }
    return arr;
  }, [intervalMinutes, durationMinutes]);

  // Set default ke frame terakhir (terbaru) saat pertama load
  useEffect(() => {
    if (steps.length > 0) {
      setCurrentIndex(steps.length - 1);
    }
  }, [steps]);

  // Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= steps.length - 1) return 0; // Loop ke awal
          return prev + 1;
        });
      }, animationSpeedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length, animationSpeedMs]);

  const currentDate = steps[currentIndex];

  return {
    currentDate,
    currentIndex,
    steps,
    isPlaying,
    togglePlay: () => setIsPlaying(!isPlaying),
    seek: (index: number) => { setCurrentIndex(index); setIsPlaying(false); }, // Stop play saat user geser manual
    reset: () => { setCurrentIndex(steps.length - 1); setIsPlaying(false); }
  };
}