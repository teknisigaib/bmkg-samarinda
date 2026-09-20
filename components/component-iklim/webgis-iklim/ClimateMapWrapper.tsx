"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Memuat komponen Leaflet murni di sisi Client (Non-SSR)
const ClimateMapClient = dynamic(
  () => import('./ClimateMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-50/80 flex flex-col items-center justify-center rounded-2xl">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menyiapkan Engine Peta...</span>
      </div>
    )
  }
);

export default function ClimateMapWrapper() {
  return <ClimateMapClient />;
}