"use client";

import { useState } from "react";
import { Plane, MapPin } from "lucide-react"; 
import { ParsedMetar } from "@/lib/bmkg/aviation-utils";
import AviationMapWrapper from "@/components/component-cuaca/cuaca-penerbangan/AviationMapWrapper";
import HeroAirportCard from "./HeroAirportCard";
import RouteWeatherCard from "./RouteWeatherCard";
import { SmallAirportCard } from "./FlightSharedUI";

interface DashboardProps {
  airports: ParsedMetar[];
}

export default function AviationDashboard({ airports }: DashboardProps) {
  const [selectedMapIcao, setSelectedMapIcao] = useState<string>('WALS');
  
  const walsData = airports.find(a => a.icao_id === 'WALS');
  const selectedData = airports.find(a => a.icao_id === selectedMapIcao);
  const isRouteMode = selectedMapIcao !== 'WALS' && selectedData && walsData;

  const handleMapSelect = (icao: string) => {
    setSelectedMapIcao(icao);
    const element = document.getElementById(`hero-section`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-10 text-slate-800">
      
      {/*  HERO SECTION */}
      <div id="hero-section" className="space-y-6 transition-all duration-500">
        
        {/* Main Card*/}
        {walsData ? (
            isRouteMode ? (
                <RouteWeatherCard origin={walsData} destination={selectedData as ParsedMetar} />
            ) : (
                <HeroAirportCard airport={walsData} />
            )
        ) : (
            <div className="p-8 text-center bg-gray-50 rounded-2xl">Memuat Data Utama...</div>
        )}
      </div>

      {/*  PETA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Peta Rute & Cuaca</h3>
            </div>
            {isRouteMode && (
                <button 
                    onClick={() => setSelectedMapIcao('WALS')}
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    Reset ke Samarinda
                </button>
            )}
        </div>
        <div >
            <AviationMapWrapper 
                airports={airports} 
                onSelect={handleMapSelect} 
                selectedIcao={selectedMapIcao} 
            />
        </div>
      </section>

      {/* GRID BANDARA LAIN */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
            <Plane className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800">Daftar Bandara Lain</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airports
                .filter(a => a.icao_id !== 'WALS' && a.icao_id !== selectedMapIcao)
                .map((apt) => (
                <div key={apt.icao_id} onClick={() => handleMapSelect(apt.icao_id)} className="cursor-pointer">
                    <SmallAirportCard airport={apt} />
                </div>
            ))}
        </div>
      </section>

    </div>
  );
}