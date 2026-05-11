"use client";

import { Cloud, CloudRain, Sun, CloudLightning, Wind } from "lucide-react";

// DATA DUMMY (Nanti diganti dari API Node.js Gateway Anda)
const LIVE_WEATHER = [
  { id: 1, city: "Samarinda", temp: 28, condition: "Hujan Ringan", type: "rain" },
  { id: 2, city: "Balikpapan", temp: 31, condition: "Cerah Berawan", type: "sun" },
  { id: 3, city: "Bontang", temp: 30, condition: "Berawan", type: "cloud" },
  { id: 4, city: "Berau", temp: 26, condition: "Hujan Petir", type: "storm" },
  { id: 5, city: "Kutai Barat", temp: 27, condition: "Berawan Tebal", type: "cloud" },
  { id: 6, city: "Penajam", temp: 29, condition: "Angin Kencang", type: "wind" },
  { id: 7, city: "Mahakam Ulu", temp: 25, condition: "Hujan Sedang", type: "rain" },
];

// Helper untuk memilih ikon berdasarkan kondisi
const getWeatherIcon = (type: string) => {
  switch (type) {
    case "sun": return <Sun className="w-8 h-8 text-yellow-500 drop-shadow-sm" />;
    case "cloud": return <Cloud className="w-8 h-8 text-gray-400 drop-shadow-sm" />;
    case "rain": return <CloudRain className="w-8 h-8 text-blue-400 drop-shadow-sm" />;
    case "storm": return <CloudLightning className="w-8 h-8 text-purple-500 drop-shadow-sm" />;
    case "wind": return <Wind className="w-8 h-8 text-teal-400 drop-shadow-sm" />;
    default: return <Cloud className="w-8 h-8 text-gray-400" />;
  }
};

export default function LiveWeatherSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12">
      <div className="relative w-full">
        
        {/* Indikator "Live" Merah Berkedip */}
        <div className="absolute -top-10 right-2 md:right-4 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Live Data</span>
        </div>

        {/* Deretan Kartu Mini (Horizontal Scroll) */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {LIVE_WEATHER.map((data) => (
            <div 
              key={data.id} 
              className="min-w-[140px] flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-4 flex flex-col items-center text-center group"
            >
              <h4 className="font-bold text-gray-600 text-sm mb-3 group-hover:text-blue-700 transition-colors">
                {data.city}
              </h4>
              
              <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {getWeatherIcon(data.type)}
              </div>
              
              <div className="flex flex-col items-center mt-auto">
                <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
                  {data.temp}°<span className="text-base text-gray-400 font-semibold">C</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 truncate w-full max-w-[100px]">
                  {data.condition}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}