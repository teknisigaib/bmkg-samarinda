"use client";

import React, { useState, useEffect } from "react";
import { Layers, Droplets, MapPin, X, Info } from "lucide-react";
import { ApiMetadata } from "./ClimateMap"; 

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface LayerControlProps {
  activeProduct: string;
  setActiveProduct: (val: string) => void;
  activeQueryParams: string;
  setActiveQueryParams: (val: string) => void;
  mapStyle: string;
  setMapStyle: (val: string) => void;
  mapMetadata: ApiMetadata | null; 
  isLoading: boolean;
}

export default function ClimateLayerControl({
  activeProduct,
  setActiveProduct,
  activeQueryParams,
  setActiveQueryParams,
  mapStyle,
  setMapStyle,
  mapMetadata,
  isLoading
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // State Waktu
  // State Waktu Harian (Otomatis H-1)
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1); 
    return d.toISOString().split('T')[0];
  });

  // Logic Otomatis: Cari Dasarian Terakhir yang Sudah Selesai (Rilis)
  const getLatestDasarian = () => {
    const today = new Date();
    let d = today.getDate();
    let m = today.getMonth();
    let y = today.getFullYear();
    let das = "1";

    if (d <= 10) {
      // Jika masih tgl 1-10, dasarian yg udah rilis adalah Dasarian 3 bulan kemaren
      das = "3";
      m -= 1;
      if (m < 0) { m = 11; y -= 1; }
    } else if (d <= 19) {
      // Jika tgl 11-20, yg rilis Dasarian 1 bulan ini
      das = "1";
    } else {
      // Jika tgl 21-akhir, yg rilis Dasarian 2 bulan ini
      das = "2";
    }
    return { y: y.toString(), m: m.toString(), das };
  };

  // State Waktu Dasarian (HTH)
  const [month, setMonth] = useState(() => getLatestDasarian().m);
  const [year, setYear] = useState(() => getLatestDasarian().y);
  const [dasarian, setDasarian] = useState(() => getLatestDasarian().das);

  // Format ke Query Params API
  useEffect(() => {
    let queryParams = "";
    
    if (activeProduct === "sebaran_hujan_harian") {
      const [y, m, d] = date.split('-');
      queryParams = `year=${parseInt(y, 10)}&month=${parseInt(m, 10)}&day=${parseInt(d, 10)}`;
      
    } else if (activeProduct === "hari_tanpa_hujan") {
      // Sesuaikan dengan parameter API HTH (year, month, dasarian)
      queryParams = `year=${year}&month=${parseInt(month, 10) + 1}&dasarian=${dasarian}`;
    }
    
    setActiveQueryParams(queryParams);
  }, [activeProduct, date, month, year, dasarian, setActiveQueryParams]);

  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] pointer-events-none flex flex-col">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200/60 text-slate-600 hover:text-blue-500 transition-all focus:outline-none w-fit"
        >
          <Layers size={20} />
        </button>
      )}

      {isOpen && (
        <div className="pointer-events-auto bg-white/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 w-72 overflow-hidden flex flex-col max-h-full animate-in slide-in-from-left-4 fade-in duration-300">
          
          {/* HEADER */}
          <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <img src="/logo-bmkg2.png" alt="Logo BMKG" className="w-7 h-7 object-contain drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800 leading-tight">WebGIS Iklim</span>
                <span className="text-[9px] font-medium text-slate-500 leading-tight">Kalimantan Timur</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors focus:outline-none">
              <X size={14} />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            
            {/* PETA DASAR */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Peta Dasar</p>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setMapStyle('light')} className={`flex-1 py-2 text-[10px] rounded-lg transition-all ${mapStyle === 'light' ? 'bg-white font-bold text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Light</button>
                <button onClick={() => setMapStyle('satellite')} className={`flex-1 py-2 text-[10px] rounded-lg transition-all ${mapStyle === 'satellite' ? 'bg-white font-bold text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Satelit</button>
                <button onClick={() => setMapStyle('dark')} className={`flex-1 py-2 text-[10px] rounded-lg transition-all ${mapStyle === 'dark' ? 'bg-white font-bold text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Dark</button>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* LAPISAN DATA */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1 px-1">Parameter Iklim</p>
              <div className="flex flex-col gap-2">
                
                {/* HARIAN */}
                <div className="flex flex-col">
                    <button 
                        onClick={() => setActiveProduct(activeProduct === 'sebaran_hujan_harian' ? '' : 'sebaran_hujan_harian')}
                        className="w-full flex items-center justify-between py-2 px-1 group focus:outline-none"
                    >
                        <div className="flex items-center gap-2.5">
                            <Droplets size={16} className={`${activeProduct === 'sebaran_hujan_harian' ? 'text-blue-500' : 'text-slate-400'}`} />
                            <span className={`text-[11px] font-semibold ${activeProduct === 'sebaran_hujan_harian' ? 'text-slate-800' : 'text-slate-500'}`}>
                                Sebaran Hujan Harian
                            </span>
                        </div>
                        <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${activeProduct === 'sebaran_hujan_harian' ? 'bg-blue-500' : 'bg-slate-300'}`}>
                            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ${activeProduct === 'sebaran_hujan_harian' ? 'translate-x-[14px]' : 'translate-x-0'}`} />
                        </div>
                    </button>
                    
                    {activeProduct === 'sebaran_hujan_harian' && (
                        <div className="mt-1 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* KONTROL WAKTU */}
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                <input 
                                    type="date" 
                                    value={date} 
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md p-2 outline-none focus:border-blue-400 shadow-sm"
                                />
                            </div>

                            {/* LEGENDA */}
                            {mapMetadata && !isLoading && mapMetadata.legend && mapMetadata.legend.length > 0 && (
                                <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                                    <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-50 pb-1.5">
                                        <Info size={12} className="text-blue-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Legenda</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {mapMetadata.legend.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-[10px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-sm shadow-sm border border-black/10" style={{ backgroundColor: item.color }}></div>
                                                    <span className="text-slate-600 font-medium">{item.range_text} mm</span>
                                                </div>
                                                <span className="text-slate-500">{item.category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* HTH */}
                <div className="flex flex-col">
                    <button 
                        onClick={() => setActiveProduct(activeProduct === 'hari_tanpa_hujan' ? '' : 'hari_tanpa_hujan')}
                        className="w-full flex items-center justify-between py-2 px-1 group focus:outline-none"
                    >
                        <div className="flex items-center gap-2.5">
                            <MapPin size={16} className={`${activeProduct === 'hari_tanpa_hujan' ? 'text-blue-500' : 'text-slate-400'}`} />
                            <span className={`text-[11px] font-semibold ${activeProduct === 'hari_tanpa_hujan' ? 'text-slate-800' : 'text-slate-500'}`}>
                                Hari Tanpa Hujan
                            </span>
                        </div>
                        <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${activeProduct === 'hari_tanpa_hujan' ? 'bg-blue-500' : 'bg-slate-300'}`}>
                            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ${activeProduct === 'hari_tanpa_hujan' ? 'translate-x-[14px]' : 'translate-x-0'}`} />
                        </div>
                    </button>

                    {activeProduct === 'hari_tanpa_hujan' && (
                        <div className="mt-1 mb-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* KONTROL WAKTU */}
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="flex-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md p-2 outline-none focus:border-blue-400 shadow-sm">
                                        {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                    </select>
                                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-20 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md p-2 outline-none focus:border-blue-400 shadow-sm">
                                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <select value={dasarian} onChange={(e) => setDasarian(e.target.value)} className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md p-2 outline-none focus:border-blue-400 shadow-sm">
                                    <option value="1">Dasarian I</option>
                                    <option value="2">Dasarian II</option>
                                    <option value="3">Dasarian III</option>
                                </select>
                            </div>

                            {/* LEGENDA HTH */}
                            {mapMetadata && !isLoading && mapMetadata.legend && mapMetadata.legend.length > 0 && (
                                <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                                    <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-50 pb-1.5">
                                        <Info size={12} className="text-blue-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Legenda HTH</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {mapMetadata.legend.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-[10px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-sm shadow-sm border border-black/10" style={{ backgroundColor: item.color }}></div>
                                                    <span className="text-slate-600 font-medium">{item.range_text} hari</span>
                                                </div>
                                                <span className="text-slate-500">{item.category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}