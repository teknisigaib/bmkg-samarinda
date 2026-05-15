"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, Calendar, Layout } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface ClimateItem {
  id: string;
  category: string;
  title: string;
  date: string;
  imageUrl: string;
  slug: string;
  dasarian?: string;
}

export default function ClimateProductsSection({ data }: { data: ClimateItem[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; url: string | null; title?: string }>({
    isOpen: false,
    url: null,
    title: ""
  });

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 380;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isHovered || !data || data.length === 0) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const scrollAmount = 380;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, data]);

  if (!data || data.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 relative group py-4">
      
      <ImageLightbox 
        isOpen={lightbox.isOpen}
        imageUrl={lightbox.url}
        title={lightbox.title}
        description="Peta Analisis & Prakiraan Iklim Kalimantan Timur"
        onClose={() => setLightbox({ ...lightbox, isOpen: false })}
      />

      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button 
          onClick={() => scroll("left")} 
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl border border-slate-100 p-3 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.map((item) => (
            <div 
              key={item.id}
              className="min-w-[300px] md:min-w-[360px] snap-start bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group/card hover:border-blue-400 hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* GAMBAR - DIPERBAIKI (MENGGUNAKAN CONTAIN DAN PADDING) */}
              {/* bg-slate-50 memberi efek kanvas elegan, p-4 membuat gambar tidak mentok ke pinggir */}
              <div className="relative aspect-[4/3] w-full bg-slate-50 border-b border-slate-100 overflow-hidden p-4 md:p-6 flex items-center justify-center">
                
                {/* Dibungkus div relatif tambahan agar image fill bisa bekerja di dalam padding */}
                <div className="relative w-full h-full">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill 
                    // Perubahan utama: object-contain menjaga proporsi peta agar tidak terpotong
                    className="object-contain transition-transform duration-700 group-hover/card:scale-105 drop-shadow-sm" 
                    unoptimized
                  />
                </div>
                
                {/* Overlay Hitam Transparan saat Hover */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLightbox({ isOpen: true, url: item.imageUrl, title: item.title });
                      }}
                      className="p-4 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform shadow-2xl"
                    >
                        <Maximize2 className="w-6 h-6" />
                    </button>
                </div>
              </div>

              {/* ISI CARD */}
              <Link href={item.slug} className="p-5 flex flex-col flex-1 hover:bg-slate-50/50 transition-colors">
  
                <div className="flex items-center flex-wrap gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider mb-3">
                  <div className="flex items-center gap-1.5">
                    <Layout className="w-3 h-3" />
                      <span>{item.category}</span>
                  </div>
    
                {item.dasarian && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-normal">|</span>
                    <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded border border-blue-100">
                      {item.dasarian}
                  </span>
                  </div>
              )}
                </div>

                <h4 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 min-h-[44px] group-hover/card:text-blue-600 transition-colors mb-4">
                  {item.title}
                </h4>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {item.date}
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-blue-600 uppercase tracking-widest gap-1">
                    Detail <ChevronRight className="w-3 h-3 transform group-hover/card:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")} 
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl border border-slate-100 p-3 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}