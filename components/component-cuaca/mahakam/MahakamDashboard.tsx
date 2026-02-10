"use client";

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MahakamLocation } from '@/lib/mahakam-data';
import RouteForecastView from './RouteForecastView';
import StationDetailView from './StationDetailView';

// Dynamic Map
const RiverMap = dynamic(
  () => import('./RiverMap'),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] w-full animate-pulse rounded-[2.5rem]"/>
  }
);

interface Props {
  data: MahakamLocation[];
}

export default function MahakamDashboard({ data }: Props) {
  
  // STATE: Menyimpan lokasi mana yang sedang diklik (selected)
  const [selectedStation, setSelectedStation] = useState<MahakamLocation | null>(null);
  
  // REF: Untuk auto-scroll ke bawah saat diklik
  const detailRef = useRef<HTMLDivElement>(null);

  // Handler saat kolom di tabel atas diklik
  const handleStationSelect = (loc: MahakamLocation) => {
    // Jika diklik lagi, tutup. Jika beda, ganti.
    if (selectedStation?.id === loc.id) {
        setSelectedStation(null);
    } else {
        setSelectedStation(loc);
        // Scroll halus ke tampilan detail
        setTimeout(() => {
            detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };

  return (
    <div className="space-y-8 pb-20">
         
         {/* 1. PETA */}
         <section>
            <RiverMap initialData={data} />
         </section>

         {/* 2. TABEL RUTE (MASTER) */}
         <section className="relative z-20">
             <RouteForecastView 
                data={data} 
                onSelect={handleStationSelect} // Pass fungsi klik
                activeId={selectedStation?.id} // Pass ID aktif untuk highlight
             />
         </section>

         {/* 3. TABEL DETAIL (DETAIL) - Muncul jika ada selectedStation */}
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