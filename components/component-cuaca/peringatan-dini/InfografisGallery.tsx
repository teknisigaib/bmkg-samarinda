"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, Image as ImageIcon } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface InfografisGalleryProps {
  imgMap: string;
  imgText: string;
}

// ✅ CARD DIPISAH AGAR BISA MEMILIKI STATE ERROR MASING-MASING
const Card = ({ url, title, label, onOpen }: { url: string, title: string, label: string, onOpen: (url: string, title: string) => void }) => {
  const [imgSrc, setImgSrc] = useState(url);
  const isFallback = imgSrc === "/logo-bmkg2.png";

  return (
    <div 
      onClick={() => onOpen(imgSrc, title)}
      className="group relative w-full max-w-[280px] md:max-w-[320px] aspect-square mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center justify-center"
    >
      <Image 
        src={imgSrc} 
        alt={title} 
        fill 
        // Jika fallback aktif, gambar jangan di-cover penuh biar logonya gak pecah/terpotong
        className={`transition-transform duration-700 group-hover:scale-105 ${isFallback ? 'object-contain p-12 opacity-30 grayscale' : 'object-cover'}`} 
        unoptimized 
        onError={() => setImgSrc("/logo-bmkg2.png")} // 🔥 Otomatis ganti gambar jika 404
      />
      {/* Overlay Hover */}
      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300 flex items-center justify-center z-10">
         <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm">
            <ZoomIn className="w-4 h-4 text-blue-600" /> Perbesar
         </div>
      </div>
      {/* Label Kiri Atas */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-700 shadow-sm z-20">
        {label}
      </div>
    </div>
  );
};

export default function InfografisGallery({ imgMap, imgText }: InfografisGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImg, setActiveImg] = useState("");
  const [activeTitle, setActiveTitle] = useState("");

  const handleOpen = (url: string, title: string) => {
    setActiveImg(url);
    setActiveTitle(title);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col bg-slate-50/50 p-5 md:p-6 rounded-2xl border border-slate-100 w-full h-full">
      <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3 mb-5">
        <ImageIcon className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-sm md:text-base text-slate-800">Infografis Peringatan Dini</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 items-center">
        <Card url={imgMap} title="Peta Sebaran Peringatan Dini" label="Peta Sebaran" onOpen={handleOpen} />
        <Card url={imgText} title="Detail Teks Peringatan Dini" label="Teks Rincian" onOpen={handleOpen} />
      </div>

      <ImageLightbox 
        isOpen={isOpen}
        imageUrl={activeImg}
        title={activeTitle}
        description="Infografis resmi dari BMKG."
        altText={activeTitle}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}