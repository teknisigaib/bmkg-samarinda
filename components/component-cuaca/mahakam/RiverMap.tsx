"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MahakamLocation } from '@/lib/mahakam-data';
import { renderToString } from 'react-dom/server';
import { Maximize, X } from 'lucide-react';

interface RiverMapProps {
  initialData: MahakamLocation[];
  onViewDetail?: (loc: MahakamLocation) => void;
}

// --- CUSTOM ICON GENERATOR (TETAP SAMA) ---
const createCustomWeatherIcon = (loc: MahakamLocation, isActive: boolean) => {
  const iconHtml = renderToString(
    <div className={`
      relative flex items-center justify-center transition-all duration-300
      ${isActive ? 'scale-125 z-50' : 'hover:scale-110 z-10'}
    `}>
      <div className={`
        relative w-12 h-12 rounded-2xl flex items-center justify-center 
        bg-white/90 backdrop-blur-md shadow-lg border-2 border-white
        ${isActive ? 'ring-4 ring-blue-400/30' : ''}
      `}>
         {loc.iconUrl ? (
            <img 
                src={loc.iconUrl} 
                alt={loc.weather}
                className="w-10 h-10 object-contain drop-shadow-sm filter contrast-125" 
            />
         ) : (
             <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
         )}
      </div>
      <div className="absolute -bottom-1.5 w-3 h-3 rotate-45 bg-white border-r-2 border-b-2 border-slate-100"></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 52], 
    popupAnchor: [0, -50]
  });
};

function SetBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  const isZoomed = useRef(false);
  useEffect(() => {
    if (coords.length > 0 && !isZoomed.current) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
      isZoomed.current = true;
    }
  }, [coords, map]);
  return null;
}

export default function RiverMap({ initialData, onViewDetail }: RiverMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [riverGeoJson, setRiverGeoJson] = useState<any>(null);
  const [selectedLoc, setSelectedLoc] = useState<MahakamLocation | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch('/maps/alur-mahakam.geojson')
      .then(res => res.json())
      .then(data => setRiverGeoJson(data))
      .catch(err => console.error("GeoJSON Error:", err));

    if (initialData.length > 0) {
        setSelectedLoc(initialData.find(l => l.name.includes('Samarinda')) || initialData[0]);
    }
  }, [initialData]);

  if (!isMounted) return <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />;

  const riverGlowStyle = { color: '#60a5fa', weight: 8, opacity: 0.5, lineCap: 'round' as const, lineJoin: 'round' as const };
  const riverCoreStyle = { color: '#2563eb', weight: 3, opacity: 1, lineCap: 'round' as const, lineJoin: 'round' as const };

  return (
    <div className="w-full relative z-0 font-sans">
      
      <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl relative group bg-slate-100">
        
        {/* --- FLOATING INFO CARD (STYLING DARI SNIPPET ANDA) --- */}
        {selectedLoc ? (
            <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300 animate-in slide-in-from-top-2 fade-in">
                
                {/* Header Title & Close Button */}
                <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        WILAYAH PERAIRAN
                    </h4>
                    <button 
                        onClick={() => setSelectedLoc(null)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
                
                {/* Location Name */}
                <div className="text-blue-900 font-bold leading-tight text-sm mb-3">
                    {selectedLoc.name}
                </div>
                
                {/* Data Rows (Menggunakan Style Snippet: bg-gray-50, rounded, border) */}
                <div className="space-y-2">
                    
                    {/* Cuaca */}
                    <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-gray-500">Cuaca:</span>
                        <span className="font-bold px-2 py-0.5 rounded text-white bg-blue-500 capitalize">
                            {selectedLoc.weather}
                        </span>
                    </div>

                    {/* Suhu */}
                    <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-gray-500">Suhu:</span>
                        <span className="font-bold px-2 py-0.5 ">
                            {selectedLoc.temp}°C
                        </span>
                    </div>

                    {/* Angin */}
                    <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-gray-500">Angin:</span>
                        <span className="font-bold px-2 py-0.5 ">
                            {selectedLoc.windSpeed} km/j
                        </span>
                    </div>

                </div>

                {/* Tombol Action (Opsional, disesuaikan agar muat di w-64) */}
                {onViewDetail && (
                    <button 
                        onClick={() => onViewDetail(selectedLoc)}
                        className="w-full mt-3 bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                        <Maximize size={12} />
                        DETAIL LENGKAP
                    </button>
                )}

            </div>
        ) : (
            // Placeholder jika tidak ada yang dipilih (Opsional)
            <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50">
                 <div className="text-gray-400 text-xs italic text-center">
                    Klik titik stasiun pada peta untuk melihat informasi cuaca.
                 </div>
            </div>
        )}

        {/* --- MAP COMPONENT --- */}
        <MapContainer 
          center={[-0.502, 117.153]} 
          zoom={8} 
          scrollWheelZoom={false} 
          className="h-full w-full z-0 bg-slate-100"
          zoomControl={false}
        >
            <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {riverGeoJson && (
              <>
                <GeoJSON data={riverGeoJson} style={riverGlowStyle} />
                <GeoJSON data={riverGeoJson} style={riverCoreStyle} />
              </>
            )}

            <SetBounds coords={initialData.map(l => [l.lat, l.lng])} />

            {initialData.map((loc) => {
                const isActive = selectedLoc?.id === loc.id;
                return (
                    <Marker 
                        key={loc.id} 
                        position={[loc.lat, loc.lng]}
                        icon={createCustomWeatherIcon(loc, isActive)}
                        eventHandlers={{
                            click: () => setSelectedLoc(loc)
                        }}
                    />
                );
            })}
        </MapContainer>
        
      </div>
    </div>
  );
}