"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Map, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

// --- KOMPONEN 1: PETA UTAMA GEMPA TERBARU ---
export function ClickableMainMap({ shakemapUrl }: { shakemapUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 flex-1 group cursor-pointer border border-slate-200 shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={shakemapUrl}
          alt="Peta Guncangan (Shakemap) Gempa BMKG"
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized // BMKG sering memblokir optimasi gambar Next.js
          priority
        />
        
        {/* Label Pojok Kiri Atas */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm pointer-events-none z-10">
           <span className="text-slate-700 text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin size={12} className="text-rose-500" /> Peta Guncangan
           </span>
        </div>

        {/* Overlay Hover "Perbesar Peta" (Diambil dari file yang dihapus) */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300 flex items-center justify-center z-20">
            <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                <ZoomIn className="w-4 h-4 text-blue-600" /> Perbesar Peta
            </div>
        </div>
      </div>

      <ImageLightbox 
        isOpen={isOpen}
        imageUrl={shakemapUrl}
        title="Peta Guncangan (Shakemap)"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

// --- KOMPONEN 2: TOMBOL SHAKEMAP DI DAFTAR GEMPA DIRASAKAN ---
export function ShakemapButton({ shakemapUrl, wilayah }: { shakemapUrl: string, wilayah: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-xs font-bold border border-blue-200 shrink-0 cursor-pointer"
        title="Lihat Peta Guncangan"
      >
        <Map size={14} />
        <span className="hidden sm:inline">Shakemap</span>
      </button>

      <ImageLightbox 
        isOpen={isOpen}
        imageUrl={shakemapUrl}
        title={`Shakemap: ${wilayah}`}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}