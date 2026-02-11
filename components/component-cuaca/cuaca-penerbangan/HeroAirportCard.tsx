"use client";
import { useState, useEffect } from "react";
import { 
    Plane, Wind, Eye, Droplets, Gauge, Clock, Terminal, 
    Loader2, ChevronDown, ArrowUp 
} from "lucide-react";
import { ParsedMetar, RawMetar, getPublicSummary } from "@/lib/bmkg/aviation-utils";
import { getRawMetar, getRawSpeci, getRawTaf } from "@/lib/bmkg/aviation";
import { TicketMetricItem, RawDataBlock } from "./FlightSharedUI";

// WIND CALCULATION
const calculateWindComponents = (windSpeed: string, windDir: string, runwayHeading: number) => {
    const speed = parseInt(windSpeed) || 0;
    const dir = (windDir === "VRB" || isNaN(parseInt(windDir))) ? runwayHeading : parseInt(windDir);
    
    const angleRad = (dir - runwayHeading) * (Math.PI / 180);
    const crosswind = Math.abs(Math.round(Math.sin(angleRad) * speed));
    const headwind = Math.round(Math.cos(angleRad) * speed);

    return { 
        crosswind, 
        headwind, 
        isHeadwind: headwind >= 0,
        dir,
        speed
    };
};

export default function HeroAirportCard({ airport }: { airport: ParsedMetar }) {
    const { status, humanWeather } = getPublicSummary(airport.visibility, airport.weather);
    const [showDetail, setShowDetail] = useState(false);
    const [rawData, setRawData] = useState<{metar: RawMetar[], speci: RawMetar[], taf: RawMetar[]} | null>(null);
    const [loadingRaw, setLoadingRaw] = useState(false);

    // KONFIGURASI RUNWAY SAMARINDA
    const RUNWAY_HEADING = 40; 
    
    const windData = calculateWindComponents(airport.wind_speed, airport.wind_direction, RUNWAY_HEADING);

    useEffect(() => {
        if (showDetail) {
            setLoadingRaw(true);
            Promise.all([getRawMetar(airport.icao_id), getRawSpeci(airport.icao_id), getRawTaf(airport.icao_id)])
                .then(([metar, speci, taf]) => setRawData({ metar, speci, taf }))
                .catch(e => console.error(e))
                .finally(() => setLoadingRaw(false));
        }
    }, [showDetail, airport.icao_id]);

    return (
        <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 via-blue-50/20 to-transparent pointer-events-none" />

            <div className="relative z-10 px-6 pt-8 md:px-10 md:pt-10 pb-8">
                
                {/* HEADER */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                            <Plane className="w-4 h-4 text-blue-500" />
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Aviation Boarding Pass</span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight max-w-2xl">
                                {airport.station_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-slate-500">
                                <span className="font-bold text-blue-600 text-lg leading-none">{airport.icao_id}</span>
                                <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
                                <span className="font-mono flex items-center gap-1.5 text-slate-700">
                                    <Clock className="w-4 h-4" /> {airport.observed_time} {airport.time_zone}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={`px-5 py-3 rounded-xl font-bold text-sm flex flex-col items-end gap-1 shadow-sm border self-start xl:self-auto ${status.label.includes('Waspada') ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                        <span className="text-[10px] uppercase tracking-widest opacity-70">Flight Condition</span>
                        <div className="flex items-center gap-2 text-base">
                            <span className={`relative flex h-3 w-3`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.label.includes('Waspada') ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${status.label.includes('Waspada') ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                            </span>
                            {status.label}
                        </div>
                    </div>
                </div>

                {/* (RUNWAY VISUALIZER & METRICS) */}
                <div className="flex flex-col xl:flex-row gap-10 xl:items-center">
                    
                    {/* KIRI: RUNWAY & TEMP VISUALIZER */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 shrink-0 bg-white/60 p-5 rounded-[2rem] border border-blue-100/50 backdrop-blur-sm shadow-sm">
                        
                        {/* VISUALISASI RUNWAY - */}
                        <div className="relative w-44 h-44 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 rounded-full border-[5px] border-white shadow-[0_8px_20px_-6px_rgba(59,130,246,0.15)] overflow-hidden shrink-0 group">
                            
                            {/* Grid Kompas */}
                            <div className="absolute inset-0 border border-blue-200/60 rounded-full m-5"></div>
                            <div className="absolute inset-0 border border-blue-100/40 rounded-full m-10"></div>
                            <div className="absolute top-2 text-[9px] font-black text-blue-400">N</div>
                            <div className="absolute bottom-2 text-[9px] font-bold text-blue-300/70">S</div>
                            <div className="absolute right-2 text-[9px] font-bold text-blue-300/70">E</div>
                            <div className="absolute left-2 text-[9px] font-bold text-blue-300/70">W</div>
                            
                            {/* Runway Strip  */}
                            <div 
                                className="w-14 h-36 bg-slate-300 rounded-lg flex flex-col justify-between items-center py-2 relative z-10 shadow-md border-2 border-slate-200"
                                style={{ transform: `rotate(${RUNWAY_HEADING}deg)` }}
                            >
                                {/* Text 04 (Atas) */}
                                <span className="text-white drop-shadow-sm text-[11px] font-black" style={{ transform: `rotate(-${RUNWAY_HEADING}deg)` }}>04</span>
                                {/* Garis tengah putus-putus */}
                                <div className="w-1 h-12 border-l-2 border-dashed border-white/70"></div>
                                {/* Text 22 (Bawah) */}
                                <span className="text-white drop-shadow-sm text-[11px] font-black" style={{ transform: `rotate(-${RUNWAY_HEADING}deg)` }}>22</span>
                            </div>

                            {/* Wind Arrow */}
                            <div 
                                className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out z-20"
                                style={{ transform: `rotate(${windData.dir + 180}deg)` }}
                            >
                                <div className="flex flex-col items-center -translate-y-14">
                                    <ArrowUp className="w-10 h-10 text-rose-500 fill-rose-500 animate-bounce drop-shadow-lg filter contrast-125" strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Wind Label */}
                            <div className="absolute z-30 bg-rose-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold bottom-4 border-2 border-white shadow-md">
                                {airport.wind_speed} KT
                            </div>
                        </div>

                        {/*  INFO SUHU & KOMPONEN ANGIN */}
                        <div className="text-center sm:text-left space-y-5">
                            
                            {/* Temperature  */}
                            <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Temperature</div>
                                <div className="text-6xl font-black text-slate-800 flex items-start leading-none tracking-tighter justify-center sm:justify-start">
                                    {airport.temp}<span className="text-2xl text-slate-400 font-medium mt-1 ml-1">°C</span>
                                </div>
                                <div className="text-sm font-bold text-slate-500 mt-2 capitalize bg-white border border-slate-100 px-4 py-1.5 rounded-full inline-block shadow-sm">
                                    {humanWeather}
                                </div>
                            </div>

                            {/* Wind Component */}
                            <div className="flex gap-3 justify-center sm:justify-start">
                                <div className={`bg-white border ${windData.isHeadwind ? 'border-emerald-100 bg-emerald-50/50' : 'border-rose-100 bg-rose-50/50'} p-2.5 rounded-xl shadow-sm flex flex-col items-center min-w-[75px]`}>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Headwind</span>
                                    <span className={`text-base font-black ${windData.isHeadwind ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {Math.abs(windData.headwind)} <span className="text-[10px] font-bold opacity-60">kt</span>
                                    </span>
                                </div>
                                <div className="border border-amber-100 bg-amber-50/50 p-2.5 rounded-xl shadow-sm flex flex-col items-center min-w-[75px]">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">X-Wind</span>
                                    <span className="text-base font-black text-amber-500">
                                        {windData.crosswind} <span className="text-[10px] font-bold opacity-60">kt</span>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* KANAN: Grid Metrik Detail */}
                    <div className="flex-1 w-full xl:pl-10 xl:border-l-2 border-dashed border-slate-100">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Flight Metrics Data
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TicketMetricItem 
                                icon={<Eye className="w-4 h-4" />} 
                                label="Jarak Pandang" 
                                value={`${airport.visibility} km`}
                            />
                            <TicketMetricItem 
                                icon={<Wind className="w-4 h-4" />} 
                                label="Angin" 
                                value={`${airport.wind_speed} km/j`} 
                                sub={`Dari ${airport.wind_direction}`}
                            />
                            <TicketMetricItem 
                                icon={<Droplets className="w-4 h-4" />} 
                                label="Titik Embun" 
                                value={`${airport.dew_point} °C`}
                            />
                            <TicketMetricItem 
                                icon={<Gauge className="w-4 h-4" />} 
                                label="Tekanan (QNH)" 
                                value={`${airport.pressure} hPa`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tear Line & Footer */}
            <div className="relative w-full h-8 my-2 bg-slate-50/50">
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-slate-300"></div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)]"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full shadow-[inset_2px_0_4px_rgba(0,0,0,0.05)]"></div>
            </div>

            <div className="relative z-10 px-6 pb-8 md:px-10 md:pb-10 pt-6 bg-slate-50/50">
                <div className="flex flex-col gap-6">
                    <div className="w-full h-14 opacity-30 bg-repeat-x mix-blend-multiply" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='40' viewBox='0 0 200 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23334155'%3E%3Crect x='0' width='2' height='40'/%3E%3Crect x='4' width='4' height='40'/%3E%3Crect x='10' width='2' height='40'/%3E%3Crect x='14' width='6' height='40'/%3E%3Crect x='22' width='2' height='40'/%3E%3Crect x='26' width='4' height='40'/%3E%3Crect x='32' width='2' height='40'/%3E%3Crect x='36' width='2' height='40'/%3E%3Crect x='40' width='4' height='40'/%3E%3Crect x='46' width='2' height='40'/%3E%3Crect x='50' width='6' height='40'/%3E%3Crect x='58' width='2' height='40'/%3E%3Crect x='62' width='4' height='40'/%3E%3Crect x='68' width='2' height='40'/%3E%3Crect x='72' width='2' height='40'/%3E%3Crect x='76' width='4' height='40'/%3E%3Crect x='82' width='2' height='40'/%3E%3Crect x='86' width='6' height='40'/%3E%3Crect x='94' width='2' height='40'/%3E%3Crect x='98' width='4' height='40'/%3E%3Crect x='104' width='2' height='40'/%3E%3Crect x='108' width='2' height='40'/%3E%3Crect x='112' width='4' height='40'/%3E%3Crect x='118' width='2' height='40'/%3E%3Crect x='122' width='6' height='40'/%3E%3Crect x='130' width='2' height='40'/%3E%3Crect x='134' width='4' height='40'/%3E%3Crect x='140' width='2' height='40'/%3E%3Crect x='144' width='2' height='40'/%3E%3Crect x='148' width='4' height='40'/%3E%3Crect x='154' width='2' height='40'/%3E%3Crect x='158' width='6' height='40'/%3E%3Crect x='166' width='2' height='40'/%3E%3Crect x='170' width='4' height='40'/%3E%3Crect x='176' width='2' height='40'/%3E%3Crect x='180' width='2' height='40'/%3E%3Crect x='184' width='4' height='40'/%3E%3Crect x='190' width='2' height='40'/%3E%3Crect x='194' width='6' height='40'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
                    <button 
                        onClick={() => setShowDetail(!showDetail)}
                        className="w-full flex items-center justify-center gap-3 text-sm bg-slate-800 hover:bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl shadow-slate-200/50 group"
                    >
                        <Terminal className="w-5 h-5 group-hover:text-blue-300 transition-colors" />
                        {showDetail ? "Tutup Data Meteorologi" : "Lihat Data Mentah (METAR/TAF)"}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showDetail ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {showDetail && (
                    <div className="mt-6 bg-slate-900 rounded-[2rem] p-2 animate-in fade-in slide-in-from-top-4 duration-500 border border-slate-800 shadow-2xl relative z-20">
                         {loadingRaw ? (
                                <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" /> 
                                    <span className="font-medium">Mengambil data dari Aviation BMKG...</span>
                                </div>
                            ) : rawData ? (
                                <div className="flex flex-col gap-2 p-2">
                                    <RawDataBlock title="METAR" data={rawData.metar} colorClass="text-green-400" bgClass="bg-green-500/10" borderClass="border-green-500/20" />
                                    <RawDataBlock title="SPECI" data={rawData.speci} colorClass="text-yellow-400" bgClass="bg-yellow-500/10" borderClass="border-yellow-500/20" />
                                    <RawDataBlock title="TAF" data={rawData.taf} colorClass="text-blue-400" bgClass="bg-blue-500/10" borderClass="border-blue-500/20" isTaf={true} />
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 font-medium">Gagal memuat data.</div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}