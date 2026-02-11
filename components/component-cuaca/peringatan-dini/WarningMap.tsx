"use client";

import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// HELPER AUTO ZOOM
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

// HELPER WARNA BERDASARKAN SEVERITY 
const getSeverityColor = (severity: string) => {
  const level = severity?.toLowerCase() || "";
  
  if (level.includes("extreme")) return "#ef4444";
  if (level.includes("severe")) return "#f97316";
  return "#eab308";
};

interface WarningMapProps {
  data: {
    polygons: [number, number][][];
    severity: string;
    event?: string;
    headline?: string;
    areaDesc?: string;
  };
}

export default function WarningMap({ data }: WarningMapProps) {
  const activeColor = getSeverityColor(data.severity);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Info Card State
  const activeInfo = hoveredIdx !== null ? {
      title: "Info Peringatan",
      name: data.event || "Peringatan Dini Cuaca",
      extra: data.areaDesc || "Wilayah Kalimantan Timur",
      color: activeColor
  } : null;

  return (
    <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      
      {/* MAP CONTAINER */}
      <MapContainer 
        center={[-0.5, 117]} 
        zoom={6} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <AutoZoom polygons={data.polygons} />

        {data.polygons.map((poly, idx) => (
          <Polygon 
            key={idx} 
            positions={poly}
            pathOptions={{ 
                color: activeColor, 
                fillColor: activeColor, 
                fillOpacity: 0.4, 
                weight: 1,
            }}
            eventHandlers={{
                mouseover: () => setHoveredIdx(idx),
                mouseout: () => setHoveredIdx(null)
            }}
          >
            <Tooltip sticky direction="top" offset={[0, -10]} opacity={1}>
              <span className="font-bold text-xs">{data.areaDesc || "Area Terdampak"}</span>
            </Tooltip>
          </Polygon>
        ))}
      </MapContainer>

      {/* FLOATING INFO CARD*/}
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
             {activeInfo ? activeInfo.title : "Info Peringatan"}
        </h4>
        
        {activeInfo ? (
          <div>
            <div className="text-blue-900 font-bold leading-tight text-sm mb-2">
                {activeInfo.name}
            </div>
            
            <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
               <span className="text-gray-500">Status:</span>
               <span className="font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: activeInfo.color }}>
                 {data.severity}
               </span>
            </div>
            <div className="mt-2 text-xs text-center text-gray-500 bg-gray-50 rounded border border-gray-100 py-1">
                {activeInfo.extra}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xs italic">
            Arahkan kursor pada area berwarna di peta untuk melihat detail wilayah terdampak.
          </div>
        )}
      </div>

      {/* LEGEND  */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-2">Keterangan Level:</span>
          <div className="space-y-1">
            <div className={`flex items-center gap-2 ${data.severity === 'Moderate' ? 'opacity-100 font-bold' : 'opacity-50 grayscale'}`}>
              <span className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-200"></span> Waspada
            </div>
            <div className={`flex items-center gap-2 ${data.severity === 'Severe' ? 'opacity-100 font-bold' : 'opacity-50 grayscale'}`}>
              <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-200"></span> Siaga
            </div>
            <div className={`flex items-center gap-2 ${data.severity === 'Extreme' ? 'opacity-100 font-bold' : 'opacity-50 grayscale'}`}>
              <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200"></span> Awas
            </div>
          </div>
      </div>

    </div>
  );
}