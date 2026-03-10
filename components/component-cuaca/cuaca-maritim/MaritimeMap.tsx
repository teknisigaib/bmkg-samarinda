"use client";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createSlug, getWaveColor, NewMaritimeForecastItem, KALTIM_AREAS, KALTIM_PORTS } from "@/lib/bmkg/maritim";

// Marker Dot Merah untuk Pelabuhan
const dotIcon = typeof window !== 'undefined' ? L.divIcon({
  className: "custom-dot",
  html: `<div style="background:#3b82f6; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
}) : null;

interface MapProps {
  onSelect: (name: string, type: 'area' | 'port') => void;
  regionCache: Record<string, NewMaritimeForecastItem[]>;
  dayIndex: number;
  geoData: any; // Terima data dari props
}

export default function MaritimeMap({ onSelect, regionCache, dayIndex, geoData }: MapProps) {
  
  // LOGIKA FILTERING (Pindahkan ke sini, tapi olah data dari props)
  // Kita filter geoData agar hanya menampilkan Kaltim
  const filteredData = { ...geoData, features: [] };
  
  if (geoData && geoData.features) {
      const allowedAreas = new Set(KALTIM_AREAS.map(a => a.toLowerCase()));
      const allowedPorts = new Set(KALTIM_PORTS.map(p => p.toLowerCase()));

      filteredData.features = geoData.features.filter((f: any) => {
          const isPoint = f.geometry.type === 'Point';
          if (isPoint) {
              return allowedPorts.has(f.properties?.name?.toLowerCase());
          } else {
              return allowedAreas.has(f.properties?.perairan?.toLowerCase());
          }
      });
  }

  const getStyle = (feature: any) => {
    if (feature.geometry.type === 'Point') return {}; 

    const name = feature.properties?.perairan;
    const slug = createSlug(name);
    
    let fillColor = "#cbd5e1"; 
    let fillOpacity = 0.3;

    if (regionCache[slug] && regionCache[slug][dayIndex]) {
        const forecastNow = regionCache[slug][dayIndex];
        fillColor = getWaveColor(forecastNow.wave_cat);
        fillOpacity = 0.6; 
    }
    return { fillColor, weight: 1, opacity: 1, color: "white", fillOpacity };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const isPort = feature.geometry.type === 'Point';
    const rawName = isPort ? feature.properties.name : feature.properties.perairan;

    layer.on({
      click: () => {
        if (rawName) onSelect(rawName, isPort ? 'port' : 'area');
      },
      mouseover: (e: any) => {
        const target = e.target;
        if (typeof target.setStyle === "function") {
           target.setStyle({ weight: 3, fillOpacity: 0.8, color: isPort ? '#ef4444' : '#3b82f6' });
        }
      },
      mouseout: (e: any) => {
        const target = e.target;
        if (typeof target.setStyle === "function" && !isPort) {
           target.setStyle(getStyle(feature));
        }
      },
    });

    if (rawName) {
        const slug = createSlug(rawName);
        let info = "";
        
        if (regionCache[slug] && regionCache[slug][dayIndex]) {
            const data = regionCache[slug][dayIndex];
            if (isPort) {
                info = ` • Vis: ${data.visibility || '-'}km • Wind: ${data.wind_speed}kts`;
            } else {
                info = ` • ${data.wave_height}m (${data.wave_cat})`;
            }
        }
        layer.bindTooltip(`${rawName}${info}`, {
            sticky: true, direction: "top", className: "custom-tooltip"
        });
    }
  };

  const pointToLayer = (feature: any, latlng: any) => {
      return L.marker(latlng, { icon: dotIcon! });
  };

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={[-1.2, 117.5]} zoom={6} className="h-full w-full" zoomControl={false}>
        <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {filteredData && filteredData.features.length > 0 && (
          <GeoJSON
            key={`map-${dayIndex}`} // Key untuk memaksa re-render warna saat jam berubah
            data={filteredData}
            style={getStyle}
            onEachFeature={onEachFeature}
            pointToLayer={pointToLayer}
          />
        )}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-24 left-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/40 text-[10px]">
         <div className="font-bold text-slate-500 mb-2 uppercase tracking-wider">Legenda Peta</div>
         <div className="space-y-1.5 font-semibold text-slate-600">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></div> 
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
      `}</style>
    </div>
  );
}