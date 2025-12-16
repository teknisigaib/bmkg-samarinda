"use client";

import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// --- HELPER: AUTO ZOOM ---
const AutoZoom = ({ polygons }: { polygons: [number, number][][] }) => {
  const map = useMap();

  useEffect(() => {
    if (polygons.length > 0) {
      try {
        const allPoints = polygons.flat();
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [30, 30] });
      } catch (e) {
        console.error("Gagal auto zoom peta", e);
      }
    }
  }, [polygons, map]);

  return null;
};

// --- HELPER: WARNA BERDASARKAN SEVERITY ---
const getSeverityColor = (severity: string) => {
  // Normalisasi string (jaga-jaga huruf besar/kecil)
  const level = severity?.toLowerCase() || "";
  
  if (level.includes("extreme")) return "#ef4444"; // Merah (Awas)
  if (level.includes("severe")) return "#f97316";  // Oranye (Siaga)
  return "#eab308"; // Kuning (Moderate/Waspada) - Default
};

interface WarningMapProps {
  data: {
    polygons: [number, number][][];
    severity: string;
  };
}

export default function WarningMap({ data }: WarningMapProps) {
  const activeColor = getSeverityColor(data.severity);

  return (
    <div className="flex flex-col gap-3">
      
      {/* 1. CONTAINER PETA */}
      <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
        <MapContainer 
          center={[-0.5, 117]} 
          zoom={6} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          {/* GANTI KE CARTO VOYAGER */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <AutoZoom polygons={data.polygons} />

          {data.polygons.map((poly, idx) => (
            <Polygon 
              key={idx} 
              positions={poly}
              interactive={false} 
              pathOptions={{ 
                  color: activeColor, 
                  fillColor: activeColor, 
                  fillOpacity: 0.4, 
                  weight: 1,
              }}
            >
              <Tooltip sticky direction="top" offset={[0, -10]} opacity={1}>
                <span className="font-bold text-xs">Area Terdampak {idx + 1}</span>
              </Tooltip>
            </Polygon>
          ))}
        </MapContainer>
      </div>

      {/* 2. LEGENDA (DI BAWAH PETA) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-xs md:text-sm">
        <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Keterangan Zona:</span>
        
        <div className="flex items-center gap-4">
          {/* Level: Waspada */}
          <div className={`flex items-center gap-2 ${data.severity === 'Moderate' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
            <span className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-200"></span>
            <span className="font-medium text-gray-700">Waspada (Kuning)</span>
          </div>

          {/* Level: Siaga */}
          <div className={`flex items-center gap-2 ${data.severity === 'Severe' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
            <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-200"></span>
            <span className="font-medium text-gray-700">Siaga (Oranye)</span>
          </div>

          {/* Level: Awas */}
          <div className={`flex items-center gap-2 ${data.severity === 'Extreme' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
            <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200"></span>
            <span className="font-medium text-gray-700">Awas (Merah)</span>
          </div>
        </div>
      </div>

    </div>
  );
}