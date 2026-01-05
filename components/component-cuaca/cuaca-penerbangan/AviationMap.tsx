"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useMemo, useRef } from "react";
import { ParsedMetar } from "@/lib/bmkg/aviation-utils";
import { 
  Layers, RefreshCw, ChevronLeft, ChevronRight, Globe, Loader2, 
  Map as MapIcon, AlertTriangle, Eye, EyeOff 
} from "lucide-react";

// --- KONSTANTA: WARNA BAHAYA SIGMET ---
const HAZARD_COLORS: Record<string, string> = {
    TS: "#ef4444",   // Red (Thunderstorm)
    TURB: "#f59e0b", // Orange (Turbulence)
    ICE: "#06b6d4",  // Cyan (Icing)
    VA: "#64748b",   // Slate (Volcanic Ash)
    TC: "#d946ef",   // Magenta (Tropical Cyclone)
    MTW: "#8b5cf6",  // Violet (Mountain Wave)
    DS: "#a8a29e",   // Brownish (Dust Storm)
    SS: "#a8a29e",   // Sand (Sand Storm)
};

// --- 1. HELPER ICONS & PATHS ---

const createPlaneIcon = (color: string, rotation: number = 0) => {
    return L.divIcon({
        className: "custom-plane-icon",
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transform: rotate(${rotation}deg);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="m5 12 3-5m11 5-3-5"/><path d="m4 19 3-2.5"/><path d="m20 19-3-2.5"/></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });
};

const createRadarIcon = () => {
    return L.divIcon({
        className: "radar-beacon",
        html: `<div class="relative flex items-center justify-center w-6 h-6"><span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const getCurvedPath = (start: [number, number], end: [number, number]) => {
    const lat1 = start[0], lng1 = start[1], lat2 = end[0], lng2 = end[1];
    const midLat = (lat1 + lat2) / 2, midLng = (lng1 + lng2) / 2;
    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    const curvature = dist * 0.15;
    const path = [];
    for (let t = 0; t <= 1; t += 0.02) {
        path.push([(1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * (midLat + curvature) + t * t * lat2, (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2] as [number, number]);
    }
    return path;
};

// --- 2. DATE & TIME HELPERS ---
const formatDateToRadar = (date: Date) => { const pad = (n: number) => String(n).padStart(2, '0'); return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`; };
const formatDateToSatellite = (date: Date) => { const pad = (n: number) => String(n).padStart(2, '0'); return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:00Z`; };
const formatDisplayTime = (date: Date) => { const pad = (n: number) => String(n).padStart(2, '0'); return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`; };
const getInitialDate = () => { const now = new Date(); now.setMinutes(now.getMinutes() - 10); now.setMinutes(now.getMinutes() - (now.getMinutes() % 10)); return now; };

// --- 3. LOGIC WARNA VISIBILITAS ---
const getVisibilityColor = (visibilityStr: string) => {
    if (!visibilityStr) return '#64748b'; 
    const cleanString = visibilityStr.toString().replace(/[^0-9.]/g, '');
    let vis = parseFloat(cleanString);
    if (isNaN(vis)) return '#64748b'; 
    if (vis === 9999) vis = 10; else if (vis > 50) vis = vis / 1000;
    if (vis > 8) return '#22c55e'; if (vis >= 4.8) return '#06b6d4'; if (vis >= 1.6) return '#eab308'; return '#ef4444';
};

const AutoZoom = ({ data }: { data: ParsedMetar[] }) => {
    const map = useMap();
    useEffect(() => { if (data.length > 0) { const bounds = L.latLngBounds(data.map(d => [parseFloat(d.latitude), parseFloat(d.longitude)])); map.fitBounds(bounds, { padding: [50, 50] }); } }, [data, map]);
    return null;
};

// --- COMPONENT UTAMA ---

interface MapProps {
    airports: ParsedMetar[];
    onSelect: (icao: string) => void;
    selectedIcao: string;
}

export default function AviationMap({ airports, onSelect, selectedIcao }: MapProps) {
    // State Layers (Default: Boundary ON, Sigmet ON)
    const [showRadar, setShowRadar] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [showBoundary, setShowBoundary] = useState(true);
    const [showSigmet, setShowSigmet] = useState(true); 
    const [isLayerLoading, setIsLayerLoading] = useState(false);

    // State Data
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [sigmetData, setSigmetData] = useState<any>(null); 
    const [radarDate, setRadarDate] = useState<Date | null>(null);
    const [satelliteDate, setSatelliteDate] = useState<Date | null>(null);
    const loadingCount = useRef(0);

    // Handler Loading Tile (Stabil)
    const tileHandlers = useMemo(() => ({
        loading: () => { loadingCount.current += 1; if (loadingCount.current === 1) setIsLayerLoading(true); },
        load: () => { loadingCount.current -= 1; if (loadingCount.current < 0) loadingCount.current = 0; if (loadingCount.current === 0) setIsLayerLoading(false); },
        tileerror: () => { loadingCount.current -= 1; if (loadingCount.current < 0) loadingCount.current = 0; if (loadingCount.current === 0) setIsLayerLoading(false); }
    }), []);

    // URL Generator
    const radarBuster = radarDate ? radarDate.getTime() : 0;
    const satelliteUrlString = satelliteDate ? formatDateToSatellite(satelliteDate) : "";
    const radarUrlString = radarDate ? formatDateToRadar(radarDate) : "";

    // Fetch Data on Mount
    useEffect(() => {
        const initTime = getInitialDate();
        setRadarDate(new Date(initTime));
        setSatelliteDate(new Date(initTime));

        // Ambil Peta Indonesia
        fetch('/maps/indonesia.geojson').then(res => res.json()).then(setGeoJsonData).catch(console.error);
        
        // Ambil Data SIGMET dari Proxy
        fetch('/api/sigmet-proxy').then(res => res.json()).then(setSigmetData).catch(console.error);
    }, []);

    const adjustRadarTime = (minutes: number) => { if (!radarDate) return; const d = new Date(radarDate); d.setMinutes(d.getMinutes() + minutes); setRadarDate(d); };
    const adjustSatelliteTime = (minutes: number) => { if (!satelliteDate) return; const d = new Date(satelliteDate); d.setMinutes(d.getMinutes() + minutes); setSatelliteDate(d); };

    // --- SIGMET STYLING ---
    const sigmetStyle = (feature: any) => {
        const color = HAZARD_COLORS[feature.properties.hazard] || '#94a3b8';
        return { color, weight: 2, opacity: 1, fillColor: color, fillOpacity: 0.2 };
    };
    
    // Tooltip interaktif saat hover area SIGMET
    const onEachSigmet = (feature: any, layer: any) => {
        const p = feature.properties;
        const color = HAZARD_COLORS[p.hazard] || '#ccc';
        const content = `
            <div class="font-sans text-xs w-[250px]">
                <div class="font-bold text-sm mb-1 flex items-center gap-2">
                    <span style="background-color: ${color}; width: 10px; height: 10px; border-radius: 2px;"></span>
                    ${p.hazard} ${p.qualifier || ''}
                </div>
                <div class="grid grid-cols-2 gap-x-2 text-slate-600 mb-1">
                    <span><b>Vert:</b>  ${p.top === 0 ? "SFC" : "FL"+Math.round(p.top/100)}</span>
                    <span><b>Mov:</b> ${p.dir || '-'}</span>
                </div>
                <div class="p-1 bg-slate-100 rounded border border-slate-200 font-mono text-[9px] text-slate-700 break-words whitespace-pre-wrap">
                    ${p.rawSigmet}
                </div>
            </div>`;
        layer.bindTooltip(content, { sticky: true, opacity: 0.95, className: 'custom-leaflet-tooltip' });
    };

    const wals = airports.find(a => a.icao_id === 'WALS');
    const selected = airports.find(a => a.icao_id === selectedIcao);
    const routePositions = (wals && selected && selectedIcao !== 'WALS') ? getCurvedPath([parseFloat(wals.latitude), parseFloat(wals.longitude)], [parseFloat(selected.latitude), parseFloat(selected.longitude)]) : null;

    return (
        <div className="h-[600px] md:h-[750px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative bg-slate-900 group">
            
            {/* Global Styles for Leaflet customization */}
            <style jsx global>{`
                .flight-path-animated { stroke-dasharray: 10, 10; stroke-dashoffset: 200; animation: dash 3s linear infinite; filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6)); }
                @keyframes dash { to { stroke-dashoffset: 0; } }
                .leaflet-container { background-color: #0f172a !important; }
                .custom-leaflet-tooltip { border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 8px; }
            `}</style>

            {/* --- UNIFIED LAYER CONTROL PANEL (KANAN ATAS) --- */}
            <div className="absolute top-4 right-4 z-[1000] w-[260px] flex flex-col gap-2 font-sans">
                
                {/* Panel Utama */}
                <div className="bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl overflow-hidden divide-y divide-slate-800">
                    
                    {/* Header Panel */}
                    <div className="bg-slate-800/50 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5" /> Map Layers
                        </div>
                        {isLayerLoading && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                    </div>

                    {/* 1. BATAS WILAYAH (Boundary Toggle) */}
                    <div className="p-2">
                        <button 
                            onClick={() => setShowBoundary(!showBoundary)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showBoundary ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <MapIcon className="w-4 h-4" />
                                <span className="text-xs font-medium">Flight Information Regions</span>
                            </div>
                            {showBoundary ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                    </div>

                    {/* 2. SIGMET Toggle & Legend */}
                    <div className="p-2">
                        <button 
                            onClick={() => setShowSigmet(!showSigmet)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showSigmet ? 'bg-red-900/30 text-red-200 border border-red-900/50' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-xs font-medium">SIGMET</span>
                            </div>
                            {showSigmet ? <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Expandable Legend untuk SIGMET (Muncul jika ON) */}
                        {showSigmet && (
                            <div className="mt-2 pl-9 pr-2 pb-1 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1">
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#ef4444]"></span><span className="text-[9px] text-slate-400">Thunderstorm</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#f59e0b]"></span><span className="text-[9px] text-slate-400">Turbulence</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#06b6d4]"></span><span className="text-[9px] text-slate-400">Icing</span></div>
                                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#64748b]"></span><span className="text-[9px] text-slate-400">Volcanic Ash</span></div>
                            </div>
                        )}
                    </div>

                    {/* 3. RADAR Toggle & Time Controls */}
                    <div className="p-2">
                        <button 
                            onClick={() => setShowRadar(!showRadar)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showRadar ? 'bg-blue-900/30 text-blue-200 border border-blue-900/50' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Layers className="w-4 h-4" />
                                <span className="text-xs font-medium">Rain Radar</span>
                            </div>
                            {showRadar ? <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Expandable Controls untuk Radar (Muncul jika ON) */}
                        {showRadar && radarDate && (
                            <div className="mt-2 p-2 bg-slate-800/50 rounded-lg animate-in slide-in-from-top-1 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <button onClick={() => adjustRadarTime(-5)} className="p-1 hover:bg-slate-700 rounded text-slate-400"><ChevronLeft className="w-3 h-3" /></button>
                                    <span className="font-mono text-[10px] text-blue-200 font-bold">{formatDisplayTime(radarDate)}</span>
                                    <button onClick={() => adjustRadarTime(5)} className="p-1 hover:bg-slate-700 rounded text-slate-400"><ChevronRight className="w-3 h-3" /></button>
                                    <button onClick={() => setRadarDate(getInitialDate())} className="ml-1 text-slate-500 hover:text-white" title="Live"><RefreshCw className="w-3 h-3" /></button>
                                </div>
                                <div className="h-1.5 w-full rounded-full border border-white/10 opacity-80" style={{background: `linear-gradient(to right, #00FFFF, #0000FF, #00FF00, #FFFF00, #FF0000, #800080)`}}></div>
                            </div>
                        )}
                    </div>

                    {/* 4. SATELLITE Toggle & Time Controls */}
                    <div className="p-2">
                        <button 
                            onClick={() => setShowSatellite(!showSatellite)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showSatellite ? 'bg-purple-900/30 text-purple-200 border border-purple-900/50' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4" />
                                <span className="text-xs font-medium">Satellite (Himawari)</span>
                            </div>
                            {showSatellite ? <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Expandable Controls untuk Satelit (Muncul jika ON) */}
                        {showSatellite && satelliteDate && (
                            <div className="mt-2 p-2 bg-slate-800/50 rounded-lg animate-in slide-in-from-top-1 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <button onClick={() => adjustSatelliteTime(-10)} className="p-1 hover:bg-slate-700 rounded text-slate-400"><ChevronLeft className="w-3 h-3" /></button>
                                    <span className="font-mono text-[10px] text-purple-200 font-bold">{formatDisplayTime(satelliteDate)}</span>
                                    <button onClick={() => adjustSatelliteTime(10)} className="p-1 hover:bg-slate-700 rounded text-slate-400"><ChevronRight className="w-3 h-3" /></button>
                                    <button onClick={() => setSatelliteDate(getInitialDate())} className="ml-1 text-slate-500 hover:text-white" title="Live"><RefreshCw className="w-3 h-3" /></button>
                                </div>
                                <div className="h-1.5 w-full rounded-full border border-white/10 opacity-80" style={{background: `linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #0000FF)`}}></div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* --- MAP CONTAINER --- */}
            <MapContainer center={[0, 117]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                
                {/* Base Map Dark Mode */}
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />

                {/* Layer 1: Batas Wilayah Indonesia */}
                {showBoundary && geoJsonData && (
                    <GeoJSON data={geoJsonData} style={{ color: '#ffffff', weight: 0.9, opacity: 1, fillColor: 'transparent' }} />
                )}

                {/* Layer 2: SIGMET (Hazard Areas) */}
                {showSigmet && sigmetData && (
                    <GeoJSON key="sigmet-layer" data={sigmetData} style={sigmetStyle} onEachFeature={onEachSigmet} />
                )}

                {/* Layer 3: Satelit Himawari */}
                {showSatellite && satelliteUrlString && (
                    <TileLayer key={`sat-${satelliteUrlString}`} url={`/api/satellite-proxy?baserun=${satelliteUrlString}&z={z}&x={x}&y={y}`} tms={true} opacity={0.6} zIndex={5} maxZoom={10} minZoom={3} eventHandlers={tileHandlers} />
                )}

                {/* Layer 4: Rain Radar */}
                {showRadar && radarUrlString && (
                    <TileLayer key={`radar-${radarUrlString}`} url={`/api/radar-proxy?time=${radarUrlString}&z={z}&x={x}&y={y}&_t=${radarBuster}`} tms={true} opacity={0.8} zIndex={10} maxZoom={10} minZoom={4} eventHandlers={tileHandlers} />
                )}

                <AutoZoom data={airports} />

                {/* Rute Penerbangan (Curve) */}
                {routePositions && (
                    <>
                        <Polyline positions={routePositions} pathOptions={{ color: '#1e3a8a', weight: 4, opacity: 0.5 }} />
                        <Polyline positions={routePositions} pathOptions={{ color: '#60a5fa', weight: 2, className: 'flight-path-animated' }} />
                        {selected && <Marker position={[parseFloat(selected.latitude), parseFloat(selected.longitude)]} icon={createRadarIcon()} zIndexOffset={1000} />}
                    </>
                )}

                {/* Marker Bandara */}
                {airports.map((apt) => {
                    if (routePositions && selectedIcao === apt.icao_id) return null;
                    return (
                        <Marker key={apt.icao_id} position={[parseFloat(apt.latitude), parseFloat(apt.longitude)]} icon={createPlaneIcon(getVisibilityColor(apt.visibility), 0)} eventHandlers={{ click: () => onSelect(apt.icao_id) }} opacity={selectedIcao && selectedIcao !== apt.icao_id && apt.icao_id !== 'WALS' ? 0.8 : 1}>
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