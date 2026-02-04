"use client";

import React from 'react';
import { Wind, Droplets, Thermometer, Wifi, ArrowRight, Gauge, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function CityObservationPanel() {
  // Dummy Data (Nanti diganti API AWS)
  const data = {
    temp: 29.2,
    rainRate: 0.0, // mm/jam
    rainTotal: 12.5, // mm (Hari ini)
    windSpeed: 8.5,
    windDir: "Tenggara",
    humidity: 78,
    pressure: 1009.2,
    isOnline: true,
    lastUpdate: "09:30 WITA"
  };

  const isRaining = data.rainRate > 0;

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        
        {/* Container Flex */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* 1. LABEL IDENTITAS (KIRI) */}
            <div className="flex items-center gap-4 w-full lg:w-auto border-b lg:border-b-0 border-slate-100 pb-4 lg:pb-0">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200">
                    <Gauge size={24} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                        AWS Kota Samarinda
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${data.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        <p className="text-xs text-slate-500 font-medium">
                            Live Observation • {data.lastUpdate}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. DATA METRICS (TENGAH) - GRID RESPONSIF */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 w-full lg:w-auto">
                
                {/* Suhu */}
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500">
                        <Thermometer size={18} />
                    </div>
                    <div>
                        <span className="block text-xl font-black text-slate-800 leading-none">
                            {data.temp}°
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Suhu Udara</span>
                    </div>
                </div>

                {/* Hujan (Highlight jika hujan) */}
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isRaining ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                        <Droplets size={18} />
                    </div>
                    <div>
                        <span className={`block text-xl font-black leading-none ${isRaining ? 'text-blue-600' : 'text-slate-800'}`}>
                            {data.rainRate}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Hujan (mm/j)</span>
                    </div>
                </div>

                {/* Angin */}
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <Wind size={18} />
                    </div>
                    <div>
                        <span className="block text-xl font-black text-slate-800 leading-none">
                            {data.windSpeed}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            {data.windDir} <Navigation size={8} className="rotate-45" fill="currentColor"/>
                        </span>
                    </div>
                </div>

                {/* Tekanan / Kelembapan */}
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                        <Gauge size={18} />
                    </div>
                    <div>
                        <span className="block text-xl font-black text-slate-800 leading-none">
                            {data.humidity}<span className="text-sm text-slate-400">%</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Kelembapan</span>
                    </div>
                </div>

            </div>

            {/* 3. TOMBOL DETAIL (KANAN) */}
            <div className="hidden lg:block border-l border-slate-200 pl-6">
                <Link 
                    href="/aws-samarinda" 
                    className="group flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-xl transition-all"
                >
                    Analisis Lengkap
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                </Link>
            </div>

        </div>
      </div>
    </div>
  );
}