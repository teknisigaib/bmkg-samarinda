"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { HotspotData } from "@/lib/data-karhutla";
import { Flame, MapPin, Calendar, Satellite, AlertTriangle, Info } from "lucide-react";

// --- 1. ICON GENERATOR (3 TINGKATAN) ---
const createHotspotIcon = (conf: number, isHovered: boolean) => {
  let mainColor = "";
  let pingColor = "";

  // LOGIKA SKALA BARU
  if (conf >= 9) {
    // TINGGI (9-10) -> Merah
    mainColor = "bg-red-600";
    pingColor = "bg-red-500";
  } else if (conf >= 7) {
    // SEDANG (7-8) -> Oranye
    mainColor = "bg-orange-500";
    pingColor = "bg-orange-400";
  } else {
    // RENDAH (1-6) -> Kuning
    mainColor = "bg-yellow-400";
    pingColor = "bg-yellow-300";
  }
  
  // Ukuran titik inti (Membesar jika di-hover)
  const sizeClass = isHovered ? "w-4 h-4" : "w-2.5 h-2.5";

  return L.divIcon({
    className: "custom-pulse-icon", 
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="absolute inline-flex w-full h-full rounded-full ${pingColor} opacity-75 animate-ping"></span>
        
        <span class="relative inline-flex ${sizeClass} rounded-full ${mainColor} border-2 border-white shadow-sm transition-all duration-300"></span>
      </div>
    `,
    iconSize: [32, 32],   
    iconAnchor: [16, 16], 
  });
};

// Helper untuk mendapatkan Label & Warna Teks berdasarkan confidence
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

  // Ambil info status jika ada yang di-hover
  const statusInfo = hoveredSpot ? getStatusInfo(hoveredSpot.conf) : null;

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-md border border-red-100 z-0 relative bg-gray-100 group">
      
      <MapContainer 
        center={[-0.5, 117]} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }} 
        scrollWheelZoom={false}
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
      
      {/* --- INFO WINDOW --- */}
      <div className="absolute top-4 right-4 z-[1000] w-72 transition-all duration-300 pointer-events-none">
        {hoveredSpot && statusInfo ? (
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
            <div className="flex items-center gap-3 mb-3 border-b border-red-50 pb-3">
               <div className="bg-red-50 p-2 rounded-lg relative overflow-hidden">
                  <Flame className="w-5 h-5 text-red-600 relative z-10" />
                  <div className="absolute inset-0 bg-red-200 animate-pulse opacity-50"></div>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 leading-tight">Hotspot Terdeteksi</h4>
                  <p className="text-[10px] text-gray-500 font-mono">ID: {hoveredSpot.id.slice(-6)}</p>
               </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Lokasi</div>
                        <div className="text-sm font-bold text-gray-800">{hoveredSpot.subDistrict}</div>
                        <div className="text-xs text-gray-600">{hoveredSpot.district}, Kaltim</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {hoveredSpot.lat.toFixed(4)}, {hoveredSpot.lng.toFixed(4)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                            <Satellite className="w-3 h-3" /> Satelit
                        </div>
                        <div className="font-bold text-sm text-gray-800">{hoveredSpot.satellite}</div>
                    </div>
                    {/* Status Box */}
                    <div className={`${statusInfo.bg} p-2 rounded-lg`}>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                            <AlertTriangle className="w-3 h-3" /> Confidence
                        </div>
                        <div className={`font-bold text-sm ${statusInfo.color}`}>
                            {statusInfo.label} ({hoveredSpot.conf})
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full w-fit mt-1">
                    <Calendar className="w-3 h-3" />
                    {hoveredSpot.date}
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 pointer-events-auto">
             <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div>
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Live Monitoring</div>
                    <div className="text-xs text-gray-500">Peta interaktif sebaran titik panas.</div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* --- LEGEND (Updated: 3 Levels) --- */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-xs">
         <div className="space-y-2">
            {/* TINGGI */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
                </span>
                <span className="font-medium text-gray-700">Tinggi (9-10)</span>
            </div>
            {/* SEDANG */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-white"></span>
                </span>
                <span className="font-medium text-gray-700">Sedang (7-8)</span>
            </div>
            {/* RENDAH */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 border border-white"></span>
                </span>
                <span className="font-medium text-gray-700">Rendah (1-6)</span>
            </div>
         </div>
      </div>
    </div>
  );
}