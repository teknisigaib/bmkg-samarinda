"use client";

import { useRef, useEffect } from "react";
import { Flame, CalendarClock } from "lucide-react"; 

interface HotspotControlProps {
  timestamps: string[]; 
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function HotspotControl({ timestamps, selectedIndex, onSelect }: HotspotControlProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getDayShort = (isoString: string) => {
      try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "Asia/Makassar" }).format(date);
      } catch (e) { return "" }
  }

  const getDateNumber = (isoString: string) => {
      try {
          const d = new Date(isoString);
          return String(d.getDate()).padStart(2, '0');
      } catch (e) { return "" }
  }

  const getMonthName = (isoString: string) => {
      try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "Asia/Makassar" }).format(date);
      } catch (e) { return "" }
  }

  const getFullLabel = (isoString: string) => {
      try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", { 
            weekday: "long", day: "numeric", month: "long", year: "numeric",
            timeZone: "Asia/Makassar" 
        }).format(date);
      } catch (e) { return "" }
  }

  // Efek pintar: Otomatis scroll/geser ke tombol yang aktif agar selalu di tengah layar
  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      const selectedElement = scrollRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        const container = scrollRef.current;
        const scrollLeft = selectedElement.offsetLeft - (container.offsetWidth / 2) + (selectedElement.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  if (!timestamps || timestamps.length === 0) return null;

  const isLatest = selectedIndex === timestamps.length - 1;

  return (
    // PERBAIKAN 1: Tambahkan w-full sm:w-fit agar di mobile mengambil lebar penuh, tapi tetap max 95vw
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full sm:w-fit max-w-[95vw] px-0 animate-in slide-in-from-bottom-6 fade-in duration-700">
      
      {/* 1. INFO BADGE (Floating Header) */}
      <div className="flex justify-center mb-3">
         <div className="bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 ring-1 ring-black/5 transition-all">
            {isLatest ? (
                 <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="uppercase tracking-widest text-red-600">Data Terbaru ({getFullLabel(timestamps[selectedIndex])})</span>
                 </div>
            ) : (
                <div className="flex items-center gap-2">
                    <CalendarClock size={14} className="text-orange-500"/>
                    <span className="uppercase tracking-widest text-slate-600">{getFullLabel(timestamps[selectedIndex])}</span>
                </div>
            )}
         </div>
      </div>

      {/* 2. TIMELINE BAR (Container) */}
      {/* PERBAIKAN 2: Tambahkan w-full sm:w-fit max-w-full agar kontainer tidak bocor keluar layar */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-[1.5rem] p-1.5 ring-1 ring-black/5 w-full sm:w-fit mx-auto max-w-full">
        <div 
          ref={scrollRef}
          // PERBAIKAN 3: Tambahkan w-full, snap-mandatory, dan [&::-webkit-scrollbar]:hidden
          className="flex overflow-x-auto gap-1 scroll-smooth snap-x snap-mandatory touch-pan-x w-full [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {timestamps.map((time, idx) => {
            const isActive = idx === selectedIndex;
            const dayName = getDayShort(time); 
            const dateNum = getDateNumber(time);
            const monthName = getMonthName(time); 

            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center gap-0.5
                  w-14 h-[3.5rem] rounded-2xl transition-all duration-300 group relative border overflow-hidden
                  ${isActive 
                    ? "bg-gradient-to-b from-orange-500 to-red-600 border-red-500 shadow-md scale-100" 
                    : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100" 
                  }
                `}
              >
                {/* Baris 1: Hari & Bulan (Kecil) */}
                <span className={`text-[8px] font-black uppercase tracking-widest leading-none mt-1 ${isActive ? "text-orange-100" : "text-slate-400"}`}>
                  {dayName.replace('.', '')}
                </span>
                
                {/* Baris 2: Tanggal Angka (Besar) */}
                <span className={`text-lg font-black leading-none my-0.5 ${isActive ? "text-white" : "text-slate-800 group-hover:text-red-500 transition-colors"}`}>
                   {dateNum}
                </span>

                {/* Baris 3: Bulan Singkat */}
                 <span className={`text-[8px] font-bold uppercase tracking-widest leading-none mb-1 ${isActive ? "text-orange-100" : "text-slate-400"}`}>
                  {monthName}
                </span>

                {/* Ikon Api Halus (Hanya saat Aktif) */}
                {isActive && (
                    <Flame size={16} className="absolute -bottom-2 -right-2 text-white/20 rotate-12" fill="currentColor"/>
                )}

              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}