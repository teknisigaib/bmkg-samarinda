// components/hooks/useTimeMachine.ts
import { useState, useEffect, useRef, useCallback } from 'react';

// Struktur standar untuk setiap frame animasi
export interface TimeFrame {
  timestamp: Date;
  label: string;       // Contoh: "04:10 UTC"
  dateLabel: string;   // Contoh: "11 Mar"
  url: string;         // URL gambar tile map yang siap pakai
}

const ANIMATION_SPEED = 2000; // Kecepatan putar antar frame (dalam milidetik)

export function useTimeMachine() {
  const [frames, setFrames] = useState<TimeFrame[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOffline, setIsOffline] = useState(true); // Default true sampai ada data masuk
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref ini bertugas melacak apakah user sedang berada di frame paling ujung (Terbaru/Live)
  // Jika true, saat ada data baru masuk, slider akan otomatis bergeser ke data terbaru tersebut.
  const isLiveRef = useRef<boolean>(true); 

  // 1. FUNGSI UNTUK MENERIMA DATA DARI SUMBER LUAR (cth: useHimawariData)
  const loadPlaylist = useCallback((newFrames: TimeFrame[]) => {
      setFrames(prevFrames => {
          // Ambil URL terakhir dari data lama dan data baru untuk perbandingan
          const prevLastUrl = prevFrames.length > 0 ? prevFrames[prevFrames.length - 1].url : '';
          const newLastUrl = newFrames.length > 0 ? newFrames[newFrames.length - 1].url : '';

          // Jika ada data baru (URL ujungnya berbeda) DAN user sedang memantau mode Live
          if (prevLastUrl !== newLastUrl && (isLiveRef.current || prevFrames.length === 0)) {
              // Pindahkan index ke frame paling baru
              setCurrentIndex(newFrames.length - 1);
          }
          
          return newFrames;
      });

      // Update status offline/online
      setIsOffline(newFrames.length === 0);
  }, []); // Array kosong sangat penting agar fungsi ini tidak ter-recreate terus menerus

  // 2. ANIMATION ENGINE (Jantung Pemutar Otomatis)
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      isLiveRef.current = false; // Saat play berjalan, berarti sedang tidak standby di Live
      
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);      // Berhenti otomatis jika sudah sampai akhir
            isLiveRef.current = true; // Set status kembali ke Live
            return prev;              
          }
          return prev + 1; // Lanjut ke frame berikutnya
        });
      }, ANIMATION_SPEED);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    // Cleanup interval saat komponen mati atau isPlaying berubah
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, frames.length]); 

  // 3. KONTROL PLAYER
  const togglePlay = () => {
    if (!isPlaying && currentIndex === frames.length - 1 && frames.length > 0) {
      // Jika posisi sedang di ujung akhir dan user tekan play, mulai ulang dari awal (0)
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
    setIsPlaying(false); // Hentikan play jika user menggeser slider manual
    setCurrentIndex(index);
    isLiveRef.current = (index === frames.length - 1);
  };

  // 4. KEMBALIKAN SEMUA STATE & FUNGSI KE KOMPONEN PETA
  return {
    frames,
    currentIndex,
    currentFrame: frames[currentIndex] || null, 
    isPlaying,
    isOffline,
    togglePlay,
    jumpToLive,
    setIndex,
    loadPlaylist // <-- Ini yang akan dipanggil oleh useHimawariData atau komponen luar
  };
}