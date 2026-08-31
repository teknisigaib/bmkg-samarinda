"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Hammer } from "lucide-react";

interface BwsTmaModalProps {
  station: { name: string, lat: number, lng: number };
  onClose: () => void;
}

export default function BwsTmaModal({ station, onClose }: BwsTmaModalProps) {
  return (
    <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-sky-500 p-4 flex justify-between items-start sm:items-center">
          <div className="flex items-start sm:items-center gap-3 text-white">
            <div className="bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center shrink-0">
              <Image src="/pupr.png" alt="PUPR" width={22} height={22} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-base leading-none mb-1">Pos Duga Air BWS</h2>
              <p className="text-[9px] sm:text-[10px] font-medium text-sky-100 uppercase tracking-widest leading-tight">
                Balai Wilayah Sungai<br className="sm:hidden" /> Kalimantan IV Samarinda
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center flex flex-col items-center">
          {/* Ikon Maintenance Tengah */}
          <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-4 border-4 border-sky-100">
            <Hammer className="w-7 h-7" />
          </div>
          
          <h3 className="text-sm font-bold text-slate-800 mb-2 leading-snug">{station.name}</h3>
          
          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            Data stasiun sedang dalam pengembangan dan integrasi sistem.
          </p>

          <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2 text-left shadow-sm">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Koordinat</p>
              <p className="text-xs text-slate-700 font-mono mt-0.5">{station.lat}, {station.lng}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}