"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { HotspotData } from "@/lib/data-karhutla";
import { Calendar, Info, Compass } from "lucide-react";

const createHotspotIcon = (conf: number, isHovered: boolean) => {
  let mainColor = "";

  if (conf >= 9) {
    mainColor = "bg-red-600";
  } else if (conf >= 7) {
    mainColor = "bg-orange-500";
  } else {
    mainColor = "bg-yellow-400";
  }
  
  const sizeClass = isHovered ? "w-5 h-5 border-[3px]" : "w-3 h-3 border-2";

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="flex items-center justify-center w-full h-full">
        <span class="relative inline-flex ${sizeClass} rounded-full ${mainColor} border-white shadow-md transition-all duration-200"></span>
      </div>
    `,
    iconSize: [20, 20],   
    iconAnchor: [10, 10], 
  });
};

// Helper Status
const getStatusInfo = (conf: number) => {
    if (conf >= 9) return { label: "Tinggi", color: "text-red-700", bg: "bg-red-50" };
    if (conf >= 7) return { label: "Sedang", color: "text-orange-700", bg: "bg-orange-50" };
    return { label: "Rendah", color: "text-yellow-700", bg: "bg-yellow-50" };
};

// Auto Zoom
const AutoBounds = ({ data }: { data: HotspotData[] }) => {
  const map = useMap();
  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(d => [d.lat, d.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([-0.5, 117], 7);
    }
  }, [data, map]);
  return null;
};

export default function HotspotMap({ data }: { data: HotspotData[] }) {
  const [hoveredSpot, setHoveredSpot] = useState<HotspotData | null>(null);
  const statusInfo = hoveredSpot ? getStatusInfo(hoveredSpot.conf) : null;

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-md border border-red-100 z-0 relative bg-gray-100 group ">
      
      <MapContainer 
        center={[-0.5, 117]} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }} 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap & CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <AutoBounds data={data} />

        {data.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createHotspotIcon(point.conf, hoveredSpot?.id === point.id)}
            eventHandlers={{
              mouseover: () => setHoveredSpot(point),
              click: () => setHoveredSpot(point),
            }}
            zIndexOffset={hoveredSpot?.id === point.id ? 1000 : 1} 
          />
        ))}
      </MapContainer>
      
      {/* INFO WINDOW */}
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
             <Info className="w-3 h-3" /> INFO TITIK PANAS
        </h4>
        
        {hoveredSpot && statusInfo ? (
          <div>
            <div className="text-blue-900 font-bold leading-tight text-sm mb-1">
                {hoveredSpot.subDistrict}
            </div>
            <div className="text-gray-500 text-xs font-medium mb-3 pb-2 border-b border-gray-100">
                {hoveredSpot.district}
            </div>
            
            <div className="flex flex-col gap-2">
               {/* Confidence */}
               <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-500">Confidence:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${statusInfo.bg.replace("bg-", "text-").replace("50", "600")}`} 
                        style={{ backgroundColor: statusInfo.bg.replace("bg-", "#") === "bg-red-50" ? "#fee2e2" : (statusInfo.bg.includes("orange") ? "#ffedd5" : "#fef9c3") }}> 
                      {statusInfo.label} ({hoveredSpot.conf})
                  </span>
               </div>

               {/* Satelit */}
               <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-500">Satelit:</span>
                  <span className="font-medium text-gray-700">{hoveredSpot.satellite}</span>
               </div>
               
               {/* Koordinat */}
               <div className="flex flex-col gap-1 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-1 text-gray-400 mb-1">
                    <Compass className="w-3 h-3" />
                    <span>Koordinat</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-gray-600 font-semibold">
                    <span>Lat: {hoveredSpot.lat.toFixed(5)}</span>
                    <span>Lon: {hoveredSpot.lng.toFixed(5)}</span>
                  </div>
               </div>

               {/* Waktu */}
               <div className="text-[10px] text-center text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {hoveredSpot.date}
               </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xs italic">
            Arahkan kursor pada titik panas untuk melihat detail lokasi dan koordinat.
          </div>
        )}
      </div>

      {/* LEGEND  */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-xs hidden md:block">
         <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600 border border-white shadow-sm"></span>
                <span className="font-medium text-gray-700">Tinggi (9-10)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500 border border-white shadow-sm"></span>
                <span className="font-medium text-gray-700">Sedang (7-8)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-400 border border-white shadow-sm"></span>
                <span className="font-medium text-gray-700">Rendah (1-6)</span>
            </div>
         </div>
      </div>
    </div>
  );
}