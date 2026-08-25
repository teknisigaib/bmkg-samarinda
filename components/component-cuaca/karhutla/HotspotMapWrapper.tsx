"use client";

import dynamic from "next/dynamic";
import { HotspotData } from "@/lib/data-karhutla";
import { useState, useMemo, useEffect } from "react";
import { 
  Flame, 
  RefreshCw,
  MapPin,
  CalendarDays,
  Download,
  Filter
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

  // --- LOGIKA DATA TANGGAL ---
  const last7Days = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    return dates.reverse();
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(last7Days.length - 1);
  const selectedDate = last7Days[selectedIndex];

  const timestamps = useMemo(() => {
      return last7Days.map(d => d.toISOString());
  }, [last7Days]);
  
  // Data Mentah Harian
  const dailyData = useMemo(() => {
    const targetID = formatDateID(selectedDate);
    return data
        .filter((item) => item.id.startsWith(targetID))
        .sort((a, b) => b.conf - a.conf);
  }, [data, selectedDate]);

  // --- STATE FILTERING ---
  const [filterConf, setFilterConf] = useState<"ALL" | "TINGGI" | "SEDANG" | "RENDAH">("ALL");
  const [filterSat, setFilterSat] = useState<string>("ALL");

  // Ekstrak daftar satelit unik untuk dropdown
  const uniqueSatellites = useMemo(() => {
    const sats = new Set(dailyData.map(d => d.satellite));
    return Array.from(sats);
  }, [dailyData]);

  // Data yang Tampil di Tabel (Setelah Difilter)
  const displayedData = useMemo(() => {
    return dailyData.filter(item => {
      let passConf = true;
      if (filterConf === "TINGGI") passConf = item.conf >= 9;
      else if (filterConf === "SEDANG") passConf = item.conf >= 7 && item.conf < 9;
      else if (filterConf === "RENDAH") passConf = item.conf < 7;

      let passSat = true;
      if (filterSat !== "ALL") passSat = item.satellite === filterSat;

      return passConf && passSat;
    });
  }, [dailyData, filterConf, filterSat]);

  // --- FUNGSI EXPORT CSV ---
  const handleExportCSV = () => {
    const headers = ["No", "Wilayah/Kabupaten", "Kecamatan", "Confidence", "Level", "Satelit", "Waktu (WIB)", "Latitude", "Longitude"];
    
    const rows = displayedData.map((d, i) => {
      const level = d.conf >= 9 ? "Tinggi" : d.conf >= 7 ? "Sedang" : "Rendah";
      return [
        i + 1,
        `"${d.district}"`,
        `"${d.subDistrict}"`,
        d.conf,
        level,
        d.satellite,
        d.date,
        d.lat,
        d.lng
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Hotspot_Kaltim_${formatDateID(selectedDate)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 animate-pulse">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Menyiapkan Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden pb-10"> 

      {/* --- 1. HEADER SECTION --- */}
      <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-0">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
         </div>
         
         <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Monitoring Hotspot
         </h1>
         
         <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
            Peta sebaran titik panas di wilayah Kalimantan Timur berdasarkan pantauan satelit sebagai peringatan dini kebakaran hutan dan lahan.
         </p>

         <div className="relative z-10 flex flex-wrap items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               <Flame className="w-4 h-4 text-orange-500" />
               <span className="text-xs font-bold text-slate-700">{dailyData.length} Titik Panas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               <CalendarDays className="w-4 h-4 text-blue-500" />
               <span className="text-xs font-bold text-slate-700">{formatDateHeader(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5">
               <RefreshCw className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-medium text-slate-500">Update: {lastUpdateString}</span>
            </div>
         </div>
      </section>
      
      {/* --- 2. PETA INTERAKTIF --- */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 bg-slate-900">
        <HotspotMap data={dailyData} />

        <div className="absolute bottom-0 left-0 w-full z-[800]"> 
             <HotspotControl 
                timestamps={timestamps}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
             />
        </div>

        {dailyData.length === 0 && (
             <div className="absolute inset-0 z-[300] flex items-center justify-center pointer-events-none pb-20">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-slate-200 text-center">
                    <p className="text-slate-800 font-bold text-sm">Tidak ada titik panas terdeteksi</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">pada tanggal {formatDateHeader(selectedDate)}</p>
                </div>
             </div>
        )}
      </div>

      {/* --- 3. TABEL DAFTAR TITIK PANAS (UPGRADED) --- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full mt-6">
        
        {/* Header Tabel & Tombol Export */}
        <div className="p-4 md:p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Rincian Lokasi Koordinat
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Menampilkan {displayedData.length} Data
                </span>
            </div>
            
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm w-full md:w-auto justify-center"
            >
                <Download className="w-3.5 h-3.5" /> Unduh CSV
            </button>
        </div>

        {/* Filter Bar (New Feature) */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
               <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            
            <select 
               className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 outline-none cursor-pointer"
               value={filterConf}
               onChange={(e) => setFilterConf(e.target.value as any)}
            >
               <option value="ALL">Semua Tingkat</option>
               <option value="TINGGI">Tinggi (9-10)</option>
               <option value="SEDANG">Sedang (7-8)</option>
               <option value="RENDAH">Rendah (&lt;7)</option>
            </select>

            <select 
               className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 outline-none cursor-pointer"
               value={filterSat}
               onChange={(e) => setFilterSat(e.target.value)}
            >
               <option value="ALL">Semua Satelit</option>
               {uniqueSatellites.map(sat => (
                 <option key={sat} value={sat}>{sat}</option>
               ))}
            </select>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto max-h-[400px] overflow-y-auto custom-scrollbar relative">
            <table className="w-full text-sm text-left relative">
                <thead className="bg-white text-slate-500 font-bold uppercase text-[10px] tracking-widest sticky top-0 z-10 shadow-sm outline outline-1 outline-slate-100">
                    <tr>
                        <th className="px-5 py-4 w-10 text-center bg-white whitespace-nowrap">No</th>
                        <th className="px-5 py-4 bg-white min-w-[150px]">Wilayah Administrasi</th>
                        <th className="px-5 py-4 bg-white whitespace-nowrap">Tingkat Kepercayaan</th>
                        <th className="px-5 py-4 bg-white hidden md:table-cell whitespace-nowrap">Satelit</th>
                        <th className="px-5 py-4 bg-white hidden md:table-cell whitespace-nowrap">Waktu (WIB)</th>
                        <th className="px-5 py-4 text-right bg-white whitespace-nowrap">Titik Koordinat</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {displayedData.length > 0 ? (
                        displayedData.map((item, index) => {
                            let confColor = "bg-slate-100 text-slate-600 border-slate-200";
                            if(item.conf >= 9) confColor = "bg-red-50 text-red-600 border-red-200";
                            else if(item.conf >= 7) confColor = "bg-orange-50 text-orange-600 border-orange-200";
                            else confColor = "bg-amber-50 text-amber-600 border-amber-200";

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-5 py-4 text-center text-slate-400 font-bold text-xs align-top">
                                        {index + 1}
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <div className="font-black text-slate-800 text-sm">{item.subDistrict}</div>
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">{item.district}</div>
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
                                Tidak ada data yang cocok dengan filter
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