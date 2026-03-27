"use client";

import { useState } from "react";
import { 
  X, Map, Thermometer, Wind, Eye, FileText, 
  AlertTriangle, Cloud, Gauge, Clock, Info, 
  CloudRain, Navigation2, Copy, Check, ArrowDown 
} from "lucide-react";

// --- INTERFACES ---
export interface CloudLayer {
    cover: string;
    height: number;
    type: string;
}

export interface AirportData {
  id: string;
  name: string;
  city: string;
  elevation: string;
  runway: string;
  lat: number;
  lon: number;
  category: 'VFR' | 'IFR' | 'LIFR' | 'MVFR';
  
  temp: number;
  dew: number;
  wind_dir: number;
  wind_spd: number;
  vis: string;
  qnh: number;
  clouds: CloudLayer[];
  weather: string;
  observed_time: string;
  remark: string;

  metar: string;
  speci?: string | null;
  taf: string;
}

interface Props {
  airport: AirportData | null;
  onClose: () => void;
}

export default function AirportDetailPanel({ airport, onClose }: Props) {
  const isOpen = !!airport;
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // --- LOGIC: COPY TO CLIPBOARD ---
  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // --- LOGIC: PARSE RUNWAY NUMBERS ---
  const getRunwayConfig = (runwayStr: string) => {
      const matches = runwayStr ? runwayStr.match(/(\d{2})\/(\d{2})/) : null;
      if (!matches) return null;
      return {
          label1: matches[1], 
          label2: matches[2], 
          heading: parseInt(matches[1]) * 10 
      };
  };

  const rwyConfig = airport ? getRunwayConfig(airport.runway) : null;

  return (
    <div 
      className={`
        absolute top-0 right-0 bottom-0 w-full md:w-[360px] z-[2050] /* Sedikit diperkecil lebarnya agar lebih padat */
        bg-white border-l border-slate-200 shadow-2xl
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {airport && (
        <>
          {/* --- HEADER PANEL --- */}
          {/* Padding dikurangi sedikit (py-4) agar tidak terlalu tinggi */}
          <div className="px-5 py-4 border-b border-slate-100 bg-white">
            <div className="flex justify-between items-start">
               <div>
                   <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{airport.id}</h2>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            airport.category === 'VFR' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                            'border-amber-200 text-amber-700 bg-amber-50'
                        }`}>
                            {airport.category}
                        </span>
                   </div>
                   <p className="text-sm font-medium text-slate-500">{airport.name}</p>
                   <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Map size={10} /> {airport.city} • Elev: {airport.elevation}
                   </p>
               </div>
               <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* --- SCROLLABLE CONTENT --- */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-5 space-y-5">
            
            {/* 1. MAIN CARD: WEATHER DATA */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                
                {/* A. Header: Observation */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Observation</span>
                        {airport.speci ? (
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded tracking-tight animate-pulse">
                                SPECI
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded tracking-tight">
                                METAR
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        <Clock size={10} /> {airport.observed_time}
                    </div>
                </div>

                {/* B. Present Weather */}
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-2">
                        <CloudRain size={14} className="text-slate-400"/>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Present Weather</span>
                    </div>
                    {airport.weather !== '-' ? (
                         <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {airport.weather}
                         </span>
                    ) : (
                        <span className="text-xs text-slate-400 italic">No significant weather</span>
                    )}
                </div>

                {/* C. Sky Condition */}
                <div className="px-4 py-3 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Cloud size={14} className="text-slate-400"/>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sky Condition</span>
                    </div>
                    <div className="space-y-1.5 pl-6">
                        {airport.clouds.length > 0 ? (
                            airport.clouds.map((cloud, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 w-16">
                                            <span className={`font-bold ${['BKN','OVC'].includes(cloud.cover) ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {cloud.cover}
                                            </span>
                                            <div className={`h-1.5 rounded-full ${['BKN','OVC'].includes(cloud.cover) ? 'w-6 bg-slate-400' : 'w-3 bg-slate-200'}`}></div>
                                        </div>
                                    </div>
                                    <span className=" text-slate-600 font-medium">
                                        {cloud.height} ft {cloud.type && <span className="text-rose-600 font-bold ml-1">{cloud.type}</span>}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-slate-400 italic">No significant clouds (CAVOK/NSC)</div>
                        )}
                    </div>
                </div>

                {/* D. RUNWAY & WIND VISUALIZATION (PROPORTIONAL TWEAK) */}
                <div className="px-4 py-4 border-b border-slate-100 bg-white">
                     <div className="flex items-center gap-2 mb-3">
                        <Wind size={14} className="text-slate-400"/>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Surface Wind & Runway</span>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        {/* 1. DATA TEKS (BALANCED SIZE) */}
                        <div>
                            <div className="flex items-baseline gap-1">
                                {/* Font diturunkan ke 5xl agar tidak terlalu dominan */}
                                <span className="text-5xl font-black text-slate-800 tracking-tighter leading-none">
                                    {airport.wind_spd}
                                </span>
                                <span className="text-base font-bold text-slate-400">KT</span>
                            </div>
                            
                            <div className="mt-2 flex items-center gap-2">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</span>
                                 <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                    {airport.wind_dir.toString().padStart(3, '0')}°
                                 </span>
                            </div>
                        </div>

                        {/* 2. VISUALISASI (COMPASS SIZE ADJUSTED) */}
                        {/* Ukuran w-24 h-24 sudah pas, pastikan margin aman */}
                        <div className="relative w-24 h-24 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm shrink-0">
                            {/* Mata Angin */}
                            <span className="absolute top-1 text-[8px] font-bold text-slate-400">N</span>
                            <span className="absolute bottom-1 text-[8px] font-bold text-slate-200">S</span>
                            <span className="absolute right-1 text-[8px] font-bold text-slate-200">E</span>
                            <span className="absolute left-1 text-[8px] font-bold text-slate-200">W</span>

                            {/* RUNWAY STRIP */}
                            {rwyConfig && (
                                <div 
                                    className="absolute w-5 h-20 bg-slate-100 border border-slate-200 rounded-sm flex flex-col justify-between items-center py-1 transition-transform duration-500"
                                    style={{ transform: `rotate(${rwyConfig.heading}deg)` }}
                                >
                                    <span className="text-[7px] font-bold text-slate-400 leading-none">{rwyConfig.label2}</span>
                                    <span className="h-full w-[1px] border-l border-dashed border-slate-300"></span>
                                    <span className="text-[7px] font-bold text-slate-400 leading-none transform rotate-180">{rwyConfig.label1}</span>
                                </div>
                            )}

                            {/* WIND ARROW */}
                            <div 
                                className="absolute w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
                                style={{ transform: `rotate(${airport.wind_dir}deg)` }}
                            >
                                <ArrowDown size={22} className="text-blue-600 drop-shadow-sm mb-9" strokeWidth={3} />
                            </div>
                            
                            {/* Center Dot */}
                            <div className="absolute w-1.5 h-1.5 bg-blue-600 rounded-full z-10 border border-white shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* E. Compact Metrics (Tightened) */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-white">
                    <div className="py-2.5 px-2 flex flex-col items-center justify-center gap-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Eye size={10} /> Vis
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                            {airport.vis}
                        </div>
                    </div>
                    <div className="py-2.5 px-2 flex flex-col items-center justify-center gap-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Gauge size={10} /> QNH
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                            {airport.qnh} <span className="text-[10px] text-slate-400 font-sans">hPa</span>
                        </div>
                    </div>
                    <div className="py-2.5 px-2 flex flex-col items-center justify-center gap-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Thermometer size={10} /> Temp
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                            {airport.temp}° <span className="text-slate-300 mx-0.5">/</span> {airport.dew}°
                        </div>
                    </div>
                </div>

                {/* F. Remarks */}
                {airport.remark !== '-' && (
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-start">
                        <div className="flex items-center gap-2 mt-0.5 min-w-[80px]">
                            <Info size={12} className="text-slate-400"/>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remarks</span>
                        </div>
                        <div className="text-[10px] text-slate-600 text-right leading-tight break-words max-w-[200px]">
                            {airport.remark}
                        </div>
                    </div>
                )}
            </div>

            {/* 2. RAW DATA (COMPACT & PROPORTIONAL) */}
            <div className="space-y-3">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 relative group">
                     <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <FileText size={10} /> METAR
                        </div>
                        <button 
                            onClick={() => handleCopy(airport.metar, 'metar')}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            {copiedType === 'metar' ? <Check size={12} className="text-emerald-500"/> : <Copy size={12}/>}
                        </button>
                    </div>
                    <div className="text-slate-300 text-[10px] leading-relaxed pr-4">
                        {airport.metar}
                    </div>
                </div>
                
                {airport.speci && (
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 relative">
                         <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <AlertTriangle size={10} /> SPECI
                            </div>
                            <button onClick={() => handleCopy(airport.speci!, 'speci')} className="text-emerald-500">
                                {copiedType === 'speci' ? <Check size={12}/> : <Copy size={12}/>}
                            </button>
                        </div>
                        <div className="text-slate-500 text-[10px] leading-relaxed pr-4">
                            {airport.speci}
                        </div>
                    </div>
                )}

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 relative group">
                     <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <Navigation2 size={10} /> TAF
                        </div>
                        <button onClick={() => handleCopy(airport.taf, 'taf')} className="text-slate-500 hover:text-white">
                            {copiedType === 'taf' ? <Check size={12} className="text-emerald-500"/> : <Copy size={12}/>}
                        </button>
                    </div>
                    <div className="text-slate-300 text-[10px] leading-relaxed pr-4">
                        {airport.taf}
                    </div>
                </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}