"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const [isPaused, setIsPaused] = useState(false);

  if (!flyers || flyers.length === 0) return null;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // AUTO SCROLL 
  useEffect(() => {
    //
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 10;

        if (isEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // SCROLL MANUAL
  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (container) {
        container.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
    }
    return () => {
        if (container) container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth;
      
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="w-full py-6 md:py-10 border-b border-gray-100">
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group"
        // EVENT HANDLER PAUSE 
        onMouseEnter={() => setIsPaused(true)} 
        onMouseLeave={() => setIsPaused(false)} 
      >
        
        {/* Tombol Kiri */}
        <button 
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-6 md:-left-5 top-1/2 -translate-y-1/2 z-20 bg-white text-blue-600 p-3 rounded-full shadow-lg border border-gray-100 transition-all duration-300 
            ${canScrollLeft ? 'opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:text-white cursor-pointer' : 'opacity-0 cursor-default'}`}
        >
            <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Tombol Kanan */}
        <button 
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-6 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-white text-blue-600 p-3 rounded-full shadow-lg border border-gray-100 transition-all duration-300
            ${canScrollRight ? 'opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:text-white cursor-pointer' : 'opacity-0 cursor-default'}`}
        >
            <ChevronRight className="w-6 h-6" />
        </button>

        {/* Container Slider */}
        <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl md:rounded-3xl shadow-xl shadow-blue-900/5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {flyers.map((item, index) => (
                <div 
                    key={item.id} 
                    className="flex-shrink-0 w-full relative aspect-[4/1] md:aspect-[5/1.2] bg-slate-100 snap-center cursor-pointer overflow-hidden"
                    onClick={() => item.link && window.open(item.link, '_blank')}
                >
                    <div className="relative w-full h-full">
                        <Image 
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority={index === 0} 
                            sizes="(max-width: 768px) 100vw, 1280px"
                        />
                    </div>
                    
                    {/* Progress Bar  */}
                    {!isPaused && (
                         <div className="absolute bottom-0 left-0 h-1 bg-blue-600/50 animate-[progress_5s_linear_infinite] w-full origin-left z-10"></div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors duration-300" />
                </div>
            ))}
        </div>

        {/* Dots Indikator */}
        {flyers.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
                {flyers.map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    </div>
                ))}
            </div>
        )}

      </div>
      
      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}