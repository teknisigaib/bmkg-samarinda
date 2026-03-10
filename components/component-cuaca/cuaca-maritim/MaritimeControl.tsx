"use client";
import { useRef, useEffect } from "react";
import { Clock } from "lucide-react"; 

export default function MaritimeControl({ timestamps, selectedIndex, onSelect }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const formatWITA = (isoString: string, options: Intl.DateTimeFormatOptions) => {
    return new Date(isoString).toLocaleString('id-ID', { ...options, timeZone: 'Asia/Makassar' });
  };

  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      const el = scrollRef.current.children[selectedIndex] as HTMLElement;
      if (el) {
        const offset = el.offsetLeft - (scrollRef.current.offsetWidth / 2) + (el.offsetWidth / 2);
        scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  if (!timestamps || timestamps.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-fit max-w-[95vw] animate-in slide-in-from-bottom-6">
      <div className="flex justify-center mb-2">
         <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-2 text-[10px] font-bold ring-1 ring-black/5">
            <Clock size={12} className="text-blue-600"/>
            <span className="uppercase tracking-widest text-slate-600">
                {formatWITA(timestamps[selectedIndex], { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} WITA
            </span>
         </div>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl p-1.5 mx-auto">
        <div ref={scrollRef} className="flex overflow-x-auto gap-1.5 no-scrollbar w-[85vw] md:w-auto md:max-w-xl scroll-smooth">
          {timestamps.map((time: string, idx: number) => {
            const active = idx === selectedIndex;
            return (
              <button key={idx} onClick={() => onSelect(idx)}
                className={`shrink-0 flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all border ${active ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105" : "bg-transparent border-transparent text-slate-400 hover:bg-white/50"}`}
              >
                <span className={`text-[8px] font-bold uppercase ${active ? 'text-blue-100' : ''}`}>{formatWITA(time, { weekday: 'short' })}</span>
                <span className="text-xs font-black">{formatWITA(time, { hour: '2-digit', hour12: false })}:00</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}