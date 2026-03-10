"use client";

import { useRef, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

interface ForecastControlProps {
  timestamps: string[]; 
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function ForecastControl({ timestamps, selectedIndex, onSelect }: ForecastControlProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- FORMATTER ---
  const formatTime = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Makassar" 
      }).format(new Date(isoString));
    } catch (e) { return "--:--"; }
  };

  const getDayShort = (isoString: string) => {
      try {
        return new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "Asia/Makassar" }).format(new Date(isoString));
      } catch (e) { return "" }
  }

  const getDateShort = (isoString: string) => {
      try {
          const d = new Date(isoString);
          return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      } catch (e) { return "" }
  }

  const getFullLabel = (isoString: string) => {
      try {
        return new Intl.DateTimeFormat("id-ID", { 
            weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            timeZone: "Asia/Makassar" 
        }).format(new Date(isoString)) + " WITA";
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

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-3xl px-4 animate-in slide-in-from-bottom-6 fade-in duration-700">
      
      {/* 1. INFO BADGE (Light Glass) */}
      <div className="flex justify-center mb-2">
         <div className="bg-white/80 backdrop-blur-md text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm border border-white/40 flex items-center gap-2 ring-1 ring-black/5">
            {selectedIndex === 0 ? (
                 <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="uppercase tracking-wide">Kondisi Saat Ini</span>
                 </div>
            ) : (
                <>
                    <Calendar size={12} className="text-blue-600"/>
                    <span className="uppercase tracking-wide">{getFullLabel(timestamps[selectedIndex])}</span>
                </>
            )}
         </div>
      </div>

      {/* 2. TIMELINE BAR (Light Glass - Ramping) */}
      <div className="bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-300/50 rounded-xl p-1 ring-1 ring-black/5">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-1 custom-scrollbar scroll-smooth snap-x touch-pan-x no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {timestamps.map((time, idx) => {
            const isActive = idx === selectedIndex;
            const dayName = getDayShort(time); 
            const timeLabel = formatTime(time);
            const dateLabel = getDateShort(time);

            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center gap-0.5
                  w-[4rem] h-10 rounded-lg transition-all duration-200 group relative border
                  ${isActive 
                    ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-200" // Style Aktif
                    : "bg-transparent border-transparent text-slate-500 hover:bg-white hover:shadow-sm" // Style Inaktif
                  }
                `}
              >
                {/* Baris 1: Hari */}
                <span className={`text-[9px] font-bold uppercase leading-none ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                  {dayName.replace('.', '')}
                </span>
                
                {/* Baris 2: Jam */}
                <span className={`text-xs font-black leading-none ${isActive ? "text-white" : "text-slate-700"}`}>
                  {timeLabel}
                </span>

                

              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}