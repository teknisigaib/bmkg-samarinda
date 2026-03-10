"use client";

// Import fungsi helper dari Library
import { 
    AwosFullData, 
    AwosItem, 
    calculateWindComponents, 
    calculateDensityAltitude, 
    parseClouds 
} from "@/lib/awos-utils";

import { 
  AlertCircle, Eye, Thermometer, 
  Cloud, CloudRain, Droplets, Wind, Clock, Bug,
  Navigation, Sun, Zap, Activity, ChevronUp,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plane
} from "lucide-react";

// --- KOMPONEN: CROSSWIND WIDGET ---
const CrosswindWidget = ({ windSpd, windDir, rwyLabel }: { windSpd: number, windDir: number, rwyLabel: string }) => {
    const rwyHeading = rwyLabel === '04' ? 40 : 220;
    
    // PENGGUNAAN FUNGSI DARI LIB
    const { headwind, crosswind, isCrosswindRight, isTailwind } = calculateWindComponents(windSpd, windDir, rwyHeading);

    // Limit Warning
    const isXwHigh = crosswind >= 15;
    const isTwHigh = isTailwind && Math.abs(headwind) >= 5;

    return (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 mt-3 w-full">
            {/* ... (Visualisasi UI tetap sama seperti sebelumnya) ... */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Wind Components</span>
                <span className="text-[9px] font-mono text-slate-300">RWY {rwyLabel} ({rwyHeading}°)</span>
            </div>

            <div className="flex items-stretch gap-2">
                {/* Visual Pesawat & Angin */}
                <div className="relative w-16 h-20 bg-white rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="absolute h-full w-8 border-x-2 border-dashed border-slate-200"></div>
                    <Plane className="text-slate-300 relative z-10" size={24} strokeWidth={1.5} />
                    <div 
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                        style={{ transform: `rotate(${windDir - rwyHeading}deg)` }}
                    >
                        <div className="absolute -top-4">
                            <ArrowDown size={16} className="text-blue-500 fill-blue-500 animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* Data Angka */}
                <div className="flex-1 flex flex-col justify-between gap-2">
                    {/* HW/TW */}
                    <div className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${isTwHigh ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-1.5">
                            {isTailwind ? (
                                <ArrowUp size={14} className={isTwHigh ? "text-amber-500" : "text-slate-400"} />
                            ) : (
                                <ArrowDown size={14} className="text-emerald-500" />
                            )}
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                                {isTailwind ? 'Tailwind' : 'Headwind'}
                            </span>
                        </div>
                        <span className={`text-sm font-black ${isTwHigh ? 'text-amber-600' : 'text-slate-700'}`}>
                            {Math.abs(headwind)} <span className="text-[9px]">KT</span>
                        </span>
                    </div>

                    {/* XW */}
                    <div className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${isXwHigh ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-1.5">
                            {crosswind > 0 ? (
                                isCrosswindRight ? 
                                <ArrowLeft size={14} className={isXwHigh ? "text-rose-500" : "text-slate-400"} /> : 
                                <ArrowRight size={14} className={isXwHigh ? "text-rose-500" : "text-slate-400"} />
                            ) : (
                                <span className="w-3.5"></span>
                            )}
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Crosswind</span>
                        </div>
                        <span className={`text-sm font-black ${isXwHigh ? 'text-rose-600' : 'text-slate-700'}`}>
                            {crosswind} <span className="text-[9px]">KT</span>
                            <span className="text-[9px] ml-1 text-slate-400 font-sans">
                                {crosswind > 0 ? (isCrosswindRight ? '(R)' : '(L)') : ''}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN: WIND COMPASS ---
const WindCompass = ({ data, rwyLabel }: { data: AwosItem | null, rwyLabel: string }) => {
    if (!data || data.wind_speed === undefined) return (
        <div className="w-full h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-full border border-dashed border-slate-200">
            <Wind className="w-8 h-8 mb-2 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Sensor Offline</span>
        </div>
    );

    const rwyHeading = rwyLabel === '04' ? 40 : 220; 
    const windRot = data.wind_direction || 0;
    const windSpd = data.wind_speed || 0;

    return (
        <div className="relative w-48 h-48 flex items-center justify-center mb-2">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* ... (SVG Drawing tetap sama) ... */}
                <circle cx="100" cy="100" r="98" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                {Array.from({ length: 36 }).map((_, i) => {
                    const deg = i * 10;
                    const isMajor = i % 9 === 0; 
                    return (
                        <line key={i} x1="100" y1="5" x2="100" y2={isMajor ? "15" : "8"}
                            stroke={isMajor ? "#475569" : "#cbd5e1"}
                            strokeWidth={isMajor ? "2" : "1"}
                            transform={`rotate(${deg} 100 100)`} />
                    );
                })}
                <text x="100" y="28" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">N</text>
                <text x="172" y="104" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">E</text>
                <text x="100" y="180" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">S</text>
                <text x="28" y="104" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">W</text>
                
                {/* Visual Runway */}
                <g transform={`rotate(${rwyHeading} 100 100)`}>
                    <rect x="88" y="35" width="24" height="130" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="100" y1="40" x2="100" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="100" y="155" textAnchor="middle" className="text-xs font-bold fill-slate-400" style={{ transform: 'rotate(180 100 155)' }}>
                        {rwyLabel === '04' ? '22' : '04'}
                    </text>
                    <text x="100" y="55" textAnchor="middle" className="text-xs font-bold fill-slate-400">
                        {rwyLabel}
                    </text>
                </g>

                {/* Wind Arrow */}
                <g transform={`rotate(${windRot} 100 100)`}>
                    <path d="M100 45 L110 25 L100 32 L90 25 Z" fill="#1e293b" stroke="none" />
                </g>

                {/* Center Info */}
                <circle cx="100" cy="100" r="32" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                <text x="100" y="98" textAnchor="middle" className="text-3xl font-bold fill-slate-800">{windSpd}</text>
                <text x="100" y="112" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">KNOTS</text>
                <text x="100" y="124" textAnchor="middle" className="text-[10px] font-bold fill-slate-600">
                    {windRot.toString().padStart(3, '0')}°
                </text>
            </svg>
        </div>
    );
};

// --- KOMPONEN: MIDDLE PANEL ---
const MiddlePanel = ({ data }: { data: AwosItem | null }) => {
    if (!data) return (
        <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-300 min-h-[400px]">
            <Activity className="w-8 h-8 mb-2 opacity-20" />
            <span className="text-sm font-bold uppercase tracking-widest opacity-30">Middle Zone Offline</span>
        </div>
    );

    // PENGGUNAAN FUNGSI DARI LIB
    const densityAlt = calculateDensityAltitude(data.air_temperature, data.qnh);

    return (
        <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 flex flex-col h-full space-y-3">
             {/* ... (Tampilan Middle Panel sama seperti sebelumnya) ... */}
            <div className="flex justify-center mb-1">
                <div className="bg-slate-200 text-slate-700 px-4 py-1 rounded-full text-[12px] font-bold border border-slate-300 tracking-widest uppercase">
                    Middle
                </div>
            </div>

            {/* Lightning */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 mt-2 shadow-sm flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                    <Zap size={15} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lightning</span>
                </div>
                <div className="text-center">
                    <span className="text-lg font-bold text-slate-700">
                        {data.nws_Lightning && data.nws_Lightning.trim() !== "" ? data.nws_Lightning : "No Strikes"}
                    </span>
                </div>
            </div>

            {/* Density Altitude */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-col items-center">
                <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                    <ChevronUp size={15} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Density Altitude</span>
                </div>
                <div className="text-lg font-bold text-slate-700">
                    {densityAlt.toLocaleString()} <span className="text-[10px] font-sans font-bold uppercase">ft</span>
                </div>
            </div>
            
            {/* Temp & Humid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center border-r border-slate-100">
                        <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                            <Thermometer size={14} />
                            <span className="text-[9px] font-bold uppercase">Air Temp</span>
                        </div>
                        <span className="text-2xl font-black text-slate-700 tracking-tighter">{data.air_temperature}°</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                            <Droplets size={14} />
                            <span className="text-[9px] font-bold uppercase">Humidity</span>
                        </div>
                        <span className="text-2xl font-black text-slate-700 tracking-tighter">{data.humidity}<span className="text-sm ml-0.5">%</span></span>
                    </div>
                </div>
                <div className="pt-3 border-t border-slate-50 flex justify-center items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Dew Point:</span>
                    <span className="text-xs font-bold text-slate-500">{data.dewpoint}°C</span>
                </div>
            </div>

            {/* Solar & Rain */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                        <Sun size={14} />
                        <span className="text-[9px] font-bold uppercase">Solar</span>
                    </div>
                    <div className="text-center">
                        <span className="text-lg font-bold text-slate-600">{data.solar_radiation}</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">W/m²</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                        <CloudRain size={14} />
                        <span className="text-[9px] font-bold uppercase">Rain</span>
                    </div>
                    <div className="text-center">
                        <span className="text-lg font-bold text-slate-600">{data.precipitation}</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">mm</p>
                    </div>
                </div>
            </div>

             {/* Center Wind */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex justify-between items-center px-4 mt-auto">
                <div className="flex items-center gap-2 text-slate-400">
                    <Navigation size={12} />
                    <span className="text-[10px] font-bold uppercase">Mid Wind</span>
                </div>
                <div className="text-xs font-bold text-slate-500">
                    {data.wind_direction.toString().padStart(3, '0')}° / {data.wind_speed} KT
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN: RUNWAY PANEL ---
const RunwayPanel = ({ data, label }: { data: AwosItem | null, label: string }) => {
    // PENGGUNAAN FUNGSI DARI LIB
    const clouds = parseClouds(data?.sky_condition || "");

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center h-full relative overflow-hidden">
            {/* Logic Debugging Visual */}
            {!data && (
                <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Sensor RWY {label} Offline</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Sistem tidak menerima payload data dari ID Station ini.</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 bg-slate-100 py-1 px-2 rounded">
                            <Bug size={10} /> ID_STATION_ERR_01
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-4 bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold border border-slate-200">
                RUNWAY {label}
            </div>

            {/* A. KOMPAS ANGIN */}
            <WindCompass data={data} rwyLabel={label} />

            {/* B. CROSSWIND CALCULATOR WIDGET */}
            {data && (
                <div className="w-full mb-4">
                     <CrosswindWidget 
                        windSpd={data.wind_speed} 
                        windDir={data.wind_direction} 
                        rwyLabel={label} 
                     />
                </div>
            )}

            {/* C. GRID DATA LAINNYA */}
            <div className="w-full space-y-3">
                
                {/* 1. VISIBILITY */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Visibility</span>
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-800">{data?.visibility ?? '-'}</span>
                        <span className="text-xs font-bold text-slate-400 ml-1">m</span>
                    </div>
                </div>

                {/* 2. PRESSURE */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">QFF</span>
                        <span className="text-sm font-bold text-slate-800">{data?.qff ?? '-'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">QFE</span>
                        <span className="text-sm font-bold text-slate-800">{data?.qfe ?? '-'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">QNH</span>
                        <span className="text-sm font-bold text-slate-800">{data?.qnh ?? '-'}</span>
                    </div>
                </div>

                {/* 3. TEMP & DEW */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-around">
                    <div className="flex items-center gap-3">
                        <Thermometer size={18} className="text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-slate-800">{data?.air_temperature ?? '-'}°</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Temp</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="flex items-center gap-3">
                        <Droplets size={18} className="text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-slate-800">{data?.dewpoint ?? '-'}°</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Dew</span>
                        </div>
                    </div>
                </div>

                {/* 4. CLOUDS & WEATHER */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-3 mb-3 border-b border-slate-200 pb-3">
                        <CloudRain size={18} className="text-slate-400" />
                        <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-500 uppercase mb-1">Present Weather</span>
                             <span className="text-sm font-bold text-slate-800">
                                {data?.present_weather || "No Significant Weather"}
                             </span>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <Cloud size={18} className="text-slate-400" />
                        <div className="w-full">
                            <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Clouds</span>
                            {clouds.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {clouds.map((c, i) => (
                                        <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-700">
                                            {c.type} {c.height}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm font-bold text-slate-400 italic">NSC / CAVOK</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- MAIN LAYOUT (Tidak Berubah) ---
export default function AwosDisplay({ fullData }: { fullData: AwosFullData | null }) {
    if (!fullData) return null;

    const activeData = fullData.rwy22 || fullData.rwy04 || fullData.middle;
    const lastUpdate = activeData?._time 
        ? new Date(activeData._time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
        : "--:--";

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center pt-4 pb-2">
                <div className="flex items-baseline gap-3 mb-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        AWOS APT Pranoto Airport
                    </h1>
                    <span className="text-xl font-bold text-slate-400">
                        (WALS)
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/50 border border-emerald-100/50">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            Live Monitoring
                        </span>
                    </div>
                    <div className="h-4 w-px bg-slate-300/50"></div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm font-bold tracking-tight">
                            {lastUpdate} <span className="text-[10px] font-sans font-bold text-slate-400">UTC</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <RunwayPanel data={fullData.rwy22} label="22" />
                <MiddlePanel data={fullData.middle} />
                <RunwayPanel data={fullData.rwy04} label="04" />
            </div>
        </div>
    );
}