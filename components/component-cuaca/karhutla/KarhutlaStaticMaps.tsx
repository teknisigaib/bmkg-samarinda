"use client";

import { useState } from "react";
import { Calendar, Info, Maximize2, X, Flame, Wind, Layers, ChevronDown } from "lucide-react";

// --- KONFIGURASI DATA ---
const MAP_TYPES = [
  {
    id: "ffmc",
    title: "FFMC (Fine Fuel Moisture Code)",
    icon: Flame,
    description: "Indeks tingkat kekeringan bahan bakar halus (alang-alang, daun kering). Angka tinggi berarti sangat mudah tersulut api.",
    accentColor: "text-amber-600",
    accentBg: "bg-amber-50"
  },
  {
    id: "isi",
    title: "ISI (Initial Spread Index)",
    icon: Wind,
    description: "Indeks kecepatan awal penyebaran api. Gabungan faktor angin dan kekeringan. Semakin tinggi, api makin cepat merambat.",
    accentColor: "text-orange-600",
    accentBg: "bg-orange-50"
  },
  {
    id: "fwi",
    title: "FWI (Fire Weather Index)",
    icon: Layers,
    description: "Indeks umum bahaya kebakaran. Menggabungkan semua faktor cuaca. Menunjukkan seberapa sulit api dikendalikan.",
    accentColor: "text-red-600",
    accentBg: "bg-red-50"
  }
];

const getDayLabel = (offset: number) => {
  if (offset === 0) return "Hari Ini (Observasi)";
  if (offset === 1) return "Besok (Prakiraan H+1)";
  
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
};

const getUrlCode = (index: number) => {
  if (index === 0) return "obs";
  return index.toString().padStart(2, "0");
};

export default function KarhutlaStaticMaps() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<{src: string, title: string} | null>(null);
  
  const days = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="space-y-6">
      
      {/* 1. FILTER TANGGAL (Ganti Scrollbar dengan Dropdown) */}
      {/* Layout Flex: Label di kiri, Dropdown di kanan/full di mobile */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-bold text-sm">Pilih Periode Data:</span>
          </div>

          <div className="relative">
              <select 
                value={selectedDayIndex}
                onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                className="w-full sm:w-64 appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 font-medium shadow-sm cursor-pointer"
              >
                {days.map((dayIdx) => (
                    <option key={dayIdx} value={dayIdx}>
                        {getDayLabel(dayIdx)}
                    </option>
                ))}
              </select>
              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
          </div>
      </div>

      {/* 2. GRID PETA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {MAP_TYPES.map((type) => {
          const code = getUrlCode(selectedDayIndex);
          const imageUrl = `https://dataweb.bmkg.go.id/cuaca/spartan/23_kaltim_${type.id}_${code}.png`;
          const Icon = type.icon;

          return (
            <div key={type.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
              
              {/* Header Card */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                <div className={`p-2 rounded-lg ${type.accentBg} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${type.accentColor}`} />
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight truncate pr-2">
                        {type.title.split('(')[0]}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mt-0.5">
                        {type.title.split('(')[1]?.replace(')', '') || type.id.toUpperCase()}
                    </span>
                </div>
              </div>

              {/* Image Container */}
              <div 
                   className="relative aspect-[4/3] bg-gray-50 cursor-zoom-in overflow-hidden border-b border-gray-100" 
                   onClick={() => setPreviewImage({ src: imageUrl, title: type.title })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={imageUrl} 
                    alt={`${type.title}`}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x450?text=Data+Tidak+Tersedia";
                    }}
                />
                
                <div className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full shadow border border-gray-200 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-gray-700" />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="p-4 bg-gray-50 flex-grow">
                  <h5 className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Penjelasan
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                      {type.description}
                  </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. LIGHTBOX PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
            <div className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] bg-white md:rounded-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white z-10 shrink-0">
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-lg line-clamp-1">{previewImage.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {getDayLabel(selectedDayIndex)}
                        </p>
                    </div>
                    <button onClick={() => setPreviewImage(null)} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-2 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={previewImage.src} 
                        alt="Preview" 
                        className="w-full h-auto md:max-h-full md:w-auto object-contain shadow-lg rounded"
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}