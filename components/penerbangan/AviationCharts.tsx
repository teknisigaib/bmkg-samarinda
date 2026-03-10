"use client";

import { useState, useEffect } from "react";
import { 
  Layers, 
  Wind, 
  CloudLightning, 
  Map as MapIcon, 
  Clock, 
  Maximize2, 
  ChevronDown, 
  X, 
  Info,
  AlertCircle
} from "lucide-react";

// --- KONFIGURASI DATA STATIS ---
const TIMES = ["00", "06", "12", "18"];

const FLIGHT_LEVELS = [
  { label: "FL050 (850 hPa)", value: "850" },
  { label: "FL100 (700 hPa)", value: "700" },
  { label: "FL140 (600 hPa)", value: "600" },
  { label: "FL180 (500 hPa)", value: "500" },
  { label: "FL240 (400 hPa)", value: "400" },
  { label: "FL300 (300 hPa)", value: "300" },
  { label: "FL340 (250 hPa)", value: "250" },
  { label: "FL390 (200 hPa)", value: "200" },
  { label: "FL450 (150 hPa)", value: "150" },
  { label: "FL530 (100 hPa)", value: "100" },
];

const CB_TYPES = [
  { label: "Tutupan Awan (Cover)", value: "extend" },
  { label: "Ketinggian Dasar (Base)", value: "base" },
  { label: "Ketinggian Puncak (Top)", value: "top" },
];

const SIGWX_TYPES = [
  { label: "High Level SIGWX", value: "high" },
  { label: "Medium Level SIGWX", value: "medium" },
];

type ChartCategory = 'wind' | 'cb' | 'sigwx';

export default function AviationCharts() {
  // --- STATE MANAGEMENT ---
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState<ChartCategory>('wind');
  
  // Sub-selection State
  const [selectedFL, setSelectedFL] = useState("300"); 
  const [selectedCB, setSelectedCB] = useState("extend");
  const [selectedSigwx, setSelectedSigwx] = useState("high");

  // UI State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Date State for URL Generation
  const [dateParams, setDateParams] = useState<{
      year: string, month: string, day: string, 
      fullDate: string, prevFullDate: string 
  } | null>(null);

  const [useFallbackDate, setUseFallbackDate] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
      const now = new Date();
      
      const year = now.getUTCFullYear().toString();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const fullDate = `${year}${month}${day}`;

      // Calculate previous date for fallback
      const prev = new Date(now);
      prev.setUTCDate(now.getUTCDate() - 1); 
      const prevYear = prev.getUTCFullYear().toString();
      const prevMonth = String(prev.getUTCMonth() + 1).padStart(2, '0');
      const prevDay = String(prev.getUTCDate()).padStart(2, '0');
      const prevFullDate = `${prevYear}${prevMonth}${prevDay}`;

      setDateParams({ year, month, day, fullDate, prevFullDate });

      // Set nearest synoptic hour (00, 06, 12, 18)
      const currentHour = now.getUTCHours();
      let nearestSynopticHour = Math.floor(currentHour / 6) * 6;
      const timeString = String(nearestSynopticHour).padStart(2, '0');
      setSelectedTime(timeString);
  }, []);

  // Reset fallback logic when controls change
  useEffect(() => {
      setUseFallbackDate(false);
      setIsLoading(true);
  }, [selectedTime, activeTab, selectedSigwx, selectedFL, selectedCB]);

  // --- HELPER: DESCRIPTION TEXT ---
  const getChartDescription = () => {
      if (activeTab === 'wind') {
          const flLabel = FLIGHT_LEVELS.find(f => f.value === selectedFL)?.label || selectedFL;
          return {
              title: `Peta Angin & Suhu - ${flLabel}`,
              desc: "Menampilkan arah dan kecepatan angin serta suhu udara pada berbagai level penerbangan. Digunakan untuk menentukan rute efisien dan antisipasi headwind/tailwind."
          };
      }
      if (activeTab === 'cb') {
          const cbLabel = CB_TYPES.find(c => c.value === selectedCB)?.label || selectedCB;
          return {
              title: `Analisis Awan CB - ${cbLabel}`,
              desc: "Memvisualisasikan area potensi awan Cumulonimbus (CB). Data mencakup cakupan area, ketinggian dasar, dan puncak awan untuk menghindari cuaca buruk."
          };
      }
      if (activeTab === 'sigwx') {
          return {
              title: selectedSigwx === 'high' ? "High Level SIGWX (SWH)" : "Medium Level SIGWX (SWM)",
              desc: "Peta cuaca signifikan yang menyoroti area turbulensi, icing, badai petir, dan fenomena berbahaya lainnya untuk perencanaan penerbangan jarak jauh."
          };
      }
      return { title: "", desc: "" };
  };

  const chartInfo = getChartDescription();

  // --- HELPER: URL GENERATOR ---
  const getImageUrl = () => {
      if (!dateParams) return ""; 

      if (activeTab === 'wind') {
          return `https://web-aviation.bmkg.go.id/model/windtemp/${selectedFL}_${selectedTime}.png?v=${new Date().getTime()}`; // Anti-cache
      } 
      else if (activeTab === 'cb') {
          return `https://web-aviation.bmkg.go.id/model/area/cb_${selectedCB}_${selectedTime}.png?v=${new Date().getTime()}`;
      } 
      else {
          if (selectedSigwx === 'high') {
              const dateToUse = useFallbackDate ? dateParams.prevFullDate : dateParams.fullDate;
              return `https://web-aviation.bmkg.go.id/model/highsigwx/${dateToUse}_${selectedTime}00_PGGE05_EGRR.png`;
          } else {
              // Medium Level structure usually needs precise path checking
              return `https://web-aviation.bmkg.go.id/model/mediumsigwx/${dateParams.year}/${dateParams.month}/sigwx_${dateParams.fullDate}${selectedTime}00.jpeg`;
          }
      }
  };

  const currentImageUrl = getImageUrl();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* 1. HEADER & GLOBAL CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                    <MapIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-xl tracking-tight">Peta Data Statis</h3>
                    <p className="text-slate-500 text-sm font-medium">Model Cuaca Penerbangan (BMKG)</p>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 w-full md:w-auto">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-600 whitespace-nowrap">Validity (UTC):</span>
                <div className="relative">
                    <select 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="bg-transparent font-mono font-bold text-lg text-blue-600 outline-none cursor-pointer pr-6 appearance-none"
                    >
                        {TIMES.map(t => <option key={t} value={t}>{t}:00</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-blue-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* 2. MAIN DISPLAY AREA */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* A. Navigation Tabs */}
            <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('wind')} 
                    className={`flex-1 min-w-[120px] py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 
                    ${activeTab === 'wind' ? 'bg-blue-50/50 text-blue-600 border-blue-500' : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <Wind className="w-4 h-4" /> Wind & Temp
                </button>
                <button 
                    onClick={() => setActiveTab('cb')} 
                    className={`flex-1 min-w-[120px] py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 
                    ${activeTab === 'cb' ? 'bg-blue-50/50 text-blue-600 border-blue-500' : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <CloudLightning className="w-4 h-4" /> Area CB
                </button>
                <button 
                    onClick={() => setActiveTab('sigwx')} 
                    className={`flex-1 min-w-[120px] py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 
                    ${activeTab === 'sigwx' ? 'bg-blue-50/50 text-blue-600 border-blue-500' : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <Layers className="w-4 h-4" /> SIGWX
                </button>
            </div>

            {/* B. Specific Controls (Context Aware) */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-200/60 flex flex-wrap gap-4 items-center justify-center min-h-[72px]">
                {activeTab === 'wind' && (
                    <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <span className="text-sm font-bold text-slate-600">Flight Level:</span>
                        <div className="relative">
                            <select 
                                value={selectedFL} 
                                onChange={(e) => setSelectedFL(e.target.value)} 
                                className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer transition-all hover:border-blue-400"
                            >
                                {FLIGHT_LEVELS.map(fl => (<option key={fl.value} value={fl.value}>{fl.label}</option>))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                )}
                {activeTab === 'cb' && (
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
                        {CB_TYPES.map(type => (
                            <button 
                                key={type.value} 
                                onClick={() => setSelectedCB(type.value)} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${selectedCB === type.value ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                )}
                {activeTab === 'sigwx' && (
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
                        {SIGWX_TYPES.map(type => (
                            <button 
                                key={type.value} 
                                onClick={() => setSelectedSigwx(type.value)} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${selectedSigwx === type.value ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* C. Info Banner */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-blue-900">{chartInfo.title}</h4>
                    <p className="text-xs text-blue-700 mt-0.5 leading-relaxed opacity-80">{chartInfo.desc}</p>
                </div>
            </div>

            {/* D. Chart Image Viewer */}
            <div 
                className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-slate-100 flex items-center justify-center overflow-hidden group cursor-zoom-in border-b border-slate-100"
                onClick={() => currentImageUrl && setPreviewImage(currentImageUrl)}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {dateParams ? (
                    <>
                        <img 
                            key={currentImageUrl}
                            src={currentImageUrl} 
                            alt={`Chart ${activeTab}`} 
                            className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setIsLoading(false)}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                // Fallback logic specifically for SIGWX
                                if (activeTab === 'sigwx' && selectedSigwx === 'high' && !useFallbackDate) {
                                    setUseFallbackDate(true);
                                } else {
                                    // Final error state
                                    target.style.display = 'none'; // Hide broken image
                                    setIsLoading(false); 
                                }
                            }}
                        />
                        
                        {/* Error State Display (If image hidden via onError) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: isLoading ? 'none' : 'flex', zIndex: -1 }}>
                            <div className="text-center">
                                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-400 font-medium text-sm">Data tidak tersedia untuk waktu ini</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-slate-400 animate-pulse">
                        <Clock className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Menyiapkan konfigurasi...</span>
                    </div>
                )}
                
                {/* Loading Indicator */}
                {isLoading && dateParams && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-[1px] z-10">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Memuat Peta...</span>
                        </div>
                    </div>
                )}

                {/* Hover Overlay */}
                {!isLoading && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-900/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/95 px-5 py-2.5 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 text-sm font-bold text-slate-700 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <Maximize2 className="w-4 h-4 text-blue-600" /> 
                            Perbesar Tampilan
                        </div>
                    </div>
                )}

                {/* Date Badge */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 shadow-lg z-20">
                    <span className="text-slate-400 mr-2">VALID:</span>
                    <span className="font-bold text-emerald-400">
                        {useFallbackDate ? dateParams?.prevFullDate : dateParams?.fullDate} 
                    </span>
                    <span className="mx-2 text-slate-600">|</span>
                    <span className="font-bold text-yellow-400">{selectedTime}:00 UTC</span>
                </div>
            </div>
        </div>

        {/* 3. LIGHTBOX MODAL */}
        {previewImage && (
            <div 
                className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" 
                onClick={() => setPreviewImage(null)}
            >
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
                     <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-lg pointer-events-auto">
                        <h3 className="text-white font-bold text-sm">{chartInfo.title}</h3>
                     </div>
                     <button 
                        onClick={() => setPreviewImage(null)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors pointer-events-auto"
                     >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div 
                    className="w-full h-full flex items-center justify-center overflow-auto p-4 md:p-10" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <img 
                        src={previewImage} 
                        alt="Full Chart" 
                        className="max-w-none md:max-w-full md:max-h-full object-contain shadow-2xl rounded-sm" 
                    />
                </div>
            </div>
        )}

    </div>
  );
}