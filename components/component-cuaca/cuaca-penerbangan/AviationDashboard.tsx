"use client";

import { useState, useEffect } from "react";
import { 
    Plane, Wind, Eye, Thermometer, MapPin, 
    Map as MapIcon, ChevronDown, ChevronUp, 
    Loader2, Terminal, AlertTriangle, CheckCircle,
    Droplets, Gauge 
} from "lucide-react";
import { ParsedMetar, RawMetar, getPublicSummary, calculateDistance } from "@/lib/bmkg/aviation-utils";
import { getRawMetar, getRawSpeci, getRawTaf } from "@/lib/bmkg/aviation";
import AviationMapWrapper from "@/components/component-cuaca/cuaca-penerbangan/AviationMapWrapper";

interface DashboardProps {
  airports: ParsedMetar[];
}

export default function AviationDashboard({ airports }: DashboardProps) {
  const [selectedMapIcao, setSelectedMapIcao] = useState<string>('WALS');
  
  const walsData = airports.find(a => a.icao_id === 'WALS');
  const selectedData = airports.find(a => a.icao_id === selectedMapIcao);
  const isRouteMode = selectedMapIcao !== 'WALS' && selectedData && walsData;

  const handleMapSelect = (icao: string) => {
    setSelectedMapIcao(icao);
    const element = document.getElementById(`hero-section`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* 1. HERO SECTION */}
      <div id="hero-section" className="transition-all duration-500">
        {walsData ? (
            isRouteMode ? (
                <RouteWeatherCard origin={walsData} destination={selectedData} />
            ) : (
                <HeroAirportCard airport={walsData} />
            )
        ) : (
            <div className="p-8 text-center bg-gray-50 rounded-2xl">Memuat Data Utama...</div>
        )}
      </div>

      {/* 2. PETA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Peta Rute & Cuaca</h3>
            </div>
            {isRouteMode && (
                <button 
                    onClick={() => setSelectedMapIcao('WALS')}
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    Reset ke Samarinda
                </button>
            )}
        </div>
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <AviationMapWrapper 
                airports={airports} 
                onSelect={handleMapSelect} 
                selectedIcao={selectedMapIcao} 
            />
            <div className="mt-3 px-2 pb-1 text-sm text-slate-500 text-center italic">
                {isRouteMode 
                    ? `Menampilkan rute dari ${walsData?.station_name} ke ${selectedData?.station_name}` 
                    : "Klik bandara lain di peta untuk melihat rute penerbangan."}
            </div>
        </div>
      </section>

      {/* 3. GRID BANDARA LAIN */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
            <Plane className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800">Daftar Bandara Lain</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airports
                .filter(a => a.icao_id !== 'WALS' && a.icao_id !== selectedMapIcao)
                .map((apt) => (
                <div key={apt.icao_id} onClick={() => handleMapSelect(apt.icao_id)} className="cursor-pointer">
                    <SmallAirportCard airport={apt} />
                </div>
            ))}
        </div>
      </section>

    </div>
  );
}

// --- KOMPONEN HERO AIRPORT CARD ---
function HeroAirportCard({ airport }: { airport: ParsedMetar }) {
    const { status, humanWeather } = getPublicSummary(airport.visibility, airport.weather);
    const [showDetail, setShowDetail] = useState(false);
    const [rawData, setRawData] = useState<{metar: RawMetar[], speci: RawMetar[], taf: RawMetar[]} | null>(null);
    const [loadingRaw, setLoadingRaw] = useState(false);

    const iconUrl = `https://web-aviation.bmkg.go.id/images/weathers/${airport.symbol}.png`;

    useEffect(() => {
        if (showDetail) {
            const fetchData = async () => {
                setLoadingRaw(true);
                try {
                    const [metar, speci, taf] = await Promise.all([
                        getRawMetar(airport.icao_id),
                        getRawSpeci(airport.icao_id),
                        getRawTaf(airport.icao_id)
                    ]);
                    setRawData({ metar, speci, taf });
                } catch (e) {
                    console.error("Gagal fetch raw data", e);
                } finally {
                    setLoadingRaw(false);
                }
            };
            fetchData();
        }
    }, [showDetail, airport.icao_id]); 

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-r from-blue-700 to-blue-500 z-0"></div>
            
            <div className="relative z-10 p-6 pt-8">
                {/* Header Text */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="text-white">
                        <h2 className="text-xs font-bold opacity-80 uppercase tracking-widest flex items-center gap-2 mb-1">
                            <Plane className="w-4 h-4" /> Aviation Weather Observation
                        </h2>
                        <h1 className="text-2xl md:text-3xl font-black">{airport.station_name}</h1>
                        <p className="opacity-90 font-mono text-sm mt-1 bg-white/10 inline-block px-2 py-0.5 rounded">
                            {airport.icao_id} • {airport.observed_time} {airport.time_zone}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg bg-white ${status.label.includes('Waspada') ? 'text-red-600' : 'text-green-600'}`}>
                        {status.label.includes('Waspada') ? <AlertTriangle className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                        {status.label}
                    </div>
                </div>

                {/* Main Weather Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-0 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        <div className="p-6 flex flex-col items-center justify-center text-center bg-blue-50/30">
                            <div className="relative w-28 h-28 mb-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={iconUrl} 
                                    alt={airport.weather}
                                    className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform duration-300"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{humanWeather}</div>
                            <div className="text-4xl font-black text-slate-800 mt-2 flex items-start justify-center gap-1">
                                {airport.temp}<span className="text-lg text-slate-500 font-medium mt-1">°C</span>
                            </div>
                        </div>

                        <div className="col-span-2 p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Observation Data</h3>
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 font-medium"><Eye className="w-4 h-4 text-blue-500"/> Jarak Pandang</div>
                                    <div className="font-bold text-gray-900 text-lg">{airport.visibility} <span className="text-sm font-normal text-gray-500">km</span></div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 font-medium"><Wind className="w-4 h-4 text-blue-500"/> Angin</div>
                                    <div className="font-bold text-gray-900 text-lg">{airport.wind_speed} <span className="text-sm font-normal text-gray-500">km/j</span></div>
                                    <div className="text-xs text-gray-500 mt-0.5 truncate font-medium">Dari {airport.wind_direction}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 font-medium"><Droplets className="w-4 h-4 text-blue-500"/> Titik Embun</div>
                                    <div className="font-bold text-gray-900 text-lg">{airport.dew_point} <span className="text-sm font-normal text-gray-500">°C</span></div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 font-medium"><Gauge className="w-4 h-4 text-blue-500"/> Tekanan (QNH)</div>
                                    <div className="font-bold text-gray-900 text-lg">{airport.pressure} <span className="text-sm font-normal text-gray-500">hPa</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button 
                        onClick={() => setShowDetail(!showDetail)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 text-sm bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl shadow-slate-200"
                    >
                        <Terminal className="w-4 h-4" />
                        {showDetail ? "Tutup Data Meteorologi" : "Lihat Data Meteorologi (METAR/TAF)"}
                        {showDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showDetail && (
                        <div className="mt-4 bg-slate-900 rounded-xl p-1 animate-in fade-in slide-in-from-top-2 duration-300 border border-slate-700">
                            {loadingRaw ? (
                                <div className="p-8 flex justify-center items-center text-slate-400 gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Mengambil data raw dari satelit...
                                </div>
                            ) : rawData ? (
                                <div className="grid grid-cols-1 divide-y divide-slate-800">
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2"><span className="text-green-400 font-bold text-xs border border-green-800 px-2 py-0.5 rounded bg-green-900/30">METAR</span></div>
                                        {rawData.metar.length > 0 ? rawData.metar.slice(0,2).map((item, idx) => (
                                            <div key={idx} className="font-mono text-sm text-green-400 mb-2 last:mb-0 break-words">
                                                <span className="text-slate-600 mr-2 text-xs">[{item.observed_time ? item.observed_time.substring(11, 16) : "AUTO"} Z]</span>{item.data_text}
                                            </div>
                                        )) : <div className="text-slate-600 text-xs italic">Tidak tersedia.</div>}
                                    </div>
                                    <div className="p-4 bg-slate-800/30">
                                        <div className="flex items-center gap-2 mb-2"><span className="text-yellow-500 font-bold text-xs border border-yellow-800 px-2 py-0.5 rounded bg-yellow-900/30">SPECI</span></div>
                                        {rawData.speci.length > 0 ? rawData.speci.map((item, idx) => (
                                            <div key={idx} className="font-mono text-sm text-yellow-500 mb-2 last:mb-0 break-words">
                                                <span className="text-slate-600 mr-2 text-xs">[{item.observed_time ? item.observed_time.substring(11, 16) : "AUTO"} Z]</span>{item.data_text}
                                            </div>
                                        )) : <div className="text-slate-600 text-xs italic">Tidak ada laporan spesial.</div>}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2"><span className="text-blue-400 font-bold text-xs border border-blue-800 px-2 py-0.5 rounded bg-blue-900/30">TAF</span></div>
                                        {rawData.taf.length > 0 ? rawData.taf.slice(0,1).map((item, idx) => (
                                            <div key={idx} className="font-mono text-sm text-blue-400 mb-2 last:mb-0 break-words">
                                                <span className="text-slate-600 mr-2 text-xs">
                                                    [{item.issued_time ? item.issued_time.substring(11, 16) : (item.observed_time ? item.observed_time.substring(11, 16) : "AUTO")} Z]
                                                </span>
                                                {item.data_text}
                                            </div>
                                        )) : <div className="text-slate-600 text-xs italic">Tidak tersedia.</div>}
                                    </div>
                                </div>
                            ) : <div className="p-4 text-center text-slate-500">Gagal memuat data.</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/// --- HELPER FUNCTIONS ---

const estimateDuration = (km: number) => {
    const speed = 550; // Avg speed km/h
    const timeInHours = km / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    return `${hours}j ${minutes}m`;
};

// LOGIKA BARU: Status Berdasarkan Visibility (Sesuai Gambar Referensi)
const getVisibilityStatus = (visibilityStr: string) => {
    const vis = parseFloat(visibilityStr);

    // Handle Data Error/Not Updated
    if (isNaN(vis)) {
        return {
            label: 'No Data',
            className: 'bg-slate-100 text-slate-500 border-slate-200',
            dotColor: 'bg-slate-400'
        };
    }

    // 1. Hijau (> 8 km)
    if (vis > 8) {
        return {
            label: '> 8 km',
            className: 'bg-green-50 text-green-700 border-green-200',
            dotColor: 'bg-green-500'
        };
    } 
    // 2. Cyan (4.8 - 8 km)
    else if (vis >= 4.8) {
        return {
            label: '4.8 - 8 km',
            className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
            dotColor: 'bg-cyan-500'
        };
    } 
    // 3. Kuning (1.6 - 4.8 km)
    else if (vis >= 1.6) {
        return {
            label: '1.6 - 4.8 km',
            className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            dotColor: 'bg-yellow-500'
        };
    } 
    // 4. Merah (< 1.6 km)
    else {
        return {
            label: '< 1.6 km',
            className: 'bg-red-50 text-red-700 border-red-200',
            dotColor: 'bg-red-500'
        };
    }
};

// --- ROUTE WEATHER CARD (CLEAN THEME + VISIBILITY STATUS) ---
function RouteWeatherCard({ origin, destination }: { origin: ParsedMetar, destination: ParsedMetar }) {
    const distance = calculateDistance(
        parseFloat(origin.latitude), parseFloat(origin.longitude),
        parseFloat(destination.latitude), parseFloat(destination.longitude)
    );
    const duration = estimateDuration(distance);

    // Hitung status visibility
    const originStatus = getVisibilityStatus(origin.visibility);
    const destStatus = getVisibilityStatus(destination.visibility);

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative group">
            
            {/* Dekorasi Header (Garis Aksen di Atas) */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-300 via-blue-400 to-slate-300"></div>

            <div className="p-6 md:p-8">
                
                {/* 1. HEADER RUTE */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    
                    {/* Origin */}
                    <div className="text-center md:text-left flex-1">
                        {/* Status Visibility Badge */}
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${originStatus.className}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${originStatus.dotColor}`}></span>
                                {originStatus.label}
                            </span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{origin.icao_id}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ORIGIN</span>
                            <span className="text-slate-300">•</span>
                            <p className="text-sm font-medium text-slate-500 truncate max-w-[150px]">{origin.station_name.split('-')[0].trim()}</p>
                        </div>
                    </div>

                    {/* Flight Path Visualizer */}
                    <div className="flex-1 w-full md:max-w-xs flex flex-col items-center justify-center px-4">
                        <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 mb-1">
                            <span>{distance} km</span>
                            <span>Est. {duration}</span>
                        </div>
                        <div className="relative w-full h-8 flex items-center">
                            {/* Garis Putus-putus */}
                            <div className="absolute w-full h-[2px] border-t-2 border-dashed border-slate-300"></div>
                            {/* Icon Pesawat */}
                            <div className="absolute left-1/2 -translate-x-1/2 bg-white p-1 rounded-full border border-slate-200 shadow-sm z-10">
                                <Plane className="w-5 h-5 text-blue-600 rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="text-center md:text-right flex-1">
                        {/* Status Visibility Badge */}
                        <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${destStatus.className}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${destStatus.dotColor}`}></span>
                                {destStatus.label}
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{destination.icao_id}</h2>
                        <div className="flex items-center justify-center md:justify-end gap-2 mt-1">
                            <p className="text-sm font-medium text-slate-500 truncate max-w-[150px]">{destination.station_name.split('-')[0].trim()}</p>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DEST</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-100 mb-8"></div>

                {/* 2. WEATHER DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2 hidden md:block"></div>
                    <WeatherColumn airport={origin} align="left" />
                    <WeatherColumn airport={destination} align="right" />
                </div>

            </div>
        </div>
    );
}

// --- SUB-COMPONENT: WEATHER COLUMN ---
function WeatherColumn({ airport, align }: { airport: ParsedMetar, align: 'left' | 'right' }) {
    const { humanWeather } = getPublicSummary(airport.visibility, airport.weather);
    const iconUrl = `https://web-aviation.bmkg.go.id/images/weathers/${airport.symbol}.png`;

    const flexDir = align === 'right' ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left';
    
    return (
        <div className="flex flex-col gap-6">
            <div className={`flex flex-col items-center ${flexDir} gap-4`}>
                <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-2xl p-2 border border-slate-100 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconUrl} alt="Weather" className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="text-4xl font-black text-slate-800">{airport.temp}°<span className="text-xl text-slate-400 font-medium">C</span></div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">{humanWeather}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center hover:border-blue-200 transition-colors">
                    <div className="flex justify-center mb-1"><Wind className="w-4 h-4 text-blue-500" /></div>
                    <div className="font-bold text-slate-700 text-sm">{airport.wind_speed}</div>
                    <div className="text-[10px] text-slate-400 uppercase">km/j</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center hover:border-emerald-200 transition-colors">
                    <div className="flex justify-center mb-1"><Eye className="w-4 h-4 text-emerald-500" /></div>
                    <div className="font-bold text-slate-700 text-sm">{airport.visibility}</div>
                    <div className="text-[10px] text-slate-400 uppercase">km</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center hover:border-purple-200 transition-colors">
                    <div className="flex justify-center mb-1"><Gauge className="w-4 h-4 text-purple-500" /></div>
                    <div className="font-bold text-slate-700 text-sm">{airport.pressure}</div>
                    <div className="text-[10px] text-slate-400 uppercase">hPa</div>
                </div>
            </div>
        </div>
    );
}

// ... SmallAirportCard tetap sama ...
function SmallAirportCard({ airport }: { airport: ParsedMetar }) {
    const { status, humanWeather } = getPublicSummary(airport.visibility, airport.weather);
    const iconUrl = `https://web-aviation.bmkg.go.id/images/weathers/${airport.symbol}.png`;

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group h-full cursor-pointer">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {airport.station_name.split(' - ')[0]}
                    </h4>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">{airport.icao_id}</span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${status.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-3">
                <div className="w-8 h-8 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconUrl} alt="icon" className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="font-medium text-gray-800 leading-tight line-clamp-1">{humanWeather}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Thermometer className="w-3 h-3"/> {airport.temp}°C
                    </div>
                </div>
            </div>
        </div>
    );
}