"use client";

import React from 'react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { 
    Navigation2, Ship, ArrowRight, CloudSun, 
    Thermometer, Eye, Droplets, MousePointerClick, 
    AlertTriangle, CheckCircle2, XCircle, 
} from 'lucide-react';

interface Props {
    data: MahakamLocation[];
    onSelect: (loc: MahakamLocation) => void;
    activeId?: string;
}

const getCardinalDirection = (deg: number) => {
    const arr = ["U", "U-TL", "TL", "T-TL", "T", "T-TG", "TG", "S-TG", "S", "S-BD", "BD", "B-BD", "B", "B-BL", "BL", "U-BL"];
    const val = Math.floor((deg / 22.5) + 0.5);
    return arr[val % 16];
};


const getNavStatus = (loc: MahakamLocation) => {
    // 1. Kriteria Bahaya (Merah)
    // Gunakan visibility numerik (loc.visibility dalam km) untuk logika
    if (
        (loc.visibility !== undefined && loc.visibility < 4) || 
        (typeof loc.windSpeed === 'number' && loc.windSpeed > 25) || 
        loc.weather.toLowerCase().includes('petir') || 
        loc.weather.toLowerCase().includes('badai')
    ) {
        return { 
            type: 'danger', 
            label: 'Bahaya', 
            icon: XCircle, 
            badgeStyle: 'bg-red-100 text-red-700 border-red-200',
            colBase: 'bg-red-50/40', 
            colHover: 'hover:bg-red-100/80',
            colActive: 'bg-red-100/80 ring-2 ring-inset ring-red-400',
            headerBg: 'bg-red-100/80',
            headerText: 'text-red-950',
            activeBadge: 'text-red-600 bg-white border-red-100'
        };
    }
    
    // 2. Kriteria Waspada (Kuning/Amber)
    if (
        (loc.visibility !== undefined && loc.visibility < 8) || 
        (typeof loc.windSpeed === 'number' && loc.windSpeed > 15) || 
        loc.weather.toLowerCase().includes('hujan')
    ) {
        return { 
            type: 'warning', 
            label: 'Waspada', 
            icon: AlertTriangle, 
            badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
            colBase: 'bg-amber-50/40', 
            colHover: 'hover:bg-amber-100/80',
            colActive: 'bg-amber-100/80 ring-2 ring-inset ring-amber-400',
            headerBg: 'bg-amber-100/80',
            headerText: 'text-amber-950',
            activeBadge: 'text-amber-700 bg-white border-amber-100'
        };
    }

    // 3. Aman (Putih/Biru Default)
    return { 
        type: 'safe', 
        label: 'Aman', 
        icon: CheckCircle2, 
        badgeStyle: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        colBase: 'bg-white',
        colHover: 'hover:bg-slate-50/50',
        colActive: 'bg-blue-50/50 ring-2 ring-inset ring-blue-400',
        headerBg: 'bg-slate-50/50',
        headerText: 'text-slate-900',
        activeBadge: 'text-blue-600 bg-white border-blue-100'
    };
};

const ROW_H = {
    HEADER: "h-20", 
    STATUS: "h-12", 
    WEATHER: "h-20",
    WIND: "h-16",
    TEMP: "h-16",
    VIS: "h-16",
    HUMID: "h-16"
};

const ICON_STYLE = "w-8 h-8 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center shrink-0";

export default function RouteForecastView({ data, onSelect, activeId }: Props) {
  
  return (
    <div className="w-full min-w-0 animate-in fade-in slide-in-from-bottom-8 duration-700 text-slate-800 pb-10">
      
      {/* HEADER TABEL */}
      <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 text-slate-600 p-2.5 rounded-xl shadow-sm shrink-0">
                  <Ship size={22} />
              </div>
              <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-900 leading-tight truncate">Monitoring Cuaca Rute Pelayaran</h2>
                  <p className="text-xs text-slate-500 font-medium truncate">Klik kolom lokasi untuk melihat detail lengkap di peta.</p>
              </div>
          </div>
      </div>

      {/* WADAH TABEL */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200 relative w-full grid grid-cols-1 overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar bg-white">
            <div className="flex min-w-max">
            
                {/* --- KOLOM LABEL STICKY --- */}
                <div className="sticky left-0 z-30 w-32 md:w-36 item-center text-center shrink-0 border-r border-slate-100 bg-white/95 backdrop-blur-sm shadow-[6px_0_15px_-5px_rgba(0,0,0,0.04)] text-slate-500">
                    
                    {/* Header Parameter */}
                    <div className={`${ROW_H.HEADER} flex flex-col justify-center px-4 border-b border-slate-100`}>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Parameter</span>
                    </div>

                    {/* STATUS */}
                    <div className={`${ROW_H.STATUS} flex items-center px-4 border-b border-slate-50 bg-slate-50/30`}>
                         <div className="flex items-center gap-3">
                            <div className={ICON_STYLE}>
                                <AlertTriangle size={16}/>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Status</span>
                        </div>
                    </div>

                    {/* CUACA */}
                    <div className={`${ROW_H.WEATHER} flex items-center px-4 border-b border-slate-50`}>
                        <div className="flex items-center gap-3">
                            <div className={ICON_STYLE}>
                                <CloudSun size={18}/>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Cuaca</span>
                        </div>
                    </div>
                    
                    {/* ANGIN */}
                    <div className={`${ROW_H.WIND} flex items-center px-4 border-b border-slate-50 bg-slate-50/30`}>
                        <div className="flex items-center gap-3">
                            <div className={ICON_STYLE}>
                                <Navigation2 size={18}/>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Angin</span>
                        </div>
                    </div>

                    {/* SUHU */}
                    <div className={`${ROW_H.TEMP} flex items-center px-4 border-b border-slate-50`}>
                        <div className="flex items-center gap-3">
                             <div className={ICON_STYLE}>
                                <Thermometer size={18}/>
                             </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Suhu</span>
                        </div>
                    </div>

                    {/* JARAK PANDANG */}
                    <div className={`${ROW_H.VIS} flex items-center px-4 border-b border-slate-50 bg-slate-50/30`}>
                        <div className="flex items-center gap-3">
                             <div className={ICON_STYLE}>
                                <Eye size={18}/>
                             </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Visibilitas</span>
                        </div>
                    </div>

                    {/* RH */}
                    <div className={`${ROW_H.HUMID} flex items-center px-4`}>
                        <div className="flex items-center gap-3">
                             <div className={ICON_STYLE}>
                                <Droplets size={18}/>
                             </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Kelembaban</span>
                        </div>
                    </div>
                </div>

                {/* --- KOLOM DATA LOKASI --- */}
                {data.map((loc, idx) => {
                    const isActive = activeId === loc.id;
                    const status = getNavStatus(loc);

                    const columnClass = isActive 
                        ? `${status.colActive} z-10` 
                        : `${status.colBase} ${status.colHover}`;

                    const headerClass = isActive 
                        ? `${status.headerBg} border-b-2 border-${status.type === 'safe' ? 'blue' : status.type}-400`
                        : `${status.headerBg}`;

                    return (
                        <div 
                            key={idx} 
                            onClick={() => onSelect(loc)}
                            className={`
                                w-32 border-r border-slate-100 flex flex-col shrink-0 text-center relative cursor-pointer transition-all duration-300 group
                                ${columnClass}
                            `}
                        >
                            {/* Overlay Hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors pointer-events-none z-0" />

                            {/* HEADER LOKASI */}
                            <div className={`${ROW_H.HEADER} flex flex-col items-center justify-center p-3 border-b border-slate-200 transition-colors z-10 ${headerClass}`}>
                                <h3 className={`text-xs font-bold leading-tight mb-1.5 line-clamp-2 h-8 flex items-center justify-center ${status.headerText}`}>
                                    {loc.name.replace('Stasiun Meteorologi', '').replace('Stasiun', '').trim()}
                                </h3>
                                {isActive ? (
                                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm animate-in fade-in zoom-in border ${status.activeBadge}`}>
                                        Terpilih
                                    </span>
                                ) : (
                                    <div className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-500 bg-white/70 px-2 py-0.5 rounded border border-slate-100 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <MousePointerClick size={10} /> Detail
                                    </div>
                                )}
                            </div>

                            {/* STATUS NAVIGASI */}
                            <div className={`${ROW_H.STATUS} flex items-center justify-center p-2 border-b border-slate-100/50 z-10`}>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.badgeStyle} shadow-sm`}>
                                    <status.icon size={12} strokeWidth={3} />
                                    <span className="text-[10px] font-extrabold uppercase tracking-wide">{status.label}</span>
                                </div>
                            </div>

                            {/* CUACA */}
                            <div className={`${ROW_H.WEATHER} flex flex-col items-center justify-center p-2 border-b border-slate-100/50 z-10`}>
                                <div className="w-12 h-12 mb-1 drop-shadow-sm transition-transform group-hover:scale-105 duration-300">
                                    {loc.iconUrl ? <img src={loc.iconUrl} alt="" className="w-full h-full object-contain filter saturate-100 contrast-125" /> : <div className="w-full h-full bg-slate-100 rounded-full animate-pulse"/>}
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 capitalize line-clamp-2 px-1 leading-tight">{loc.weather}</span>
                            </div>

                            {/* ANGIN */}
                            <div className={`${ROW_H.WIND} flex flex-col items-center justify-center p-2 border-b border-slate-100/50 z-10`}>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Navigation2 size={14} className="text-slate-500" style={{ transform: `rotate(${loc.windDeg || 0}deg)` }} fill="currentColor"/>
                                    <span className="text-sm font-black text-slate-900">{loc.windSpeed}</span>
                                    <span className="text-[10px] font-bold text-slate-500">km/j</span>
                                </div>
                                <span className="text-[9px] font-medium text-slate-500 bg-white/60 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[90%]">
                                    {getCardinalDirection(loc.windDeg || 0)}
                                </span>
                            </div>

                            {/* SUHU */}
                            <div className={`${ROW_H.TEMP} flex flex-col items-center justify-center p-2 border-b border-slate-100/50 z-10`}>
                                <div className="flex items-end gap-0.5">
                                    <span className="text-base font-black text-slate-800">{loc.temp}</span>
                                    <span className="text-[10px] font-bold text-slate-400 mb-0.5">°C</span>
                                </div>
                            </div>

                            {/* VISIBILITY (UPDATED) */}
                            <div className={`${ROW_H.VIS} flex flex-col items-center justify-center p-2 border-b border-slate-100/50 z-10`}>
                                <span className="text-sm font-bold text-slate-800 px-2 py-0.5 bg-white/60 rounded border border-slate-100 whitespace-nowrap">
                                    {loc.visibilityDisplay || "-"}
                                </span>
                            </div>

                            {/* HUMIDITY */}
                            <div className={`${ROW_H.HUMID} flex flex-col items-center justify-center p-2 z-10`}>
                                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 border border-slate-200">
                                    <Droplets size={12} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">{loc.humidity} <span className="text-[10px] font-medium text-slate-400">%</span></span>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}