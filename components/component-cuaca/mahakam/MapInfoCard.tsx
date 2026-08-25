// components/MapInfoCard.tsx
import React from 'react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { Info, X, Thermometer, Wind, Eye, Cloud, MapPin, BarChart2, Clock } from 'lucide-react';

interface MapInfoCardProps {
  location: MahakamLocation | null;
  onClose: () => void;
  // Ubah nama prop agar lebih jelas tugasnya
  onShowMeteogram?: (loc: MahakamLocation) => void;
}

export default function MapInfoCard({ location, onClose, onShowMeteogram }: MapInfoCardProps) {
  if (!location) return null;

  const updateTime = location.forecasts && location.forecasts[0] 
    ? new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' }).format(new Date(location.forecasts[0].time))
    : '-';

  const handleDetailClick = () => {
    // SEKARANG: Langsung panggil callback, tanpa exit fullscreen
    if (onShowMeteogram) {
      onShowMeteogram(location);
    }
  };

  return (
    <div className="absolute top-4 right-[4.5rem] z-[1000] w-[280px] bg-slate-50 rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <div className="p-3.5">
        
        {/* HEADER */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Info Stasiun</p>
              <h2 className="text-sm font-extrabold text-slate-800 leading-tight line-clamp-1">
                {location.name}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-1 rounded-full transition-colors border border-slate-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* STATUS DENGAN IKON CUACA */}
        <div className="flex items-center gap-3 bg-white rounded-xl p-2.5 mb-3.5 border border-slate-100 shadow-sm">
          {location.iconUrl ? (
            <img src={location.iconUrl} alt={location.weather || 'Ikon'} className="w-10 h-10 object-contain drop-shadow-sm" />
          ) : (
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <Cloud className="w-5 h-5 text-slate-300" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400">Status Cuaca</span>
            <span className="text-[12px] font-bold text-slate-700">{location.weather || '-'}</span>
          </div>
        </div>

        {/* PARAMETER OBSERVASI (GRID COMPACT 2x2) */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col justify-between h-[52px]">
            <div className="flex items-center gap-1.5"><Thermometer className="w-3 h-3 text-blue-500"/><span className="text-[9px] font-semibold text-slate-500">Suhu & RH</span></div>
            <div className="flex justify-between items-end">
              <span className="font-bold text-slate-800 text-[11px]">{location.temp ?? '-'} <span className="text-[8px] text-slate-400">°C</span></span>
              <span className="font-bold text-slate-800 text-[11px]">{location.humidity ?? '-'} <span className="text-[8px] text-slate-400">%</span></span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col justify-between h-[52px]">
            <div className="flex items-center gap-1.5"><Wind className="w-3 h-3 text-blue-500"/><span className="text-[9px] font-semibold text-slate-500">Angin</span></div>
            <div className="flex justify-between items-end">
              <span className="font-bold text-slate-800 text-[11px]">{location.windDeg ?? '-'} <span className="text-[8px] text-slate-400">°</span></span>
              <span className="font-bold text-slate-800 text-[11px]">{location.windSpeed ?? '-'} <span className="text-[8px] text-slate-400">km/h</span></span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col justify-between h-[52px]">
            <div className="flex items-center gap-1.5"><Eye className="w-3 h-3 text-blue-500"/><span className="text-[9px] font-semibold text-slate-500">Visibilitas</span></div>
            <span className="font-bold text-slate-800 text-[11px]">{location.visibilityDisplay || '-'}</span>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col justify-between h-[52px]">
            <div className="flex items-center gap-1.5"><Cloud className="w-3 h-3 text-blue-500"/><span className="text-[9px] font-semibold text-slate-500">Awan</span></div>
            <span className="font-bold text-slate-800 text-[11px]">{location.tcc ?? '-'} <span className="text-[8px] text-slate-400">%</span></span>
          </div>
        </div>

        {/* KOORDINAT */}
        <div className="flex justify-between items-center text-[9px] text-slate-500 bg-slate-100/50 rounded-lg px-2 py-1.5 mb-3.5">
          <div className="flex items-center gap-1 font-bold"><MapPin className="w-3 h-3 text-slate-400"/>KOORDINAT</div>
          <div className="font-semibold flex gap-2"><span>Lat: {location.lat.toFixed(3)}</span><span>Lon: {location.lng.toFixed(3)}</span></div>
        </div>

        {/* TOMBOL */}
        {onShowMeteogram && (
          <button 
            onClick={handleDetailClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Detail
          </button>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-slate-100/70 px-4 py-2.5 flex justify-between items-center border-t border-slate-200/60">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500"><Clock className="w-3 h-3" /><span>{updateTime} WITA</span></div>
        <span className="bg-emerald-100 text-emerald-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">ONLINE</span>
      </div>

    </div>
  );
}