import React from 'react';
import { Info } from 'lucide-react';

// --- DATA IKON RESMI BMKG ---
const weatherLegends = [
  { label: "Cerah", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-am.svg" },
  { label: "Cerah Berawan", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah%20berawan-am.svg" },
  { label: "Berawan", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg" },
  { label: "Berawan Tebal", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan%20tebal-am.svg" },
  { label: "Udara Kabur", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/udara%20kabur.svg" },
  { label: "Kabut", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/kabut-am.svg" },
  { label: "Hujan Ringan", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan%20ringan-am.svg" },
  { label: "Hujan Sedang", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan%20sedang-am.svg" },
  { label: "Hujan Lebat", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan%20lebat-am.svg" },
  { label: "Hujan Petir", url: "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan%20petir-am.svg" },
];

export default function WeatherLegend() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-4">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        
        <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">Panduan Ikon Cuaca BMKG</h3>
            </div>
        </div>
        
        {/* Grid Icon Legenda - Dibikin 10 Kolom di Desktop (lg:grid-cols-10) biar sebaris */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3">
          {weatherLegends.map((item, idx) => (
              <div 
                key={idx} 
                className="rounded-xl p-2 flex flex-col items-center justify-start text-center border bg-slate-50 border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Ukuran ikon dikecilin jadi w-8 h-8 sampai w-10 h-10 */}
                <img 
                  src={item.url} 
                  alt={`Ikon ${item.label}`} 
                  className="w-8 h-8 xl:w-10 xl:h-10 mb-2 drop-shadow-sm" 
                />
                {/* Teks diperkecil biar tulisan panjang gak makan tempat */}
                <span className="font-bold text-[9px] xl:text-[10px] text-slate-600 uppercase tracking-wider leading-tight">
                  {item.label}
                </span>
              </div>
          ))}
        </div>

      </div>
    </section>
  );
}