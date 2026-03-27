// components/hooks/useTimeMachine.ts
import { useState, useEffect, useRef } from 'react';

// Struktur standar untuk TimeFrame Universal (TANPA url gambar!)
export interface UniversalTimeFrame {
  timeUTC: string;     // Format ISO murni untuk pencocokan data (Cth: "2026-03-24T10:20:00.000Z")
  timestamp: Date;     // Objek Date Javascript
  label: string;       // Untuk UI: "10:20 UTC"
  dateLabel: string;   // Untuk UI: "24 Mar"
}

const ANIMATION_SPEED = 2000; // Kecepatan putar antar frame (2 detik)
const HISTORY_STEPS = 12;     // Berapa langkah ke belakang? (12 langkah = 2 jam)
const STEP_MINUTES = 10;      // Interval antar langkah (10 menit)

export function useTimeMachine(serverTimeUTC: string | null) {
  const [frames, setFrames] = useState<UniversalTimeFrame[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLiveRef = useRef<boolean>(true); 

  // 1. GENERATOR JAM UNIVERSAL (Berjalan otomatis jika serverTime masuk)
  useEffect(() => {
    if (!serverTimeUTC) return;

    const serverDate = new Date(serverTimeUTC);
    
    // BULATKAN KE BAWAH (Ke 10 Menit Terdekat)
    const minutes = Math.floor(serverDate.getUTCMinutes() / STEP_MINUTES) * STEP_MINUTES;
    serverDate.setUTCMinutes(minutes, 0, 0);

    const newFrames: UniversalTimeFrame[] = [];
    
    // Cetak Rel Waktu dari masa lalu (kiri) ke masa sekarang (kanan)
    for (let i = HISTORY_STEPS; i >= 0; i--) {
      const frameTime = new Date(serverDate.getTime() - i * STEP_MINUTES * 60000);
      
      newFrames.push({
        timeUTC: frameTime.toISOString(),
        timestamp: frameTime,
        label: frameTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC',
        dateLabel: frameTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'UTC' })
      });
    }

    setFrames(newFrames);
    
    // Jika user sedang manteng di posisi LIVE, geser otomatis ke frame ujung kanan yang baru
    if (isLiveRef.current) {
      setCurrentIndex(newFrames.length - 1);
    }
  }, [serverTimeUTC]);

  // 2. ANIMATION ENGINE (Jantung Pemutar)
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      isLiveRef.current = false; 
      
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);      // Stop otomatis di akhir
            isLiveRef.current = true; // Set status Live
            return prev;              
          }
          return prev + 1;
        });
      }, ANIMATION_SPEED);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, frames.length]); 

  // 3. KONTROL PLAYER
  const togglePlay = () => {
    if (!isPlaying && currentIndex === frames.length - 1 && frames.length > 0) {
      setCurrentIndex(0); // Ulangi dari 0 jika ditekan saat di ujung
    }
    setIsPlaying(!isPlaying);
  };
  
  const jumpToLive = () => {
    setIsPlaying(false);
    if (frames.length > 0) {
        setCurrentIndex(frames.length - 1);
    }
    isLiveRef.current = true; 
  };

  const setIndex = (index: number) => {
    setIsPlaying(false);
    setCurrentIndex(index);
    isLiveRef.current = (index === frames.length - 1);
  };

  return {
    frames,
    currentIndex,
    currentFrame: frames[currentIndex] || null, 
    isPlaying,
    togglePlay,
    jumpToLive,
    setIndex
  };
}