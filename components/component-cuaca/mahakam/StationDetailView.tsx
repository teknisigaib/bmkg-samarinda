"use client";

import React from 'react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { Navigation2, Droplets, X, MapPin } from 'lucide-react';

interface Props {
  data: MahakamLocation;
  onClose?: () => void;
}

const WeatherIconDisplay = ({ iconUrl, condition }: { iconUrl?: string, condition: string }) => {
    if (iconUrl) return <img src={iconUrl} alt={condition} className="w-10 h-10 object-contain" />;
    return <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse"></div>;
};

// Helper Format Tanggal
const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date);
};

// HELPER ARAH ANGIN
const getCardinalDirection = (angle: number) => {
    if (angle === undefined) return "-";
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
};

export default function StationDetailView({ data, onClose }: Props) {

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[600px]">
            
            {/* HEADER */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 leading-none">
                            {data.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {data.regency} • Detail Per Jam
                        </p>
                    </div>
                </div>
                
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                        title="Tutup Detail"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* TABLE AREA */}
            <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 bg-white">
                <table className="w-full text-left border-collapse">
                    
                    {/* TABLE HEADER  */}
                    <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm shadow-sm">
                        <tr className="border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32">WAKTU</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">KONDISI CUACA</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ANGIN</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">SUHU</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">RH %</th>
                        </tr>
                    </thead>
                    
                    {/* TABLE BODY */}
                    <tbody className="divide-y divide-slate-50">
                        {data.forecasts && data.forecasts.length > 0 ? (
                            data.forecasts.map((fc, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                    
                                    {/* WAKTU & TANGGAL */}
                            <td className="px-6 py-4 whitespace-nowrap align-middle">
                                <div className="flex flex-col">
                                    <span className="text-base font-black text-slate-900 font-mono">
                                        {/* Jam */}
                                        {fc.time.includes(' ') ? fc.time.split(' ')[1].slice(0,5) : fc.time}
                                    </span>
                                    
                                    <span className="text-[10px] font-medium text-slate-400 mt-1">
                                        {fc.date ? formatDateShort(fc.date) : "-"}
                                    </span>
                                </div>
                            </td>

                                    {/* KONDISI */}
                                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                                        <div className="flex items-center gap-4">
                                            <WeatherIconDisplay iconUrl={fc.weatherIcon} condition={fc.condition} />
                                            <span className="text-sm font-semibold text-slate-700 capitalize">
                                                {fc.condition}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ANGIN */}
                                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <Navigation2 
                                                  size={14} 
                                                  className="text-blue-600"
                                                  style={{ transform: `rotate(${fc.windDeg || 0}deg)` }} 
                                                  fill="currentColor"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">
                                                    {getCardinalDirection(fc.windDeg || 0)}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {fc.windSpeed} km/j
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SUHU */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                                        <span className="text-lg font-black text-slate-900 block">{fc.temp}°</span>
                                        <span className="text-[10px] font-medium text-slate-400">Terasa {fc.temp + 2}°</span>
                                    </td>

                                    {/* RH% */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                                       <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50/50 text-blue-600 text-xs font-bold border border-blue-100 min-w-[70px]">
                                          <Droplets size={10} className="mr-1.5" />
                                          {data.humidity}% 
                                       </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                    Data tidak tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}