"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { ParsedMetar } from "@/lib/bmkg/aviation-utils";
import { Layers, RefreshCw, ChevronLeft, ChevronRight, Globe, Map as MapIcon } from "lucide-react";

// --- 1. ICON PESAWAT ---
const createPlaneIcon = (color: string, rotation: number = 0) => {
    return L.divIcon({
      className: "custom-plane-icon",
      html: `
        <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transform: rotate(${rotation}deg);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="m5 12 3-5m11 5-3-5"/><path d="m4 19 3-2.5"/><path d="m20 19-3-2.5"/></svg>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
};

// --- 2. ICON RADAR BEACON ---
const createRadarIcon = () => {
    return L.divIcon({
        className: "radar-beacon",
        html: `
            <div class="relative flex items-center justify-center w-6 h-6">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

// --- 3. HELPER PATH ---
const getCurvedPath = (start: [number, number], end: [number, number]) => {
    const lat1 = start[0];
    const lng1 = start[1];
    const lat2 = end[0];
    const lng2 = end[1];
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    const curvature = dist * 0.15; 
    const path = [];
    for (let t = 0; t <= 1; t += 0.02) { 
        path.push([
            (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * (midLat + curvature) + t * t * lat2,
            (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2
        ] as [number, number]);
    }
    return path;
};

// --- 4. DATE HELPERS ---
const formatDateToRadar = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`;
};

const formatDateToSatellite = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:00Z`;
};

const formatDisplayTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
};

const getInitialDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 10); 
    now.setMinutes(now.getMinutes() - (now.getMinutes() % 10)); 
    return now;
};

// --- 5. COLOR HELPER (NEW LOGIC) ---
// Logika warna berdasarkan Visibility (Sama dengan Dashboard)
const getVisibilityColor = (visibilityStr: string) => {
    const vis = parseFloat(visibilityStr);
    
    if (isNaN(vis)) return '#64748b'; // Slate (No Data)

    if (vis > 8) return '#22c55e';      // Green-500
    if (vis >= 4.8) return '#06b6d4';   // Cyan-500
    if (vis >= 1.6) return '#eab308';   // Yellow-500
    return '#ef4444';                   // Red-500
};

const AutoZoom = ({ data }: { data: ParsedMetar[] }) => {
    const map = useMap();
    useEffect(() => {
      if (data.length > 0) {
        const bounds = L.latLngBounds(data.map(d => [parseFloat(d.latitude), parseFloat(d.longitude)]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [data, map]);
    return null;
};

interface MapProps {
    airports: ParsedMetar[];
    onSelect: (icao: string) => void;
    selectedIcao: string;
}

export default function AviationMap({ airports, onSelect, selectedIcao }: MapProps) {
  // State Layers
  const [showRadar, setShowRadar] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showBoundary, setShowBoundary] = useState(true); 
  
  // State Data
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [radarDate, setRadarDate] = useState<Date | null>(null);
  const [satelliteDate, setSatelliteDate] = useState<Date | null>(null);

  // Init Data & Waktu
  useEffect(() => {
      const initTime = getInitialDate();
      setRadarDate(new Date(initTime));
      setSatelliteDate(new Date(initTime));

      fetch('/maps/indonesia.geojson')
        .then(res => res.json())
        .then(data => setGeoJsonData(data))
        .catch(err => console.error("Gagal memuat GeoJSON:", err));
  }, []);

  const adjustRadarTime = (minutes: number) => {
      if (!radarDate) return;
      const newDate = new Date(radarDate);
      newDate.setMinutes(newDate.getMinutes() + minutes);
      setRadarDate(newDate);
  };

  const adjustSatelliteTime = (minutes: number) => {
      if (!satelliteDate) return;
      const newDate = new Date(satelliteDate);
      newDate.setMinutes(newDate.getMinutes() + minutes);
      setSatelliteDate(newDate);
  };

  const wals = airports.find(a => a.icao_id === 'WALS');
  const selected = airports.find(a => a.icao_id === selectedIcao);
  const routePositions = (wals && selected && selectedIcao !== 'WALS') 
    ? getCurvedPath([parseFloat(wals.latitude), parseFloat(wals.longitude)], [parseFloat(selected.latitude), parseFloat(selected.longitude)]) : null;

  const radarUrlString = radarDate ? formatDateToRadar(radarDate) : "";
  const satelliteUrlString = satelliteDate ? formatDateToSatellite(satelliteDate) : "";

  return (
    <div className="h-[600px] md:h-[750px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative bg-slate-900 group transition-all duration-500">
      
      <style jsx global>{`
        .flight-path-animated { stroke-dasharray: 10, 10; stroke-dashoffset: 200; animation: dash 3s linear infinite; filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6)); }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .leaflet-container { background-color: #0f172a !important; }
      `}</style>

      {/* --- FLOATING CONTROLS --- */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-3">
          
          {/* Toggle Buttons Group */}
          <div className="flex gap-2">
            {/* Tombol Batas Wilayah */}
            <button 
                onClick={() => setShowBoundary(!showBoundary)} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold shadow-lg transition-all border ${showBoundary ? 'bg-slate-600 text-white border-slate-500' : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'}`}
                title="Tampilkan Batas Wilayah Indonesia"
            >
                <MapIcon className="w-3 h-3" /> {showBoundary ? 'Batas: ON' : 'Batas: OFF'}
            </button>

            {/* Tombol Satelit */}
            <button 
                onClick={() => setShowSatellite(!showSatellite)} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold shadow-lg transition-all border ${showSatellite ? 'bg-purple-600 text-white border-purple-500' : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'}`}
            >
                <Globe className="w-3 h-3" /> {showSatellite ? 'Sat: ON' : 'Sat: OFF'}
            </button>

            {/* Tombol Radar */}
            <button 
                onClick={() => setShowRadar(!showRadar)} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold shadow-lg transition-all border ${showRadar ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'}`}
            >
                <Layers className="w-3 h-3" /> {showRadar ? 'Radar: ON' : 'Radar: OFF'}
            </button>
          </div>

          {/* Unified Control Card */}
          {(showRadar || showSatellite) && (
            <div className="bg-slate-900/95 backdrop-blur text-white rounded-xl border border-slate-700 shadow-2xl flex flex-col w-[260px] divide-y divide-slate-700 overflow-hidden animate-in fade-in slide-in-from-right-3">
                
                {/* --- RADAR CONTROLS --- */}
                {showRadar && radarDate && (
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Layers className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Rain Radar</span>
                            </div>
                            <button onClick={() => setRadarDate(getInitialDate())} className="text-slate-500 hover:text-white transition-colors" title="Reset"><RefreshCw className="w-3 h-3" /></button>
                        </div>

                        <div className="flex items-center justify-between bg-slate-800 rounded-lg p-1 border border-slate-700 mb-2">
                            <button onClick={() => adjustRadarTime(-5)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                            <div className="font-mono text-white font-bold text-xs">{formatDisplayTime(radarDate)}</div>
                            <button onClick={() => adjustRadarTime(5)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>

                        {/* Legend Radar (dBZ) */}
                        <div>
                            <div className="h-3 w-full rounded-sm mb-1 border border-white/10" style={{background: `linear-gradient(to right, #00FFFF 0%, #0080FF 8.3%, #0000FF 16.6%, #00FF00 25%, #80FF00 33.3%, #FFFF00 41.6%, #FFC000 50%, #FF8000 58.3%, #FF4000 66.6%, #FF0000 75%, #C00000 83.3%, #FF00FF 91.6%, #800080 100%)`}}></div>
                            <div className="flex justify-between text-[8px] text-slate-300 font-mono font-bold px-0.5">
                                <span>5</span><span>15</span><span>25</span><span>35</span><span>45</span><span>55</span><span>65</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SATELLITE CONTROLS --- */}
                {showSatellite && satelliteDate && (
                    <div className="p-3 bg-slate-800/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Globe className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Himawari-9</span>
                            </div>
                            <button onClick={() => setSatelliteDate(getInitialDate())} className="text-slate-500 hover:text-white transition-colors" title="Reset"><RefreshCw className="w-3 h-3" /></button>
                        </div>

                        <div className="flex items-center justify-between bg-slate-800 rounded-lg p-1 border border-slate-700 mb-2">
                            <button onClick={() => adjustSatelliteTime(-10)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                            <div className="font-mono text-white font-bold text-xs">{formatDisplayTime(satelliteDate)}</div>
                            <button onClick={() => adjustSatelliteTime(10)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>

                        {/* Legend Satelit */}
                        <div>
                            <div className="h-3 w-full rounded-sm mb-1 border border-white/10" style={{background: `linear-gradient(to right, #FF0000 0%, #FF8000 15%, #FFFF00 30%, #80FF00 45%, #00FF00 60%, #00FFFF 75%, #0000FF 90%, #000080 100%)`}}></div>
                            <div className="flex justify-between text-[8px] text-slate-300 font-mono font-bold px-0.5">
                                <span>-100</span><span>-75</span><span>-50</span><span>-25</span><span>0</span><span>+20</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="px-3 py-1.5 bg-slate-950/50 text-[9px] text-slate-500 text-center italic border-t border-slate-800">
                    *Geser waktu {"(<<)"} jika peta kosong
                </div>
            </div>
          )}
      </div>

      <MapContainer center={[0, 117]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />

        {/* --- LAYER GEOJSON BATAS INDONESIA --- */}
        {showBoundary && geoJsonData && (
            <GeoJSON 
                data={geoJsonData}
                style={{
                    color: '#ffffff',       // Warna Putih
                    weight: 0.9,            // Sangat Tipis
                    opacity: 1,           
                    fillColor: 'transparent', // FIX: HARUS TRANSPARAN AGAR PETA TERLIHAT
                }}
            />
        )}

        {/* --- LAYER SATELIT --- */}
        {showSatellite && satelliteUrlString && (
            <TileLayer
                key={`sat-${satelliteUrlString}`}
                url={`/api/satellite-proxy?baserun=${satelliteUrlString}&z={z}&x={x}&y={y}`}
                tms={true} 
                opacity={0.6}
                zIndex={5}    
                maxZoom={10}
                minZoom={3}
                errorTileUrl="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            />
        )}
        
        {/* --- LAYER RADAR --- */}
        {showRadar && radarUrlString && (
            <TileLayer
                key={`radar-${radarUrlString}`}
                url={`/api/radar-proxy?time=${radarUrlString}&z={z}&x={x}&y={y}&_t=${new Date().getTime()}`}
                tms={true} 
                opacity={0.8}
                zIndex={10}    
                maxZoom={10}
                minZoom={4}
                errorTileUrl="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            />
        )}

        <AutoZoom data={airports} />

        {routePositions && (
            <>
                <Polyline positions={routePositions} pathOptions={{ color: '#1e3a8a', weight: 4, opacity: 0.5 }} />
                <Polyline positions={routePositions} pathOptions={{ color: '#60a5fa', weight: 2, className: 'flight-path-animated' }} />
                {selected && <Marker position={[parseFloat(selected.latitude), parseFloat(selected.longitude)]} icon={createRadarIcon()} zIndexOffset={1000} />}
            </>
        )}

        {airports.map((apt) => {
            if (routePositions && selectedIcao === apt.icao_id) return null;
            return (
                <Marker 
                    key={apt.icao_id}
                    position={[parseFloat(apt.latitude), parseFloat(apt.longitude)]}
                    // IMPLEMENTASI WARNA BARU DISINI
                    icon={createPlaneIcon(getVisibilityColor(apt.visibility), 0)}
                    eventHandlers={{ click: () => onSelect(apt.icao_id) }}
                    opacity={selectedIcao && selectedIcao !== apt.icao_id && apt.icao_id !== 'WALS' ? 0.8 : 1}
                >
                    <Tooltip direction="top" offset={[0, -15]} opacity={1} permanent={selectedIcao === apt.icao_id || apt.icao_id === 'WALS'}>
                        <div className="text-center font-bold text-xs text-slate-800">{apt.icao_id}</div>
                    </Tooltip>
                </Marker>
            );
        })}
      </MapContainer>
    </div>
  );
}