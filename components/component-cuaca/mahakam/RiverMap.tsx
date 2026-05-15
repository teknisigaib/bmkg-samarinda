"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, Marker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MahakamLocation } from '@/lib/mahakam-data';
import { 
  Info, MapPin, Compass, Calendar, X, Maximize, 
  Wind, Thermometer, Eye 
} from 'lucide-react'; 
import ForecastControl from './ForecastControl';

interface RiverMapProps {
  initialData: MahakamLocation[];
  onViewDetail?: (loc: MahakamLocation) => void;
}

// --- 1. ICON MARKER (VERSI SUPER RINGAN - TANPA renderToString) ---
const createCustomWeatherIcon = (loc: MahakamLocation, isActive: boolean) => {
  const activeClassContainer = isActive ? 'scale-110 z-[1000]' : 'z-[500]';
  const activeClassBox = isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white';
  
  // HAPUS filter contrast dan backdrop-blur. Ganti dengan solid bg-white.
  const iconContent = loc.iconUrl 
    ? `<img src="${loc.iconUrl}" alt="${loc.weather || ''}" class="w-8 h-8 object-contain" />`
    : `<div class="w-6 h-6 bg-slate-200 rounded-full"></div>`;

  const htmlString = `
    <div class="relative flex items-center justify-center ${activeClassContainer}">
      <div class="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-slate-200 ${activeClassBox}">
         ${iconContent}
      </div>
      <div class="absolute -bottom-1 w-2 h-2 rotate-45 bg-white border-r border-b border-slate-200"></div>
    </div>
  `;

  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 44], 
    popupAnchor: [0, -44]
  });
};

// --- AUTO ZOOM (Tetap Sama) ---
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

// --- KOMPONEN UTAMA ---
export default function RiverMap({ initialData, onViewDetail }: RiverMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [riverGeoJson, setRiverGeoJson] = useState<any>(null);
  const [selectedLoc, setSelectedLoc] = useState<MahakamLocation | null>(null);
  const [timeIndex, setTimeIndex] = useState(0); 

  // --- DATA PROCESSING ---
  const timestamps = useMemo(() => {
      const validLoc = initialData.find(l => l.forecasts && l.forecasts.length > 0);
      if(validLoc && validLoc.forecasts) {
          return validLoc.forecasts.map(f => f.time);
      }
      return [];
  }, [initialData]);

  const displayData = useMemo(() => {
      if (timestamps.length === 0) return initialData;

      return initialData.map(loc => {
          const forecast = loc.forecasts?.[timeIndex];
          if (forecast) {
              return {
                  ...loc,
                  weather: forecast.condition,
                  temp: forecast.temp,
                  iconUrl: forecast.weatherIcon,
                  windSpeed: forecast.windSpeed,
                  windDeg: forecast.windDeg
              };
          }
          return loc;
      });
  }, [initialData, timeIndex, timestamps]);

  // Helper Format Waktu untuk Footer
  const formatFooterTime = (isoString?: string) => {
    if (!isoString) return "-";
    try {
        return new Intl.DateTimeFormat('id-ID', { 
            dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Makassar' 
        }).format(new Date(isoString)) + " WITA";
    } catch (e) { return "-" }
  }

  useEffect(() => {
    setIsMounted(true);
    fetch('/maps/alur-mahakam.geojson')
      .then(res => res.json())
      .then(data => setRiverGeoJson(data))
      .catch(err => console.error("GeoJSON Error:", err));
  }, []);

  useEffect(() => {
      if (selectedLoc) {
          const updatedLoc = displayData.find(l => l.id === selectedLoc.id);
          if (updatedLoc) {
              setSelectedLoc(updatedLoc);
          }
      }
  }, [timeIndex, displayData]);

  // --- 2. MEMOIZE GEOJSON (Biar gak di-render ulang terus) ---
  const riverCoreStyle = { color: '#2563eb', weight: 3, opacity: 1, lineCap: 'round' as const, lineJoin: 'round' as const };
  
  const geoJsonLayers = useMemo(() => {
    if (!riverGeoJson) return null;
    return (
      <>
        <GeoJSON data={riverGeoJson} style={riverCoreStyle} />
      </>
    );
  }, [riverGeoJson]);

  // --- KUNCI MARKER AGAR TIDAK RENDER ULANG SIA-SIA ---
const renderedMarkers = useMemo(() => {
  return displayData.map((loc) => {
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
  });
}, [displayData, selectedLoc]); // Hanya render ulang jika data berubah atau ada titik yang diklik

  if (!isMounted) return <div className="h-[500px] w-full animate-pulse rounded-2xl bg-slate-100" />;

  return (
    <div className="w-full relative z-0">
      
      <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl relative group bg-slate-50">
        
        {/* --- KONTROL TIMELINE --- */}
        {timestamps.length > 0 && (
            <ForecastControl 
                timestamps={timestamps}
                selectedIndex={timeIndex}
                onSelect={setTimeIndex}
            />
        )}

        {/* --- INFO WINDOW --- */}
        <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                     <Info className="w-3 h-3" /> INFO CUACA
                </h4>
                {selectedLoc && (
                    <button onClick={() => setSelectedLoc(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {selectedLoc ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-blue-900 font-bold leading-tight text-sm mb-1">{selectedLoc.name}</div>
                    <div className="text-gray-500 text-xs font-medium mb-3 pb-2 border-b border-gray-100">{selectedLoc.regency}</div>

                    <div className="flex flex-col gap-2">
                        {/* 1. Kondisi Cuaca */}
                        <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <span className="text-gray-500">Kondisi:</span>
                            <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                {selectedLoc.weather}
                            </span>
                        </div>

                        {/* 2. Grid Suhu & Angin */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-1 text-gray-400 mb-1">
                                    <Thermometer className="w-3 h-3" /> <span>Suhu</span>
                                </div>
                                <span className="font-medium text-gray-700 text-sm">{selectedLoc.temp}°C</span>
                            </div>
                            <div className="flex flex-col text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-1 text-gray-400 mb-1">
                                    <Wind className="w-3 h-3" /> <span>Angin</span>
                                </div>
                                <span className="font-medium text-gray-700 text-sm">{selectedLoc.windSpeed} km/j</span>
                            </div>
                        </div>

                        {/* 3. Koordinat */}
                        <div className="flex flex-col gap-1 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-1 text-gray-400 mb-1">
                                <Compass className="w-3 h-3" /><span>Koordinat</span>
                            </div>
                            <div className="flex justify-between font-mono text-[11px] text-gray-600 font-semibold">
                                <span>Lat: {selectedLoc.lat.toFixed(4)}</span>
                                <span>Lon: {selectedLoc.lng.toFixed(4)}</span>
                            </div>
                        </div>

                        {/* 4. Waktu */}
                        <div className="text-[10px] text-center text-gray-400 mt-1 flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {timestamps[timeIndex] ? formatFooterTime(timestamps[timeIndex]) : "-"}
                        </div>

                        {/* Tombol Detail */}
                        {onViewDetail && (
                            <button 
                                onClick={() => onViewDetail(selectedLoc)}
                                className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Maximize className="w-3 h-3" /> Detail Lengkap
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-gray-400 text-xs italic py-4 text-center">
                    Arahkan kursor atau klik titik pada peta untuk melihat detail cuaca.
                </div>
            )}
        </div>

        {/* --- 3. MAP DENGAN preferCanvas --- */}
        <MapContainer 
          preferCanvas={true}
          center={[-0.502, 117.153]} 
          zoom={9} 
          scrollWheelZoom={true} 
          className="h-full w-full z-0 "
          zoomControl={false}
        >
            <TileLayer 
                attribution='&copy; CARTO' 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
            />

            {geoJsonLayers}
            <SetBounds coords={initialData.map(l => [l.lat, l.lng])} />

            {/* Panggil marker yang sudah dikunci memorinya di sini! */}
            {renderedMarkers}

        </MapContainer>
        
      </div>
    </div>
  );
}