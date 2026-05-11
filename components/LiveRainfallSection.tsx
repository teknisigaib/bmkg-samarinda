"use client";

import { Droplets, CloudRain, CloudLightning, Cloud } from "lucide-react";

// DATA DUMMY CURAH HUJAN (Satuan: milimeter)
const LIVE_RAINFALL = [
  { id: 1, city: "Samarinda", rainfall: 0.0, status: "Nihil" },
  { id: 2, city: "Balikpapan", rainfall: 12.5, status: "Hujan Sedang" },
  { id: 3, city: "Bontang", rainfall: 2.1, status: "Hujan Ringan" },
  { id: 4, city: "Berau", rainfall: 54.0, status: "Hujan Lebat" },
  { id: 5, city: "Kutai Barat", rainfall: 0.0, status: "Nihil" },
  { id: 6, city: "Penajam", rainfall: 0.5, status: "Gerimis" },
  { id: 7, city: "Mahakam Ulu", rainfall: 18.2, status: "Hujan Sedang" },
];

// Helper: Menentukan Warna dan Ikon berdasarkan Curah Hujan
const getRainfallUI = (rainfall: number) => {
  if (rainfall === 0) {
    return { 
      icon: <Cloud className="w-8 h-8 text-gray-300" />, 
      color: "text-gray-500", 
      bg: "bg-gray-100", 
      border: "hover:border-gray-300" 
    };
  } else if (rainfall > 0 && rainfall <= 5) {
    return { 
      icon: <Droplets className="w-8 h-8 text-blue-400" />, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      border: "hover:border-blue-300" 
    };
  } else if (rainfall > 5 && rainfall <= 20) {
    return { 
      icon: <CloudRain className="w-8 h-8 text-blue-600" />, 
      color: "text-blue-700", 
      bg: "bg-blue-100", 
      border: "hover:border-blue-500" 
    };
  } else {
    return { 
      icon: <CloudLightning className="w-8 h-8 text-red-500 animate-pulse" />, 
      color: "text-red-600", 
      bg: "bg-red-50", 
      border: "border-red-200 hover:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
    };
  }
};

export default function LiveRainfallSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12">
      <div className="relative w-full">
        
        {/* Indikator "Live Telemetri" Merah Berkedip */}
        <div className="absolute -top-10 right-2 md:right-4 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Live Telemetri</span>
        </div>

        {/* Deretan Kartu Mini (Horizontal Scroll) */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {LIVE_RAINFALL.map((data) => {
            const ui = getRainfallUI(data.rainfall);
            
            return (
              <div 
                key={data.id} 
                className={`min-w-[140px] flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-100 shadow-sm transition-all p-4 flex flex-col items-center text-center group ${ui.border}`}
              >
                <h4 className="font-bold text-gray-600 text-sm mb-3 group-hover:text-gray-900 transition-colors line-clamp-1">
                  {data.city}
                </h4>
                
                <div className={`mb-3 p-3 rounded-full ${ui.bg} transform group-hover:scale-110 transition-transform duration-300`}>
                  {ui.icon}
                </div>
                
                <div className="flex flex-col items-center mt-auto">
                  <span className={`text-2xl font-extrabold tracking-tight ${ui.color}`}>
                    {data.rainfall.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    mm / jam
                  </span>
                  
                  {/* Label Status Bawah */}
                  <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${data.rainfall > 20 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {data.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}