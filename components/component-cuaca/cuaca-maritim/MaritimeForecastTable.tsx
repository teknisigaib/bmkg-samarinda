"use client";

import React from 'react';
import {
  Waves,
  Navigation2,
  Anchor,
  Thermometer,
  Droplets,
  Clock,
  CalendarDays,
  MapPin,
  ArrowDownUp
} from "lucide-react";
import {
  getWaveColor,
  NewMaritimeForecastItem,
  getWindRotation,
} from "@/lib/bmkg/maritim";

interface Props {
  data: NewMaritimeForecastItem[];
  locationName: string;
  isPort?: boolean;
}

// --- HELPER FORMATTER ---
const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Makassar"
  }).format(new Date(iso)).replace('.', ':'); 

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar"
  }).format(new Date(iso));

export default function MaritimeForecastTable({ data, locationName, isPort }: Props) {

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[700px] animate-in slide-in-from-bottom-8">
      
      {/* --- HEADER --- */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shadow-sm text-white ${isPort ? 'bg-red-500 shadow-red-200' : 'bg-blue-600 shadow-blue-200'}`}>
            {isPort ? <Anchor size={24} /> : <Waves size={24} />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 leading-tight">
              {locationName}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
               <MapPin size={12} /> {isPort ? 'Pelabuhan' : 'Perairan'} • Detail Per Jam (WITA)
            </p>
          </div>
        </div>
      </div>

      {/* --- LIST AREA --- */}
      <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50 p-4 space-y-3 relative">
        
        {data.map((item, idx) => {
            const prevDate = idx > 0 ? formatDate(data[idx - 1].time) : null;
            const currDate = formatDate(item.time);
            const showDateHeader = prevDate !== currDate;

            return (
                <React.Fragment key={idx}>
                    
                    {/* HEADER TANGGAL */}
                    {showDateHeader && (
                        <div className="sticky top-0 z-40 py-3 -mx-4 px-4 bg-slate-50/95 backdrop-blur-sm transition-all">
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px w-12 bg-slate-200"></div>
                                <div className="flex items-center gap-2 text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                    <CalendarDays size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {currDate}
                                    </span>
                                </div>
                                <div className="h-px w-12 bg-slate-200"></div>
                            </div>
                        </div>
                    )}

                    {/* CARD ROW CONTAINER (KEMBALI KE PUTIH BERSIH) */}
                    <div className="bg-white rounded-2xl p-2 border border-slate-100 hover:border-blue-300 shadow-[0_2px_4px_rgb(0,0,0,0.02)] transition-all group">
                        
                        <div className="flex flex-col md:flex-row items-stretch gap-2">
                            
                            {/* 1. KOLOM WAKTU & CUACA (Fixed Width) */}
                            <div className="w-full md:w-[240px] shrink-0 flex items-center justify-between md:justify-start px-3 py-2 md:border-r md:border-slate-50 gap-4">
                                <div className="flex items-center gap-2 w-20 shrink-0">
                                    <Clock size={16} className="text-slate-400" />
                                    <span className="text-xl font-black text-slate-800">{formatTime(item.time)}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 capitalize truncate w-full text-center">
                                    {item.weather}
                                </span>
                            </div>

                            {/* 2. KOLOM DATA (Grid) */}
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                                
                                {/* A. GELOMBANG */}
                                <div className="bg-slate-50/50 rounded-xl px-3 py-2 flex items-center gap-3 border border-slate-100 relative overflow-hidden">
                                    {/* Indikator Warna Kiri (Tetap ada sebagai penanda visual kecil) */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: getWaveColor(item.wave_cat) }}></div>
                                    <div className="ml-2">
                                        <span className="block text-[9px] uppercase font-bold text-slate-400">GELOMBANG</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-sm font-black text-slate-800">{item.wave_height}m</span>
                                            <span className="text-[9px] font-bold uppercase truncate max-w-[70px] text-slate-500">
                                                {item.wave_cat}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* B. ANGIN */}
                                <div className="bg-slate-50/50 rounded-xl px-3 py-2 flex items-center gap-3 border border-slate-100">
                                    <div className="p-1.5 rounded-lg shadow-sm border border-slate-100 bg-white text-slate-500 shrink-0">
                                        <Navigation2 
                                            size={14} 
                                            style={{ transform: `rotate(${getWindRotation(item.wind_from)}deg)` }} 
                                            fill="currentColor"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-[9px] uppercase font-bold text-slate-400 truncate">ANGIN ({item.wind_from})</span>
                                        <span className="text-sm font-black text-slate-800">{item.wind_speed} <span className="text-[10px] font-normal text-slate-500">kts</span></span>
                                    </div>
                                </div>

                                {/* C. ARUS LAUT (IKON ROTASI AKTIF) */}
                                <div className="bg-slate-50/50 rounded-xl px-3 py-2 flex items-center gap-3 border border-slate-100">
                                    <div className="p-1.5 rounded-lg shadow-sm border border-slate-100 bg-white text-blue-500 shrink-0">
                                        {/* Ikon berputar sesuai arah arus */}
                                        <Navigation2 
                                            size={14} 
                                            style={{ transform: `rotate(${getWindRotation(item.current_to)}deg)` }} 
                                            fill="currentColor"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-[9px] uppercase font-bold text-slate-400 truncate">ARUS KE {item.current_to}</span>
                                        <span className="text-sm font-black text-slate-800">{item.current_speed} <span className="text-[10px] font-normal text-slate-500">cm/s</span></span>
                                    </div>
                                </div>

                                {/* D. SUHU & RH (ATAU PASUT) */}
                                <div className="bg-slate-50/50 rounded-xl px-3 py-2 flex items-center justify-between border border-slate-100">
                                    {isPort ? (
                                        <div className="flex items-center gap-2">
                                            <ArrowDownUp size={14} className="text-emerald-500"/>
                                            <div>
                                                <span className="block text-[9px] uppercase font-bold text-slate-400">PASUT</span>
                                                <span className="text-sm font-black text-slate-800">{item.tides} m</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase font-bold text-slate-400">SUHU</span>
                                                <div className="flex items-center gap-1 font-bold text-sm text-slate-800">
                                                    <Thermometer size={12} className="text-rose-400"/> {item.temp_avg}°
                                                </div>
                                            </div>
                                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] uppercase font-bold text-slate-400">RH</span>
                                                <div className="flex items-center gap-1 font-bold text-sm text-slate-800">
                                                    <Droplets size={12} className="text-blue-400"/> {item.rh_avg}%
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        })}
        
        {/* Footer */}
        <div className="py-8 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold bg-slate-100 inline-block px-4 py-1 rounded-full">
                Akhir Data Prakiraan
            </p>
        </div>

      </div>
    </div>
  );
}