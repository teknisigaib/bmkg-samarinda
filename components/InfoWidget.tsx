"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Activity, MapPin, Clock, Wind, Thermometer, AlertTriangle, Droplets, Cloud, Compass } from "lucide-react";

interface WeatherData {
  wilayah: string;
  suhuMin: number;
  suhuMax: number;
  cuaca: string;
  iconUrl: string;
  anginSpeedMin: number;
  anginSpeedMax: number;
  anginDir: string;
  kelembapanMin: number;
  kelembapanMax: number;
  jam: string;
}

interface InfoWidgetProps {
  dataGempa: any;
  listCuaca: WeatherData[];
}

export default function InfoWidget({ dataGempa, listCuaca }: InfoWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!listCuaca || listCuaca.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listCuaca.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [listCuaca]);

  const cuacaAktif = listCuaca && listCuaca.length > 0 ? listCuaca[currentIndex] : null;

  return (
    <div className="w-full bg-white flex flex-col lg:flex-row">
      
      {/* ======================================= */}
      {/* BAGIAN KIRI: GEMPA TERBARU */}
      {/* ======================================= */}
      <div className="w-full lg:w-1/2 p-5 sm:p-8 flex flex-col justify-center relative">
        
        {/* JUDUL GEMPA */}
        <div className="w-full flex justify-center items-center mb-6 relative">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-lg text-slate-800 tracking-tight">Gempa Terbaru</h3>
          </div>
          {dataGempa?.Potensi?.includes("Tsunami") && (
            <span className="absolute right-0 animate-pulse bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest hidden sm:flex items-center gap-1.5 shadow-sm">
              <AlertTriangle className="w-3 h-3" /> Tsunami
            </span>
          )}
        </div>

        {dataGempa ? (
          <div className="flex flex-col items-center">
            <div className="flex gap-5 sm:gap-6 items-center justify-center w-full">
              {/* Box Magnitudo (Dimensi Diselaraskan: 92x92) */}
              <div className="flex flex-col items-center justify-center bg-red-50/40 border border-red-100 rounded-2xl w-[92px] h-[92px] flex-shrink-0">
                <span className="text-[34px] font-black text-red-600 tracking-tighter leading-none mb-1">
                  {dataGempa.Magnitude}
                </span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  Magnitudo
                </span>
              </div>

              {/* List Detail Gempa */}
              <div className="flex flex-col gap-2.5 flex-1 max-w-[260px]">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold leading-snug line-clamp-2">
                    {dataGempa.Wilayah}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 opacity-70" />
                  <span>{dataGempa.Tanggal}, {dataGempa.Jam}</span>
                </div>
                <div className="mt-0.5 inline-flex w-fit items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                  Kedalaman: {dataGempa.Kedalaman}
                </div>
              </div>
            </div>

            {/* Spacer Siluman: Untuk menyeimbangkan tinggi dot carousel di sisi Cuaca */}
            <div className="h-1.5 mt-6 w-full invisible"></div>
          </div>
        ) : (
          <div className="text-sm text-slate-400 py-6 flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl">
            <Activity className="w-4 h-4 opacity-50" /> Data gempa belum tersedia.
          </div>
        )}
      </div>

      {/* GARIS PEMBATAS TENGAH */}
      <div className="w-full lg:w-px h-px lg:h-auto bg-slate-100 my-0 lg:my-6"></div>

      {/* ======================================= */}
      {/* BAGIAN KANAN: RINGKASAN CUACA KOTA */}
      {/* ======================================= */}
      <div className="w-full lg:w-1/2 p-5 sm:p-8 flex flex-col justify-center relative">
        
        {/* JUDUL CUACA */}
        <div className="w-full flex justify-center items-center mb-6 relative">
          <div className="flex items-center gap-2.5">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg text-slate-800 tracking-tight">Ringkasan Cuaca</h3>
          </div>
        </div>

        {cuacaAktif ? (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500" key={cuacaAktif.wilayah}>
            
            <div className="flex gap-5 sm:gap-6 items-center justify-center w-full">
              
              {/* Box Ikon & Suhu (Dimensi Tinggi Diselaraskan: 92px) */}
              <div className="flex flex-col items-center justify-center bg-blue-50/40 border border-blue-100 rounded-2xl min-w-[104px] px-3 h-[92px] flex-shrink-0">
                <div className="relative w-9 h-9 mb-1 drop-shadow-sm">
                  {cuacaAktif.iconUrl ? (
                    <Image src={cuacaAktif.iconUrl} alt={cuacaAktif.cuaca} fill className="object-contain" unoptimized />
                  ) : (
                    <Cloud className="w-full h-full text-blue-300" />
                  )}
                </div>
                <span className="text-[17px] font-black text-blue-600 tracking-tighter leading-none mb-0.5 whitespace-nowrap">
                  {cuacaAktif.suhuMin}°<span className="opacity-40 font-medium mx-0.5">-</span>{cuacaAktif.suhuMax}°
                </span>
              </div>

              {/* List Detail Cuaca (Lebar Diselaraskan dengan Gempa) */}
              <div className="flex flex-col gap-2.5 flex-1 max-w-[260px]">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold leading-snug line-clamp-1">{cuacaAktif.wilayah}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-slate-500 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 opacity-70 text-cyan-500" />
                    <span>{cuacaAktif.kelembapanMin}-{cuacaAktif.kelembapanMax}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 opacity-70 text-teal-500" />
                    <span>{cuacaAktif.anginSpeedMin}-{cuacaAktif.anginSpeedMax} km/j</span>
                  </div>
                </div>

                <div className="mt-0.5 flex flex-wrap gap-1.5">
                  <div className="inline-flex w-fit items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50/80 text-blue-700 capitalize border border-blue-100/80">
                    {cuacaAktif.cuaca}
                  </div>
                  <div className="inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                    <Compass className="w-3 h-3 text-slate-400" /> {cuacaAktif.anginDir}
                  </div>
                </div>
              </div>

            </div>

            {/* Indikator Titik Carousel (Dots) */}
            <div className="flex justify-center gap-1.5 mt-6 h-1.5">
              {listCuaca.slice(0, 8).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-full rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-blue-500" : "w-1.5 bg-slate-200"}`}
                />
              ))}
            </div>

          </div>
        ) : (
          <div className="text-sm text-slate-400 py-6 flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl">
            <Wind className="w-4 h-4 opacity-50" /> Memuat data BMKG...
          </div>
        )}
      </div>

    </div>
  );
}