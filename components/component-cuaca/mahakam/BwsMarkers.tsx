"use client";

import React, { useState, useEffect } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import BwsTmaModal from "./BwsTmaModal";

interface Station {
  name: string;
  lat: number;
  lng: number;
}

interface BwsMarkersProps {
  stations: Station[]; 
}

export default function BwsMarkers({ stations }: BwsMarkersProps) {
  const [tmaData, setTmaData] = useState<any[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    const fetchTma = async () => {
      try {
        const res = await fetch("https://tma.bmkgaptpranoto.com/api/water-levels");
        if (!res.ok) return;
        const json = await res.json();
        
        // Simpan array stasiun langsung ke state
        if (json.data) {
          setTmaData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat data TMA:", err);
      }
    };

    fetchTma();
    const interval = setInterval(fetchTma, 5 * 60 * 1000); // Auto-refresh 5 menit
    return () => clearInterval(interval);
  }, []);

  const createLabelIcon = (stationName: string) => {
    // Cari data TMA yang cocok dengan nama stasiun
    const matchedData = tmaData.find((d: any) => 
      d.station?.trim().toLowerCase() === stationName.trim().toLowerCase()
    );

    let latestTma = "-";
    
    // Cari nilai tma_07 terbaru yang tidak null
    if (matchedData && matchedData.data) {
      const latestValidRecord = matchedData.data.find((record: any) => record.tma_07 !== null);
      if (latestValidRecord) {
        latestTma = latestValidRecord.tma_07.toFixed(2);
      }
    }

    return L.divIcon({
      className: "bg-transparent", 
      html: `
        <div class="relative flex justify-center items-center w-[14px] h-[14px]">
          <div class="absolute bottom-4 bg-white/95 backdrop-blur-sm border border-sky-400 text-sky-700 text-[11px] font-black px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-50">
            ${latestTma} m
          </div>
          
          <div class="w-3.5 h-3.5 bg-sky-500 border-[1.5px] border-white rounded-full shadow-sm z-40"></div>
        </div>
      `,
      iconSize: [14, 14], 
      iconAnchor: [7, 7], 
    });
  };

  return (
    <>
      {stations.map((station, idx) => (
        <Marker
          key={idx}
          position={[station.lat, station.lng]}
          icon={createLabelIcon(station.name)}
          eventHandlers={{
            click: () => setSelectedStation(station),
          }}
        />
      ))}

      {selectedStation && (
        <BwsTmaModal 
          station={selectedStation} 
          onClose={() => setSelectedStation(null)} 
        />
      )}
    </>
  );
}