"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Ship, Wind, Waves, Navigation, AlertTriangle, CalendarDays, Anchor, 
  Eye, Thermometer, Droplets, ArrowRight,
  Sun, CloudSun, Cloud, CloudFog, Haze, CloudDrizzle, CloudRain, 
  CloudRainWind, CloudSunRain, CloudLightning, ArrowUp, ArrowDown
} from "lucide-react";
import { 
  getMaritimeWeather, 
  getPortWeather, 
  getWaveOverview, 
  MaritimeData, 
  PortData, 
  OverviewData 
} from "@/lib/bmkg/maritim";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuaca Maritim | BMKG Samarinda",
  description: "Informasi cuaca perairan dan pelabuhan untuk wilayah Kalimantan Timur.",
};

const MaritimeMap = dynamic(() => import("@/components/component-cuaca/cuaca-maritim/MaritimeMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-blue-50 animate-pulse rounded-2xl flex items-center justify-center text-blue-300">
      <div className="flex flex-col items-center gap-2">
        <Ship className="w-8 h-8 animate-bounce" />
        <span>Memuat Peta Maritim...</span>
      </div>
    </div>
  )
});

// --- HELPER 1: ICON CUACA DINAMIS ---
const WeatherIcon = ({ condition, className = "w-6 h-6" }: { condition: string, className?: string }) => {
  const c = (condition || "").toLowerCase();
  if (c.includes("petir") || c.includes("badai")) return <CloudLightning className={`${className} text-purple-600`} />;
  if (c.includes("lebat")) return <CloudRainWind className={`${className} text-blue-800`} />;
  if (c.includes("sedang")) return <CloudRain className={`${className} text-blue-600`} />;
  if (c.includes("ringan")) return <CloudDrizzle className={`${className} text-blue-400`} />;
  if (c.includes("lokal") || c.includes("hujan")) return <CloudSunRain className={`${className} text-blue-500`} />;
  if (c.includes("asap")) return <Haze className={`${className} text-orange-400`} />;
  if (c.includes("kabut") || c.includes("tebal") || c.includes("pekat")) return <CloudFog className={`${className} text-gray-400`} />;
  if (c.includes("cerah berawan")) return <CloudSun className={`${className} text-yellow-500`} />;
  if (c.includes("berawan")) return <Cloud className={`${className} text-gray-500`} />;
  if (c.includes("cerah")) return <Sun className={`${className} text-yellow-400`} />;
  return <CloudSun className={`${className} text-gray-400`} />;
};

// --- HELPER 2: GENERATE TANGGAL DINAMIS ---
const getForecastDate = (dayIndex: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayIndex);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function MaritimePage() {
  const [viewMode, setViewMode] = useState<'area' | 'port'>('area');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [areaData, setAreaData] = useState<MaritimeData | null>(null);
  const [portData, setPortData] = useState<PortData | null>(null);
  
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 1. Logic Pilihan Hari (Adaptif)
  // Area = 4 Hari, Port = 2 Hari (Hari Ini & Besok)
  const availableDays = viewMode === 'area' 
    ? ['Hari Ini', 'Besok', 'Lusa', 'H+3'] 
    : ['Hari Ini', 'Besok'];

  useEffect(() => {
    const initData = async () => {
      setLoadingOverview(true);
      const data = await getWaveOverview();
      setOverviewData(data);
      setLoadingOverview(false);
    };
    initData();
  }, []);

  const handleSelectArea = async (code: string, name: string) => {
    setSelectedId(code);
    setLoadingDetail(true);
    setPortData(null);
    setAreaData(null);
    const data = await getMaritimeWeather(code, name);
    setAreaData(data);
    setLoadingDetail(false);
  };

  const handleSelectPort = async (id: string, name: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    setAreaData(null);
    setPortData(null);
    const data = await getPortWeather(id, name);
    setPortData(data);
    setLoadingDetail(false);
  };

  const toggleMode = (mode: 'area' | 'port') => {
    setViewMode(mode);
    setSelectedId(null);
    setAreaData(null);
    setPortData(null);
    setSelectedDayIndex(0); // Reset ke hari ini setiap ganti mode
  };

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto space-y-8 max-sm:max-w-xs ">
        
        {/* --- UNIFIED CONTROL BAR (NEW DESIGN) --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-4 z-40 backdrop-blur-md">
            
            {/* 1. Mode Switcher (Kiri) */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex w-full lg:w-auto">
                <button 
                    onClick={() => toggleMode('area')}
                    className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${viewMode === 'area' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Waves className="w-4 h-4" /> Perairan
                </button>
                <button 
                    onClick={() => toggleMode('port')}
                    className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${viewMode === 'port' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Anchor className="w-4 h-4" /> Pelabuhan
                </button>
            </div>

            {/* 2. Date Selector (Kanan) - Scrollable Pill List */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-hide">
                {availableDays.map((label, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                            selectedDayIndex === idx 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' 
                            : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>

        {/* --- MAP --- */}
        <div className="relative z-0">
            {loadingOverview && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="bg-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3 text-blue-600 font-bold border border-blue-100 animate-pulse">
                        <Ship className="w-5 h-5 animate-bounce" />
                        Sinkronisasi Data...
                    </div>
                </div>
            )}
            
            <MaritimeMap 
                mode={viewMode}
                onSelectArea={handleSelectArea}
                onSelectPort={handleSelectPort}
                selectedId={selectedId}
                overviewData={overviewData}
                dayIndex={selectedDayIndex}
            />
        </div>

        {/* --- DETAIL SECTION --- */}
        <div className="scroll-mt-24" id="forecast-detail">
            {loadingDetail ? (
                <div className="h-80 bg-white rounded-[2.5rem] animate-pulse flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200">
                    <Ship className="w-12 h-12 mb-4 animate-bounce opacity-20" />
                    <span className="font-medium">Mengambil detail data...</span>
                </div>
            ) : (
                <>
                    {/* --- DETAIL PERAIRAN (AREA) --- */}
                    {viewMode === 'area' && areaData && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* ... (Kode Area sama seperti sebelumnya) ... */}
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Waves className="w-5 h-5 text-blue-500" />
                                    {areaData.name}
                                </h2>
                                <span className="text-[10px] md:text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    Issued: {areaData.issued}
                                </span>
                            </div>

                            {(() => {
                                const dayData = areaData.data[selectedDayIndex];
                                if (!dayData) return <EmptyDataState />;

                                return (
                                    <>
                                        <div className="relative bg-white rounded-[2.5rem] p-6 md:p-10 border-2 border-blue-100/80 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)] overflow-hidden group transition-all duration-500 hover:shadow-[0_25px_70px_-15px_rgba(59,130,246,0.3)]">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-blue-50/20 to-transparent pointer-events-none z-0"></div>
                                            <Waves className="absolute -right-10 -bottom-10 w-72 h-72 text-blue-100 pointer-events-none opacity-60 z-0" />

                                            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
                                                <div className="flex-1 space-y-5">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-blue-200/50">
                                                            <WeatherIcon condition={dayData.weather} className="w-4 h-4 text-white" /> 
                                                            {dayData.time_desc}
                                                        </div>
                                                        <span className="text-xs text-gray-600 font-bold bg-white/60 border border-blue-100 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                            {getForecastDate(selectedDayIndex)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2">
                                                            {dayData.weather}
                                                        </h2>
                                                        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
                                                            {dayData.weather_desc}
                                                        </p>
                                                    </div>
                                                    {dayData.warning_desc && dayData.warning_desc !== "NIL" && (
                                                        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm border border-red-100 animate-pulse">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            PERINGATAN: {dayData.warning_desc}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-full lg:w-auto grid grid-cols-2 gap-4">
                                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-blue-100 flex flex-col items-center justify-center min-w-[140px] text-center shadow-sm">
                                                        <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-wider font-bold mb-2">
                                                            <Waves className="w-4 h-4" /> Gelombang
                                                        </div>
                                                        <div className="text-2xl font-black text-blue-900">{dayData.wave_desc}</div>
                                                        <div className="text-[10px] bg-blue-50 px-3 py-1 rounded-full mt-2 font-bold text-blue-600 border border-blue-100">
                                                            {dayData.wave_cat}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-gray-100 flex flex-col items-center justify-center min-w-[140px] text-center shadow-sm">
                                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">
                                                            <Wind className="w-4 h-4" /> Angin
                                                        </div>
                                                        <div className="text-2xl font-black text-gray-800">
                                                            {dayData.wind_speed_min}-{dayData.wind_speed_max} <span className="text-sm font-normal text-gray-500">kts</span>
                                                        </div>
                                                        <div className="text-[10px] flex items-center gap-1 mt-2 font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                            <Navigation className="w-3 h-3 rotate-45" /> 
                                                            {dayData.wind_from} - {dayData.wind_to}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                                                Prakiraan Lainnya <ArrowRight className="w-3 h-3" />
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {areaData.data.filter((_, idx) => idx !== selectedDayIndex).map((otherDay, idx) => {
                                                    const originalIndex = areaData.data.indexOf(otherDay);
                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            onClick={() => setSelectedDayIndex(originalIndex)}
                                                            className="cursor-pointer bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 active:scale-95 transition-all duration-300 group relative overflow-hidden"
                                                        >
                                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                                <div>
                                                                    <div className="text-gray-800 font-bold text-lg group-hover:text-blue-600 transition-colors">
                                                                        {otherDay.time_desc}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                                                                        {getForecastDate(originalIndex)}
                                                                    </div>
                                                                </div>
                                                                <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                                    <WeatherIcon condition={otherDay.weather} className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-gray-600 font-medium mb-4 line-clamp-1 relative z-10 group-hover:text-gray-900">
                                                                {otherDay.weather}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 relative z-10">
                                                                <div>
                                                                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold mb-0.5">
                                                                        <Waves className="w-3 h-3" /> Gelombang
                                                                    </div>
                                                                    <div className="font-bold text-gray-800 text-sm">{otherDay.wave_desc}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold mb-0.5">
                                                                        <Wind className="w-3 h-3" /> Angin
                                                                    </div>
                                                                    <div className="font-bold text-gray-800 text-sm">{otherDay.wind_speed_min}-{otherDay.wind_speed_max} kts</div>
                                                                </div>
                                                            </div>
                                                            <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/10 transition-colors pointer-events-none"></div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* --- DETAIL PELABUHAN (PORT) - NEW ELEGANT DESIGN --- */}
                    {viewMode === 'port' && portData && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             
                             <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Anchor className="w-5 h-5 text-blue-600" />
                                    {portData.name}
                                </h2>
                                <span className="text-[10px] md:text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    Pelabuhan Utama
                                </span>
                            </div>

                             {(() => {
                                const dayData = portData.data[selectedDayIndex];
                                if (!dayData) return <EmptyDataState />;

                                return (
                                    // CONTAINER UTAMA - CLEAN WHITE STYLE
                                    <div className="relative bg-white rounded-[2.5rem] p-6 md:p-10 border-2 border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden group">
                                        
                                        {/* Background Subtle Gradient (Sangat Tipis) */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none"></div>
                                        <Anchor className="absolute -right-8 -bottom-8 w-64 h-64 text-gray-100 pointer-events-none rotate-12" />
                                        
                                        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
                                            
                                            {/* Kiri: Info Cuaca Utama */}
                                            <div className="flex-1 space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                                                        {getForecastDate(selectedDayIndex)}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-5">
                                                    <div className="p-4 bg-blue-50/50 rounded-3xl shadow-sm border border-blue-100">
                                                        <WeatherIcon condition={dayData.weather} className="w-16 h-16" />
                                                    </div>
                                                    <div>
                                                        <div className="text-5xl font-bold text-gray-900 tracking-tight">{dayData.weather}</div>
                                                        <div className="text-gray-500 text-base mt-1 font-medium">Cuaca Lokal Pelabuhan</div>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-600 leading-relaxed max-w-xl text-lg border-l-4 border-gray-200 pl-5">
                                                    {dayData.weather_desc}
                                                </p>
                                                
                                                {/* Info Suhu & Kelembaban (Minimalis) */}
                                                <div className="flex gap-6 pt-2">
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <Thermometer className="w-5 h-5 text-gray-400" />
                                                        <span className="font-bold text-lg">{dayData.temp_min}° - {dayData.temp_max}°C</span>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-200"></div>
                                                    <div className="flex items-center gap-3 text-gray-700">
                                                        <Droplets className="w-5 h-5 text-gray-400" />
                                                        <span className="font-bold text-lg">{dayData.rh_min}% - {dayData.rh_max}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kanan: Grid Statistik (Monokromatik Elegan) */}
                                            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                                                
                                                {/* Visibility */}
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:border-blue-200 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Visibility</div>
                                                        <Eye className="w-5 h-5 text-gray-300" />
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-gray-900">{dayData.visibility} <span className="text-base font-normal text-gray-500">km</span></div>
                                                        <div className="text-xs text-gray-400 mt-1">Jarak Pandang</div>
                                                    </div>
                                                </div>

                                                {/* Angin */}
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:border-blue-200 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Angin</div>
                                                        <Wind className="w-5 h-5 text-gray-300" />
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-black text-gray-900">{dayData.wind_speed_min}-{dayData.wind_speed_max} <span className="text-sm font-normal text-gray-500">kts</span></div>
                                                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                                            <Navigation className="w-3 h-3" /> {dayData.wind_from}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pasang (High Tide) */}
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:border-blue-200 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pasang</div>
                                                        <ArrowUp className="w-5 h-5 text-blue-600 bg-blue-50 rounded-full p-1" />
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-gray-900">{dayData.high_tide} <span className="text-base font-normal text-gray-500">m</span></div>
                                                        <div className="text-xs text-gray-400 mt-1">Maksimum</div>
                                                    </div>
                                                </div>

                                                {/* Surut (Low Tide) */}
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[140px] hover:border-blue-200 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Surut</div>
                                                        <ArrowDown className="w-5 h-5 text-gray-600 bg-gray-100 rounded-full p-1" />
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-gray-900">{dayData.low_tide} <span className="text-base font-normal text-gray-500">m</span></div>
                                                        <div className="text-xs text-gray-400 mt-1">Minimum</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                );
                             })()}
                        </div>
                    )}

                    {/* --- EMPTY STATE --- */}
                    {!areaData && !portData && (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                            <div className="p-6 bg-blue-50 rounded-full mb-6 animate-pulse">
                                {viewMode === 'area' ? <Waves className="w-12 h-12 text-blue-400" /> : <Anchor className="w-12 h-12 text-blue-400" />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada lokasi dipilih</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                Silakan klik salah satu <span className="font-bold text-blue-600">{viewMode === 'area' ? 'wilayah perairan' : 'ikon pelabuhan'}</span> pada peta di atas untuk melihat detail prakiraan cuaca.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>

      </div>
    </div>
  );
}

function EmptyDataState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border border-gray-100">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-gray-500 font-medium">Data prakiraan untuk tanggal ini belum tersedia.</p>
        </div>
    );
}