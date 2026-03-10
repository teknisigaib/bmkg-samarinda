import { useState, useEffect, useRef, useCallback } from 'react';

const DATA_INTERVAL_MINUTES = 10;
const HISTORY_LENGTH = 12; 
const ANIMATION_SPEED = 2000;

export interface TimeFrame {
  timestamp: Date;
  label: string;
  dateLabel: string;
  urlParam: string;
}

function formatTimeCode(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}${month}${day}${hour}${min}`;
}

export function useTimeMachine() {
  const [frames, setFrames] = useState<TimeFrame[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLiveRef = useRef<boolean>(true);

  // 1. GENERATE FRAMES (UTC LABEL)
  const generateFrames = useCallback((anchorTimestamp: number) => {
    const arr: TimeFrame[] = [];
    const anchorDate = new Date(anchorTimestamp);
    
    for (let i = HISTORY_LENGTH - 1; i >= 0; i--) {
      const d = new Date(anchorDate);
      d.setMinutes(anchorDate.getMinutes() - (i * DATA_INTERVAL_MINUTES));
      
      arr.push({
        timestamp: d,
        // --- UBAH KE UTC DI SINI ---
        label: d.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'UTC' 
        }) + ' UTC', 
        
        dateLabel: d.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            timeZone: 'UTC' 
        }),
        urlParam: formatTimeCode(d)
      });
    }
    return arr;
  }, []);

  // 2. FETCH & SYNC
  const refreshPlaylist = useCallback(async () => {
      try {
          // Tambahkan timestamp query agar browser tidak men-cache request JSON ini
          const res = await fetch(`/api/satellite/status?t=${Date.now()}`);
          const data = await res.json();

          if (data.available && data.timestamp) {
              const newFrames = generateFrames(data.timestamp);
              
              setFrames(prevFrames => {
                  const prevLast = prevFrames.length > 0 ? prevFrames[prevFrames.length - 1].urlParam : '';
                  const newLast = newFrames.length > 0 ? newFrames[newFrames.length - 1].urlParam : '';

                  if (prevLast !== newLast && (isLiveRef.current || prevFrames.length === 0)) {
                      setCurrentIndex(newFrames.length - 1);
                  }
                  return newFrames;
              });
              setIsOffline(false);
          } else {
              setIsOffline(true);
          }
      } catch (e) {
          console.error("Sync Error:", e);
          setIsOffline(true);
      }
  }, [generateFrames]);

  useEffect(() => {
    refreshPlaylist();
    // Cek setiap 1 menit (agar cepat menangkap update baru BMKG)
    const intervalId = setInterval(refreshPlaylist, 60 * 1000); 
    return () => clearInterval(intervalId);
  }, [refreshPlaylist]);

  // ... (Sisa kode logic animasi SAMA PERSIS dengan sebelumnya) ...
  
  // (Copy logic animasi useEffect, togglePlay, dll dari jawaban sebelumnya di sini)
  // ...
  
  // 4. ANIMATION ENGINE
  useEffect(() => {
    if (isPlaying) {
      isLiveRef.current = false; 
      
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);      
            isLiveRef.current = true; 
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

  const togglePlay = () => {
    if (!isPlaying && currentIndex === frames.length - 1) {
      setCurrentIndex(0);
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
    isOffline,
    togglePlay,
    jumpToLive,
    setIndex
  };
}