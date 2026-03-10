"use client";

import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MahakamLocation } from '@/lib/mahakam-data';
import { RawTideData } from '@/lib/tide-service'; 
import RouteForecastView from './RouteForecastView';
import StationDetailView from './StationDetailView';
import TidalChart, { TideData } from '@/components/component-cuaca/mahakam/TidalChart';
// Import Ikon Baru
import { Anchor, Info, Clock,Waves } from "lucide-react";

const RiverMap = dynamic(
  () => import('./RiverMap'),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] w-full animate-pulse rounded-[2.5rem] bg-slate-100"/>
  }
);

interface Props {
  data: MahakamLocation[];
  tideData: RawTideData[]; 
}

export default function MahakamDashboard({ data, tideData }: Props) {
  
  const [selectedStation, setSelectedStation] = useState<MahakamLocation | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // --- DATA PROCESSING (TIDE) ---
  const processedTideData = useMemo((): TideData[] => {
    if (!tideData || tideData.length === 0) return [];

    const formatted = tideData.map(item => {
        const dateObj = new Date(item.t);
        return {
            originalTime: item.t,
            label: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Makassar' }).format(dateObj).replace('.', ':'),
            dateLabel: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Makassar' }).format(dateObj),
            heightLAT: parseFloat(item.est), 
            heightMSL: parseFloat(item.msl), 
            isHigh: false,
            isLow: false
        };
    });

    const maxVal = Math.max(...formatted.map(d => d.heightLAT));
    const minVal = Math.min(...formatted.map(d => d.heightLAT));

    return formatted.map(d => ({
        ...d,
        isHigh: d.heightLAT === maxVal,
        isLow: d.heightLAT === minVal
    }));
  }, [tideData]);

  // --- MENCARI DATA PASANG SURUT SAAT INI (UNTUK HEADER) ---
  const currentTideInfo = useMemo(() => {
     if(!processedTideData.length) return null;
     const now = new Date().getTime();
     // Cari data terdekat (yang waktunya > sekarang, lalu ambil sebelumnya)
     const foundIndex = processedTideData.findIndex(d => new Date(d.originalTime).getTime() > now);
     const targetIndex = foundIndex > 0 ? foundIndex - 1 : (foundIndex === 0 ? 0 : processedTideData.length - 1);
     return processedTideData[targetIndex];
  }, [processedTideData]);

  const handleStationSelect = (loc: MahakamLocation) => {
    if (selectedStation?.id === loc.id) {
        setSelectedStation(null);
    } else {
        setSelectedStation(loc);
        setTimeout(() => {
            detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };

  // Format Tanggal Header
  const todayLabel = new Intl.DateTimeFormat('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Makassar' 
  }).format(new Date());

  return (
    <div className="space-y-8 pb-20">
         
         {/* --- HEADER UTAMA (FITUR BARU) --- */}
         <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center text-center md:items-start md:text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
            {/* Main Icon */}
            <div className="bg-white p-4 rounded-full shadow-sm w-fit shrink-0 ring-4 ring-blue-50/50">
                <Anchor className="w-8 h-8 text-blue-600" />
            </div>
    
            <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold text-slate-800">
                    Cuaca Jalur Sungai Mahakam
                </h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed mx-auto md:mx-0">
                   Informasi terpadu cuaca, jarak pandang, dan pasang surut untuk keselamatan pelayaran di sepanjang alur Sungai Mahakam.
                </p>
                
                {/* Action Row: Badge Informasi */}
                <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  
                  {/* Badge Tanggal */}
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{todayLabel}</span>
                  </div>

                  {/* Badge Jumlah Titik Pantau */}
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      <span><strong>{data.length}</strong> Titik Pantau Cuaca</span>
                  </div>

                  {/* Badge Status Pasut Saat Ini (Live) */}
                  {currentTideInfo && (
                      <div className="inline-flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-md border border-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-200">
                          <Waves className="w-3.5 h-3.5" />
                          <span>Pasang Surut: {currentTideInfo.heightLAT.toFixed(2)} m (LAT)</span>
                      </div>
                  )}

                </div>
            </div>
         </section>
         {/* ---------------------------------- */}


         {/* 1. PETA VISUALISASI */}
         <section>
            <RiverMap initialData={data} />
         </section>

         {/* 2. PASANG SURUT */}
         <section className="scroll-mt-20">
            {processedTideData.length > 0 ? (
                <TidalChart data={processedTideData} />
            ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
                    Gagal memuat data pasang surut BMKG.
                </div>
            )}
         </section>

         {/* 3. TABEL RUTE */}
         <section className="relative z-20">
             <RouteForecastView 
                data={data} 
                onSelect={handleStationSelect}
                activeId={selectedStation?.id}
             />
         </section>

         {/* 4. DETAIL VIEW */}
         {selectedStation && (
             <section ref={detailRef} className="scroll-mt-6">
                <StationDetailView 
                    data={selectedStation} 
                    onClose={() => setSelectedStation(null)} 
                />
             </section>
         )}

    </div>
  );
}