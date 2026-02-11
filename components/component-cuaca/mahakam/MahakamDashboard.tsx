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
  
  const [selectedStation, setSelectedStation] = useState<MahakamLocation | null>(null);
  
  const detailRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-8 pb-20">
         
         {/*  PETA */}
         <section>
            <RiverMap initialData={data} />
         </section>

         {/* TABEL RUTE */}
         <section className="relative z-20">
             <RouteForecastView 
                data={data} 
                onSelect={handleStationSelect}
                activeId={selectedStation?.id}
             />
         </section>

         {/* 3. TABEL DETAIL */}
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