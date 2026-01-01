"use client";

import { useState, useEffect } from "react";
import { 
    Layers, Wind, CloudLightning, Map as MapIcon, 
    Clock, Maximize2, ChevronDown, X, Info 
} from "lucide-react";

// --- KONFIGURASI OPSI ---
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
  // --- STATE ---
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState<ChartCategory>('wind');
  
  // Sub-states
  const [selectedFL, setSelectedFL] = useState("300"); 
  const [selectedCB, setSelectedCB] = useState("extend");
  const [selectedSigwx, setSelectedSigwx] = useState("high");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // State Tanggal
  const [dateParams, setDateParams] = useState<{
      year: string, month: string, day: string, 
      fullDate: string, prevFullDate: string 
  } | null>(null);

  const [useFallbackDate, setUseFallbackDate] = useState(false);

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
  }, [selectedTime, activeTab, selectedSigwx, selectedFL, selectedCB]);

  // --- HELPER: DESKRIPSI DINAMIS ---
  const getChartDescription = () => {
      if (activeTab === 'wind') {
          const flLabel = FLIGHT_LEVELS.find(f => f.value === selectedFL)?.label || selectedFL;
          return {
              title: `Peta Angin & Suhu - ${flLabel}`,
              desc: "Wind & Temperature Chart adalah peta cuaca penerbangan yang menampilkan arah dan kecepatan angin serta suhu udara pada berbagai level penerbangan (Flight Level). Peta ini digunakan untuk membantu pilot, dispatcher, dan forecaster dalam menentukan jalur penerbangan yang efisien dan aman terhadap kondisi atmosfer di lapisan atas."
          };
      }
      if (activeTab === 'cb') {
          const cbLabel = CB_TYPES.find(c => c.value === selectedCB)?.label || selectedCB;
          return {
              title: `Analisis Awan CB - ${cbLabel}`,
              desc: "Prakiraan Area Cumulonimbus (CB) menggambarkan area dan karakteristik awan cumulonimbus yang berpotensi menimbulkan cuaca signifikan seperti badai petir, turbulensi, dan hujan lebat. Informasi mencakup ketinggian dasar, ketinggian puncak, serta luas tutupan awan CB yang digunakan pilot dan pengatur lalu lintas udara untuk menjaga keselamatan penerbangan."
          };
      }
      if (activeTab === 'sigwx') {
          if (selectedSigwx === 'high') {
              return {
                  title: "High Level Significant Weather (SWH)",
                  desc: "Significant Weather Chart (SIGWX) adalah peta cuaca penerbangan yang menampilkan fenomena cuaca signifikan seperti badai petir, turbulensi, dan aktivitas konvektif di level tinggi dan menengah. Informasi ini penting bagi perencana dan pelaksana penerbangan untuk menghindari area berisiko."
              };
          } else {
              return {
                  title: "Medium Level Significant Weather (SWM)",
                  desc: "Significant Weather Chart (SIGWX) adalah peta cuaca penerbangan yang menampilkan fenomena cuaca signifikan seperti badai petir, turbulensi, dan aktivitas konvektif di level tinggi dan menengah. Informasi ini penting bagi perencana dan pelaksana penerbangan untuk menghindari area berisiko."
              };
          }
      }
      return { title: "", desc: "" };
  };

  const chartInfo = getChartDescription();

  // --- URL GENERATOR ---
  const getImageUrl = () => {
      if (!dateParams) return ""; 

      if (activeTab === 'wind') {
          return `https://web-aviation.bmkg.go.id/model/windtemp/${selectedFL}_${selectedTime}.png?`;
      } 
      else if (activeTab === 'cb') {
          return `https://web-aviation.bmkg.go.id/model/area/cb_${selectedCB}_${selectedTime}.png`;
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
    <div className="space-y-6">
        
        {/* HEADER & TIME SELECTOR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <MapIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Peta Cuaca Penerbangan</h3>
                    <p className="text-slate-500 text-xs">Analisis Angin, Awan CB, & SIGWX</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-600">Validity (UTC):</span>
                <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-transparent font-mono font-bold text-blue-600 outline-none cursor-pointer"
                >
                    {TIMES.map(t => <option key={t} value={t}>{t}:00</option>)}
                </select>
            </div>
        </div>

        {/* MAIN CONTROLS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            
            {/* TABS */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
                <button onClick={() => setActiveTab('wind')} className={`flex-1 py-4 px-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'wind' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-50'}`}><Wind className="w-4 h-4" /> Wind Temp</button>
                <button onClick={() => setActiveTab('cb')} className={`flex-1 py-4 px-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'cb' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-50'}`}><CloudLightning className="w-4 h-4" /> Area CB</button>
                <button onClick={() => setActiveTab('sigwx')} className={`flex-1 py-4 px-2 text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'sigwx' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-50'}`}><Layers className="w-4 h-4" /> SIGWX</button>
            </div>

            {/* SUB-CONTROLS */}
            <div className="p-4 bg-slate-50 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-center">
                {activeTab === 'wind' && (
                    <div className="flex items-center gap-2 animate-in fade-in">
                        <span className="text-sm font-medium text-slate-600">Pilih Ketinggian:</span>
                        <div className="relative">
                            <select value={selectedFL} onChange={(e) => setSelectedFL(e.target.value)} className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                {FLIGHT_LEVELS.map(fl => (<option key={fl.value} value={fl.value}>{fl.label}</option>))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                )}
                {activeTab === 'cb' && (
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm animate-in fade-in">
                        {CB_TYPES.map(type => (
                            <button key={type.value} onClick={() => setSelectedCB(type.value)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedCB === type.value ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>{type.label}</button>
                        ))}
                    </div>
                )}
                {activeTab === 'sigwx' && (
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm animate-in fade-in">
                        {SIGWX_TYPES.map(type => (
                            <button key={type.value} onClick={() => setSelectedSigwx(type.value)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedSigwx === type.value ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>{type.label}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* DESCRIPTION BOX (BARU) */}
            <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-slate-800">{chartInfo.title}</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{chartInfo.desc}</p>
                </div>
            </div>

            {/* IMAGE VIEWER */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-100 flex items-center justify-center overflow-hidden group cursor-zoom-in"
                 onClick={() => currentImageUrl && setPreviewImage(currentImageUrl)}
            >
                {dateParams ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        key={currentImageUrl} // Force re-mount on URL change
                        src={currentImageUrl} 
                        alt={`Chart ${activeTab}`} 
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (activeTab === 'sigwx' && selectedSigwx === 'high' && !useFallbackDate) {
                                setUseFallbackDate(true);
                            } else {
                                target.src = "https://via.placeholder.com/1200x600?text=Data+Sedang+Diproses+BMKG";
                            }
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <Clock className="w-8 h-8 animate-pulse mb-2" />
                        <span>Menyiapkan data...</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Maximize2 className="w-4 h-4" /> Klik untuk memperbesar
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-white/20">
                    VALID: {useFallbackDate ? dateParams?.prevFullDate : dateParams?.fullDate} {selectedTime}:00 UTC
                </div>
            </div>
        </div>

        {/* LIGHTBOX MODAL */}
        {previewImage && (
            <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
                <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500/20 rounded-full text-white transition-colors">
                    <X className="w-8 h-8" />
                </button>
                <div className="w-full h-full flex items-center justify-center overflow-auto" onClick={(e) => e.stopPropagation()}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewImage} alt="Full Chart" className="max-w-none h-full object-contain md:h-auto md:w-full md:max-w-5xl shadow-2xl rounded-lg" />
                </div>
            </div>
        )}

    </div>
  );
}