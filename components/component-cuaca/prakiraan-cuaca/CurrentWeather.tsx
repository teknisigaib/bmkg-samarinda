import React from 'react';
import { CloudRain, ArrowRight, Wind } from 'lucide-react';
import { WeatherData } from '@/lib/types';

export default function CurrentWeather({ data }: { data: WeatherData }) {
  if (!data) return null;

  // Cek apakah ini tampilan range (Provinsi) atau single (Kota/Kec)
  const isRange = !!data.tempRange;

  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
        
        {/* Blob Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-10 translate-x-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-start">
              {/* LOGIKA TAMPILAN SUHU */}
              {isRange ? (
                 // Tampilan Range (Font sedikit lebih kecil agar muat)
                 <span className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter">
                   {data.tempRange}
                 </span>
              ) : (
                 // Tampilan Single (Normal)
                 <>
                   <span className="text-7xl md:text-8xl font-bold text-slate-900 tracking-tighter">
                     {data.temp}
                   </span>
                   <span className="text-4xl md:text-5xl font-medium text-slate-400 mt-2">°</span>
                 </>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1 pl-1">
               <span className="text-xl text-slate-600 font-medium">
                 {data.condition}
               </span>
            </div>
          </div>
          
          {/* UBAH BAGIAN INI: Render Image BMKG */}
          <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
             {/* Gunakan tag img standar */}
             <img 
               src={data.tableData?.[0].weatherIcon || "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg"} 
               alt={data.condition}
               className="w-20 h-20 object-contain drop-shadow-sm"
             />
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-slate-50">
          <p className="text-slate-600 font-medium mb-4">"{data.description}"</p>
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-400">
            
            {/* Hanya tampilkan detail angin/realfeel jika BUKAN range provinsi, 
                karena angin di provinsi pasti beda-beda */}
            {!isRange && (
              <>
                <div className="flex items-center gap-2">
                   <Wind className="w-4 h-4" />
                   <span>{data.windSpeed} km/j</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-[-45deg]"/> Terasa {data.feelsLike}°
                    </span>
                </div>
              </>
            )}

            {/* Untuk provinsi, tampilkan ringkasan lain (misal jumlah kota) */}
            {isRange && (
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    Rata-rata se-provinsi
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}