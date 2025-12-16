"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CloudSun, Activity, Wind, Droplets, ArrowRight, MapPin, Calendar, Waves,
  Sun, Cloud, CloudRain, CloudLightning, CloudFog 
} from "lucide-react";
import type { GempaData } from "@/lib/bmkg/gempa";
import type { CuacaData } from "@/lib/bmkg/cuaca";

interface InfoWidgetProps {
  dataGempa: GempaData | null;
  dataCuaca: CuacaData | null;
}

export default function InfoWidget({ dataGempa, dataCuaca }: InfoWidgetProps) {
  const [activeTab, setActiveTab] = useState<"cuaca" | "gempa">("cuaca");

  // PERBAIKAN: Tambahkan parameter 'sizeClass'
  const getWeatherIcon = (code: string, sizeClass: string = "w-20 h-20") => {
    const c = parseInt(code);
    // Masukkan sizeClass ke dalam className icon
    if (c === 0 || c === 1 || c === 2) return <Sun className={`${sizeClass} text-yellow-500`} />;
    if (c === 3 || c === 4) return <Cloud className={`${sizeClass} text-gray-400`} />;
    if (c >= 5 && c <= 45) return <CloudFog className={`${sizeClass} text-slate-400`} />;
    if (c >= 60 && c <= 63) return <CloudRain className={`${sizeClass} text-blue-500`} />;
    if (c >= 80) return <CloudLightning className={`${sizeClass} text-purple-500`} />;
    return <CloudSun className={`${sizeClass} text-yellow-500`} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* --- TAB NAVIGASI --- */}
        <div className="md:w-1/4 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col">
          <button 
            onClick={() => setActiveTab("cuaca")}
            className={`flex-1 p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 transition-all ${
                activeTab === 'cuaca' ? 'bg-white text-blue-600 font-bold shadow-sm md:border-l-4 md:border-l-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {/* PERBAIKAN: Panggil dengan ukuran kecil (w-6 h-6) agar sama dengan Gempa */}
            {dataCuaca ? (
                getWeatherIcon(dataCuaca.kodeCuaca, "w-6 h-6") 
            ) : <CloudSun className="w-6 h-6" />}
            <span>Cuaca</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("gempa")}
            className={`flex-1 p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 transition-all ${
                activeTab === 'gempa' ? 'bg-white text-red-600 font-bold shadow-sm md:border-l-4 md:border-l-red-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-6 h-6" /> 
            <span>Gempa Bumi</span>
          </button>
        </div>

        {/* --- KONTEN TAB --- */}
        <div className="flex-1 p-6 md:p-8 min-h-[200px] flex items-center">
            
            {/* KONTEN CUACA */}
            {activeTab === "cuaca" && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {dataCuaca ? (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                {/* PERBAIKAN: Di sini biarkan default (w-20 h-20) agar tetap besar */}
                                {getWeatherIcon(dataCuaca.kodeCuaca)}
                                <div>
                                    <h3 className="text-gray-500 font-medium text-sm md:text-base">
                                        {dataCuaca.wilayah}
                                    </h3>
                                    <div className="text-4xl font-bold text-gray-800 my-1">
                                        {dataCuaca.suhu}°C
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                            {dataCuaca.cuaca}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Pukul {dataCuaca.jam}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Wind className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <span className="block font-bold text-gray-800">{dataCuaca.anginSpeed} km/j</span>
                                        <span className="text-xs">Arah {dataCuaca.anginDir}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Droplets className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <span className="block font-bold text-gray-800">{dataCuaca.kelembapan}%</span>
                                        <span className="text-xs">Kelembapan</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/cuaca/prakiraan" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition group">
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">Memuat data cuaca...</div>
                    )}
                </div>
            )}

            {/* KONTEN GEMPA (Biarkan Tetap Sama) */}
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

        </div>
      </div>
    </div>
  );
}