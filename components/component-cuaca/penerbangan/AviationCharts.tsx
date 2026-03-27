"use client";

import { useState, useEffect } from "react";
import { 
  Maximize2, 
  ChevronDown, 
  X, 
  AlertCircle
} from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

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

      const prev = new Date(now);
      prev.setUTCDate(now.getUTCDate() - 1); 
      const prevYear = prev.getUTCFullYear().toString();
      const prevMonth = String(prev.getUTCMonth() + 1).padStart(2, '0');
      const prevDay = String(prev.getUTCDate()).padStart(2, '0');
      const prevFullDate = `${prevYear}${prevMonth}${prevDay}`;

      setDateParams({ year, month, day, fullDate, prevFullDate });

      const currentHour = now.getUTCHours();
      let nearestSynopticHour = Math.floor(currentHour / 6) * 6;
      const timeString = String(nearestSynopticHour).padStart(2, '0');
      setSelectedTime(timeString);
  }, []);

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
          return `https://web-aviation.bmkg.go.id/model/windtemp/${selectedFL}_${selectedTime}.png?v=${new Date().getTime()}`;
      } 
      else if (activeTab === 'cb') {
          return `https://web-aviation.bmkg.go.id/model/area/cb_${selectedCB}_${selectedTime}.png?v=${new Date().getTime()}`;
      } 
      else {
          if (selectedSigwx === 'high') {
              const dateToUse = useFallbackDate ? dateParams.prevFullDate : dateParams.fullDate;
              return `https://web-aviation.bmkg.go.id/model/highsigwx/${dateToUse}_${selectedTime}00_PGGE05_EGRR.png`;
          } else {
              return `https://web-aviation.bmkg.go.id/model/mediumsigwx/${dateParams.year}/${dateParams.month}/sigwx_${dateParams.fullDate}${selectedTime}00.jpeg`;
          }
      }
  };

  const currentImageUrl = getImageUrl();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
        
        {/* --- 1. HEADER & GLOBAL CONTROLS --- */}
        <div className="flex flex-col items-center justify-center text-center gap-6 pb-2">
            
            <div>
                <h3 className="font-extrabold text-slate-900 text-3xl tracking-tight mb-2">Peta Data Cuaca</h3>
            </div>

            {/* Validity Time Control dengan Aksen Biru pada Teks Select */}
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Validity (UTC)</span>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="relative flex items-center">
                    <select 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="bg-transparent font-mono font-bold text-base text-blue-600 outline-none cursor-pointer pr-5 appearance-none hover:text-blue-800 transition-colors"
                    >
                        {TIMES.map(t => <option key={t} value={t}>{t}:00</option>)}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-500 absolute right-0 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* --- 2. MAIN DISPLAY AREA --- */}
        <div className="bg-white border border-slate-200 flex flex-col shadow-sm">
            
            {/* A. Navigation Tabs dengan Border Bawah Biru */}
            <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('wind')} 
                    className={`flex-1 min-w-[150px] py-4 px-4 text-xs uppercase tracking-[0.1em] font-bold transition-all border-b-2 
                    ${activeTab === 'wind' ? 'bg-blue-50/50 text-blue-700 border-blue-600' : 'text-slate-400 border-transparent hover:bg-slate-50/50 hover:text-slate-600'}`}
                >
                    Wind & Temp
                </button>
                <button 
                    onClick={() => setActiveTab('cb')} 
                    className={`flex-1 min-w-[150px] py-4 px-4 text-xs uppercase tracking-[0.1em] font-bold transition-all border-b-2 
                    ${activeTab === 'cb' ? 'bg-blue-50/50 text-blue-700 border-blue-600' : 'text-slate-400 border-transparent hover:bg-slate-50/50 hover:text-slate-600'}`}
                >
                    Area CB
                </button>
                <button 
                    onClick={() => setActiveTab('sigwx')} 
                    className={`flex-1 min-w-[150px] py-4 px-4 text-xs uppercase tracking-[0.1em] font-bold transition-all border-b-2 
                    ${activeTab === 'sigwx' ? 'bg-blue-50/50 text-blue-700 border-blue-600' : 'text-slate-400 border-transparent hover:bg-slate-50/50 hover:text-slate-600'}`}
                >
                    SIGWX
                </button>
            </div>

            {/* B. Specific Controls (Aksen Background Biru pada Pilihan Aktif) */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-center min-h-[72px]">
                {activeTab === 'wind' && (
                    <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Flight Level:</span>
                        <div className="relative">
                            <select 
                                value={selectedFL} 
                                onChange={(e) => setSelectedFL(e.target.value)} 
                                className="appearance-none pl-4 pr-10 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition-all hover:border-blue-400 rounded-sm"
                            >
                                {FLIGHT_LEVELS.map(fl => (<option key={fl.value} value={fl.value}>{fl.label}</option>))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                )}
                {activeTab === 'cb' && (
                    <div className="flex bg-white border border-slate-200 rounded-sm animate-in slide-in-from-top-2 duration-300">
                        {CB_TYPES.map(type => (
                            <button 
                                key={type.value} 
                                onClick={() => setSelectedCB(type.value)} 
                                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border-r border-slate-200 last:border-r-0 ${selectedCB === type.value ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                )}
                {activeTab === 'sigwx' && (
                    <div className="flex bg-white border border-slate-200 rounded-sm animate-in slide-in-from-top-2 duration-300">
                        {SIGWX_TYPES.map(type => (
                            <button 
                                key={type.value} 
                                onClick={() => setSelectedSigwx(type.value)} 
                                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all border-r border-slate-200 last:border-r-0 ${selectedSigwx === type.value ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* C. Info Banner */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col items-center text-center">
                <h4 className="text-sm font-bold text-blue-900 mb-1">{chartInfo.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{chartInfo.desc}</p>
            </div>

            {/* D. Chart Image Viewer */}
            <div 
                className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-slate-50 flex items-center justify-center overflow-hidden group cursor-zoom-in"
                onClick={() => currentImageUrl && setPreviewImage(currentImageUrl)}
            >
                {/* Minimalist Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {dateParams ? (
                    <>
                        <img 
                            key={currentImageUrl}
                            src={currentImageUrl} 
                            alt={`Chart ${activeTab}`} 
                            className={`w-full h-full object-contain transition-opacity duration-300 mix-blend-multiply relative z-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setIsLoading(false)}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (activeTab === 'sigwx' && selectedSigwx === 'high' && !useFallbackDate) {
                                    setUseFallbackDate(true);
                                } else {
                                    target.style.display = 'none';
                                    setIsLoading(false); 
                                }
                            }}
                        />
                        
                        {/* Error State Display */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: isLoading ? 'none' : 'flex', zIndex: -1 }}>
                            <div className="text-center">
                                <AlertCircle className="w-8 h-8 text-blue-400 mx-auto mb-3 opacity-50" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Data Tidak Tersedia</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-blue-300 animate-pulse">
                        <span className="text-xs font-bold uppercase tracking-widest">Inisialisasi...</span>
                    </div>
                )}
                
                {/* Loading Indicator (Scanning Line dengan warna Biru) */}
                {isLoading && dateParams && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-[3px] bg-blue-100 overflow-hidden rounded-full">
                                <div className="w-full h-full bg-blue-600 origin-left animate-[scale-x_1s_ease-in-out_infinite_alternate]"></div>
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Memuat Peta...</span>
                        </div>
                    </div>
                )}

                {/* Hover Overlay */}
                {!isLoading && (
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                        <div className="bg-white px-4 py-2 border border-blue-100 shadow-sm flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            <Maximize2 className="w-3.5 h-3.5 text-blue-500" /> 
                            Perbesar
                        </div>
                    </div>
                )}

                {/* Date Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 border border-slate-200 shadow-sm z-20 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Date:</span>
                        <span className="text-blue-700">{useFallbackDate ? dateParams?.prevFullDate : dateParams?.fullDate}</span>
                    </div>
                    <div className="w-px h-3 bg-slate-300"></div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Time:</span>
                        <span className="text-blue-700">{selectedTime}Z</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. LIGHTBOX MODAL (REUSABLE COMPONENT) */}
        <ImageLightbox 
            isOpen={!!previewImage} // Bernilai true jika previewImage tidak null
            imageUrl={previewImage}
            title={chartInfo.title}
            description={chartInfo.desc}
            onClose={() => setPreviewImage(null)}
            altText={`Full Chart ${activeTab}`}
        />

    </div>
  );
}