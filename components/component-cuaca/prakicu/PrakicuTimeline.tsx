"use client";

import React from "react";
import { Play, Pause } from "lucide-react";

interface TimelineProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  timeLabels: string[];
  activeTimeIndex: number;
  setActiveTimeIndex: (idx: number) => void;
}

export default function PrakicuTimeline({
  isPlaying,
  setIsPlaying,
  timeLabels,
  activeTimeIndex,
  setActiveTimeIndex,
}: TimelineProps) {
  if (!timeLabels || timeLabels.length === 0) return null;

  return (
    // Posisi di tengah bawah dengan ukuran yang dirampingkan
    <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[85%] max-w-3xl z-[40]">
      
      {/* Wadah Utama: Padding dikecilkan (py-2 md:py-2.5) agar lebih pipih */}
      <div className="bg-white/90 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-3 md:gap-4">
        
        {/* Tombol Play/Pause (Dikecilkan ukurannya jadi w-8 h-8) */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="shrink-0 w-8 h-8 md:w-9 md:h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-[0.6rem] shadow-sm flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Track Timeline */}
        <div className="flex-1 relative flex items-center h-8">
          
          {/* Garis Dasar Abu-abu */}
          <div className="absolute left-0 right-0 h-1 bg-slate-200 rounded-full"></div>
          
          {/* Garis Progres Biru */}
          <div 
            className="absolute left-0 h-1 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(activeTimeIndex / (timeLabels.length - 1)) * 100}%` }}
          ></div>

          {/* Titik dan Label Waktu */}
          <div className="relative w-full flex justify-between items-center z-10 px-0.5">
            {timeLabels.map((time, idx) => {
              const isActive = idx === activeTimeIndex;
              const isPassed = idx <= activeTimeIndex;
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTimeIndex(idx)}
                  className="group relative flex flex-col items-center focus:outline-none"
                >
                  {/* Bulatan Titik (Dikecilkan) */}
                  <div 
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600 scale-125 ring-4 ring-blue-100' 
                        : isPassed 
                        ? 'bg-blue-400 group-hover:bg-blue-500' 
                        : 'bg-white border-2 border-slate-300 group-hover:border-blue-400'
                    }`}
                  ></div>
                  
                  {/* Label Teks (Digeser lebih dekat ke titik dan diperkecil) */}
                  <span 
                    className={`absolute top-4 md:top-4 text-[9px] md:text-[10px] font-bold tracking-tight transition-colors ${
                      isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}