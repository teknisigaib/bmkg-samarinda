"use client";

import React from 'react';
import { Wind, Droplets, Thermometer, Gauge, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AwsStatusBar() {
  // Data Dummy (Nanti diganti API)
  const data = {
    temp: 29.2,
    rainRate: 0.0, // mm/jam
    windSpeed: 12.5,
    humidity: 78,
    isOnline: true,
    lastUpdate: "09:30 WITA"
  };

  const isRaining = data.rainRate > 0;

  return (
    <div className="w-full bg-white border-b border-slate-200 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-sm">
        
        {/* KIRI: LABEL LIVE */}
        <div className="flex items-center gap-3 border-r border-slate-200 pr-6 h-full">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${data.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="font-black text-slate-800 tracking-tight uppercase">AWS SAMARINDA</span>
            </div>
            <span className="hidden md:inline text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                Live {data.lastUpdate}
            </span>
        </div>

        {/* TENGAH: DATA METRICS (SCROLLABLE ON MOBILE) */}
        <div className="flex-1 flex items-center justify-start md:justify-center gap-6 overflow-x-auto no-scrollbar px-4 h-full whitespace-nowrap">
            
            {/* Suhu */}
            <div className="flex items-center gap-2">
                <Thermometer size={14} className="text-amber-500" />
                <span className="font-bold text-slate-700">{data.temp}°C</span>
            </div>

            {/* Hujan (Highlight jika hujan) */}
            <div className={`flex items-center gap-2 px-2 py-0.5 rounded ${isRaining ? 'bg-blue-100' : ''}`}>
                <Droplets size={14} className={isRaining ? 'text-blue-600' : 'text-slate-400'} />
                <span className={`font-bold ${isRaining ? 'text-blue-700' : 'text-slate-700'}`}>
                    {data.rainRate} <span className="text-[10px] text-slate-400 font-normal">mm/h</span>
                </span>
            </div>

            {/* Angin */}
            <div className="flex items-center gap-2">
                <Wind size={14} className="text-emerald-500" />
                <span className="font-bold text-slate-700">
                    {data.windSpeed} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                </span>
            </div>

            {/* Kelembapan (Hidden on small mobile) */}
            <div className="hidden sm:flex items-center gap-2">
                <Gauge size={14} className="text-purple-500" />
                <span className="font-bold text-slate-700">{data.humidity}%</span>
            </div>

        </div>

        {/* KANAN: LINK DETAIL */}
        <div className="hidden md:flex items-center h-full border-l border-slate-200 pl-6">
            <Link href="/aws-samarinda" className="group flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Analisis
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>

      </div>
    </div>
  );
}