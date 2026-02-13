

"use client";

import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { OverviewData, getWaveColor } from "@/lib/bmkg/maritim";
import { MARITIME_GEOJSON } from "./geojson";
import { PORT_LOCATIONS } from "./ports";

// ICON PELABUHAN
const anchorIcon = L.divIcon({
  className: "custom-anchor-icon",
  html: `<div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #2563eb; display: flex; align-items: center; justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const AutoZoom = () => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([[-4.5, 115.5], [2.5, 120]]);
    map.fitBounds(bounds);
  }, [map]);
  return null;
};

interface MaritimeMapProps {
  mode: 'area' | 'port';
  onSelectArea: (code: string, name: string) => void;
  onSelectPort: (id: string, name: string) => void;
  selectedId: string | null;
  overviewData: OverviewData | null;
  dayIndex: number;
}

export default function MaritimeMap({ mode, onSelectArea, onSelectPort, selectedId, overviewData, dayIndex }: MaritimeMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getWaveCategory = (code: string) => {
    if (!overviewData || !overviewData[code]) return "Tidak Ada Data";
    const data = overviewData[code];
    switch (dayIndex) {
      case 0: return data.today;
      case 1: return data.tomorrow;
      case 2: return data.h2;
      case 3: return data.h3;
      default: return "Tidak Ada Data";
    }
  };

  const activeId = hoveredId || selectedId;
  
  let activeInfo = null;
  if (activeId) {
    if (mode === 'area') {
      const feature = MARITIME_GEOJSON.features.find((f: any) => f.properties.WP_1 === activeId);
      if (feature) {
        const wave = getWaveCategory(activeId);
        activeInfo = {
          title: "Wilayah Perairan",
          name: feature.properties.WP_IMM,
          extra: wave,
          color: getWaveColor(wave)
        };
      }
    } else {
      const port = PORT_LOCATIONS.find((p) => p.id === activeId);
      if (port) {
        activeInfo = {
          title: "Lokasi Pelabuhan",
          name: port.name,
          extra: "Klik untuk detail cuaca",
          color: "#2563eb"
        };
      }
    }
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-md border border-blue-100 bg-blue-50">
      <MapContainer center={[-1.2, 117.5]} zoom={7} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <AutoZoom />

        {/* RENDER AREA  */}
        {mode === 'area' && MARITIME_GEOJSON.features.map((feature: any, idx: number) => {
          const code = feature.properties.WP_1;
          const name = feature.properties.WP_IMM;
          const isSelected = selectedId === code;
          const waveCat = getWaveCategory(code);
          const baseColor = getWaveColor(waveCat);

          return (
            <Polygon 
              key={idx}
              positions={feature.geometry.coordinates[0].map((coord: any) => [coord[1], coord[0]])}
              pathOptions={{ color: isSelected ? "#fff" : baseColor, weight: isSelected ? 3 : 1, fillColor: baseColor, fillOpacity: isSelected ? 0.9 : 0.6 }}
              eventHandlers={{ click: () => onSelectArea(code, name), mouseover: () => setHoveredId(code), mouseout: () => setHoveredId(null) }}
            >
              <Tooltip sticky direction="top">
                <div className="text-center"><div className="font-bold text-xs mb-1">{name}</div><div className="text-[10px] px-2 py-0.5 rounded text-white inline-block" style={{ backgroundColor: baseColor }}>Gelombang: {waveCat}</div></div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* RENDER  PORT */}
        {mode === 'port' && PORT_LOCATIONS.map((port) => (
          <Marker 
            key={port.id} 
            position={[port.lat, port.lng]} 
            icon={anchorIcon}
            eventHandlers={{ click: () => onSelectPort(port.id, port.name) }}
          >
            <Tooltip direction="top" offset={[0, -36]} opacity={1}>
              <span className="font-bold text-sm">{port.name}</span>
            </Tooltip>
          </Marker>
        ))}

      </MapContainer>

      {/*FLOATING INFO CARD  */}
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {activeInfo ? activeInfo.title : (mode === 'area' ? "Info Perairan" : "Info Pelabuhan")}
        </h4>
        
        {activeInfo ? (
          <div>
            <div className="text-blue-900 font-bold leading-tight text-sm mb-2">
                {activeInfo.name}
            </div>
            
            {mode === 'area' ? (
               <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-500">Gelombang:</span>
                  <span className="font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: activeInfo.color }}>
                    {activeInfo.extra}
                  </span>
               </div>
            ) : (
               <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block font-medium">
                  {activeInfo.extra}
               </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-xs italic">
            Arahkan kursor atau klik {mode === 'area' ? 'area berwarna' : 'ikon jangkar'} pada peta untuk melihat informasi.
          </div>
        )}
      </div>

      {/* Info Box & Legend */}
      {mode === 'area' && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 text-xs">
           <div className="font-bold text-gray-500 mb-2 uppercase tracking-wider text-[10px]">Tinggi Gelombang</div>
           <div className="space-y-1">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#10b981]"></span> Tenang (0.1-0.5m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#3b82f6]"></span> Rendah (0.5-1.25m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#eab308]"></span> Sedang (1.25-2.5m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#f97316]"></span> Tinggi (2.5-4.0m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span> Ekstrem {`>4.0m`}</div>
            </div>
        </div>
      )}
    </div>
  );
}