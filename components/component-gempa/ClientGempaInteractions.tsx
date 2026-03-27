"use client";

import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import Image from "next/image";
import { MapPin, Map } from "lucide-react";

// Tipe props untuk gambar utama
interface MainMapProps {
  shakemapUrl: string;
}

// Komponen 1: Peta Utama yang bisa diklik
export function ClickableMainMap({ shakemapUrl }: MainMapProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Gambar Peta di Halaman */}
      <div 
        className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 flex-1 group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={shakemapUrl}
          alt="Peta Guncangan (Shakemap) Gempa BMKG"
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm pointer-events-none">
           <span className="text-slate-700 text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin size={12} className="text-rose-500" /> Peta Guncangan
           </span>
        </div>
      </div>

      {/* Modal Lightbox tersembunyi */}
      <ImageLightbox 
        isOpen={isOpen}
        imageUrl={shakemapUrl}
        title="Peta Guncangan (Shakemap)"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

// Tipe props untuk tombol di daftar gempa
interface MapButtonProps {
  shakemapUrl: string;
  wilayah: string;
}

// Komponen 2: Tombol "Shakemap" di daftar gempa yang bisa diklik
export function ShakemapButton({ shakemapUrl, wilayah }: MapButtonProps) {
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

      {/* Modal Lightbox tersembunyi */}
      <ImageLightbox 
        isOpen={isOpen}
        imageUrl={shakemapUrl}
        title={`Shakemap: ${wilayah}`}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}