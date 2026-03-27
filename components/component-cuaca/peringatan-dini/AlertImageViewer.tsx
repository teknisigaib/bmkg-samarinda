"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, ImageIcon, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox"; // Import Lightbox milik Anda

export default function AlertImageViewer({ imageUrl }: { imageUrl: string }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="lg:col-span-1">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ImageIcon className="w-4 h-4 text-blue-500" /> Citra Infografis Resmi
        </h4>
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 group">
          
          {/* Thumbnail Image (Klik untuk buka Lightbox) */}
          <div 
            className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-white shadow-sm border border-slate-200 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={imageUrl}
              alt="Infografis Peringatan Dini BMKG"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            {/* Overlay Perbesar */}
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-600" /> Perbesar
              </div>
            </div>
          </div>

          {/* Tombol Tab Baru */}
          <div className="mt-2 text-center">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka Tab Baru
            </a>
          </div>
        </div>
      </div>

      {/* Memanggil Komponen Lightbox Anda */}
      <ImageLightbox 
        isOpen={isLightboxOpen}
        imageUrl={imageUrl}
        title="Peringatan Dini Cuaca"
        description="Peta sebaran cuaca ekstrem berdasarkan radar BMKG Kalimantan Timur."
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}