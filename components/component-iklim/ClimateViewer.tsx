"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Info, History, ChevronRight, Map, Clock } from "lucide-react";


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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* KOLOM KIRI */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Header Info Aktif*/}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    {/* Badge Dasarian */}
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded border border-green-200 uppercase tracking-wide">
                        {activeData.dasarian}
                    </span>
                    
                    {/* Badge Terbaru */}
                    {activeData.isLatest && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">
                            Terbaru
                        </span>
                    )}
                </div>
                
                {/* Info Bulan & Periode */}
                <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {activeData.bulan} 
                    <span className="text-gray-300 font-light">|</span> 
                    <span className="text-gray-500 font-normal text-base">{activeData.period}</span>
                </h3>
            </div>
        </div>

        {/* Peta Besar */}
        <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
            <Image 
                key={activeData.image} 
                src={activeData.image} 
                alt={activeData.title} 
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain min-h-[300px] max-h-[80vh] bg-white transition-opacity duration-300"
            />

            {/* Overlay Judul */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                    <Map className="w-4 h-4 opacity-80" /> {activeData.title}
                </p>
            </div>
        </div>

        {/* Analisis Teks  */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" /> Analisis Klimatologis
            </h4>
            <div 
                className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeData.analysis }}
            />
        </div>
      </div>

      {/* KOLOM KANAN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-gray-800 font-bold text-base mb-2 border-b pb-2">
            <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-500" />
                Arsip Data
            </div>
        </div>
        
        {/* List Scrollable */}
        <div className="grid gap-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {data.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveData(item)}
                    className={`text-left w-full p-3 rounded-lg border transition-all flex gap-3 items-center group ${
                        activeData.id === item.id 
                        ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100" 
                        : "bg-white border-gray-100 hover:bg-gray-50"
                    }`}
                >
                    {/* Thumbnail Kecil */}
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 opacity-90 group-hover:opacity-100 transition-opacity border border-gray-200">
                        <Image src={item.image} alt="Thumb" fill className="object-cover" />
                    </div>
                    
                    {/* Info Text */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                                activeData.id === item.id 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}>
                                {item.dasarian}
                            </span>
                            {item.isLatest && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        </div>
                        
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                            {item.bulan}
                        </p>

                        <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-[10px] text-gray-500 truncate">
                                {item.period}
                            </p>
                        </div>
                    </div>

                    {activeData.id === item.id && (
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                    )}
                </button>
            ))}
        </div>
      </div>

    </div>
  );
}