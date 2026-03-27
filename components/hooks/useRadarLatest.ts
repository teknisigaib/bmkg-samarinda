"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export type RadarFrame = {
    id: string;
    url: string;
    timeUTC: string;
    timeLocal: string;
};

export function useRadarLatest(site: string = "BAL") {
  const [radarUrl, setRadarUrl] = useState<string | null>(null);
  const [radarTime, setRadarTime] = useState<string | null>(null); 
  const [radarBounds, setRadarBounds] = useState<[number, number][] | null>(null); 
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]); 
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Penampung untuk manajemen RAM (Mencegah Memory Leak)
  const blobUrlsRef = useRef<string[]>([]);

  // Fungsi pembersih RAM (Menghapus Blob lama saat refresh atau pindah halaman)
  const cleanupBlobs = useCallback(() => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
  }, []);

  const fetchRadarData = useCallback(async () => {
    setIsLoading(true);
    
    try {
        const res = await fetch(`/api/radar/info?site=${site}`);
        if (!res.ok) throw new Error("Gagal mengambil info");
        
        const data = await res.json();
        setRadarBounds(data.bounds);
        setRadarTime(data.latest.timeUTC);

        // Bersihkan sampah Blob lama sebelum membuat yang baru
        cleanupBlobs();

        const frames = data.frames || [];
        
        // --- PROSES PRE-LOADER BLOB ---
        // Kita fetch semua gambar secara paralel di background
        const blobFramesPromises = frames.map(async (frame: any) => {
            try {
                const imageRes = await fetch(frame.url);
                if (!imageRes.ok) throw new Error();
                
                const blob = await imageRes.blob();
                const objectUrl = URL.createObjectURL(blob);
                
                // Catat URL-nya untuk dibersihkan nanti
                blobUrlsRef.current.push(objectUrl); 
                
                return { ...frame, url: objectUrl }; // Timpa URL API menjadi URL Blob
            } catch (err) {
                // Jika gagal di-blob, biarkan pakai URL API asli sebagai Fallback
                return frame; 
            }
        });

        // Tunggu semua gambar selesai di-download ke RAM
        const blobFrames = await Promise.all(blobFramesPromises);

        setRadarFrames(blobFrames); 
        
        // Set gambar terbaru dari frame terakhir yang sudah berbentuk Blob
        if (blobFrames.length > 0) {
            setRadarUrl(blobFrames[blobFrames.length - 1].url); 
        }

        setIsLoading(false);
        setIsOffline(false);

    } catch (err) {
        setIsOffline(true);
        setIsLoading(false);
    }
  }, [site, cleanupBlobs]);

  useEffect(() => {
    fetchRadarData();

    // Pembersihan RAM otomatis jika komponen Peta dimatikan (Unmount)
    return () => cleanupBlobs();
  }, [fetchRadarData, cleanupBlobs]);

  return { radarUrl, radarTime, radarBounds, radarFrames, isLoading, isOffline, refresh: fetchRadarData };
}