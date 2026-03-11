"use client";

import { useState, useEffect } from "react";

// URL Asli BMKG
// --- SOLUSI PAMUNGKAS: BYPASS CORP & CLOUDFLARE ---
// Kita bungkus URL BMKG dengan Proxy CDN Publik
// Kita arahkan pemanggilan peta ke API Lokal kita, bukan langsung ke BMKG
const BMKG_HIMAWARI_TEMPLATE = (timeStr: string, z: string | number, x: string | number, y: string | number) => {
  const originalUrl = `https://inasiam.bmkg.go.id/api/tilerv3/tiles/himawari:ir:output=shaded:modelrun=${timeStr}:validtime=${timeStr}/${z}/${x}/${y}?size=256`;
  
  // Menggunakan API Proxy Internal Next.js kita
  return `/api/proxy-tile?url=${encodeURIComponent(originalUrl)}`;
};

export function useHimawariLatest() {
  const [layerData, setLayerData] = useState<{ url: string; timeLabel: string } | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Fungsi rahasia: Cek gambar langsung pakai elemen Image Browser (Bypass Cloudflare)
    // Fungsi rahasia: Cek gambar langsung pakai elemen Image Browser
    const checkImageExists = (timeStr: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        const testUrl = BMKG_HIMAWARI_TEMPLATE(timeStr, 3, 6, 4);
        
        console.log(`[CLIENT PROBE] Mencoba memuat: ${testUrl}`);
        
        img.src = testUrl;
        
        img.onload = () => {
            console.log(`✅ [CLIENT PROBE SUKSES] Gambar ditemukan untuk jam ${timeStr}`);
            resolve(true);
        };
        
        img.onerror = () => {
            console.warn(`❌ [CLIENT PROBE GAGAL] Tidak bisa memuat gambar jam ${timeStr}`);
            resolve(false);
        };
      });
    };

    const findLatest = async () => {
      const checkTime = new Date();
      // Bulatkan ke 10 menit terdekat
      const minutes = Math.floor(checkTime.getUTCMinutes() / 10) * 10;
      checkTime.setUTCMinutes(minutes, 0, 0);

      // Kita coba mundur sampai 12x (2 Jam)
      for (let i = 0; i < 12; i++) {
        const yyyy = checkTime.getUTCFullYear();
        const mm = String(checkTime.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(checkTime.getUTCDate()).padStart(2, '0');
        const hh = String(checkTime.getUTCHours()).padStart(2, '0');
        const min = String(checkTime.getUTCMinutes()).padStart(2, '0');
        const timeStr = `${yyyy}${mm}${dd}${hh}${min}`;

        // Lakukan pengecekan bayangan di browser
        const exists = await checkImageExists(timeStr);

        if (exists) {
          if (!isMounted) return;
          
          // JIKA KETEMU! Buat URL Leaflet-nya (pakai {z}/{x}/{y} untuk Leaflet)
          const finalUrl = `https://inasiam.bmkg.go.id/api/tilerv3/tiles/himawari:ir:output=shaded:modelrun=${timeStr}:validtime=${timeStr}/{z}/{x}/{y}?size=256`;
          
          const timeLabel = checkTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + " UTC";

          setLayerData({
            url: finalUrl,
            timeLabel: timeLabel
          });
          setIsOffline(false);
          
          // Hentikan pencarian karena sudah ketemu yang terbaru
          return; 
        }

        // Jika tidak ketemu, mundur 10 menit, cari lagi
        checkTime.setMinutes(checkTime.getMinutes() - 10);
      }

      // Jika loop selesai dan tidak ketemu sama sekali
      if (isMounted) {
        setIsOffline(true);
      }
    };

    findLatest();
    
    // Auto-update setiap 5 menit
    const interval = setInterval(findLatest, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { layerData, isOffline };
}