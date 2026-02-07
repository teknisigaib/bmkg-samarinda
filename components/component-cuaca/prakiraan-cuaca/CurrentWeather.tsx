import React from 'react';
import { ArrowRight, Wind, MapPin } from 'lucide-react'; // Tambah MapPin biar manis
import { WeatherData } from '@/lib/types';

export default function CurrentWeather({ data }: { data: WeatherData }) {
  if (!data) return null;

  // Cek apakah ini tampilan range (Provinsi)
  const isRange = !!data.tempRange;

  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
        
        {/* Blob Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-10 translate-x-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            {/* Header Lokasi Kecil */}
            <div className="flex items-center gap-1 text-slate-400 mb-1 text-sm font-medium">
               <MapPin className="w-4 h-4" />
               {data.location}
            </div>

            <div className="flex items-start">
              {/* LOGIKA TAMPILAN SUHU */}
              {isRange ? (
                  // Tampilan Range (Provinsi)
                  <div className="flex flex-col">
                    <span className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                      {data.tempRange} <span className="text-4xl text-slate-400">°C</span>
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mt-2">
                        Rentang Suhu Wilayah
                    </span>
                  </div>
              ) : (
                  // Tampilan Single (Kota/Kec)
                  <span className="text-7xl md:text-8xl font-bold text-slate-900 tracking-tighter">
                    {data.temp} <span className="text-4xl md:text-5xl text-slate-400 align-top">°C</span>
                  </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-2 pl-1">
               <span className="text-xl text-slate-600 font-medium bg-slate-100/50 px-3 py-1 rounded-lg">
                 {data.condition}
               </span>
            </div>
          </div>
          
          {/* Render Image BMKG */}
          <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm">
             <img 
               src={data.tableData?.[0].weatherIcon || "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg"} 
               alt={data.condition}
               className="w-24 h-24 object-contain drop-shadow-md"
             />
          </div>
        </div>

        <div className="relative z-10 mt-6 pt-2 border-t border-slate-50">
          <p className="text-slate-600 font-medium mb-4 ">
            "{data.description}"
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-400">
            
            {/* Detail Angin & RealFeel (Hanya tampil jika BUKAN range/provinsi) */}
            {!isRange && (
              <>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                   <Wind className="w-4 h-4 text-blue-400" />
                   <span className="text-slate-600">{data.windSpeed} km/j</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                   <span className="flex items-center gap-1 text-slate-600">
                       <ArrowRight className="w-3 h-3 rotate-[-45deg] text-orange-400"/> 
                       Terasa {data.feelsLike}°
                   </span>
                </div>
              </>
            )}

            {/* Jika Provinsi, tampilkan info ringkas */}
            {isRange && (
                <div className="px-3 py-1 bg-indigo-50 text-blue-600 rounded-full text-xs border border-indigo-100">
                    *Parameter cuaca adalah rata-rata wilayah.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}