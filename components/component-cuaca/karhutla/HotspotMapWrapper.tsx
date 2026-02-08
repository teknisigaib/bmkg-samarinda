"use client";

import dynamic from "next/dynamic";
import { HotspotData } from "@/lib/data-karhutla";
import { useState, useMemo } from "react";
import { 
  CalendarDays, 
  Flame, 
  Info, 
  RefreshCw,
  MapPin
} from "lucide-react";

const HotspotMap = dynamic(() => import("./HotspotMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-red-50 animate-pulse rounded-2xl flex items-center justify-center text-red-300 font-bold">
      Memuat Peta...
    </div>
  ),
});

// --- HELPER FORMAT ---
const formatDateID = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const formatDateDisplay = (date: Date) => {
  return date.toLocaleDateString("id-ID", {
    weekday: 'short',
    day: 'numeric', 
    month: 'short'
  });
};

const formatDateHeader = (date: Date) => {
  return date.toLocaleDateString("id-ID", {
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
};

export default function HotspotMapWrapper({ data, lastUpdateString }: { data: HotspotData[], lastUpdateString: string }) {
  
  const last7Days = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    return dates.reverse();
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(last7Days[last7Days.length - 1]);
  
  const filteredData = useMemo(() => {
    const targetID = formatDateID(selectedDate);
    return data
        .filter((item) => item.id.startsWith(targetID))
        .sort((a, b) => b.conf - a.conf);
  }, [data, selectedDate]);

  return (
    // PARENT UTAMA: overflow-hidden untuk mencegah scroll horizontal pada level page
    <div className="space-y-8 w-full max-w-full overflow-hidden"> 

      {/* 1. HEADER INFORMASI */}
      <section className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center text-center md:items-start md:text-left shadow-sm">
        
        {/* Ikon Api */}
        <div className="bg-white p-3 rounded-full shadow-sm w-fit">
            <Flame className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">Monitoring Titik Panas (Hotspot)</h2>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Peta sebaran titik panas di wilayah <strong>Kalimantan Timur</strong> berdasarkan pantauan satelit (SNPP/NOAA20). 
            </p>
            
            {/* Container Badge (Pills) */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                
                {/* Badge Jumlah Titik */}
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 shadow-sm">
                    <Info className="w-3.5 h-3.5" />
                    {formatDateHeader(selectedDate)}: {filteredData.length} Titik
                </div>
                
                {/* Badge Update Server */}
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Update Server: {lastUpdateString}
                </div>

            </div>
        </div>
      </section>
      
      {/* 2. DATE PICKER (FIX LEBAR DI SINI) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-red-500" />
            Pilih Tanggal Pantauan
        </h3>
        
        {/* FIX: max-w-[calc(100vw-2rem)] memaksa lebar container < lebar layar HP */}
        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 overflow-x-auto hide-scrollbar gap-2 snap-x w-full max-w-[calc(100vw-2.5rem)] md:max-w-none md:w-auto">
            {last7Days.map((date, idx) => {
                const isSelected = formatDateID(date) === formatDateID(selectedDate);
                const isToday = formatDateID(date) === formatDateID(new Date());
                return (
                    <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={`
                            relative flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-lg transition-all snap-center
                            ${isSelected 
                                ? "bg-white text-red-600 shadow-md border border-red-100 ring-1 ring-red-50 z-10 scale-105 font-bold" 
                                : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 font-medium"
                            }
                        `}
                    >
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                            {date.toLocaleDateString("id-ID", { weekday: 'short' })}
                        </span>
                        <span className="text-lg leading-none mt-0.5">
                            {date.getDate()}
                        </span>
                        {isToday && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
      </div>

      {/* 3. PETA INTERAKTIF */}
      <div className="relative group">
        <HotspotMap data={filteredData} />
        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-auto z-[400] pointer-events-none flex justify-center md:justify-start">
             <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl border border-gray-200 shadow-lg text-xs flex items-center gap-3">
                <span className="text-gray-500 font-medium">
                    {formatDateDisplay(selectedDate)}
                </span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="font-bold text-gray-800">
                    Terdeteksi: <span className="text-red-600 text-sm">{filteredData.length}</span> Titik
                </span>
             </div>
        </div>
        {filteredData.length === 0 && (
             <div className="absolute inset-0 z-[300] flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 font-medium text-sm">Tidak ada titik panas terdeteksi</p>
                    <p className="text-xs text-gray-400">pada tanggal {formatDateDisplay(selectedDate)}</p>
                </div>
             </div>
        )}
      </div>

      {/* 4. TABEL DAFTAR TITIK PANAS (FIX LEBAR JUGA) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm w-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Daftar Detail Lokasi
            </h3>
            <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">
                Menampilkan {filteredData.length} Data
            </span>
        </div>

        {/* FIX: max-w-[calc(100vw-2.5rem)] agar tabel scrollable di dalam box, bukan melebarkan halaman */}
        <div className="overflow-x-auto w-full max-w-[calc(100vw-2.5rem)] md:max-w-full mx-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="w-full text-sm text-left relative">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 w-10 text-center bg-gray-50 whitespace-nowrap">No</th>
                        <th className="px-4 py-3 bg-gray-50 min-w-[150px]">Lokasi</th>
                        <th className="px-4 py-3 bg-gray-50 whitespace-nowrap">Confidence</th>
                        <th className="px-4 py-3 bg-gray-50 hidden md:table-cell whitespace-nowrap">Satelit</th>
                        <th className="px-4 py-3 bg-gray-50 hidden md:table-cell whitespace-nowrap">Waktu (WIB)</th>
                        <th className="px-4 py-3 text-right bg-gray-50 whitespace-nowrap">Koordinat</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => {
                            let confColor = "bg-gray-100 text-gray-600";
                            if(item.conf >= 9) confColor = "bg-red-100 text-red-700";
                            else if(item.conf >= 7) confColor = "bg-orange-100 text-orange-700";
                            else confColor = "bg-yellow-100 text-yellow-700";

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-center text-gray-500 text-xs align-top">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-bold text-gray-800 text-xs md:text-sm">
                                            {item.subDistrict}
                                        </div>
                                        <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-0.5">
                                            {item.district}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${confColor} whitespace-nowrap`}>
                                            {item.conf >= 9 ? "Tinggi" : (item.conf >= 7 ? "Sedang" : "Rendah")} ({item.conf})
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 font-medium text-xs hidden md:table-cell align-top">
                                        {item.satellite}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell align-top">
                                        {item.date.split(" ")[1]} 
                                    </td>
                                    <td className="px-4 py-3 text-right align-top">
                                        <div className="font-mono text-[10px] text-gray-500 whitespace-nowrap">
                                            {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                                Tidak ada data titik panas pada tanggal ini.
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