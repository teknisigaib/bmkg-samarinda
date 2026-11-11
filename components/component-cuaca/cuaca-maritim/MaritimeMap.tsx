"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getWaveColor, NewMaritimeForecastItem, KALTIM_AREAS, KALTIM_PORTS } from "@/lib/bmkg/maritim";

// Marker Dot Merah untuk Pelabuhan
const dotIcon = typeof window !== 'undefined' ? L.divIcon({
  className: "custom-dot",
  html: `<div style="background:#ef4444; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
}) : null;

interface MapProps {
  onSelect: (name: string, type: 'area' | 'port', codeId?: string) => void;
  regionCache: Record<string, NewMaritimeForecastItem[]>;
  dayIndex: number;
  geoData: any; 
}

export default function MaritimeMap({ onSelect, regionCache, dayIndex, geoData }: MapProps) {
  
  // FIX: Gunakan useRef agar event Leaflet selalu baca data terbaru, bukan memori lama!
  const cacheRef = useRef(regionCache);
  const dayRef = useRef(dayIndex);

  useEffect(() => {
      cacheRef.current = regionCache;
      dayRef.current = dayIndex;
  }, [regionCache, dayIndex]);

  const filteredData = { ...geoData, features: [] };
  
  if (geoData && geoData.features) {
      const allowedAreas = new Set(KALTIM_AREAS.map(a => a.name.toLowerCase()));

      filteredData.features = geoData.features.filter((f: any) => {
          if (f.geometry.type === 'Point') return false; 
          // Amankan dari spasi nyasar menggunakan .trim()
          const rawName = (f.properties?.perairan || f.properties?.WSB || "").trim();
          if (!rawName) return false;
          return allowedAreas.has(rawName.toLowerCase());
      });
  }

  const getStyle = (feature: any) => {
    if (feature.geometry.type === 'Point') return {}; 

    const rawName = (feature.properties?.perairan || feature.properties?.WSB || "").trim();
    const matchedArea = KALTIM_AREAS.find(a => a.name.toLowerCase() === rawName.toLowerCase());
    
    let fillColor = "#cbd5e1"; 
    let fillOpacity = 0.3;

    // BACA DARI REF agar tidak pernah terjebak status abu-abu
    const currentCache = cacheRef.current;
    const currentDay = dayRef.current;

    if (matchedArea && currentCache[matchedArea.id] && currentCache[matchedArea.id][currentDay]) {
        const forecastNow = currentCache[matchedArea.id][currentDay];
        fillColor = getWaveColor(forecastNow.wave_cat);
        fillOpacity = 0.6; 
    }

    return { fillColor, weight: 1.5, opacity: 1, color: "white", fillOpacity };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const rawName = (feature.properties.perairan || feature.properties.WSB || "").trim();
    const matchedLocation = KALTIM_AREAS.find(a => a.name.toLowerCase() === rawName.toLowerCase());

    layer.on({
      click: () => {
        if (rawName && matchedLocation) {
            onSelect(rawName, 'area', matchedLocation.id);
        }
      },
      mouseover: (e: any) => {
        const target = e.target;
        if (typeof target.setStyle === "function") {
           target.setStyle({ weight: 3, fillOpacity: 0.8, color: '#3b82f6' });
        }
      },
      mouseout: (e: any) => {
        const target = e.target;
        if (typeof target.setStyle === "function") {
           // Karena getStyle membaca cacheRef, warnanya akan kembali ke warna gelombang yang benar!
           target.setStyle(getStyle(feature));
        }
      },
    });

    if (rawName && matchedLocation) {
        const locationId = matchedLocation.id;
        let info = "";
        
        const currentCache = cacheRef.current;
        const currentDay = dayRef.current;

        if (currentCache[locationId] && currentCache[locationId][currentDay]) {
            const data = currentCache[locationId][currentDay];
            info = ` • ${data.wave_height}m (${data.wave_cat})`;
        }
        layer.bindTooltip(`${rawName}${info}`, {
            sticky: true, direction: "top", className: "custom-tooltip"
        });
    }
  };

  // Kunci perbaikan ke-2: Ubah Key agar peta otomatis nge-cat ulang saat data cache masuk
  const cacheSize = Object.keys(regionCache).length;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={[1.0, 118.0]} zoom={6.5} className="h-full w-full" zoomControl={false}>
        <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_32wf_1_a69d1812376e13fad46ef99a" />
        
        {/* 1. Gambar Area Perairan (Poligon Biru) */}
        {filteredData && filteredData.features.length > 0 && (
          <GeoJSON
            key={`map-${dayIndex}-${cacheSize}`} 
            data={filteredData}
            style={getStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* 2. Gambar Titik Pelabuhan Manual (Marker Merah) */}
        {KALTIM_PORTS.map((port) => {
           if (!port.lat || !port.lon) return null;

           let info = "";
           if (regionCache[port.id] && regionCache[port.id][dayIndex]) {
               const data = regionCache[port.id][dayIndex];
               info = ` • Vis: ${data.visibility || '-'} • Wind: ${data.wind_speed}kts`;
           }

           return (
               <Marker 
                  key={port.id}
                  position={[port.lat, port.lon]}
                  icon={dotIcon!}
                  eventHandlers={{
                      click: () => onSelect(port.name, 'port', port.id)
                  }}
               >
                  <Tooltip direction="top" className="custom-tooltip">
                     {port.name}{info}
                  </Tooltip>
               </Marker>
           );
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-24 left-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/40 text-[10px]">
         <div className="font-bold text-slate-500 mb-2 uppercase tracking-wider">Legenda Peta</div>
         <div className="space-y-1.5 font-semibold text-slate-600">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-[#ef4444] border border-white shadow-sm"></div> 
                <span>Lokasi Pelabuhan</span>
            </div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#3b82f6]"></span> Tenang (0-0.5 m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#10b981]"></span> Rendah (0.5-1.25 m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#eab308]"></span> Sedang (1.25-2.5 m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#f97316]"></span> Tinggi (2.5-4 m)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#ef4444]"></span> Sangat Tinggi (4-6 m)</div>
         </div>
      </div>
      <style jsx global>{`
        .custom-tooltip {
          background: rgba(255, 255, 255, 0.95) !important; border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important; padding: 4px 8px !important; font-weight: 800 !important;
          color: #1e293b !important; box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
          font-size: 10px !important; text-transform: uppercase;
        }
        .leaflet-tooltip-top:before { border-top-color: white !important; }
        
        /* HILANGKAN KOTAK TEBAL (OUTLINE) SAAT AREA DIKLIK */
        .leaflet-interactive:focus { outline: none !important; }
        path.leaflet-interactive:focus { outline: none !important; }
      `}</style>
    </div>
  );
}