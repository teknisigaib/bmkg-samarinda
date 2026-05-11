"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Flyer {
  id: string;
  title: string;
  image: string;
  link: string | null;
}

interface FlyerSectionProps {
  flyers: Flyer[];
}

export default function FlyerSection({ flyers }: FlyerSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!flyers || flyers.length === 0) return null;

  // --- AUTO SCROLL ENGINE ---
  useEffect(() => {
    if (isPaused || flyers.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % flyers.length;
        setCurrentIndex(nextIndex);
        scrollRef.current.scrollTo({
          left: nextIndex * scrollRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, flyers.length]);

  const scrollManual = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      let nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
      
      if (nextIndex < 0) nextIndex = flyers.length - 1;
      if (nextIndex >= flyers.length) nextIndex = 0;

      setCurrentIndex(nextIndex);
      container.scrollTo({
        left: nextIndex * container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-4 px-4 sm:px-6 lg:px-12">
      <div 
        className="relative group w-full mx-auto max-w-[1400px]"
        onMouseEnter={() => setIsPaused(true)} 
        onMouseLeave={() => setIsPaused(false)} 
      >
        {/* Navigasi Panah - Hanya muncul jika lebih dari 1 flyer */}
        {flyers.length > 1 && (
          <>
            <button 
              onClick={() => scrollManual("left")}
              className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl border border-slate-100 p-3 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button 
              onClick={() => scrollManual("right")}
              className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl border border-slate-100 p-3 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* CONTAINER SLIDER */}
        <div 
          ref={scrollRef}
          className="flex overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-50"
        >
          {flyers.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex-shrink-0 w-full relative group/item transition-all ${item.link ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => item.link && window.open(item.link, '_blank')}
            >
              {/* Gambar Utama */}
              <div className="relative w-full h-full">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto block object-contain mx-auto"
                />
              </div>
              
              {/* Overlay Indikator Link (Hanya muncul jika ada link) */}
              {item.link && (
                <div className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                  <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider pr-1">Buka Link</span>
                  </div>
                </div>
              )}

              {/* Progress Bar Otomatis */}
              {!isPaused && index === currentIndex && flyers.length > 1 && (
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 z-40 animate-progress origin-left w-full" />
              )}
            </div>
          ))}
        </div>

        {/* Dots Indikator */}
        {flyers.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {flyers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  scrollRef.current?.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}} />
    </section>
  );
}