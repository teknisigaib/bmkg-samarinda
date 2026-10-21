"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowLeft, Thermometer, Wind, Gauge, Activity, Droplets, Waves, MapPin, Clock, CloudRain, BarChart3, Loader2, Navigation2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MawsPalaranModalProps {
  onClose: () => void;
}

// === KOMPONEN KOMPAS BESAR (DENGAN PANAH TENGAH) ===
const WindCompassLarge = ({ direction }: { direction: number }) => (
  <div className="relative flex justify-center items-center w-24 h-24 sm:w-28 sm:h-28 my-1">
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm">
      {/* Lingkaran Luar & Grid Putus-putus */}
      <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" />
      
      {/* Label Arah Utama (N, E, S, W) */}
      <text x="50" y="16" fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="black">N</text>
      <text x="86" y="53.5" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">E</text>
      <text x="50" y="91" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">S</text>
      <text x="14" y="53.5" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">W</text>

      {/* Label Arah Diagonal (NE, SE, SW, NW) */}
      <text x="76" y="27" fontSize="6" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">NE</text>
      <text x="76" y="80" fontSize="6" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">SE</text>
      <text x="24" y="80" fontSize="6" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">SW</text>
      <text x="24" y="27" fontSize="6" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">NW</text>
    </svg>
    
    {/* Ikon Panah Navigasi di Tengah */}
    <div 
      className="relative z-10 text-blue-500 drop-shadow-md" 
      style={{ transform: `rotate(${direction}deg)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <Navigation2 size={36} strokeWidth={2.5} fill="currentColor" />
    </div>
  </div>
);

// === KOMPONEN STAT CARD ===
const StatCard = ({ label, value, unit, icon: Icon }: any) => (
  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col justify-center shadow-sm min-h-[76px] transition-all">
    <span className="text-[10px] text-slate-500 font-bold mb-1.5 flex items-center gap-1.5 tracking-wide truncate">
      <Icon size={12} className="text-blue-500 shrink-0" strokeWidth={2.5} /> {label}
    </span>
    <div className="flex items-baseline w-full">
      <span className="text-[15px] sm:text-base font-black text-slate-700 leading-none truncate">
        {value !== undefined && value !== null ? value : '-'} 
        <span className="text-[9px] font-bold text-slate-400 ml-1 uppercase">{unit}</span>
      </span>
    </div>
  </div>
);

type MetricType = "water_level" | "salinity" | "ph";

export default function MawsPalaranModal({ onClose }: MawsPalaranModalProps) {
  const [latestData, setLatestData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  
  const [historyCache, setHistoryCache] = useState<Record<string, any[]>>({});
  const [activeMetric, setActiveMetric] = useState<MetricType>("water_level");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const fetchLatestData = async (isBackground = false) => {
    if (!isBackground) setIsLoadingLatest(true);
    try {
      const res = await fetch("https://maws.bmkgaptpranoto.com/api/maws/latest");
      const json = await res.json();
      if (json.status === "success") {
        setLatestData(json.data);
        const dateObj = new Date(json.metadata.message_date);
        const timeStr = new Intl.DateTimeFormat('id-ID', { 
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        }).format(dateObj).replace('.', ':');
        setLastUpdate(timeStr + " WITA");
      }
    } catch (err) {
      console.error("Gagal fetch data latest:", err);
    } finally {
      if (!isBackground) setIsLoadingLatest(false);
    }
  };

  const fetchHistoryData = async (metric: MetricType) => {
    if (historyCache[metric]) return;

    setIsLoadingHistory(true);
    try {
      const res = await fetch(`https://maws.bmkgaptpranoto.com/api/maws/history?metric=${metric}`);
      const json = await res.json();
      
      if (json.status === "success" && json.series) {
        const formatted = json.series.map((item: any) => {
          let val = 0;
          if (metric === "water_level") val = item.water_level_m;
          if (metric === "salinity") val = item.salinity_psu;
          if (metric === "ph") val = item.ph;

          return { fullTimestamp: item.timestamp, value: val };
        });
        
        setHistoryCache(prev => ({ ...prev, [metric]: formatted }));
      }
    } catch (err) {
      console.error("Gagal fetch data history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchLatestData(); 
    
    const intervalId = setInterval(() => {
      fetchLatestData(true);
    }, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchHistoryData(activeMetric);
  }, [activeMetric]);

  const currentHistoryData = historyCache[activeMetric] || [];

  const getMetricConfig = () => {
    switch (activeMetric) {
      case "water_level": return { color: "#3b82f6", label: "Muka Air (m)" };
      case "salinity": return { color: "#0ea5e9", label: "Salinitas" };
      case "ph": return { color: "#8b5cf6", label: "pH Air" };
    }
  };

  return (
    <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-300 max-h-[90%] sm:max-h-[560px] border border-white">
        
        {/* HEADER MODAL */}
        <div className="p-3 sm:p-4 flex items-start justify-between shrink-0 bg-white">
          <div className="flex gap-3 items-center">
            {isChartModalOpen ? (
              <button onClick={() => setIsChartModalOpen(false)} className="p-2 bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0">
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0 relative flex items-center justify-center">
                <Image 
                  src="/logo-bmkg2.png" 
                  alt="BMKG" 
                  width={22} 
                  height={26} 
                  className={`object-contain ${isLoadingLatest ? 'opacity-50 animate-pulse' : ''}`} 
                />
                {!isLoadingLatest && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-2 border-white bg-emerald-500 rounded-full animate-pulse"></span>}
              </div>
            )}
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                {isChartModalOpen ? 'GRAFIK TREN HARIAN' : 'INFO MAWS MARITIME'}
              </p>
              <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight line-clamp-1">
                Pelabuhan Palaran
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-4 shrink-0"><hr className="border-slate-100" /></div>

        {/* BODY MODAL */}
        <div className="overflow-y-auto custom-scrollbar bg-white flex-1 min-h-0">
          {!isChartModalOpen ? (
            
            /* === TAMPILAN INFO (GRID DATA) === */
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="p-4 space-y-3">
                
                {isLoadingLatest && !latestData ? (
                   <div className="py-24 flex flex-col items-center text-blue-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 opacity-80" />
                      <p className="text-xs uppercase tracking-widest font-bold animate-pulse text-slate-400">Loading Data...</p>
                   </div>
                ) : (
                  <>
                    {/* 1. Status Bar Utama (Muka Air Radar) */}
                    <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-3 rounded-xl shadow-sm transition-all mb-1">
                      <span className="text-xs text-blue-700 font-bold flex items-center gap-1.5">
                        <Waves size={16} /> Tinggi Muka Air (Radar):
                      </span>
                      <span className="text-lg font-black text-blue-800">
                        {latestData?.marine?.radar_water_level_m ?? '-'} <span className="text-[10px] font-bold text-blue-500 uppercase">m</span>
                      </span>
                    </div>

                    {/* 2. Grid Angin (Kiri) & Atmosfer (Kanan) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Kotak Kompas Angin */}
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center shadow-sm">
                        <div className="w-full flex items-center justify-center gap-1.5 mb-2 text-blue-500">
                          <Wind size={14} strokeWidth={2.5} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Arah Angin</span>
                        </div>
                        
                        <WindCompassLarge direction={latestData?.wind?.direction_deg || 0} />
                        
                        <div className="mt-3 text-center flex items-center justify-center gap-2">
                          <div className="text-right">
                             <p className="text-[15px] font-black text-slate-800 leading-none">{latestData?.wind?.direction_deg ?? '-'}°</p>
                          </div>
                          <span className="text-slate-300">|</span>
                          <div className="text-left flex items-baseline gap-1">
                             <p className="text-[15px] font-black text-slate-800 leading-none">{latestData?.wind?.speed_avg_1h ?? latestData?.wind?.speed_max_1h ?? '-'}</p>
                             <span className="text-[9px] font-bold text-slate-400">m/s</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Grid Atmosfer 2x2 */}
                      <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                        <StatCard label="Suhu Udara" value={latestData?.atmosphere?.temperature_c} unit="°C" icon={Thermometer} />
                        <StatCard label="Kelembapan" value={latestData?.atmosphere?.humidity_percent} unit="%" icon={Droplets} />
                        <StatCard label="Tekanan" value={latestData?.atmosphere?.pressure_hpa} unit="hPa" icon={Gauge} />
                        <StatCard label="Titik Embun" value={latestData?.atmosphere?.dew_point_c} unit="°C" icon={CloudRain} />
                      </div>
                    </div>

                    {/* 3. Grid Parameter Perairan (Bawah) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                      <StatCard label="Suhu Air" value={latestData?.marine?.sea_temperature_c} unit="°C" icon={Waves} />
                      <StatCard label="Salinitas" value={latestData?.marine?.salinity_psu} unit="PSU" icon={Activity} />
                      <StatCard label="pH Air" value={latestData?.marine?.ph} unit="" icon={Activity} />
                      <StatCard label="Hujan (Total)" value={latestData?.precipitation_solar?.rain_mm} unit="mm" icon={CloudRain} />
                    </div>
                  </>
                )}

              </div>

              <div className="px-4"><hr className="border-slate-100" /></div>

              {/* ACTION FOOTER */}
              <div className="p-4 space-y-3 mt-auto">
                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Koordinat MAWS</span></div>
                <div className="flex justify-between pl-5 text-[11px] font-medium text-slate-600"><p>Lat: -0.5700</p><p>Lon: 117.2060</p></div>
                
                <button onClick={() => setIsChartModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-sm">
                  <BarChart3 size={16} /> Lihat Tren Riwayat (7 Hari)
                </button>
              </div>

            </div>

          ) : (
            
            /* === TAMPILAN GRAFIK === */
            <div className="p-4 w-full h-[280px] sm:h-[320px] flex flex-col animate-in fade-in zoom-in-95 duration-300">
              
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 mb-4 w-fit mx-auto shrink-0">
                <button onClick={() => setActiveMetric('water_level')} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeMetric === 'water_level' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Muka Air</button>
                <button onClick={() => setActiveMetric('salinity')} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeMetric === 'salinity' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-800'}`}>Salinitas</button>
                <button onClick={() => setActiveMetric('ph')} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeMetric === 'ph' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>pH</button>
              </div>
              
              <div className="flex-1 min-h-0 w-full pb-4">
                {isLoadingHistory && currentHistoryData.length === 0 ? (
                   <div className="w-full h-full flex items-center justify-center">
                     <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                   </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentHistoryData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      
                      <XAxis 
                        dataKey="fullTimestamp" 
                        tickFormatter={(tick) => {
                           const d = new Date(tick);
                           return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(d).replace('.', ':');
                        }}
                        tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} 
                        tickMargin={10} axisLine={false} tickLine={false} minTickGap={40} 
                      />
                      
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px' }}
                        // TAMBAHKAN : any PADA PARAMETER LABEL DI BAWAH INI
                        labelFormatter={(label: any) => { 
                          const d = new Date(label);
                          return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d).replace('.', ':');
                     }}
                        labelStyle={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px', fontSize: '10px' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}
                        formatter={(value: any) => [`${value}`, getMetricConfig().label]}
                      />
                      
                      <Line 
                        name={getMetricConfig().label}
                        type="monotone" 
                        dataKey="value" 
                        stroke={getMetricConfig().color} 
                        strokeWidth={2.5} 
                        dot={{ r: 2.5, fill: getMetricConfig().color, strokeWidth: 0 }} 
                        activeDot={{ r: 5, fill: '#fff', stroke: getMetricConfig().color, strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium mt-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-blue-500" />
            <span>Update:</span> 
            <span className="font-bold text-slate-700">{lastUpdate || 'Loading...'}</span>
          </div>
          <div className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 ${isLoadingLatest ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
            {isLoadingLatest ? 'SYNC...' : (
              <><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ONLINE</>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}