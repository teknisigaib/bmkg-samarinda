"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; 
import { CloudRain, MapPin, RefreshCw } from "lucide-react";

// 👉 PERBAIKAN: Jalur impor diarahkan ke lib/api-cuaca
import { WeatherStationData } from "@/lib/api-cuaca"; 

// Load Peta tanpa SSR
const WeatherMap = dynamic(() => import("./WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center border border-slate-200 shadow-sm">
      <span className="text-slate-400 font-bold tracking-widest uppercase text-sm">Memuat Peta Observasi...</span>
    </div>
  ),
});

export default function WeatherMapWrapper({ data }: { data: WeatherStationData[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); // INISIALISASI ROUTER

  useEffect(() => {
    setIsMounted(true);

    // --- FITUR AUTO REFRESH SILENT (POLLING) ---
    // Meminta server mengambil data baru setiap 60 detik (60000 ms)
    const interval = setInterval(() => {
      router.refresh(); 
    }, 60000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen ditutup
  }, [router]);

  // 1. Urutkan Data: Yang sedang hujan ditaruh di Paling Atas
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.rain_total - a.rain_total);
  }, [data]);

  // 2. Hitung Statistik Singkat
  const totalStations = data.length;
  const rainingStations = data.filter(d => d.is_raining && !d.is_offline).length;

  // 3. Ambil Waktu Update Terakhir dari seluruh data
  const latestTimeStr = useMemo(() => {
    if (!data || data.length === 0) return null;
    const latest = data.reduce((latest, current) => {
        return new Date(current.record_time) > new Date(latest.record_time) ? current : latest;
    });
    return latest.record_time;
  }, [data]);

  const formattedSyncTime = latestTimeStr 
    ? new Date(latestTimeStr).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }) + " WITA"
    : "-";

  if (!isMounted) return null;

  return (
    <div className="space-y-8">
        
      {/* --- KARTU RINGKASAN STATUS --- */}
      <div className="flex justify-center -mt-4 mb-8 relative z-10">
        <div className="flex flex-wrap items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm p-1 w-fit mx-auto">
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700">{totalStations} Stasiun Aktif</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                <CloudRain className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold text-slate-700">{rainingStations} Lokasi Hujan</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5">
                {/* Animasi spin ringan pada ikon refresh agar terlihat hidup */}
                <RefreshCw className="w-4 h-4 text-blue-500 hover:animate-spin cursor-pointer" onClick={() => router.refresh()} />
                <span className="text-xs font-medium text-slate-500">Sync: {formattedSyncTime}</span>
            </div>
        </div>
      </div>

      {/* --- PETA OBSERVASI --- */}
      <WeatherMap data={data} />

    </div>
  );
}