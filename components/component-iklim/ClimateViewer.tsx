"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Info, History, ChevronRight, Map, Clock, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface ClimateViewerProps {
  data: {
    id: string;
    title: string;
    period: string;
    dasarian: string;
    bulan: string;
    image: string;
    analysis: string;
    isLatest: boolean;
  }[];
}

export default function ClimateViewer({ data }: ClimateViewerProps) {
  const [activeData, setActiveData] = useState(data[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* KOLOM KIRI */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Header Info Aktif*/}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    {/* Badge Dasarian */}
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide shadow-sm">
                        {activeData.dasarian}
                    </span>
                    
                    {/* Badge Terbaru */}
                    {activeData.isLatest && (
                        <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Terbaru
                        </span>
                    )}
                </div>
                
                {/* Info Bulan & Periode */}
                <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {activeData.bulan} 
                    <span className="text-slate-300 font-light">|</span> 
                    <span className="text-slate-500 font-medium text-base">{activeData.period}</span>
                </h3>
            </div>
        </div>

        {/* Peta Besar (Clickable untuk Lightbox) */}
        <div 
            className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group p-1 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
        >
            <div className="relative w-full rounded-xl overflow-hidden bg-white border border-slate-100">
                <Image 
                    key={activeData.image} 
                    src={activeData.image} 
                    alt={activeData.title} 
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain min-h-[300px] max-h-[80vh] transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Overlay Hover (Zoom In) */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center z-10">
                    <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                        <ZoomIn className="w-4 h-4 text-blue-600" /> Perbesar Peta
                    </div>
                </div>

                {/* Overlay Judul Bawah */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium flex items-center gap-2 shadow-sm">
                        <Map className="w-4 h-4 opacity-90 text-blue-400" /> {activeData.title}
                    </p>
                </div>
            </div>
        </div>

        {/* Komponen Lightbox */}
        <ImageLightbox 
            isOpen={isLightboxOpen}
            imageUrl={activeData.image}
            title={activeData.title}
            description={`Data analisis/prakiraan klimatologi wilayah Kalimantan Timur. Dasarian: ${activeData.dasarian}, Periode: ${activeData.period}`}
            altText={activeData.title}
            onClose={() => setIsLightboxOpen(false)}
        />

        {/* Analisis Teks  */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Info className="w-4 h-4 text-blue-600" /> Analisis Klimatologis
            </h4>
            <div 
                className="prose prose-sm prose-slate max-w-none text-slate-600 font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeData.analysis }}
            />
        </div>
      </div>

      {/* KOLOM KANAN (PERBAIKAN SCROLL) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:sticky lg:top-8 flex flex-col h-[500px] lg:h-[calc(100vh-6rem)]">
        
        <div className="flex items-center justify-between text-slate-800 font-bold text-base mb-4 border-b border-slate-100 pb-3 shrink-0">
            <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Arsip Data
            </div>
        </div>
        
        {/* List Scrollable (min-h-0 adalah kunci agar tidak bocor) */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
            {data.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveData(item)}
                    className={`text-left w-full p-3 rounded-xl border transition-all flex gap-3 items-center group relative overflow-hidden shrink-0 ${
                        activeData.id === item.id 
                        ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100" 
                        : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                >
                    {/* Garis Indikator Kiri */}
                    {activeData.id === item.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                    )}

                    {/* Thumbnail Kecil */}
                    <div className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-opacity border ${
                        activeData.id === item.id ? 'border-blue-300 opacity-100' : 'bg-slate-200 border-slate-200 opacity-80 group-hover:opacity-100'
                    }`}>
                        <Image src={item.image} alt="Thumb" fill className="object-cover" />
                    </div>
                    
                    {/* Info Text */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${
                                activeData.id === item.id 
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                                {item.dasarian}
                            </span>
                            {item.isLatest && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200"></span>}
                        </div>
                        
                        <p className={`text-xs font-bold truncate leading-tight ${activeData.id === item.id ? 'text-blue-900' : 'text-slate-800'}`}>
                            {item.bulan}
                        </p>

                        <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <p className="text-[10px] text-slate-500 font-medium truncate">
                                {item.period}
                            </p>
                        </div>
                    </div>

                    {activeData.id === item.id && (
                        <div className="bg-white p-1 rounded-md shadow-sm border border-blue-100">
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                        </div>
                    )}
                </button>
            ))}
        </div>
      </div>

    </div>
  );
}