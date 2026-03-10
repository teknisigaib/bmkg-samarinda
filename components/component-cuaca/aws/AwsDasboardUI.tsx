"use client";

import React, { useState, useEffect } from "react";
import { 
  Thermometer, Droplets, Wind, Sun, Gauge, 
  Clock, CloudRain, Activity, Compass, AlertTriangle, 
  Navigation2, Radio, ChevronDown, MapPin
} from "lucide-react";
import { AwsSnapshotData } from "@/lib/aws-types";
import { AWS_STATIONS, DEFAULT_STATION_ID } from "@/lib/aws-config"; 

// IMPORT SERVER ACTION
import { getAwsStationData } from "@/app/(public)/cuaca/aws/actions";

// ... (KOMPONEN SKELETON SAMA, TIDAK BERUBAH) ...
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-50 pb-10 animate-pulse">
    <div className="bg-white border-b border-slate-200 h-16 mb-8"></div>
    <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="bg-slate-200 h-48 rounded-xl"></div>
       <div className="bg-slate-200 h-[600px] rounded-xl"></div>
       <div className="bg-slate-200 h-48 rounded-xl"></div>
    </div>
  </div>
);

interface Props {
  initialData: AwsSnapshotData | null;
}

export default function AwsDashboardUI({ initialData }: Props) {
  // STATE
  const [data, setData] = useState<AwsSnapshotData | null>(initialData);
  const [selectedStationId, setSelectedStationId] = useState(DEFAULT_STATION_ID);
  const [isLoading, setIsLoading] = useState(false);

  // Cari object station aktif
  const activeStation = AWS_STATIONS.find(s => s.id === selectedStationId) || AWS_STATIONS[0];

  // --- LOGIKA UTAMA DIGANTI DI SINI ---
  
  const fetchData = async (stationId: string) => {
    try {
      // Panggil Server Action (Bukan fetch API route)
      // Browser tidak akan melihat request ke IP 202.90...
      const newData = await getAwsStationData(stationId);
      
      if (newData) {
        setData(newData);
      }
    } catch (err) {
      console.error("Failed to load station data", err);
    } finally {
      setIsLoading(false);
    }
  };

  // EFFECT 1: Ganti Stasiun (Manual)
  const handleStationChange = (newId: string) => {
    if (newId === selectedStationId) return;
    setIsLoading(true);
    setSelectedStationId(newId);
    // Panggil Server Action
    fetchData(newId); 
  };

  // EFFECT 2: Auto Refresh setiap 60 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(selectedStationId);
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedStationId]);

  // Loading Awal
  if (!data && isLoading) return <DashboardSkeleton />;
  if (!data) return <div className="p-10 text-center text-slate-500">Gagal memuat data stasiun.</div>;

  // FORMATTER
  const windKnots = (data.windSpeed * 1.94384).toFixed(1);
  const windMs = data.windSpeed.toFixed(1);
  const isStale = data.minutesAgo > 30;

  return (
    <div className="min-h-screen text-slate-800 pb-20">
       
       {/* --- HEADER SECTION --- */}
       <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center text-center md:items-start md:text-left shadow-sm transition-all mb-8">
          
          <div className="bg-white p-3 rounded-full shadow-sm w-fit ring-4 ring-blue-50/50">
            <Radio className="w-8 h-8 text-blue-600" />
          </div>
  
          <div className="flex-1 w-full">
            
            {/* Judul & Deskripsi */}
            <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                    (Automatic Weather Station) {activeStation.name}
                    {isLoading && <span className="text-xs font-normal text-blue-500 animate-pulse ml-2">(Memuat...)</span>}
                </h2>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {activeStation.description}
                </p>
            </div>

            {/* Container Badge & Selector */}
            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              
              {/* Badge Status */}
              <div className={`inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-xs font-bold shadow-sm ${!isStale ? 'border-emerald-200 text-emerald-700' : 'border-amber-200 text-amber-700'}`}>
                <span className="relative flex h-2.5 w-2.5">
                  {!isStale && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${!isStale ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                {!isStale ? 'Online' : 'Gangguan'}
              </div>
              
              {/* Badge Waktu Update */}
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-medium text-gray-600 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Update: {data.lastUpdateDate} {data.lastUpdateTime} UTC</span>
              </div>

              {/* Selector Stasiun */}
              <div className="relative inline-flex items-center group">
                 <MapPin className="absolute left-3 w-3.5 h-3.5 text-blue-500 z-10" />
                 <select 
                    value={selectedStationId}
                    onChange={(e) => handleStationChange(e.target.value)}
                    className="appearance-none bg-white pl-9 pr-8 py-1.5 rounded-lg border border-blue-200 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
                 >
                    {AWS_STATIONS.map((station) => (
                        <option key={station.id} value={station.id}>
                            {station.name}
                        </option>
                    ))}
                 </select>
                 <ChevronDown className="absolute right-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

            </div>
          </div>
       </section>
       
       {/* ALERT JIKA DATA LAMA */}
       {isStale && (
         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center text-amber-800 text-sm font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
            <AlertTriangle className="w-4 h-4" />
            Perhatian: Data sensor tidak diperbarui sejak {data.minutesAgo} menit yang lalu.
         </div>
       )}

      {/* --- GRID KONTEN (ISI SAMA PERSIS SEPERTI SEBELUMNYA) --- */}
      <div className={`max-w-[1600px] mx-auto transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
            
            {/* KOLOM 1: Suhu & Kelembaban */}
            <div className="lg:col-span-2 flex flex-col gap-5">
                {/* SUHU UDARA */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><Thermometer className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suhu Udara</span>
                    </div>
                    <div className="flex items-baseline mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tighter">{data.temp}</span>
                        <span className="text-2xl font-semibold text-slate-400 ml-1">°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3 mt-4">
                         <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400">Dew Point:</span>
                            <span className="font-bold text-slate-700">{data.dewPoint}°C</span>
                         </div>
                    </div>
                </div>

                {/* KELEMBABAN */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><Droplets className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kelembaban</span>
                    </div>
                    <div className="flex items-baseline mt-1">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.humidity}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{width: `${data.humidity}%`}}></div>
                    </div>
                </div>

                {/* HEAT INDEX */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><Activity className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Terasa Seperti</span>
                    </div>
                    <div className="flex items-baseline mt-1">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.heatIndex}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">°C</span>
                    </div>
                </div>
            </div>

            {/* KOLOM 2: ANGIN (COMPASS) */}
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex flex-col h-full hover:border-blue-300 transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><Wind className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Arah & Kecepatan Angin</span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative mb-4">
                    <div className="relative w-56 h-56 sm:w-72 sm:h-72 transition-all duration-500">
                        {/* Circle Background */}
                        <div className="absolute inset-1 rounded-full border border-blue-400 bg-slate-50/20 z-50"></div>
                        
                        {/* Tick Marks Logic */}
                        {[...Array(360)].map((_, i) => {
                            const degree = i;
                            const isCardinal = degree % 90 === 0;
                            const isMajor = degree % 15 === 0;
                            const isMedium = degree % 5 === 0;

                            let tickClass = "h-1.5 w-[1px] bg-slate-200"; 
                            if (isCardinal) { tickClass = "h-4 w-1 bg-slate-800 z-30"; }
                            else if (isMajor) { tickClass = "h-3 w-0.5 bg-slate-400 z-20"; } 
                            else if (isMedium) { tickClass = "h-2 w-[1px] bg-slate-300 z-10"; }

                            return (
                                <div key={i} className="absolute inset-0 flex justify-center pt-1" style={{ transform: `rotate(${degree}deg)` }}>
                                    <div className={tickClass}></div>
                                </div>
                            )
                        })}

                        {/* --- ARAH MATA ANGIN UTAMA (U,S,B,T) --- */}
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[12px] font-bold text-slate-800">U</span>
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[12px] font-bold text-slate-800">S</span>
                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 -ml-2 text-[12px] font-bold text-slate-800">B</span>
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 -mr-1 text-[12px] font-bold text-slate-800">T</span>

                        {/* --- ARAH MATA ANGIN TAMBAHAN (TL, TG, BD, BL) --- */}
                        
                        <span className="absolute top-[10%] right-[10%] text-[10px] font-bold text-slate-500 z-20">TL</span>
                        <span className="absolute bottom-[10%] right-[10%] text-[10px] font-bold text-slate-500 z-20">TG</span>
                        <span className="absolute bottom-[10%] left-[10%] text-[10px] font-bold text-slate-500 z-20">BD</span>
                        <span className="absolute top-[10%] left-[10%] text-[10px] font-bold text-slate-500 z-20">BL</span>

                        {/* Navigation Arrow */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="transition-transform duration-1000 ease-out flex items-center justify-center" style={{ transform: `rotate(${data.windDir}deg)` }}>
                                <Navigation2 className="w-12 h-12 text-blue-700 fill-blue-700 drop-shadow-md" strokeWidth={0} />
                            </div>
                        </div>

                        {/* Floating Info */}
                        <div className="absolute bottom-10 inset-x-0 flex justify-center z-20">
                            <div className="flex flex-col items-center bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm px-4 py-1.5 rounded-xl">
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xl font-bold text-slate-800 tracking-tight">{data.windDir}</span>
                                    <span className="text-xl font-bold text-slate-400">°</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wind Speed Values */}
                <div className="flex flex-col items-center justify-center py-5 border-t border-slate-100 bg-slate-50 rounded-3xl mx-1 mt-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Kecepatan Angin</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-slate-800 tracking-tighter">{windMs}</span>
                        <span className="text-xl font-semibold text-slate-400">m/s</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                        <Compass className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">{windKnots} Knots</span>
                    </div>
                </div>
            </div>

            {/* KOLOM 3: Hujan, Tekanan, Radiasi */}
            <div className="lg:col-span-2 flex flex-col gap-5">
                {/* CURAH HUJAN */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 flex flex-col justify-between hover:border-blue-300 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><CloudRain className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Curah Hujan</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.rainRate}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">mm</span>
                    </div>
                    <div className="flex gap-1 mt-4 h-2 w-full">
                        <div className={`flex-1 rounded-l-md transition-all ${data.rainRate >= 0 ? 'bg-slate-300' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 5 ? 'bg-blue-300' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 20 ? 'bg-blue-500' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 transition-all ${data.rainRate > 50 ? 'bg-blue-700' : 'bg-slate-100'}`}></div>
                        <div className={`flex-1 rounded-r-md transition-all ${data.rainRate > 100 ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-bold font-mono">
                        <span>0</span><span>5</span><span>20</span><span>50</span><span>100+</span>
                    </div>
                </div>

                {/* TEKANAN UDARA */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><Gauge className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tekanan</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.pressure}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">hPa</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
                        <div className="absolute left-1/2 w-0.5 h-full bg-slate-300 z-10"></div> 
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{width: '20%', marginLeft: `${Math.min(Math.max((data.pressure - 980)/60, 0), 1)*100}%`}}></div>
                    </div>
                </div>

                {/* RADIASI MATAHARI */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex-1 hover:border-blue-300 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-slate-50 text-blue-700 border border-slate-100 rounded-lg"><Sun className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Radiasi</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-5xl font-bold text-slate-800 tracking-tight">{data.solarRad}</span>
                        <span className="text-xl font-semibold text-slate-400 ml-1">W/m²</span>
                    </div>
                     <div className="mt-4 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-3">
                        <span className="font-semibold text-slate-400">UV Index (Estimasi)</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{data.uvIndex}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}