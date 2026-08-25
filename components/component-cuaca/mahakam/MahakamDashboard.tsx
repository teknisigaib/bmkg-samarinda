"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MahakamLocation } from '@/lib/mahakam-data';
import { RawTideData } from '@/lib/tide-service'; 
import RouteForecastView from '@/components/component-cuaca/mahakam/RouteForecastView';
// NOTE: MeteogramView import tidak diperlukan lagi di sini
import TidalChart, { TideData } from '@/components/component-cuaca/mahakam/TidalChart';
import SectionDivider from "@/components/ui/SectionDivider"; 
import { Map, Clock, Waves } from "lucide-react";

const RiverMap = dynamic(
  () => import('@/components/component-cuaca/mahakam/RiverMap'),
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
            isHigh: false, isLow: false
        };
    });
    const maxVal = Math.max(...formatted.map(d => d.heightLAT));
    const minVal = Math.min(...formatted.map(d => d.heightLAT));
    return formatted.map(d => ({
        ...d, isHigh: d.heightLAT === maxVal, isLow: d.heightLAT === minVal
    }));
  }, [tideData]);

  const currentTideInfo = useMemo(() => {
     if(!processedTideData.length) return null;
     const now = new Date().getTime();
     const foundIndex = processedTideData.findIndex(d => new Date(d.originalTime).getTime() > now);
     const targetIndex = foundIndex > 0 ? foundIndex - 1 : (foundIndex === 0 ? 0 : processedTideData.length - 1);
     return processedTideData[targetIndex];
  }, [processedTideData]);

  const todayLabel = new Intl.DateTimeFormat('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Makassar' 
  }).format(new Date());

  return (
    <div className="space-y-8 pb-20 relative">
        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-0">
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">Cuaca Sungai Mahakam</h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">Sistem pemantauan alur sungai terpadu. Menyediakan informasi cuaca, visibilitas, dan data pasang surut real-time.</p>
           <div className="relative z-10 flex flex-wrap items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
              <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100"><Map className="w-4 h-4 text-blue-500"/><span className="text-xs font-semibold text-slate-700">{data.length} Titik</span></div>
              {currentTideInfo && (<div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100"><Waves className="w-4 h-4 text-emerald-500"/><span className="text-xs font-semibold text-slate-700">Pasut: {currentTideInfo.heightLAT.toFixed(2)}m</span></div>)}
              <div className="flex items-center gap-2 px-4 py-1.5"><Clock className="w-4 h-4 text-slate-400"/><span className="text-xs font-medium text-slate-500">{todayLabel}</span></div>
           </div>
        </section>

        <section className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
           {/* SEKARANG: RiverMap handle meteogram internal */}
           <RiverMap initialData={data} onViewDetail={setSelectedStation} />
        </section>

        <section className="scroll-mt-20 mt-24">
            <SectionDivider title="Grafik Pasang Surut" className="mb-8" />
            {processedTideData.length > 0 ? (<TidalChart data={processedTideData} />) : (<div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">Gagal memuat data pasang surut BMKG.</div>)}
        </section>

        <section className="relative z-20 mt-24">
             <SectionDivider title="Prakiraan Jalur Sungai" className="mb-8" />
             <RouteForecastView data={data} onSelect={setSelectedStation} activeId={selectedStation?.id} />
        </section>

        {/* --- SECTION 5 (MODAL METEOGRAM) DIHAPUS DARI SINI --- */}
    </div>
  );
}