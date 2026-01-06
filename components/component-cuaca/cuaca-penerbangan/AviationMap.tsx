"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useMemo, useRef } from "react";
import { ParsedMetar } from "@/lib/bmkg/aviation-utils";
import { 
  Layers, RefreshCw, ChevronLeft, ChevronRight, Globe, Loader2, 
  Map as MapIcon, AlertTriangle, Eye, EyeOff, ChevronsRight, Settings2,
  Play, Pause
} from "lucide-react";

import { 
  getPlaneIconHtml, getRadarIconHtml, getCurvedPath, 
  formatDateToRadar, formatDateToSatellite, formatDisplayTime, 
  getVisibilityColor, getSigmetStyle, getSigmetTooltipContent 
} from "@/lib/bmkg/aviation-utils";

// Import Hook Baru
import { useTimeAnimation } from "@/hooks/use-time-animation";

// --- CLIENT-SIDE ICONS ---
const createPlaneIcon = (color: string, rotation: number = 0) => L.divIcon({
    className: "custom-plane-icon",
    html: getPlaneIconHtml(color, rotation),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const createRadarIcon = () => L.divIcon({
    className: "radar-beacon",
    html: getRadarIconHtml(),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// --- SUB-COMPONENT: TIME CONTROL BAR (Reusable) ---
interface TimeControlProps {
    steps: Date[];
    currentIndex: number;
    isPlaying: boolean;
    onPlayToggle: () => void;
    onSeek: (index: number) => void;
    label: string; 
    color: string; // "blue" | "purple"
}

const TimeAnimationControl = ({ steps, currentIndex, isPlaying, onPlayToggle, onSeek, label, color }: TimeControlProps) => {
    const currentTime = steps[currentIndex];
    const percent = (currentIndex / (steps.length - 1)) * 100;
    
    // Tailwind dynamic colors helpers
    const bgThumb = color === 'blue' ? 'bg-blue-500' : 'bg-purple-500';
    const shadowThumb = color === 'blue' ? 'shadow-[0_0_8px_#3b82f6]' : 'shadow-[0_0_8px_#a855f7]';
    const textCol = color === 'blue' ? 'text-blue-200' : 'text-purple-200';

    return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-xl mb-2 last:mb-0 w-full animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
                {/* Play Button */}
                <button 
                    onClick={onPlayToggle}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all border border-white/10 ${isPlaying ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                    {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                </button>

                {/* Info Label (Vertical Stack) */}
                <div className="flex flex-col w-24 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${bgThumb} ${shadowThumb}`}></span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${textCol}`}>{label}</span>
                    </div>
                    <span className="text-[10px] text-white font-mono font-bold leading-tight">
                        {currentTime ? formatDisplayTime(currentTime) : "--:--"}
                    </span>
                </div>

                {/* Slider */}
                <div className="relative flex-1 h-6 flex items-center group">
                    <div className="absolute left-0 right-0 h-1 bg-slate-700 rounded-full"></div>
                    <div className="absolute left-0 h-1 bg-white/30 rounded-full" style={{ width: `${percent}%` }}></div>
                    
                    <input 
                        type="range" 
                        min={0} 
                        max={steps.length - 1} 
                        value={currentIndex}
                        onChange={(e) => onSeek(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {/* Thumb */}
                    <div 
                        className={`absolute w-3 h-3 bg-white rounded-full border border-slate-900 shadow transition-transform pointer-events-none z-0 ${isPlaying ? 'scale-110' : ''}`}
                        style={{ left: `calc(${percent}% - 6px)` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT AUTO ZOOM ---
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

// --- COMPONENT UTAMA ---
interface MapProps {
    airports: ParsedMetar[];
    onSelect: (icao: string) => void;
    selectedIcao: string;
}

export default function AviationMap({ airports, onSelect, selectedIcao }: MapProps) {
    // --- LAYER STATES (INDEPENDENT) ---
    const [showRadar, setShowRadar] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [showBoundary, setShowBoundary] = useState(true);
    const [showSigmet, setShowSigmet] = useState(false); 
    
    // --- ANIMATION HOOKS (INDEPENDENT) ---
    // Radar: Interval 5 menit, Durasi 60 menit ke belakang
    const radarAnim = useTimeAnimation(5, 60, 2500);
    // Satelit: Interval 10 menit, Durasi 120 menit ke belakang
    const satAnim = useTimeAnimation(10, 120, 2500);

    // --- UI STATES ---
    const [isLayerLoading, setIsLayerLoading] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    
    // --- DATA STATES ---
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [sigmetData, setSigmetData] = useState<any>(null); 
    const loadingCount = useRef(0);

    // --- INIT ---
    useEffect(() => {
        fetch('/maps/indonesia.geojson').then(res => res.json()).then(setGeoJsonData).catch(console.error);
        if (window.innerWidth < 768) setIsPanelOpen(false);
    }, []);

    // Lazy Load SIGMET
    useEffect(() => {
        if (showSigmet && !sigmetData) {
            setIsLayerLoading(true);
            fetch('/api/sigmet-proxy')
                .then(res => res.json())
                .then(data => { setSigmetData(data); setIsLayerLoading(false); })
                .catch(err => { console.error(err); setIsLayerLoading(false); });
        }
    }, [showSigmet, sigmetData]);

    // URL Helpers
    const radarBuster = radarAnim.currentDate ? radarAnim.currentDate.getTime() : 0;
    const radarUrlString = radarAnim.currentDate ? formatDateToRadar(radarAnim.currentDate) : "";
    
    const satelliteUrlString = satAnim.currentDate ? formatDateToSatellite(satAnim.currentDate) : "";

    // Tile Load Handlers
    const tileHandlers = useMemo(() => ({
        loading: () => { loadingCount.current += 1; if (loadingCount.current === 1) setIsLayerLoading(true); },
        load: () => { loadingCount.current -= 1; if (loadingCount.current < 0) loadingCount.current = 0; if (loadingCount.current === 0) setIsLayerLoading(false); },
        tileerror: () => { loadingCount.current -= 1; if (loadingCount.current < 0) loadingCount.current = 0; if (loadingCount.current === 0) setIsLayerLoading(false); }
    }), []);

    // Sigmet Tooltip
    const onEachSigmet = (feature: any, layer: any) => {
        const content = getSigmetTooltipContent(feature.properties);
        layer.bindTooltip(content, { sticky: true, opacity: 0.95, className: 'custom-leaflet-tooltip' });
    };

    const wals = airports.find(a => a.icao_id === 'WALS');
    const selected = airports.find(a => a.icao_id === selectedIcao);
    const routePositions = (wals && selected && selectedIcao !== 'WALS') ? getCurvedPath([parseFloat(wals.latitude), parseFloat(wals.longitude)], [parseFloat(selected.latitude), parseFloat(selected.longitude)]) : null;

    return (
        <div className="h-[600px] md:h-[750px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative bg-slate-900 group">
            
            <style jsx global>{`
                .flight-path-animated { stroke-dasharray: 10, 10; stroke-dashoffset: 200; animation: dash 3s linear infinite; filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6)); }
                @keyframes dash { to { stroke-dashoffset: 0; } }
                .leaflet-container { background-color: #0f172a !important; }
                .custom-leaflet-tooltip { border: none; border-radius: 8px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); padding: 12px; min-width: 250px; }
            `}</style>

            {/* --- RIGHT PANEL (LAYERS) --- */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2 font-sans transition-all duration-300">
                {isPanelOpen ? (
                    <div className="w-[260px] bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl overflow-hidden divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-800/50 p-3 flex items-center justify-between cursor-pointer" onClick={() => setIsPanelOpen(false)}>
                            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider"><Settings2 className="w-3.5 h-3.5" /> Layers</div>
                            <div className="flex items-center gap-2">
                                {isLayerLoading && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                                <button className="text-slate-400 hover:text-white"><ChevronsRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                            {/* 1. Boundary */}
                            <div className="p-2">
                                <button onClick={() => setShowBoundary(!showBoundary)} className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showBoundary ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                                    <div className="flex items-center gap-3"><MapIcon className="w-4 h-4" /><span className="text-xs font-medium">Regions (FIR)</span></div>
                                    {showBoundary ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            {/* 2. SIGMET */}
                            <div className="p-2">
                                <button onClick={() => setShowSigmet(!showSigmet)} className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showSigmet ? 'bg-red-900/30 text-red-200 border border-red-900/50' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}>
                                    <div className="flex items-center gap-3"><AlertTriangle className="w-4 h-4" /><span className="text-xs font-medium">SIGMET Hazards</span></div>
                                    {showSigmet ? <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            {/* 3. RADAR (INDEPENDENT) */}
                            <div className="p-2">
                                <button onClick={() => setShowRadar(!showRadar)} className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showRadar ? 'bg-blue-900/30 text-blue-200 border border-blue-900/50' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}>
                                    <div className="flex items-center gap-3"><Layers className="w-4 h-4" /><span className="text-xs font-medium">Rain Radar</span></div>
                                    {showRadar ? <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            {/* 4. SATELLITE (INDEPENDENT) */}
                            <div className="p-2">
                                <button onClick={() => setShowSatellite(!showSatellite)} className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${showSatellite ? 'bg-purple-900/30 text-purple-200 border border-purple-900/50' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}>
                                    <div className="flex items-center gap-3"><Globe className="w-4 h-4" /><span className="text-xs font-medium">Himawari-9</span></div>
                                    {showSatellite ? <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsPanelOpen(true)} className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl hover:bg-slate-800 text-white transition-all hover:scale-105 active:scale-95 group">
                        <Layers className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    </button>
                )}
            </div>

            {/* --- BOTTOM FLOATING TIME CONTROLS (STACKED) --- */}
            {/* Hanya tampil jika salah satu layer aktif */}
            {(showRadar || showSatellite) && (
                <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-[1000] flex flex-col-reverse gap-2">
                    
                    {/* SATELLITE CONTROL (Ungu) */}
                    {showSatellite && (
                        <TimeAnimationControl 
                            steps={satAnim.steps}
                            currentIndex={satAnim.currentIndex}
                            isPlaying={satAnim.isPlaying}
                            onPlayToggle={satAnim.togglePlay}
                            onSeek={satAnim.seek}
                            label="SATELLITE"
                            color="purple"
                        />
                    )}

                    {/* RADAR CONTROL (Biru) - Di atas jika keduanya aktif agar lebih dekat ke peta */}
                    {showRadar && (
                        <TimeAnimationControl 
                            steps={radarAnim.steps}
                            currentIndex={radarAnim.currentIndex}
                            isPlaying={radarAnim.isPlaying}
                            onPlayToggle={radarAnim.togglePlay}
                            onSeek={radarAnim.seek}
                            label="RADAR"
                            color="blue"
                        />
                    )}
                </div>
            )}

            {/* --- MAP --- */}
            <MapContainer center={[0, 117]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />

                {showBoundary && geoJsonData && <GeoJSON data={geoJsonData} style={{ color: '#ffffff', weight: 0.9, opacity: 1, fillColor: 'transparent' }} />}
                {showSigmet && sigmetData && <GeoJSON key="sigmet-layer" data={sigmetData} style={getSigmetStyle} onEachFeature={onEachSigmet} />}

                {/* SATELLITE LAYER */}
                {showSatellite && satelliteUrlString && (
                    <TileLayer 
                        key={`sat-${satelliteUrlString}`} 
                        url={`/api/satellite-proxy?baserun=${satelliteUrlString}&z={z}&x={x}&y={y}`} 
                        tms={true} opacity={0.6} zIndex={5} maxZoom={10} minZoom={3} eventHandlers={tileHandlers} 
                    />
                )}

                {/* RADAR LAYER */}
                {showRadar && radarUrlString && (
                    <TileLayer 
                        key={`radar-${radarUrlString}`} 
                        url={`/api/radar-proxy?time=${radarUrlString}&z={z}&x={x}&y={y}&_t=${radarBuster}`} 
                        tms={true} opacity={0.8} zIndex={10} maxZoom={10} minZoom={4} eventHandlers={tileHandlers} 
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