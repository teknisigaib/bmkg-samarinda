"use client";

import React from 'react';
import { Navigation2, Thermometer, Droplets, ArrowDownUp, Clock, CalendarDays } from "lucide-react";
import { getWaveColor, NewMaritimeForecastItem, getWindRotation } from "@/lib/bmkg/maritim";

interface Props {
  data: NewMaritimeForecastItem[];
  locationName: string;
  isPort?: boolean;
}

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
    <div className="w-full bg-white border border-slate-200 overflow-hidden flex flex-col h-[700px] rounded-[2rem] shadow-lg animate-in slide-in-from-bottom-8">
      
      {/* --- 1. HEADER UTAMA --- */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col items-center justify-center text-center z-10">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
            {locationName}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-1.5">
             {isPort ? 'Titik Pelabuhan' : 'Area Perairan'} • Waktu Lokal (WITA)
          </p>
      </div>

      {/* --- AREA SCROLL (Latar Abu-abu agar Card Putih Menonjol) --- */}
      <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50 relative">
          
        {/* --- 2. HEADER KOLOM STICKY (Hanya Desktop) --- */}
        <div className="sticky top-0 z-50 bg-slate-100/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-3 hidden md:flex items-center gap-6">
           {/* Kolom Kiri: Waktu & Cuaca (Lebih Lebar) */}
           <div className="w-56 shrink-0 flex items-center">
              <div className="w-24 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-2"><Clock size={12}/> Waktu</div>
              <div className="flex-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Cuaca</div>
           </div>
           
           {/* Kolom Kanan: Grid Data */}
           <div className="flex-1 grid grid-cols-4 gap-4 w-full">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">Gelombang</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">Angin</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">Arus Laut</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">{isPort ? 'Pasut' : 'Suhu / RH'}</div>
           </div>
        </div>

        {/* --- 3. LIST CARD --- */}
        <div className="p-4 space-y-3">
            {data.map((item, idx) => {
                const prevDate = idx > 0 ? formatDate(data[idx - 1].time) : null;
                const currDate = formatDate(item.time);
                const showDateHeader = prevDate !== currDate;

                return (
                    <React.Fragment key={idx}>
                        
                        {/* Pemisah Tanggal */}
                        {showDateHeader && (
                            <div className="sticky top-[45px] z-40 py-2 -mx-4 px-4 bg-slate-50/90 backdrop-blur-sm">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-px w-8 md:w-16 bg-slate-200"></div>
                                    <div className="flex items-center gap-2 text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                        <CalendarDays size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {currDate}
                                        </span>
                                    </div>
                                    <div className="h-px w-8 md:w-16 bg-slate-200"></div>
                                </div>
                            </div>
                        )}

                        {/* BARIS DATA (BENTUK CARD MELAYANG) */}
                        <div className="bg-white rounded-2xl p-3 md:py-4 md:px-6 border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-4 md:gap-6 group">
                            
                            {/* Kolom 1: Waktu & Cuaca (Lebar Ditambah) */}
                            <div className="w-full md:w-56 flex items-center justify-between md:border-r md:border-slate-100 md:pr-6 shrink-0">
                                <div className="flex items-center gap-2 w-24 shrink-0">
                                    <Clock size={16} className="text-slate-400 md:hidden" /> {/* Ikon jam disembunyikan di desktop karena sudah ada di header */}
                                    <span className="text-xl font-black text-slate-800 tracking-tight">
                                        {formatTime(item.time)}
                                    </span>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center bg-slate-50 px-2 py-1.5 rounded border border-slate-100 leading-tight w-full max-w-[100px]">
                                        {item.weather}
                                    </span>
                                </div>
                            </div>

                            {/* Kolom 2: Grid Data Utama */}
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full items-center">
                                
                                {/* A. Gelombang (Garis Tebal) */}
                                {/* border-l-4 membuatnya jauh lebih tebal dan mencolok */}
                                <div className="flex flex-col border-l-[4px] pl-3 py-1" style={{ borderColor: getWaveColor(item.wave_cat) }}>
                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Gelombang</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-base font-bold text-slate-800">{item.wave_height} <span className="text-[10px] text-slate-500 font-normal">m</span></span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase truncate">({item.wave_cat})</span>
                                    </div>
                                </div>

                                {/* B. Angin */}
                                <div className="flex flex-col md:border-l border-slate-100 pl-0 md:pl-4 py-1">
                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Angin</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-slate-800">{item.wind_speed} <span className="text-[10px] text-slate-500 font-normal">kts</span></span>
                                        <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 text-[9px] font-bold text-blue-600 uppercase">
                                           <Navigation2 size={10} style={{ transform: `rotate(${getWindRotation(item.wind_from)}deg)` }} fill="currentColor" />
                                           {item.wind_from}
                                        </div>
                                    </div>
                                </div>

                                {/* C. Arus Laut */}
                                <div className="flex flex-col md:border-l border-slate-100 pl-0 md:pl-4 py-1">
                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Arus Laut</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-slate-800">{item.current_speed} <span className="text-[10px] text-slate-500 font-normal">cm/s</span></span>
                                        <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 text-[9px] font-bold text-emerald-600 uppercase">
                                           <Navigation2 size={10} style={{ transform: `rotate(${getWindRotation(item.current_to)}deg)` }} fill="currentColor" />
                                           Ke {item.current_to}
                                        </div>
                                    </div>
                                </div>

                                {/* D. Suhu / Pasut */}
                                <div className="flex flex-col md:border-l border-slate-100 pl-0 md:pl-4 py-1">
                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">{isPort ? 'Pasut' : 'Suhu / RH'}</span>
                                    {isPort ? (
                                        <div className="flex items-center gap-2">
                                            <ArrowDownUp size={12} className="text-emerald-500"/>
                                            <span className="text-base font-bold text-slate-800">{item.tides} <span className="text-[10px] text-slate-500 font-normal">m</span></span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 font-bold text-sm text-slate-800">
                                                <Thermometer size={14} className="text-rose-400"/> {item.temp_avg}°
                                            </div>
                                            <div className="w-px h-3 bg-slate-300"></div>
                                            <div className="flex items-center gap-1 font-bold text-sm text-slate-800">
                                                <Droplets size={14} className="text-blue-400"/> {item.rh_avg}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </React.Fragment>
                );
            })}
            
            <div className="py-6 text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold bg-slate-200/50 px-4 py-1.5 rounded-full">AKHIR DATA PRAKIRAAN</span>
            </div>
        </div>
      </div>
    </div>
  );
}