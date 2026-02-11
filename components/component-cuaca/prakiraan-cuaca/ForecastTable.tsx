import React from 'react';
import { Navigation2, Droplets } from 'lucide-react';
import { GeneralForecastRow } from '@/lib/data';
import { getWindRotation } from '@/lib/weather-utils'; 

export default function ForecastTable({ data }: { data: GeneralForecastRow[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8 w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
          Prakiraan Per Jam
        </h3>
        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full md:hidden animate-pulse">
           Geser & Scroll
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm w-full overflow-hidden">
        <div className="overflow-auto w-full max-h-[500px] max-w-[calc(100vw-2.5rem)] md:max-w-full pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs shadow-sm">
              <tr>
                <th className="px-6 py-4 min-w-[100px] bg-slate-50 border-b border-slate-200">Waktu</th>
                <th className="px-6 py-4 min-w-[200px] bg-slate-50 border-b border-slate-200">Kondisi Cuaca</th>
                <th className="px-6 py-4 min-w-[180px] bg-slate-50 border-b border-slate-200">Angin</th>
                <th className="px-6 py-4 text-center min-w-[100px] bg-slate-50 border-b border-slate-200">Suhu</th>
                <th className="px-6 py-4 text-center min-w-[100px] bg-slate-50 border-b border-slate-200">RH %</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.map((row, idx) => {
                
                // HITUNG ROTASI
                const windDegree = getWindRotation(row.wind.direction);
                
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-base">{row.time}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{row.date}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all flex-shrink-0">
                          <img 
                            src={row.weatherIcon} 
                            alt={row.weatherDesc}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <span className="font-medium text-slate-700">{row.weatherDesc}</span>
                      </div>
                    </td>

                    {/* KOLOM ANGIN*/}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-1.5 bg-slate-100 rounded-full transform transition-transform duration-300 flex-shrink-0"
                          style={{ transform: `rotate(${windDegree}deg)` }}
                        >
                          <Navigation2 className="w-4 h-4 text-blue-500" fill="currentColor" fillOpacity={1} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{row.wind.direction}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {row.wind.speed} km/j
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-slate-900 text-lg">{row.temp}°</div>
                      <div className="text-xs text-slate-400 mt-1 whitespace-nowrap">
                        Terasa {row.feelsLike}°
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                        <Droplets className="w-3 h-3" />
                        {row.humidity}%
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-200 text-xs text-slate-400">
           <span>*Data diperbarui secara berkala</span>
        </div>
      </div>
    </div>
  );
}