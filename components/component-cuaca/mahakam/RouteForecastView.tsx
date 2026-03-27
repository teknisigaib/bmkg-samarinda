"use client";

import React from 'react';
import { MahakamLocation, translateWindDir } from '@/lib/mahakam-data';
import { 
    Navigation2, CloudSun, Cloud,
    Thermometer, Eye, Droplets, 
    AlertTriangle, CheckCircle2, XCircle, 
} from 'lucide-react';

interface Props {
    data: MahakamLocation[];
    onSelect: (loc: MahakamLocation) => void;
    activeId?: string;
}

const getNavStatus = (loc: MahakamLocation) => {
    // 1. Kriteria Bahaya (Merah)
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
            badgeStyle: 'bg-red-50 text-red-700 border-red-200',
            colBase: 'bg-white', 
            colHover: 'hover:bg-red-50/50',
            colActive: 'bg-red-50 ring-2 ring-inset ring-red-400 z-20 shadow-[0_0_20px_rgba(248,113,113,0.15)]',
            headerBg: 'bg-red-50',
            headerText: 'text-red-900',
            activeBadge: 'text-red-600 bg-white border-red-200'
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
            badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
            colBase: 'bg-white', 
            colHover: 'hover:bg-amber-50/50',
            colActive: 'bg-amber-50 ring-2 ring-inset ring-amber-400 z-20 shadow-[0_0_20px_rgba(251,191,36,0.15)]',
            headerBg: 'bg-amber-50',
            headerText: 'text-amber-900',
            activeBadge: 'text-amber-700 bg-white border-amber-200'
        };
    }

    // 3. Aman (Putih/Biru Default)
    return { 
        type: 'safe', 
        label: 'Aman', 
        icon: CheckCircle2, 
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        colBase: 'bg-white',
        colHover: 'hover:bg-slate-50',
        colActive: 'bg-blue-50/40 ring-2 ring-inset ring-blue-400 z-20 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
        headerBg: 'bg-white',
        headerText: 'text-slate-900',
        activeBadge: 'text-blue-600 bg-white border-blue-200'
    };
};

// Tinggi baris DIKUNCI KETAT (h + min-h) agar tidak ada yang melar/menciut
const ROW_H = {
    HEADER: "h-[70px] min-h-[70px]", // Tinggi header dikurangi menjadi 70px
    STATUS: "h-[65px] min-h-[65px]", 
    WEATHER: "h-[110px] min-h-[110px]", 
    WIND: "h-[85px] min-h-[85px]",      
    TEMP: "h-[65px] min-h-[65px]",
    CLOUD: "h-[65px] min-h-[65px]", 
    VIS: "h-[65px] min-h-[65px]",
    HUMID: "h-[65px] min-h-[65px]"
};

// Style Label Kiri (Dengan Ikon)
const LABEL_CONTAINER = "flex items-center gap-3 px-5 w-full";
const LABEL_TEXT = "text-[10px] font-bold uppercase tracking-widest text-slate-500";
const LABEL_ICON = "text-slate-400 shrink-0";

// Style Sel Data 
const DATA_CELL = "flex flex-col items-center justify-center p-2 w-full border-b border-slate-100/50 shrink-0 overflow-hidden";
const ZEBRA_BG = "bg-slate-50/40"; 

export default function RouteForecastView({ data, onSelect, activeId }: Props) {
  
  return (
    <div className="w-full min-w-0 animate-in fade-in slide-in-from-bottom-8 duration-700 text-slate-800 pb-10">

      {/* WADAH TABEL */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 relative w-full grid grid-cols-1 overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar bg-slate-50/30">
            <div className="flex min-w-max bg-white">
            
                {/* --- 1. KOLOM LABEL STICKY KIRI --- */}
                <div className="sticky left-0 z-30 w-44 md:w-56 shrink-0 border-r border-slate-200 bg-white shadow-[8px_0_20px_-5px_rgba(0,0,0,0.05)]">
                    
                    <div className={`${ROW_H.HEADER} flex flex-col items-center justify-center border-b border-slate-200 bg-slate-50/50 p-2`}>
                        <Navigation2 className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 text-center">Pilih Area</span>
                    </div>

                    <div className={`${ROW_H.STATUS} flex items-center border-b border-slate-100 ${ZEBRA_BG}`}>
                        <div className={LABEL_CONTAINER}><AlertTriangle size={16} className={LABEL_ICON}/><span className={LABEL_TEXT}>Status Navigasi</span></div>
                    </div>

                    <div className={`${ROW_H.WEATHER} flex items-center border-b border-slate-100`}>
                        <div className={LABEL_CONTAINER}><CloudSun size={18} className={LABEL_ICON}/><span className={LABEL_TEXT}>Kondisi Cuaca</span></div>
                    </div>
                    
                    <div className={`${ROW_H.WIND} flex items-center border-b border-slate-100 ${ZEBRA_BG}`}>
                        <div className={LABEL_CONTAINER}><Navigation2 size={16} className={LABEL_ICON}/><span className={LABEL_TEXT}>Angin & Arah</span></div>
                    </div>

                    <div className={`${ROW_H.TEMP} flex items-center border-b border-slate-100`}>
                        <div className={LABEL_CONTAINER}><Thermometer size={16} className={LABEL_ICON}/><span className={LABEL_TEXT}>Suhu Udara</span></div>
                    </div>

                    <div className={`${ROW_H.CLOUD} flex items-center border-b border-slate-100 ${ZEBRA_BG}`}>
                        <div className={LABEL_CONTAINER}><Cloud size={16} className={LABEL_ICON}/><span className={LABEL_TEXT}>Tutupan Awan</span></div>
                    </div>

                    <div className={`${ROW_H.VIS} flex items-center border-b border-slate-100`}>
                        <div className={LABEL_CONTAINER}><Eye size={16} className={LABEL_ICON}/><span className={LABEL_TEXT}>Jarak Pandang</span></div>
                    </div>

                    <div className={`${ROW_H.HUMID} flex items-center border-b border-slate-100 ${ZEBRA_BG}`}>
                        <div className={LABEL_CONTAINER}><Droplets size={16} className={LABEL_ICON}/><span className={LABEL_TEXT}>Kelembaban (RH)</span></div>
                    </div>
                </div>

                {/* --- 2. KOLOM DATA LOKASI --- */}
                {data.map((loc, idx) => {
                    const isActive = activeId === loc.id;
                    const status = getNavStatus(loc);

                    const columnClass = isActive 
                        ? `${status.colActive}` 
                        : `${status.colBase} ${status.colHover}`;

                    return (
                        <div 
                            key={idx} 
                            onClick={() => onSelect(loc)}
                            className={`
                                w-32 md:w-36 border-r border-slate-100 flex flex-col shrink-0 text-center relative cursor-pointer transition-all duration-300 group
                                ${columnClass}
                            `}
                        >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/[0.02] transition-colors pointer-events-none z-0" />

                            {/* HEADER LOKASI (Diperkecil & badge dihilangkan) */}
                            <div className={`${ROW_H.HEADER} flex flex-col items-center justify-center p-2 border-b border-slate-200 z-10 transition-colors ${status.headerBg}`}>
                                <h3 className={`text-xs font-black uppercase tracking-widest leading-tight line-clamp-2 text-center ${status.headerText}`}>
                                    {loc.name.replace('Stasiun Meteorologi', '').replace('Stasiun', '').trim()}
                                </h3>
                            </div>

                            {/* STATUS */}
                            <div className={`${ROW_H.STATUS} ${DATA_CELL} ${ZEBRA_BG} z-10`}>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.badgeStyle}`}>
                                    <status.icon size={12} strokeWidth={2.5} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">{status.label}</span>
                                </div>
                            </div>

                            {/* CUACA */}
                            <div className={`${ROW_H.WEATHER} ${DATA_CELL} z-10`}>
                                <div className="w-12 h-12 mb-1.5 transition-transform group-hover:scale-110 duration-300">
                                    {loc.iconUrl ? <img src={loc.iconUrl} alt="" className="w-full h-full object-contain filter saturate-100" /> : <div className="w-full h-full bg-slate-100 rounded-full animate-pulse"/>}
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest line-clamp-2 px-1 leading-tight">{loc.weather}</span>
                            </div>

                            {/* ANGIN */}
                            <div className={`${ROW_H.WIND} ${DATA_CELL} ${ZEBRA_BG} z-10`}>
                                <div className="flex items-baseline gap-0.5 mb-1.5">
                                    <span className="text-base font-black text-slate-900">{loc.windSpeed}</span>
                                    <span className="text-[9px] font-bold text-slate-500">km/j</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                                    <Navigation2 size={10} style={{ transform: `rotate(${loc.windDeg || 0}deg)` }} fill="currentColor" className="text-slate-400"/>
                                    <span className="truncate max-w-[80px]">{translateWindDir(loc.windDir)}</span>
                                </div>
                            </div>

                            {/* SUHU */}
                            <div className={`${ROW_H.TEMP} ${DATA_CELL} z-10`}>
                                <div className="flex items-start">
                                    <span className="text-base font-black text-slate-900">{loc.temp}</span>
                                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">°C</span>
                                </div>
                            </div>

                            {/* AWAN */}
                            <div className={`${ROW_H.CLOUD} ${DATA_CELL} ${ZEBRA_BG} z-10`}>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-base font-black text-slate-900">{loc.tcc || 0}</span>
                                    <span className="text-[10px] font-bold text-slate-500">%</span>
                                </div>
                            </div>

                            {/* VISIBILITY */}
                            <div className={`${ROW_H.VIS} ${DATA_CELL} z-10`}>
                                <span className="text-sm font-black text-slate-800 whitespace-nowrap">
                                    {loc.visibilityDisplay || "-"}
                                </span>
                            </div>

                            {/* HUMIDITY */}
                            <div className={`${ROW_H.HUMID} ${DATA_CELL} ${ZEBRA_BG} z-10`}>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-base font-black text-slate-900">{loc.humidity}</span>
                                    <span className="text-[10px] font-bold text-slate-500">%</span>
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