"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, AlertTriangle, Filter, X, RefreshCcw, Map, Satellite, Flame, ChevronDown, Layers, Wind, Loader2 } from "lucide-react";

const KALTIM_KABUPATEN = [
  "BERAU", "KUTAI BARAT", "KUTAI KARTANEGARA", "KUTAI TIMUR", 
  "MAHAKAM ULU", "PASER", "PENAJAM PASER UTARA", "BALIKPAPAN", 
  "BONTANG", "SAMARINDA"
];

interface HotspotControlProps {
  dateMode: "single" | "range"; setDateMode: (mode: "single" | "range") => void;
  singleDate: string; setSingleDate: (date: string) => void;
  startDate: string; setStartDate: (date: string) => void;
  endDate: string; setEndDate: (date: string) => void;
  filterKab: string; setFilterKab: (kab: string) => void;
  filterConf: "ALL" | "TINGGI" | "SEDANG" | "RENDAH"; setFilterConf: (conf: any) => void;
  mapStyle: string; setMapStyle: (val: string) => void;
  spartanDate: string; setSpartanDate: (val: string) => void;
  showFfmc: boolean; setShowFfmc: (val: boolean) => void;
  showIsi: boolean; setShowIsi: (val: boolean) => void;
  showFwi: boolean; setShowFwi: (val: boolean) => void;
  spartanOpacity: number; setSpartanOpacity: (val: number) => void;
  hotspotStats: { total: number; tinggi: number; sedang: number; rendah: number }; // 🚀 Object Stats Rincian Hotspot
  isLoadingHotspot: boolean;
}

export default function HotspotControl({
  dateMode, setDateMode, singleDate, setSingleDate,
  startDate, setStartDate, endDate, setEndDate,
  filterKab, setFilterKab, filterConf, setFilterConf,
  mapStyle, setMapStyle,
  spartanDate, setSpartanDate, showFfmc, setShowFfmc, showIsi, setShowIsi, showFwi, setShowFwi,
  spartanOpacity, setSpartanOpacity, hotspotStats, isLoadingHotspot
}: HotspotControlProps) {
  
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, []);

  const handleReset = () => {
    setFilterKab("ALL");
    setFilterConf("ALL");
    setShowFfmc(false);
    setShowIsi(false);
    setShowFwi(false);
    setSpartanOpacity(0.65);
  };

  const handleSpartanChange = (layer: string) => {
    setShowFfmc(layer === 'ffmc');
    setShowIsi(layer === 'isi');
    setShowFwi(layer === 'fwi');
  };

  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] pointer-events-none flex flex-col">
      
      <style dangerouslySetInnerHTML={{__html: `
        .modern-input-mask::-webkit-calendar-picker-indicator { opacity: 0; width: 100%; height: 100%; position: absolute; top: 0; left: 0; cursor: pointer; }
        .modern-select { appearance: none; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
      `}} />

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-slate-200 text-slate-600 hover:text-blue-500 transition-all focus:outline-none w-fit animate-in zoom-in">
          <Filter size={20} strokeWidth={2} />
        </button>
      )}

      {isOpen && (
        <div className="pointer-events-auto bg-slate-50/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] border border-slate-200/80 w-[290px] overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300 flex flex-col max-h-full">
          
          {/* HEADER */}
          <div className="p-3.5 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] z-10 relative">
            <div className="flex items-center gap-3">
              <img src="/logo-bmkg.png" alt="Logo BMKG" className="w-7 h-7 object-contain drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-slate-800 leading-tight tracking-wide">Monitoring Karhutla</span>
                <span className="text-[9px] font-medium text-slate-500 leading-tight uppercase tracking-widest mt-0.5">Kaltim Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {(filterKab !== "ALL" || filterConf !== "ALL" || showFfmc || showIsi || showFwi || spartanOpacity !== 0.65) && (
                <button onClick={handleReset} title="Reset Filter" className="text-slate-500 hover:text-blue-600 p-1.5 rounded-md transition-colors bg-slate-50 hover:bg-blue-50 border border-slate-200/60 shadow-sm">
                  <RefreshCcw size={12} strokeWidth={2.5} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors focus:outline-none">
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            
            {/* 1. TAMPILAN PETA DASAR */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Tampilan Peta Dasar</p>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 shadow-inner">
                <button onClick={() => setMapStyle('light')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-md transition-all ${mapStyle === 'light' ? 'bg-white shadow-sm text-blue-600 font-semibold border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 font-medium'}`}><Map size={14} /><span className="text-[9px]">Terang</span></button>
                <button onClick={() => setMapStyle('satellite')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-md transition-all ${mapStyle === 'satellite' ? 'bg-white shadow-sm text-blue-600 font-semibold border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 font-medium'}`}><Satellite size={14} /><span className="text-[9px]">Satelit</span></button>
                <button onClick={() => setMapStyle('dark')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-md transition-all ${mapStyle === 'dark' ? 'bg-white shadow-sm text-blue-600 font-semibold border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 font-medium'}`}><Map size={14} className={mapStyle === 'dark' ? '' : 'opacity-50'} /><span className="text-[9px]">Gelap</span></button>
              </div>
            </div>

            {/* 2. KONTROL HOTSPOT */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
               <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-blue-500" /> Data Hotspot
                     </span>
                     
                     {isLoadingHotspot ? (
                       <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1 shadow-sm">
                          <Loader2 size={10} className="animate-spin" /> Memuat...
                       </span>
                     ) : (
                       <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shadow-sm">
                          {hotspotStats.total} Terfilter
                       </span>
                     )}
                  </div>

                  {/* 🚀 RINCIAN DATA HOTSPOT (Tinggi, Sedang, Rendah) */}
                  {!isLoadingHotspot && hotspotStats.total >= 0 && (
                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-2 mx-1 shadow-inner">
                      <div className="flex flex-col items-center flex-1">
                         <span className="text-[11px] font-bold text-red-500">{hotspotStats.tinggi}</span>
                         <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Tinggi</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="flex flex-col items-center flex-1">
                         <span className="text-[11px] font-bold text-yellow-500">{hotspotStats.sedang}</span>
                         <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Sedang</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="flex flex-col items-center flex-1">
                         <span className="text-[11px] font-bold text-emerald-500">{hotspotStats.rendah}</span>
                         <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Rendah</span>
                      </div>
                    </div>
                  )}
               </div>

               {/* RADIO BUTTON (Accent Blue) */}
               <div className="flex justify-center items-center gap-6 px-1 py-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                     <input type="radio" name="datemode" checked={dateMode === 'single'} onChange={() => setDateMode('single')} className="accent-blue-500 w-3.5 h-3.5 cursor-pointer" />
                     <span className="text-[10px] font-medium text-slate-600">Harian</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                     <input type="radio" name="datemode" checked={dateMode === 'range'} onChange={() => setDateMode('range')} className="accent-blue-500 w-3.5 h-3.5 cursor-pointer" />
                     <span className="text-[10px] font-medium text-slate-600">Periode Range</span>
                  </label>
               </div>

               {/* DATE PICKER (Tema Biru) */}
               {dateMode === "single" ? (
                  <div className="relative flex items-center group">
                    <Calendar className="absolute left-3 w-3.5 h-3.5 text-blue-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                    <input type="date" value={singleDate} onChange={(e) => setSingleDate(e.target.value)} className="modern-input-mask w-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium rounded-lg py-2 pl-9 pr-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner relative z-10" />
                  </div>
               ) : (
                  <div className="flex flex-col gap-2">
                     <div className="relative flex items-center group">
                       <span className="absolute left-3 text-[9px] font-semibold text-slate-400 uppercase pointer-events-none">Dari</span>
                       <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="modern-input-mask w-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium rounded-lg py-1.5 pl-[38px] pr-2 outline-none focus:border-blue-400 focus:ring-1 transition-all shadow-inner relative z-10" />
                     </div>
                     <div className="relative flex items-center group">
                       <span className="absolute left-3 text-[9px] font-semibold text-slate-400 uppercase pointer-events-none">S/D</span>
                       <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="modern-input-mask w-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium rounded-lg py-1.5 pl-[38px] pr-2 outline-none focus:border-blue-400 focus:ring-1 transition-all shadow-inner relative z-10" />
                     </div>
                  </div>
               )}

               <div className="space-y-2 pt-1 border-t border-slate-100">
                 <div className="relative flex items-center">
                   <MapPin className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                   <select value={filterKab} onChange={(e) => setFilterKab(e.target.value)} className="modern-select w-full bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded-lg py-2 pl-8 pr-8 outline-none focus:border-blue-400 transition-all shadow-sm cursor-pointer">
                      <option value="ALL">Semua Kabupaten/Kota</option>
                      {KALTIM_KABUPATEN.map(kab => (
                         <option key={kab} value={kab}>{kab}</option>
                      ))}
                   </select>
                   <ChevronDown className="absolute right-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
                 
                 <div className="relative flex items-center">
                   <AlertTriangle className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                   <select value={filterConf} onChange={(e) => setFilterConf(e.target.value as any)} className="modern-select w-full bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded-lg py-2 pl-8 pr-8 outline-none focus:border-blue-400 transition-all shadow-sm cursor-pointer">
                      <option value="ALL">Semua Tingkat</option>
                      <option value="TINGGI">Tinggi (&ge; 9)</option>
                      <option value="SEDANG">Sedang (7 - 8)</option>
                      <option value="RENDAH">Rendah (&lt; 7)</option>
                   </select>
                   <ChevronDown className="absolute right-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
               </div>

               {/* LEGENDA HOTSPOT */}
               <div className="pt-3 border-t border-slate-100">
                 <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest px-1 block mb-2">Level Kepercayaan</span>
                 <div className="flex flex-wrap items-center gap-3 px-1">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f00707] shadow-sm"></span>
                        <span className="font-medium text-slate-600 text-[9px]">Tinggi (&ge;9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f3e309] shadow-sm"></span>
                        <span className="font-medium text-slate-600 text-[9px]">Sedang (7-8)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#13ce1d] shadow-sm"></span>
                        <span className="font-medium text-slate-600 text-[9px]">Rendah (&lt;7)</span>
                    </div>
                 </div>
               </div>

            </div>

            {/* 3. LAYER SPARTAN */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
               <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 px-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> Prakiraan SPARTAN
               </span>

               <div className="relative flex items-center group">
                 <Calendar className="absolute left-3 w-3.5 h-3.5 text-blue-500 pointer-events-none transition-colors" />
                 <input 
                   type="date" 
                   value={spartanDate} 
                   onChange={(e) => setSpartanDate(e.target.value)} 
                   className="modern-input-mask w-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium rounded-lg py-2 pl-9 pr-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all shadow-inner relative z-10" 
                 />
               </div>
               
               <div className="space-y-3.5 px-1 pt-1">
                 <label className="flex items-start gap-2.5 cursor-pointer group">
                   <input type="radio" name="spartan" checked={!showFfmc && !showIsi && !showFwi} onChange={() => handleSpartanChange('off')} className="mt-0.5 accent-slate-500 w-3.5 h-3.5 cursor-pointer" />
                   <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Sembunyikan Layer</span>
                 </label>

                 <label className="flex items-start gap-2.5 cursor-pointer group">
                   <input type="radio" name="spartan" checked={showFfmc} onChange={() => handleSpartanChange('ffmc')} className="mt-0.5 accent-blue-500 w-3.5 h-3.5 cursor-pointer" />
                   <div className="flex flex-col">
                     <span className="text-[11px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors">FFMC (Kemudahan Terbakar)</span>
                     <span className="text-[9px] text-slate-400 leading-relaxed mt-0.5">Memprakirakan tingkat kekeringan bahan ringan permukaan (serasah, dedaunan).</span>
                   </div>
                 </label>

                 <label className="flex items-start gap-2.5 cursor-pointer group">
                   <input type="radio" name="spartan" checked={showIsi} onChange={() => handleSpartanChange('isi')} className="mt-0.5 accent-blue-500 w-3.5 h-3.5 cursor-pointer" />
                   <div className="flex flex-col">
                     <span className="text-[11px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors">ISI (Laju Penjalaran Api)</span>
                     <span className="text-[9px] text-slate-400 leading-relaxed mt-0.5">Memprakirakan potensi kecepatan merambatnya api jika terjadi kebakaran.</span>
                   </div>
                 </label>

                 <label className="flex items-start gap-2.5 cursor-pointer group">
                   <input type="radio" name="spartan" checked={showFwi} onChange={() => handleSpartanChange('fwi')} className="mt-0.5 accent-blue-500 w-3.5 h-3.5 cursor-pointer" />
                   <div className="flex flex-col">
                     <span className="text-[11px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors">FWI (Indeks Cuaca Kebakaran)</span>
                     <span className="text-[9px] text-slate-400 leading-relaxed mt-0.5">Indeks gabungan tingkat keparahan untuk memprakirakan intensitas karhutla.</span>
                   </div>
                 </label>
               </div>

               {(showFfmc || showIsi || showFwi) && (
                 <div className="pt-3 border-t border-slate-100 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                   <div className="flex justify-between items-center mb-2 px-1">
                     <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Transparansi</span>
                     <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{Math.round(spartanOpacity * 100)}%</span>
                   </div>
                   <input 
                     type="range" min="10" max="100" value={spartanOpacity * 100} 
                     onChange={(e) => setSpartanOpacity(Number(e.target.value) / 100)}
                     className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer outline-none"
                   />
                 </div>
               )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}