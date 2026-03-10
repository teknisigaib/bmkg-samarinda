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

  // --- FORMATTER BARU ---

  // 1. Ambil Nama Hari (Sen, Sel)
  const getDayShort = (isoString: string) => {
      try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "Asia/Makassar" }).format(date);
      } catch (e) { return "" }
  }

  // 2. Ambil Tanggal Angka (01, 02, 31)
  const getDateNumber = (isoString: string) => {
      try {
          const d = new Date(isoString);
          return String(d.getDate()).padStart(2, '0');
      } catch (e) { return "" }
  }

  // 3. Ambil Nama Bulan (Maret) - PERBAIKAN DI SINI
  const getMonthName = (isoString: string) => {
      try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", { month: "long", timeZone: "Asia/Makassar" }).format(date);
      } catch (e) { return "" }
  }

  // 4. Label Panjang untuk Badge atas
  const getFullLabel = (isoString: string) => {
      try {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("id-ID", { 
            weekday: "long", day: "numeric", month: "long", year: "numeric",
            timeZone: "Asia/Makassar" 
        }).format(date);
      } catch (e) { return "" }
  }

  // Auto scroll
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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-fit max-w-[95vw] px-0 animate-in slide-in-from-bottom-6 fade-in duration-700">
      
      {/* 1. INFO BADGE (Floating Header) */}
      <div className="flex justify-center mb-2">
         <div className="bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm border border-white/40 flex items-center gap-2 ring-1 ring-black/5">
            {isLatest ? (
                 <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="uppercase tracking-wide text-red-600">Pantauan Hari Ini</span>
                 </div>
            ) : (
                <>
                    <CalendarClock size={12} className="text-orange-600"/>
                    <span className="uppercase tracking-wide">{getFullLabel(timestamps[selectedIndex])}</span>
                </>
            )}
         </div>
      </div>

      {/* 2. TIMELINE BAR (Container) */}
      {/* Perubahan: w-full menjadi w-fit agar tidak ada ruang kosong */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-orange-900/10 rounded-xl p-1 ring-1 ring-black/5 w-fit mx-auto">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-1 custom-scrollbar scroll-smooth snap-x touch-pan-x no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {timestamps.map((time, idx) => {
            const isActive = idx === selectedIndex;
            const dayName = getDayShort(time); 
            const dateNum = getDateNumber(time);
            const monthName = getMonthName(time); // Menggunakan nama bulan

            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center gap-0.5
                  w-[4.5rem] h-10 rounded-lg transition-all duration-200 group relative border overflow-hidden
                  ${isActive 
                    ? "bg-gradient-to-br from-orange-500 to-red-600 border-orange-500 shadow-md shadow-orange-200 scale-100" 
                    : "bg-transparent border-transparent text-slate-500 hover:bg-white hover:shadow-sm" 
                  }
                `}
              >
                {/* Baris 1: Hari */}
                <span className={`text-[9px] font-bold uppercase leading-none ${isActive ? "text-orange-100" : "text-slate-400"}`}>
                  {dayName.replace('.', '')}
                </span>
                
                {/* Baris 2: Tanggal Angka */}
                <span className={`text-md font-black leading-none my-0.5 ${isActive ? "text-white" : "text-slate-700"}`}>
                   {dateNum}
                </span>

                
                
                {/* Ikon Api Halus (Hanya saat Aktif) */}
                {isActive && (
                    <Flame size={12} className="absolute -bottom-1 -right-1 text-white/20 rotate-12" fill="currentColor"/>
                )}

              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}