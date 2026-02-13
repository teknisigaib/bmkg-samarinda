"use client";

import { useState } from "react";
import { 
  Wind, Thermometer, Eye, Gauge, Droplets, 
  ChevronDown, ChevronUp, ArrowUp
} from "lucide-react";
import { AwosFullData, AwosItem } from "@/lib/awos";

// --- 1. KOMPONEN WIND GAUGE (REVISI: BORDER TIPIS & POSISI DIR TERPISAH) ---
const WindGaugeCard = ({ data, label }: { data: AwosItem | null, label: string }) => {
    if (!data) return (
        <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 h-full min-h-[350px] flex items-center justify-center text-xs text-slate-300 font-mono">
            No Signal RWY {label}
        </div>
    );

    const isLowVis = (data.visibility || 9999) < 5000;
    const runwayRot = label === '04' ? 45 : 225;
    const oppositeLabel = label === '04' ? '22' : '04';

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col items-center h-full relative overflow-hidden">
            
            {/* Header: Label Sensor */}
            <div className="w-full flex justify-between items-center z-10 mb-2">
                <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    RWY {label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">TDZ SENSOR</span>
            </div>

            {/* --- GAUGE CONTAINER --- */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                
                {/* 1. VISUAL GAUGE */}
                <div className="relative w-52 h-52 flex items-center justify-center">
                    
                    {/* Border Lingkaran Luar (Lebih Tipis: border-2) */}
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200 bg-slate-50/30"></div>
                    
                    {/* Tick Marks */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="absolute w-full h-full flex justify-center p-1" style={{ transform: `rotate(${i * 30}deg)` }}>
                            <div className={`w-0.5 rounded-full ${i % 3 === 0 ? 'h-3 bg-slate-400' : 'h-1.5 bg-slate-300'}`}></div>
                        </div>
                    ))}

                    {/* Cardinal Points */}
                    <span className="absolute top-2 text-[10px] font-black text-slate-500">N</span>
                    <span className="absolute bottom-2 text-[10px] font-black text-slate-500">S</span>
                    <span className="absolute left-2 text-[10px] font-black text-slate-500">W</span>
                    <span className="absolute right-2 text-[10px] font-black text-slate-500">E</span>

                    {/* VISUAL RUNWAY */}
                    <div 
                        className="absolute w-14 h-44 bg-slate-800 rounded-md flex flex-col justify-between items-center py-2 shadow-sm border border-slate-600 z-0 opacity-90"
                        style={{ transform: `rotate(${runwayRot}deg)` }}
                    >
                        <div className="flex gap-0.5">
                            {[...Array(3)].map((_,i) => <div key={i} className="w-1 h-2.5 bg-white/90"></div>)}
                        </div>
                        <span className="text-white/90 text-[10px] font-black rotate-180 z-10 select-none">{oppositeLabel}</span>
                        <div className="h-full border-l-[1.5px] border-dashed border-white/40"></div>
                        <span className="text-white/90 text-[10px] font-black z-10 select-none">{label}</span>
                        <div className="flex gap-0.5">
                            {[...Array(3)].map((_,i) => <div key={i} className="w-1 h-2.5 bg-white/90"></div>)}
                        </div>
                    </div>

                    {/* INDIKATOR PANAH (Rotating) */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out z-10"
                        style={{ transform: `rotate(${data.wind_direction}deg)` }}
                    >
                        <div className="absolute -top-4 drop-shadow-md">
                             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-blue-600"></div>
                        </div>
                    </div>

                    {/* BUBBLE SPEED (Center) */}
                    <div className="absolute z-20 bg-white/90 backdrop-blur-sm rounded-full w-20 h-20 border-2 border-slate-200 shadow-lg flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 leading-none tracking-tighter tabular-nums">
                            {data.wind_speed}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Knots</span>
                    </div>
                </div>

                {/* 2. DIGITAL DIRECTION DISPLAY (Digeser ke bawah: mt-4) */}
                <div className="flex flex-col items-center mt-4 z-20 bg-white px-3 py-1 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Direction</span>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-black text-slate-800 font-mono leading-none">
                            {data.wind_direction?.toString().padStart(3, '0')}
                        </span>
                        <span className="text-sm font-bold text-slate-400">°</span>
                    </div>
                </div>
            </div>

            {/* Footer: Visibility */}
            <div className={`w-full mt-4 flex items-center justify-between px-4 py-2.5 rounded-2xl border ${isLowVis ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                    <Eye className="w-4 h-4" /> Visibility
                </div>
                <div className="font-mono font-bold text-lg leading-none">
                    {data.visibility} <span className="text-[10px] font-normal opacity-70">m</span>
                </div>
            </div>
        </div>
    );
};

// --- 2. KOMPONEN TENGAH (ENVIRONMENT - TIDAK ADA PERUBAHAN) ---
const MiddleInfoCard = ({ data }: { data: AwosItem | null }) => {
    if (!data) return <div className="bg-slate-50 rounded-2xl h-full flex items-center justify-center text-xs text-slate-300">No Data</div>;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 h-full flex flex-col justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 opacity-30"></div>

            <div className="mb-4">
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                    ENV
                 </span>
            </div>

            {/* Suhu */}
            <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-6xl font-black text-slate-800 tracking-tighter tabular-nums">{data.air_temperature}</span>
                <span className="text-sm font-bold text-slate-400 mt-1">°C Temp</span>
            </div>

            {/* Dewpoint */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="flex items-center gap-1 text-slate-600 font-bold">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <span className="text-xl">{data.dewpoint}°</span>
                </div>
                <span className="text-[9px] text-slate-400 uppercase mt-1">Dewpoint</span>
            </div>

            {/* Parameter Lain */}
            <div className="flex flex-col gap-3 w-full px-2">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between px-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Gauge className="w-3.5 h-3.5" /> QNH
                    </div>
                    <div className="text-slate-700 font-bold font-mono text-sm">{data.qnh} <span className="text-[9px] font-normal text-slate-400">hPa</span></div>
                </div>
                
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between px-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5" /> RH
                    </div>
                    <div className="text-slate-700 font-bold font-mono text-sm">{data.humidity}%</div>
                </div>
            </div>
        </div>
    );
};

export default function AwosVisualizer({ fullData }: { fullData: AwosFullData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      
      {/* --- DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch min-h-[400px]">
         {/* KIRI: RWY 22 (40%) */}
         <div className="lg:col-span-4 order-2 lg:order-1 h-full">
            <WindGaugeCard data={fullData.rwy22} label="22" />
         </div>

         {/* TENGAH: ENVIRONMENT (20%) */}
         <div className="lg:col-span-2 order-1 lg:order-2 h-full">
            <MiddleInfoCard data={fullData.middle} />
         </div>

         {/* KANAN: RWY 04 (40%) */}
         <div className="lg:col-span-4 order-3 h-full">
            <WindGaugeCard data={fullData.rwy04} label="04" />
         </div>
      </div>

      {/* --- EXPANDABLE TABLE (TIDAK ADA PERUBAHAN) --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-500 flex items-center justify-center gap-2 transition-colors border-b border-slate-100"
        >
            {isExpanded ? (
                <>Tutup Data Lengkap <ChevronUp className="w-3 h-3" /></>
            ) : (
                <>Buka Data Lengkap <ChevronDown className="w-3 h-3" /></>
            )}
        </button>

        {isExpanded && (
            <div className="p-0 animate-in slide-in-from-top-2 duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="text-slate-400 font-bold uppercase bg-slate-50/50">
                            <tr>
                                <th className="py-3 px-4 font-bold">Parameter</th>
                                <th className="py-3 px-4 text-center text-blue-600">RWY 22</th>
                                <th className="py-3 px-4 text-center text-slate-600">Middle</th>
                                <th className="py-3 px-4 text-center text-blue-600">RWY 04</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {[
                                { label: "Temperature", unit: "°C", k22: fullData.rwy22?.air_temperature, mid: fullData.middle?.air_temperature, k04: fullData.rwy04?.air_temperature },
                                { label: "Dew Point", unit: "°C", k22: fullData.rwy22?.dewpoint, mid: fullData.middle?.dewpoint, k04: fullData.rwy04?.dewpoint },
                                { label: "Humidity", unit: "%", k22: fullData.rwy22?.humidity, mid: fullData.middle?.humidity, k04: fullData.rwy04?.humidity },
                                { label: "Pressure (QNH)", unit: "hPa", k22: fullData.rwy22?.qnh, mid: fullData.middle?.qnh, k04: fullData.rwy04?.qnh },
                                { label: "Pressure (QFE)", unit: "hPa", k22: fullData.rwy22?.qfe, mid: fullData.middle?.qfe, k04: fullData.rwy04?.qfe },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-medium text-slate-500">{row.label}</td>
                                    <td className="py-3 px-4 text-center font-mono">{row.k22 ?? "-"}</td>
                                    <td className="py-3 px-4 text-center font-mono font-bold">{row.mid ?? "-"}</td>
                                    <td className="py-3 px-4 text-center font-mono">{row.k04 ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="py-3 bg-slate-50 text-[10px] text-slate-400 text-center font-mono border-t border-slate-100">
                    Sensor Sync: {fullData.last_update ? new Date(fullData.last_update).toLocaleTimeString() : '-'}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}