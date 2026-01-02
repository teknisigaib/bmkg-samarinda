"use client";

import { useEffect, useState } from "react";
import { 
  CloudSun, Plane, Anchor, Flame, Satellite, 
  Clock, Activity, Map, ChevronRight 
} from "lucide-react";

// Tipe halaman yang didukung (Scalable untuk masa depan)
export type HeaderType = 'forecast' | 'aviation' | 'maritime' | 'hotspot' | 'satellite' | 'default';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  type?: HeaderType;
  showClock?: boolean; // Opsional: Tampilkan jam
  rightElement?: React.ReactNode; // Opsional: Jika ingin menambah tombol custom di kanan
}

export default function DashboardHeader({ 
  title, 
  subtitle, 
  type = 'default',
  showClock = true,
  rightElement
}: DashboardHeaderProps) {
  
  const [time, setTime] = useState<string>("");

  // Logic Jam Digital (WITA)
  useEffect(() => {
    if (!showClock) return;
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('id-ID', { 
        timeZone: 'Asia/Makassar', // WITA
        hour: '2-digit', minute: '2-digit', hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, [showClock]);

  // Konfigurasi Tema (Warna & Icon)
  const theme = {
    forecast: { 
      icon: <CloudSun className="w-6 h-6 text-blue-600" />, 
      bg: "bg-blue-50", border: "border-blue-100", 
      accent: "bg-blue-600", text: "text-blue-700" 
    },
    aviation: { 
      icon: <Plane className="w-6 h-6 text-sky-600" />, 
      bg: "bg-sky-50", border: "border-sky-100", 
      accent: "bg-sky-600", text: "text-sky-700" 
    },
    maritime: { 
      icon: <Anchor className="w-6 h-6 text-teal-600" />, 
      bg: "bg-teal-50", border: "border-teal-100", 
      accent: "bg-teal-600", text: "text-teal-700" 
    },
    hotspot: { 
      icon: <Flame className="w-6 h-6 text-orange-600" />, 
      bg: "bg-orange-50", border: "border-orange-100", 
      accent: "bg-orange-600", text: "text-orange-700" 
    },
    satellite: { 
      icon: <Satellite className="w-6 h-6 text-purple-600" />, 
      bg: "bg-purple-50", border: "border-purple-100", 
      accent: "bg-purple-600", text: "text-purple-700" 
    },
    default: { 
      icon: <Map className="w-6 h-6 text-slate-600" />, 
      bg: "bg-slate-50", border: "border-slate-100", 
      accent: "bg-slate-600", text: "text-slate-700" 
    }
  }[type];

  return (
    <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-30 pt-6 pb-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        
        {/* BAGIAN KIRI: Identitas Halaman */}
        <div className="flex items-start gap-4">
          {/* Icon Container Modern */}
          <div className={`shrink-0 p-3.5 rounded-2xl border shadow-sm ${theme.bg} ${theme.border}`}>
            {theme.icon}
          </div>
          
          <div className="space-y-1 pt-0.5">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* BAGIAN KANAN: Status System / Jam / Custom Element */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          
          {/* Slot Custom (Misal: Tombol Filter/Download) */}
          {rightElement && (
            <div className="mr-2">{rightElement}</div>
          )}

          {/* Status Widget */}
          <div className="flex items-center gap-3 bg-slate-50 pl-4 pr-5 py-2 rounded-xl border border-slate-100 shadow-sm">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.accent}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${theme.accent}`}></span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
                Live
              </span>
            </div>
            
            {/* Clock */}
            {showClock && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm font-mono font-bold tracking-tight">
                  {time || "--:--"} <span className="text-[10px] text-slate-400 font-sans font-bold">WITA</span>
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}