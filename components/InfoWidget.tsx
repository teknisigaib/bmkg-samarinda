"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CloudSun, Activity, Wind, Droplets, ArrowRight, MapPin, Calendar, Waves,
  Sun, Cloud, CloudRain, CloudLightning, CloudFog, Radio
} from "lucide-react";
import type { GempaData } from "@/lib/bmkg/gempa";
import type { CuacaData } from "@/lib/bmkg/cuaca";

// Import Komponen UI Baru
import AwsWidgetContent, { AwsData } from "@/components/component-cuaca/aws/AwsWidgetContent";

interface InfoWidgetProps {
  dataGempa: GempaData | null;
  listCuaca: CuacaData[]; 
}

export default function InfoWidget({ dataGempa, listCuaca }: InfoWidgetProps) {
  const [activeTab, setActiveTab] = useState<"cuaca" | "gempa" | "aws">("cuaca");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!listCuaca || listCuaca.length <= 1 || isPaused || activeTab !== "cuaca") return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listCuaca.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [listCuaca, isPaused, activeTab]);

  const currentCuaca = listCuaca && listCuaca.length > 0 ? listCuaca[currentIndex] : null;

  // --- DATA AWS (Bisa diganti fetch API nantinya) ---
  const awsData: AwsData = {
    temp: 29.2,
    humidity: 78,
    rain: 0.0,
    windSpeed: 12.5,
    windDir: "Tenggara",
    solarRad: 850,
    lastUpdate: "09:30 WITA",
    isOnline: true
  };
  // --------------------------------------------------

  const getFallbackIcon = (code: string, sizeClass: string = "w-20 h-20") => {
    const c = parseInt(code);
    if (isNaN(c)) return <CloudSun className={`${sizeClass} text-yellow-500`} />;
    if (c === 0 || c === 1 || c === 2) return <Sun className={`${sizeClass} text-yellow-500`} />;
    if (c === 3 || c === 4) return <Cloud className={`${sizeClass} text-gray-400`} />;
    if (c >= 5 && c <= 45) return <CloudFog className={`${sizeClass} text-slate-400`} />;
    if (c >= 60 && c <= 63) return <CloudRain className={`${sizeClass} text-blue-500`} />;
    if (c >= 80) return <CloudLightning className={`${sizeClass} text-purple-500`} />;
    return <CloudSun className={`${sizeClass} text-yellow-500`} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 mb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[220px]">
        
        {/* --- TAB NAVIGASI (SIDEBAR) --- */}
        <div className="md:w-1/4 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col">
          
          <button 
            onClick={() => setActiveTab("cuaca")}
            className={`flex-1 p-4 md:p-5 flex items-center justify-center md:justify-start gap-3 transition-all ${
                activeTab === 'cuaca' ? 'bg-white text-blue-600 font-bold shadow-sm md:border-l-4 md:border-l-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {currentCuaca?.iconUrl ? (
                 <img src={currentCuaca.iconUrl} alt="icon" className="w-6 h-6 object-contain" />
            ) : <CloudSun className="w-6 h-6" />}
            <span className="text-sm">Cuaca Kaltim</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("gempa")}
            className={`flex-1 p-4 md:p-5 flex items-center justify-center md:justify-start gap-3 transition-all ${
                activeTab === 'gempa' ? 'bg-white text-red-600 font-bold shadow-sm md:border-l-4 md:border-l-red-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-6 h-6" /> 
            <span className="text-sm">Gempa Bumi</span>
          </button>

          <button 
            onClick={() => setActiveTab("aws")}
            className={`flex-1 p-4 md:p-5 flex items-center justify-center md:justify-start gap-3 transition-all ${
                activeTab === 'aws' ? 'bg-white text-blue-600 font-bold shadow-sm md:border-l-4 md:border-l-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Radio className={`w-6 h-6 ${awsData.isOnline ? 'animate-pulse' : ''}`} /> 
            <span className="text-sm">Live Data</span>
          </button>

        </div>

        {/* --- KONTEN UTAMA --- */}
        <div 
            className="flex-1 p-6 md:p-8 flex flex-col justify-center relative bg-white"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            
            {/* 1. KONTEN CUACA */}
            {activeTab === "cuaca" && (
                <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300"> 
                    {currentCuaca ? (
                        <div key={currentCuaca.wilayah}>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-x-8">
                                    {/* ICON */}
                                    {currentCuaca.iconUrl ? (
                                        <div className="w-24 h-24 relative">
                                            <img 
                                                src={currentCuaca.iconUrl} 
                                                alt={currentCuaca.cuaca}
                                                className="w-full h-full object-contain drop-shadow-md scale-125"
                                            />
                                        </div>
                                    ) : (
                                        getFallbackIcon(currentCuaca.kodeCuaca)
                                    )}

                                    <div className="justify-items-center space-y-0.5">
                                        <h3 className="text-gray-500 font-medium text-sm md:text-base flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-blue-500" /> {currentCuaca.wilayah}
                                        </h3>
                                        <div className="text-4xl font-bold text-gray-800 my-1">
                                            {currentCuaca.suhu}°C
                                        </div>
                                        <div className="text-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                            {currentCuaca.cuaca}
                                        </div>
                                        <div className="text-center text-md text-gray-400">
                                            {currentCuaca.jam} WITA
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Wind className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <span className="block font-bold text-gray-800">{currentCuaca.anginSpeed} km/j</span>
                                            <span className="text-xs">Arah {currentCuaca.anginDir}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <span className="block font-bold text-gray-800">{currentCuaca.kelembapan}%</span>
                                            <span className="text-xs">Kelembapan</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/cuaca/prakiraan" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition group">
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4 flex flex-col items-center">
                           <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                           Memuat data cuaca...
                        </div>
                    )}

                    {/* DOTS PAGINATION */}
                    {listCuaca && listCuaca.length > 1 && (
                        <div className="flex justify-center items-center gap-1.5 mt-4 w-full">
                            {listCuaca.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className="p-1 focus:outline-none"
                                >
                                    <div className={`h-1.5 rounded-full transition-all duration-500 ${
                                        idx === currentIndex ? "w-6 bg-blue-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                                    }`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 2. KONTEN GEMPA */}
            {activeTab === "gempa" && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {dataGempa ? (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0 bg-red-50 p-4 rounded-xl border border-red-100 text-center min-w-[120px]">
                                <span className="block text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Magnitudo</span>
                                <span className="text-4xl font-extrabold text-red-600">{dataGempa.Magnitude}</span>
                                <span className="text-sm text-red-400 font-medium">SR</span>
                            </div>
                            
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-500 text-sm">
                                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {dataGempa.Tanggal}</div>
                                    <div className="flex items-center gap-1"><Activity className="w-4 h-4" /> {dataGempa.Jam}</div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                    {dataGempa.Wilayah}
                                </h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm mt-2">
                                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded text-gray-600 border border-gray-200">
                                        <MapPin className="w-3 h-3" /> Kedalaman: {dataGempa.Kedalaman}
                                    </span>
                                    <span className={`px-3 py-1 rounded font-bold text-xs border flex items-center gap-1 ${
                                        dataGempa?.Potensi?.includes("tidak") || dataGempa?.Potensi?.includes("Tidak")
                                        ? "bg-green-100 text-green-700 border-green-200" 
                                        : "bg-red-100 text-red-700 border-red-200 animate-pulse"
                                    }`}>
                                        <Waves className="w-3 h-3" /> {dataGempa.Potensi}
                                    </span>
                                </div>
                            </div>

                            <Link href="/gempa/gempa-terbaru" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition group">
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">Data gempa tidak tersedia.</div>
                    )}
                </div>
            )}

            {/* 3. KONTEN AWS REALTIME (Dipisah ke Component) */}
            {activeTab === "aws" && (
                <AwsWidgetContent data={awsData} />
            )}

        </div>
      </div>
    </div>
  );
}