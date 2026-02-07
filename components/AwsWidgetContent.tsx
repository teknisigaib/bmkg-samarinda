"use client";

import Link from "next/link";
import { Droplets, Wind, Sun, Gauge, ArrowRight, Radio } from "lucide-react";
import { AwsSnapshotData } from "@/lib/aws-types"; // Import tipe data standar

interface AwsWidgetContentProps {
  data: AwsSnapshotData;
}

export default function AwsWidgetContent({ data }: AwsWidgetContentProps) {
  return (
    <div className="w-full h-full flex items-center animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* CONTAINER UTAMA */}
      <div className="w-full flex flex-col md:flex-row items-center gap-4 md:gap-8">

        {/* === KOLOM 1: DATA UTAMA === */}
        <div className="flex flex-col items-center text-center mx-auto min-w-[100px]">
             {/* Header Kecil */}
             <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Radio className={`w-4 h-4 ${data.isOnline ? 'text-blue-500 animate-pulse' : 'text-red-500'}`} />
                <span className="text-sm font-medium">AWS Temindung</span>
             </div>
             
             {/* Suhu */}
             <div className="text-5xl md:text-4xl font-bold text-gray-800 tracking-tight leading-none">
                {data.temp}°
             </div>
             
             {/* Kelembaban */}
             <div className="flex items-center gap-2 mt-2 bg-blue-50 px-3 py-1 rounded-full">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm font-bold text-blue-700">{data.humidity}% RH</span>
             </div>

             <div className="text-xs text-gray-400 mt-2 font-medium">
                Update: {data.lastUpdate}
             </div>
        </div>

        {/* === KOLOM 2: PARAMETER LAIN === */}
        <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            
            {/* Kotak 1: Hujan */}
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0">
                  <Droplets className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.rainRate} <span className="text-sm font-normal text-gray-400">mm</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Curah Hujan</span>
               </div>
            </div>

            {/* Kotak 2: Angin */}
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0">
                  <Wind className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {/* Konversi m/s ke km/j untuk display umum */}
                     {data.windSpeed} <span className="text-sm font-normal text-gray-400">m/s</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Arah {data.windDir}°</span>
               </div>
            </div>

            {/* Kotak 3: Radiasi */}
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0">
                  <Sun className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.solarRad} <span className="text-sm font-normal text-gray-400">W/m²</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Radiasi</span>
               </div>
            </div>

             {/* Kotak 4: Tekanan */}
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0">
                  <Gauge className="w-5 h-5" strokeWidth={2} />
               </div>
               <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                     {data.pressure} <span className="text-sm font-normal text-gray-400">hPa</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Tekanan</span>
               </div>
            </div>

        </div>

        {/* Tombol Panah */}
        <Link
          href="/cuaca/aws"
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-blue-400 hover:bg-blue-500 hover:text-white transition group shrink-0 ml-2 shadow-sm"
          title="Lihat Detail Lengkap"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

      </div>
    </div>
  );
}