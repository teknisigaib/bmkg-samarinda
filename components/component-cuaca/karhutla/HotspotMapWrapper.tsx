"use client";

import dynamic from "next/dynamic";
import { HotspotData } from "@/lib/data-karhutla";
import { useState, useMemo, useEffect } from "react";
import { 
  Flame, 
  RefreshCw,
  MapPin,
  CalendarDays
} from "lucide-react";
import HotspotControl from "@/components/component-cuaca/karhutla/HotspotControl";

// 1. DYNAMIC IMPORT PETA (Tanpa SSR)
const HotspotMap = dynamic(() => import("./HotspotMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-50 animate-pulse rounded-[2rem] flex items-center justify-center text-slate-400 font-bold tracking-widest uppercase text-sm border border-slate-200">
      Memuat Peta...
    </div>
  ),
});

// --- HELPER FORMAT TANGGAL ---
const formatDateID = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const formatDateHeader = (date: Date) => {
  return date.toLocaleDateString("id-ID", {
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
};

export default function HotspotMapWrapper({ data, lastUpdateString }: { data: HotspotData[], lastUpdateString: string }) {
  
  // --- MENCEGAH HYDRATION MISMATCH ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- LOGIKA DATA TANGGAL (SUDAH TIDAK MUNDUR 1 HARI) ---
  const last7Days = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    // LOGIKA H-1 SUDAH DIHAPUS. 'today' sekarang murni hari ini.
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    return dates.reverse(); // Urutan: Lama -> Terbaru
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(last7Days.length - 2);
  const selectedDate = last7Days[selectedIndex];

  const timestamps = useMemo(() => {
      return last7Days.map(d => d.toISOString());
  }, [last7Days]);
  
  const filteredData = useMemo(() => {
    const targetID = formatDateID(selectedDate);
    return data
        .filter((item) => item.id.startsWith(targetID))
        .sort((a, b) => b.conf - a.conf);
  }, [data, selectedDate]);

  // --- SSR FALLBACK (Loading UI saat di Server) ---
  if (!isMounted) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 animate-pulse">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Menyiapkan Data...</p>
      </div>
    );
  }

  // --- RENDER UTAMA ---
  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden pb-10"> 

      {/* --- 1. HEADER SECTION --- */}
      <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
         
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
         </div>
         
         <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Monitoring Hotspot
         </h1>
         
         <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
            Peta sebaran titik panas di wilayah Kalimantan Timur berdasarkan pantauan satelit (SNPP/NOAA20) sebagai peringatan dini kebakaran hutan dan lahan. Data berlaku 24 jam ke depan.
         </p>

         <div className="relative z-10 flex flex-wrap items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               <Flame className="w-4 h-4 text-orange-500" />
               <span className="text-xs font-bold text-slate-700">{filteredData.length} Titik Panas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               <CalendarDays className="w-4 h-4 text-blue-500" />
               <span className="text-xs font-bold text-slate-700">{formatDateHeader(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5">
               <RefreshCw className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-medium text-slate-500">Update Server: {lastUpdateString}</span>
            </div>
         </div>
      </section>
      
      {/* --- 2. PETA INTERAKTIF + KONTROL WAKTU --- */}
      <div className="relative group rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/50 bg-slate-900">
        <HotspotMap data={filteredData} />

        <div className="absolute bottom-0 left-0 w-full z-[800]"> 
             <HotspotControl 
                timestamps={timestamps}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
             />
        </div>

        {filteredData.length === 0 && (
             <div className="absolute inset-0 z-[300] flex items-center justify-center pointer-events-none pb-20">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-slate-200 text-center">
                    <p className="text-slate-800 font-bold text-sm">Tidak ada titik panas terdeteksi</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">pada tanggal {formatDateHeader(selectedDate)}</p>
                </div>
             </div>
        )}
      </div>

      {/* --- 3. TABEL DAFTAR TITIK PANAS --- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full mt-6">
        <div className="p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                <MapPin className="w-4 h-4 text-red-500" />
                Rincian Lokasi Koordinat
            </h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                Menampilkan {filteredData.length} Data
            </span>
        </div>

        <div className="overflow-x-auto w-full max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm text-left relative">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-5 py-4 w-10 text-center bg-slate-50 whitespace-nowrap">No</th>
                        <th className="px-5 py-4 bg-slate-50 min-w-[150px]">Wilayah Administrasi</th>
                        <th className="px-5 py-4 bg-slate-50 whitespace-nowrap">Tingkat Kepercayaan</th>
                        <th className="px-5 py-4 bg-slate-50 hidden md:table-cell whitespace-nowrap">Satelit</th>
                        <th className="px-5 py-4 bg-slate-50 hidden md:table-cell whitespace-nowrap">Waktu (WIB)</th>
                        <th className="px-5 py-4 text-right bg-slate-50 whitespace-nowrap">Titik Koordinat</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => {
                            let confColor = "bg-slate-100 text-slate-600 border-slate-200";
                            if(item.conf >= 9) confColor = "bg-red-50 text-red-600 border-red-200";
                            else if(item.conf >= 7) confColor = "bg-orange-50 text-orange-600 border-orange-200";
                            else confColor = "bg-amber-50 text-amber-600 border-amber-200";

                            return (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-5 py-4 text-center text-slate-400 font-bold text-xs align-top">
                                        {index + 1}
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <div className="font-black text-slate-800 text-sm">
                                            {item.subDistrict}
                                        </div>
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">
                                            {item.district}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold border ${confColor} whitespace-nowrap`}>
                                            {item.conf >= 9 ? "Tinggi" : (item.conf >= 7 ? "Sedang" : "Rendah")} ({item.conf})
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600 font-bold text-xs hidden md:table-cell align-top">
                                        {item.satellite}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 font-medium text-xs hidden md:table-cell align-top">
                                        {item.date.split(" ")[1]} 
                                    </td>
                                    <td className="px-5 py-4 text-right align-top">
                                        <div className="font-mono text-[11px] font-bold text-slate-500 whitespace-nowrap bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100 group-hover:bg-white transition-colors">
                                            {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-5 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                Data Tidak Ditemukan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}