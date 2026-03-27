"use client";

import React from 'react';
import { MahakamLocation, translateWindDir } from '@/lib/mahakam-data';
import { 
    Navigation2, Droplets, X, CalendarDays, Clock, 
    Thermometer, Eye, CloudSun, Cloud 
} from 'lucide-react';

interface Props {
  data: MahakamLocation;
  onClose?: () => void;
}

const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Makassar" 
      }).format(date);
    } catch (e) { return "-"; }
};

const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" 
      }).format(date);
    } catch (e) { return "-"; }
};

export default function StationDetailView({ data, onClose }: Props) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500 pb-10">
        
        {/* CONTAINER UTAMA */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col h-[700px]">
            
            {/* --- 1. HEADER UTAMA --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-50">
                <div className="w-10 md:block hidden"></div>
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-black text-slate-900 leading-none uppercase">
                        {data.name}
                    </h2>
                    <p className="text-[10px] text-blue-600 font-bold mt-3 uppercase tracking-widest px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100/50">
                        {data.regency}
                    </p>
                </div>
                {onClose ? (
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all border border-slate-100"
                    >
                        <X size={20} />
                    </button>
                ) : <div className="w-10"></div>}
            </div>

            {/* --- AREA SCROLL --- */}
            <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50 relative">
                
                {/* --- 2. HEADER KOLOM STICKY (AWAN DILEBARKAN KE 110px) --- */}
                <div className="sticky top-0 z-50 bg-slate-100/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-8 py-3 hidden md:flex items-center gap-6">
                   <div className="w-24 shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12}/> Waktu
                   </div>
                   <div className="w-48 shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Kondisi
                   </div>
                   
                   {/* Proporsi: Suhu | Awan (110px) | Angin | Visibilitas */}
                   <div className="flex-1 grid grid-cols-[1fr_110px_1.5fr_1fr] gap-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">Suhu / RH</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Awan</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">Angin & Arah</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4">Visibilitas</div>
                   </div>
                </div>

                {/* --- 3. LIST CONTENT --- */}
                <div className="p-4 space-y-3">
                    {data.forecasts && data.forecasts.length > 0 ? (
                        data.forecasts.map((fc, idx) => {
                            const prevDate = idx > 0 ? formatDate(data.forecasts![idx - 1].time) : null;
                            const currDate = formatDate(fc.time);
                            const showDateHeader = prevDate !== currDate;

                            return (
                                <React.Fragment key={idx}>
                                    
                                    {showDateHeader && (
                                        <div className="sticky top-[45px] z-40 py-3 flex items-center justify-center gap-4">
                                            <div className="h-px flex-1 bg-slate-200"></div>
                                            <div className="flex items-center gap-2 text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                                <CalendarDays size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{currDate}</span>
                                            </div>
                                            <div className="h-px flex-1 bg-slate-200"></div>
                                        </div>
                                    )}

                                    {/* CARD ITEM */}
                                    <div className="bg-white rounded-2xl p-4 md:px-8 border border-slate-100 hover:border-blue-200 shadow-sm transition-all group">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            
                                            {/* Waktu */}
                                            <div className="w-full md:w-24 shrink-0 flex items-center">
                                                <span className="text-xl font-black text-slate-800 tracking-tight">
                                                    {formatTime(fc.time)}
                                                </span>
                                            </div>

                                            {/* Kondisi */}
                                            <div className="w-full md:w-48 shrink-0 flex flex-col items-center justify-center md:border-r md:border-slate-100 md:pr-6">
                                                <img src={fc.weatherIcon} alt={fc.condition} className="w-8 h-8 object-contain" />
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight mt-1">
                                                    {fc.condition}
                                                </span>
                                            </div>

                                            {/* Parameter Grid */}
                                            <div className="flex-1 grid grid-cols-2 md:grid-cols-[1fr_110px_1.5fr_1fr] gap-4 w-full items-center">
                                                
                                                {/* Suhu & RH */}
                                                <div className="flex flex-col border-l border-slate-100 pl-4">
                                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">Suhu / RH</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <Thermometer size={14} className="text-rose-400" />
                                                            <span className="text-base font-bold text-slate-800">{fc.temp}°</span>
                                                        </div>
                                                        <div className="w-px h-3 bg-slate-200"></div>
                                                        <div className="flex items-center gap-1">
                                                            <Droplets size={14} className="text-blue-400" />
                                                            <span className="text-base font-bold text-slate-800">{fc.humidity}%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tutupan Awan (Sedikit lebih lebar) */}
                                                <div className="flex flex-col md:items-center md:border-l border-slate-100">
                                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">Awan</span>
                                                    <div className="flex items-center gap-2">
                                                        <Cloud size={15} className="text-slate-400" />
                                                        <span className="text-base font-bold text-slate-800">
                                                            {fc.tcc}<span className="text-[10px] text-slate-400 ml-0.5">%</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Angin & Arah (Inline) */}
                                                <div className="flex flex-col md:border-l border-slate-100 pl-0 md:pl-4">
                                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">Angin</span>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-base font-bold text-slate-800 whitespace-nowrap">
                                                            {fc.windSpeed} <span className="text-[10px] text-slate-400 font-normal">km/j</span>
                                                        </span>
                                                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[9px] font-bold text-blue-600 uppercase shrink-0">
                                                           <Navigation2 size={10} style={{ transform: `rotate(${fc.windDeg}deg)` }} fill="currentColor" />
                                                           {translateWindDir(fc.windDir)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Visibilitas */}
                                                <div className="flex flex-col md:border-l border-slate-100 pl-0 md:pl-4">
                                                    <span className="md:hidden text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">Visibilitas</span>
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <Eye size={14} className="text-slate-400" />
                                                        <span className="text-sm font-bold whitespace-nowrap">{fc.visibility_text}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 min-h-[400px]">
                            <CloudSun size={64} strokeWidth={1} />
                            <p className="text-xs font-bold uppercase tracking-[0.2em]">Data Tidak Ditemukan</p>
                        </div>
                    )}

                    <div className="py-12 text-center">
                        <span className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-bold bg-slate-200/50 px-6 py-2 rounded-full">End of Data Transmission</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}