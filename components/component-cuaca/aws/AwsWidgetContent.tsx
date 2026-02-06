"use client";

import Link from "next/link";
import { Droplets, Wind, Sun, Gauge, ArrowRight, Radio } from "lucide-react";

export interface AwsData {
  temp: number;
  humidity: number; // Tambahan field
  rain: number;
  windSpeed: number;
  windDir: string;
  solarRad: number;
  lastUpdate: string;
  isOnline: boolean;
}

interface AwsWidgetContentProps {
  data: AwsData;
}

export default function AwsWidgetContent({ data }: AwsWidgetContentProps) {
  return (
    <div className="w-full h-full flex items-center animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* CONTAINER UTAMA: 2 KOLOM PADA DESKTOP */}
      <div className="w-full flex flex-col md:flex-row items-center gap-4 md:gap-8">

        {/* === KOLOM 1: DATA UTAMA (SUHU & KELEMBABAN) === */}
        <div className="flex flex-col items-center text-center mx-auto min-w-[100px]">
             {/* Header Kecil */}
             <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Radio className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">AWS Samarinda</span>
             </div>
             
             {/* Suhu */}
             <div className="text-5xl md:text-4xl font-bold text-gray-800 tracking-tight leading-none">
                {data.temp}°C
             </div>
             
             {/* Kelembaban */}
             <div className="flex items-center gap-2 mt-2 bg-blue-50 px-3 py-1 rounded-full">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm font-bold text-blue-700">{data.humidity}% RH</span>
             </div>

             <div className="text-sm text-gray-400 mt-1.5 font-medium">
                Update: {data.lastUpdate}
             </div>
        </div>

        {/* === KOLOM 2: PARAMETER LAIN (GRID 2 BARIS / 4 KOTAK) === */}
        <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-8 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            
            {/* Kotak 1: Hujan */}
            <div className="flex items-center gap-3">
               <div className="p-2  rounded-lg text-blue-500 shrink-0">
                  <Droplets className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.rain} <span className="text-xs font-normal text-gray-400">mm</span>
                  </span>
                  <span className="text-xs text-gray-400">Curah Hujan</span>
               </div>
            </div>

            {/* Kotak 2: Angin */}
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg text-blue-500 shrink-0">
                  <Wind className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.windSpeed} <span className="text-xs font-normal text-gray-400">km/j</span>
                  </span>
                  <span className="text-xs text-gray-400">Kec. Angin</span>
               </div>
            </div>

            {/* Kotak 3: Radiasi */}
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg text-blue-500 shrink-0">
                  <Sun className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.solarRad} <span className="text-xs font-normal text-gray-400">W/m²</span>
                  </span>
                  <span className="text-xs text-gray-400">Rad. Matahari</span>
               </div>
            </div>

             {/* Kotak 4: Arah Angin */}
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg text-blue-500 shrink-0">
                  <Gauge className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.windDir}
                  </span>
                  <span className="text-xs text-gray-400">Arah Angin</span>
               </div>
            </div>

        </div>

        {/* Tombol Panah (Opsional, di kanan pojok) */}
        <Link
          href="/aws-samarinda"
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-gray-400 hover:bg-emerald-500 hover:text-white transition group shrink-0 ml-2"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

      </div>
    </div>
  );
}