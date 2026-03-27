"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

export type WarningLevel = "AWAS" | "SIAGA" | "WASPADA" | "AMAN" | "TIDAK ADA DATA";

export interface RegionData {
  id: string;
  name: string;
  level: WarningLevel;
}

interface ClimateMapProps {
  geoJsonData: any;
  warningData: RegionData[];
  warningType: "HUJAN" | "KEKERINGAN";
}

const getColor = (level: WarningLevel) => {
  switch (level) {
    case "AWAS": return "#ef4444";    
    case "SIAGA": return "#f97316";   
    case "WASPADA": return "#eab308"; 
    case "AMAN": return "#10b981";   
    default: return "#cbd5e1";
  }
};

export default function ClimateMapClient({ geoJsonData, warningData, warningType }: ClimateMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<{ name: string; level: WarningLevel; warningText: string } | null>(null);

  const style = (feature: any) => {
    const regionName = feature.properties.NAME_2; 
    const regionStatus = warningData.find((item) => item.name.toLowerCase() === regionName.toLowerCase());
    const level = regionStatus ? regionStatus.level : "TIDAK ADA DATA";

    return {
      fillColor: getColor(level),
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.7 
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const regionName = feature.properties.NAME_2;
    const regionStatus = warningData.find((item) => item.name.toLowerCase() === regionName.toLowerCase());
    const level = regionStatus ? regionStatus.level : "TIDAK ADA DATA";

    const warningText = warningType === "HUJAN" 
        ? "Curah Hujan Tinggi" 
        : "Hari Tanpa Hujan Panjang";

    // Hover Effect & State Update
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 2, color: '#1e293b', fillOpacity: 0.9 });
        l.bringToFront();
        setHoveredRegion({ name: regionName, level, warningText });
      },
      mouseout: (e) => {
        const l = e.target;
        // @ts-ignore
        l.setStyle({ weight: 1, color: 'white', fillOpacity: 0.7 });
        setHoveredRegion(null);
      }
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer 
        center={[0.5, 116.5]} 
        zoom={7} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#f8fafc' }} 
      >
        <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"/>

        {geoJsonData && (
          <GeoJSON 
            key={warningType} 
            data={geoJsonData} 
            style={style} 
            onEachFeature={onEachFeature} 
          />
        )}
      </MapContainer>

      {/* FLOATING INFO CARD */}
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-100 transition-all duration-300">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">
             Info Wilayah
        </h4>
        
        {hoveredRegion ? (
          <div>
            <div className="text-slate-800 font-black tracking-tight leading-tight text-sm mb-3">
                {hoveredRegion.name}
            </div>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium">Peringatan:</span>
                  <span className={`font-bold ${warningType === "HUJAN" ? "text-blue-600" : "text-amber-600"}`}>
                    {hoveredRegion.warningText}
                  </span>
               </div>
               
               <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold px-2 py-0.5 rounded text-white shadow-sm uppercase tracking-widest text-[10px]" style={{ backgroundColor: getColor(hoveredRegion.level) }}>
                    {hoveredRegion.level}
                  </span>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-xs font-medium leading-relaxed">
            Arahkan kursor pada wilayah peta untuk melihat informasi detail peringatan dini.
          </div>
        )}
      </div>
    </div>
  );
}