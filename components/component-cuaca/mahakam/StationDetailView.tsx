"use client";

import React from 'react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { 
    Navigation2, Droplets, X, MapPin, CalendarDays, Clock, 
    Thermometer, Eye, CloudSun 
} from 'lucide-react';

interface Props {
  data: MahakamLocation;
  onClose?: () => void;
}

// --- HELPER FORMATTER ---
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

// Helper Arah Angin
const getCardinalDirection = (angle: number) => {
    if (angle === undefined) return "-";
    const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
    return directions[Math.round(angle / 45) % 8];
};

const WeatherIconDisplay = ({ iconUrl, condition }: { iconUrl?: string, condition: string }) => {
    if (iconUrl) return <img src={iconUrl} alt={condition} className="w-12 h-12 object-contain drop-shadow-sm" />;
    return <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse"></div>;
};

export default function StationDetailView({ data, onClose }: Props) {

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500 pb-10">
        
        {/* CONTAINER UTAMA */}
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-50 overflow-hidden relative flex flex-col h-[700px]">
            
            {/* --- HEADER --- */}
            <div className="px-6 py-5 border-b border-blue-100/50 flex items-center justify-between bg-white sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">
                            {data.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                            {data.regency} <span className="w-1 h-1 rounded-full bg-slate-300"/> Detail Per Jam
                        </p>
                    </div>
                </div>
                
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-2.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100"
                        title="Tutup Detail"
                    >
                        <X size={22} />
                    </button>
                )}
            </div>

            {/* --- LIST AREA --- */}
            {/* Background diganti ke slate-50 murni agar kartu putih lebih menonjol */}
            <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-50 p-4 space-y-3 relative">
                
                {data.forecasts && data.forecasts.length > 0 ? (
                    data.forecasts.map((fc, idx) => {
                        // Grouping Tanggal
                        const prevDate = idx > 0 ? formatDate(data.forecasts![idx - 1].time) : null;
                        const currDate = formatDate(fc.time);
                        const showDateHeader = prevDate !== currDate;

                        return (
                            <React.Fragment key={idx}>
                                
                                {/* --- HEADER TANGGAL (REDESIGNED) --- */}
                                {showDateHeader && (
                                    <div className="sticky top-0 z-40 py-3 -mx-4 px-4 bg-slate-50/95 backdrop-blur-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            {/* Garis Kiri */}
                                            <div className="h-px flex-1 bg-blue-200/50"></div>
                                            
                                            {/* Label Tanggal */}
                                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100/50">
                                                <CalendarDays size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {currDate}
                                                </span>
                                            </div>

                                            {/* Garis Kanan */}
                                            <div className="h-px flex-1 bg-blue-200/50"></div>
                                        </div>
                                    </div>
                                )}

                                {/* CARD ITEM */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-300 shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.05)] transition-all group">
                                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                        
                                        {/* 1. WAKTU & IKON */}
                                        <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-4 border-b md:border-b-0 border-slate-50 pb-3 md:pb-0">
                                            <div className="flex items-center gap-2 min-w-[80px]">
                                                <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <Clock size={16} />
                                                </div>
                                                <span className="text-xl font-black text-slate-800">{formatTime(fc.time)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                 <WeatherIconDisplay iconUrl={fc.weatherIcon} condition={fc.condition} />
                                                 <span className="text-sm font-bold text-slate-700 capitalize w-24 leading-tight md:hidden">
                                                    {fc.condition}
                                                 </span>
                                            </div>
                                        </div>

                                        {/* 2. DETAIL PARAMETER GRID */}
                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                                            
                                            {/* Kondisi (Desktop) */}
                                            <div className="hidden md:flex flex-col justify-center border-l border-slate-50 pl-4">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 whitespace-nowrap">Kondisi</span>
                                                <span className="text-sm font-bold text-slate-700 capitalize leading-tight whitespace-nowrap">
                                                    {fc.condition}
                                                </span>
                                            </div>

                                            {/* Suhu */}
                                            <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3 border border-slate-100">
                                                <div className="p-1.5 bg-white rounded-lg text-rose-500 shadow-sm border border-slate-100">
                                                    <Thermometer size={14} />
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap">Suhu</span>
                                                    <span className="text-sm font-black text-slate-800 whitespace-nowrap">{fc.temp}°C</span>
                                                </div>
                                            </div>

                                            {/* Angin */}
                                            <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3 border border-slate-100">
                                                <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                                                    <Navigation2 
                                                        size={14} 
                                                        style={{ transform: `rotate(${fc.windDeg}deg)` }} 
                                                        fill="currentColor"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap">
                                                        Angin ({getCardinalDirection(fc.windDeg)})
                                                    </span>
                                                    <span className="text-sm font-black text-slate-800 whitespace-nowrap">{fc.windSpeed} <span className="text-[10px] font-normal text-slate-500">km/j</span></span>
                                                </div>
                                            </div>

                                            {/* Visibility & Humid */}
                                            <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between border border-slate-100 col-span-2 md:col-span-1">
                                                <div className="flex items-center gap-2">
                                                    <Eye size={14} className="text-slate-400"/>
                                                    <div>
                                                        <span className="block text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap">Visibilitas</span>
                                                        <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{fc.visibility_text || "-"}</span>
                                                    </div>
                                                </div>
                                                <div className="w-px h-6 bg-slate-200"></div>
                                                <div className="flex items-center gap-2">
                                                    <Droplets size={14} className="text-blue-400"/>
                                                    <div>
                                                        <span className="block text-[9px] uppercase font-bold text-slate-400 whitespace-nowrap">RH</span>
                                                        <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{fc.humidity}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 min-h-[300px]">
                        <CloudSun size={48} className="text-slate-200" />
                        <p className="text-sm font-medium italic">Data prakiraan cuaca tidak tersedia untuk lokasi ini.</p>
                    </div>
                )}

                {/* Footer List */}
                <div className="py-6 text-center">
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                        Akhir dari data prakiraan
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}