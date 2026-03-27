"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox"; 

export default function ShakemapImageViewer({ imageUrl }: { imageUrl: string }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div 
        className="relative w-full aspect-square md:aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group cursor-pointer shadow-sm"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image 
            src={imageUrl} 
            alt="Peta Guncangan Gempa BMKG" 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
        />
        
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                <ZoomIn className="w-4 h-4 text-blue-600" /> Perbesar Peta
            </div>
        </div>
      </div>

      <ImageLightbox 
        isOpen={isLightboxOpen}
        imageUrl={imageUrl}
        title="Peta Guncangan (Shakemap)"
        description="Peta tingkat guncangan gempabumi BMKG. Skala intensitas warna menunjukkan tingkat dampak guncangan."
        altText="Shakemap BMKG"
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}