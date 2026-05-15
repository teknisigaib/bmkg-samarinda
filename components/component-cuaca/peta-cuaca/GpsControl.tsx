"use client";

import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";

interface GpsControlProps {
  userPos: [number, number] | null;
  setUserPos: (pos: [number, number] | null) => void;
  onFlyTo: (pos: [number, number], zoom: number) => void;
  defaultCenter: [number, number];
}

export default function GpsControl({ userPos, setUserPos, onFlyTo, defaultCenter }: GpsControlProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    // 1. Jika sudah ada lokasi, klik lagi berarti reset ke default
    if (userPos) {
      setUserPos(null);
      onFlyTo(defaultCenter, 7);
      return;
    }

    setIsLocating(true);

    // 2. Fungsi Fallback (Mendeteksi dari IP)
    const fallbackToIP = async () => {
      console.log("🌐 Beralih menggunakan pelacakan IP...");
      try {
        const res = await fetch("https://ipapi.co/json/");
        const d = await res.json();
        if (d.latitude && d.longitude) {
          const pos: [number, number] = [parseFloat(d.latitude), parseFloat(d.longitude)];
          setUserPos(pos);
          onFlyTo(pos, 10); // Zoom level sedang untuk akurasi tingkat kota (IP)
        } else {
          throw new Error("Data koordinat IP tidak valid");
        }
      } catch (err) {
        console.error("Gagal melacak via IP:", err);
        alert("Gagal menemukan lokasi Anda baik dari GPS maupun Jaringan.");
      } finally {
        setIsLocating(false);
      }
    };

    // 3. Jika browser benar-benar tidak mendukung Geolocation
    if (!navigator.geolocation) {
      fallbackToIP();
      return;
    }

    // 4. Proses GPS Perangkat (Prioritas Utama)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // SUKSES DARI GPS
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        onFlyTo(coords, 13); // Zoom lebih dalam karena GPS sangat akurat
        setIsLocating(false);
      },
      (err) => {
        // GAGAL/DITOLAK/TIMEOUT DARI GPS -> Lari ke IP Fallback
        console.warn("⚠️ GPS Perangkat gagal/ditolak:", err.message);
        fallbackToIP();
      },
      { 
        enableHighAccuracy: true, // 🔥 MEMAKSA menggunakan chip GPS perangkat
        timeout: 8000,            // Maksimal nunggu 8 detik sebelum menyerah ke IP
        maximumAge: 0             // Jangan gunakan cache lokasi lama
      } 
    );
  };

  return (
    <button
      onClick={handleLocateMe}
      disabled={isLocating}
      className={`pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all border focus:outline-none ${
        isLocating
          ? 'text-blue-500 border-slate-200/60'
          : userPos
          ? 'text-blue-600 border-blue-200 bg-blue-50'
          : 'text-slate-600 border-slate-200/60 hover:text-blue-500 hover:bg-white'
      }`}
      title="Temukan Lokasi Saya"
    >
      {isLocating ? <Loader2 size={20} className="animate-spin" /> : <LocateFixed size={20} />}
    </button>
  );
}