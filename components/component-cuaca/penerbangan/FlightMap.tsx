"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { 
  Maximize2, Minimize2, Menu, X 
} from "lucide-react";

// --- CUSTOM HOOKS ---
import { useSigmetLayers } from "@/components/hooks/useSigmetLayers";
import { useAirportWeather } from "@/components/hooks/useAirportWeather";
import { useBoundaryLayers } from "@/components/hooks/useBoundaryLayers";
import { useHimawariData } from "@/components/hooks/useHimawariData";
import { useRadarLatest } from "@/components/hooks/useRadarLatest"; 
import { useTimeMachine } from "@/components/hooks/useTimeMachine"; // IMPORT TIME MACHINE

// --- CUSTOM COMPONENTS ---
import AirportDetailPanel, { AirportData } from "./AirportDetailPanel";
import SigmetDetailPanel, { SigmetProperties } from "./SigmetDetailPanel";
import LayerControlPanel, { BaseMapType, OverlayType } from "./LayerControlPanel";
import TimeControlPanel from "./TimeControlPanel"; // IMPORT PANEL SLIDER

// --- LEAFLET DYNAMIC IMPORTS ---
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), { ssr: false });
const RadarLayer = dynamic(() => import("./Radarlayer"), { ssr: false });
const HimawariLayer = dynamic(() => import("./HimawariLayer"), { ssr: false });

// --- INTERFACES & CONSTANTS ---
interface MapProps { 
  className?: string;
  initialAirports?: AirportData[]; 
}

const BASE_MAPS: Record<BaseMapType, string> = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite_base: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
};

const SIGMET_COLORS: Record<string, string> = {
  TS:   "#a855f7", TSGR: "#a855f7", TURB: "#22c55e", LLWS: "#22c55e",
  MTW:  "#ec4899", ICE:  "#06b6d4", TC:   "#eab308", SS:   "#f97316",
  DS:   "#f97316", VA:   "#ef4444", CLD:  "#3b82f6", DEFAULT: "#94a3b8"
};

const getSigmetStyle = (feature: any) => {
  const hazard = feature.properties?.hazard;
  const color = SIGMET_COLORS[hazard] || SIGMET_COLORS.DEFAULT;
  return {
    color: color, weight: 1.5, opacity: 1, fillColor: color, fillOpacity: 0.25,
    dashArray: (hazard === "TURB" || hazard === "ICE" || hazard === "MTW") ? "4, 4" : undefined,
  };
};

const boundaryStyle = {
  color: "#ffffff", weight: 0.6, opacity: 0.8, fillColor: "transparent", fillOpacity: 0,
};

export default function FlightMap({ className, initialAirports = [] }: MapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // --- 1. HOOK DATA SATELIT ---
  const { latest: himawariLatest, serverTime, isLoading: isHimawariLoading, isError: isHimawariOffline, refresh: refreshHimawari } = useHimawariData();

  // --- 2. HOOK DATA MULTI-RADAR ---
  const balRadar = useRadarLatest('BAL');
  const mtwRadar = useRadarLatest('MTW');
  const trkRadar = useRadarLatest('TRK');

  // Buat fungsi sapu jagat untuk merefresh ketiga radar sekaligus
  const handleRefreshAllRadars = () => {
      balRadar.refresh();
      mtwRadar.refresh();
      trkRadar.refresh();
  };

  const isAnyRadarLoading = balRadar.isLoading || mtwRadar.isLoading || trkRadar.isLoading;

  // --- 3. THE UNIVERSAL TIME MACHINE ---
  const { 
    frames: timeFrames, currentIndex, currentFrame, isPlaying, 
    togglePlay, jumpToLive, setIndex 
  } = useTimeMachine(serverTime);

  // --- LOGIKA PENCARI WAKTU TERDEKAT UNTUK TEKS STATUS RADAR ---
  // --- LOGIKA PENCARI WAKTU TERDEKAT UNTUK TEKS STATUS RADAR ---
  const getClosestRadarTimeText = (radarHookData: ReturnType<typeof useRadarLatest>, targetTimeUTC?: string) => {
      if (radarHookData.isOffline) return "OFFLINE";
      if (radarHookData.isLoading) return "LOADING...";
      
      let bestTimeStr = radarHookData.radarTime; // Default: Latest

      if (targetTimeUTC && radarHookData.radarFrames && radarHookData.radarFrames.length > 0) {
          const targetMs = new Date(targetTimeUTC).getTime();
          
          // PERUBAHAN UTAMA: Mulai dengan KOSONG
          let bestFrame = null; 

          for (const frame of radarHookData.radarFrames) {
              const frameMs = new Date(frame.timeUTC).getTime();
              if (frameMs <= targetMs) {
                  bestFrame = frame;
              } else {
                  break;
              }
          }
          
          // Jika tidak ada frame yang cocok, tampilkan peringatan "TIDAK TERSEDIA"
          if (!bestFrame) return "TIDAK TERSEDIA";
          
          bestTimeStr = bestFrame.timeUTC;
      }

      // Format buang tanggal: "2026-03-24 05:45 UTC" -> "05:45 UTC"
      if (!bestTimeStr) return "LIVE DATA";
      const parts = bestTimeStr.split(' ');
      if (parts.length >= 2) return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`; 
      
      try {
          const d = new Date(bestTimeStr);
          return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
      } catch {
          return bestTimeStr;
      }
  };
  const radarStatuses = [
    { id: 'BAL', name: 'Balikpapan', status: getClosestRadarTimeText(balRadar, currentFrame?.timeUTC) },
    { id: 'MTW', name: 'Muara Teweh', status: getClosestRadarTimeText(mtwRadar, currentFrame?.timeUTC) },
    { id: 'TRK', name: 'Tarakan', status: getClosestRadarTimeText(trkRadar, currentFrame?.timeUTC) }
  ];

  // --- 4. LAYER CONTROL STATE ---
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [baseMap, setBaseMap] = useState<BaseMapType>('dark');
  const [overlays, setOverlays] = useState<Record<OverlayType, boolean>>({
    himawari: true, radar: false, sigmet: false, airports: true, boundaries: true,
  });

  const [selectedAirport, setSelectedAirport] = useState<AirportData | null>(null);
  const [selectedSigmet, setSelectedSigmet] = useState<SigmetProperties | null>(null);

  const sigmetData = useSigmetLayers();
  const boundaryData = useBoundaryLayers();
  const { data: fetchedAirports } = useAirportWeather();

  const displayAirports = (fetchedAirports && fetchedAirports.length > 0) ? fetchedAirports : initialAirports;

  useEffect(() => { setIsMounted(true); }, []);

  const toggleOverlay = (type: OverlayType) => setOverlays(prev => ({ ...prev, [type]: !prev[type] }));
  const handleAirportClick = (airport: AirportData) => { setSelectedSigmet(null); setSelectedAirport(airport); };
  const handleSigmetClick = (properties: any) => { setSelectedAirport(null); setSelectedSigmet(properties as SigmetProperties); };

  const MapContent = (
    <div className={`bg-slate-900 overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none' : `w-full h-[600px] rounded-2xl relative border border-slate-700 ${className}`}`}>
      
      <AirportDetailPanel airport={selectedAirport} onClose={() => setSelectedAirport(null)} />
      <SigmetDetailPanel data={selectedSigmet} onClose={() => setSelectedSigmet(null)} />

      <LayerControlPanel 
        isOpen={isPanelOpen}
        baseMap={baseMap}
        setBaseMap={setBaseMap}
        overlays={overlays}
        toggleOverlay={toggleOverlay}
        himawariTime={isHimawariOffline ? "OFFLINE" : (isHimawariLoading ? "LOADING..." : (currentFrame?.label || himawariLatest?.label))}
        radarStatuses={radarStatuses}      
        onRefreshHimawari={refreshHimawari}
        isHimawariLoading={isHimawariLoading}
        onRefreshRadar={handleRefreshAllRadars}
        isRadarLoading={isAnyRadarLoading}
      />

      {(overlays.himawari || overlays.radar) && timeFrames.length > 0 && (
         <TimeControlPanel 
             frames={timeFrames}
             currentIndex={currentIndex}
             isPlaying={isPlaying}
             onTogglePlay={togglePlay}
             onJumpToLive={jumpToLive}
             onIndexChange={setIndex}
         />
      )}

      <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="absolute top-6 left-6 z-[2010] p-2 bg-black/80 text-white rounded-lg backdrop-blur-md border border-white/10 hover:bg-black transition-all shadow-xl">
        {isPanelOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <button onClick={() => setIsFullscreen(!isFullscreen)} className="absolute top-6 right-6 z-[1000] p-2 bg-black/40 text-slate-300 hover:text-white rounded-lg border border-white/10 backdrop-blur-md transition-all">
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      <MapContainer 
          key={isFullscreen ? 'full' : 'norm'}
          center={[0.122933, 116.989542]} zoom={7} scrollWheelZoom={true} 
          className="w-full h-full z-0 bg-[#1a1a1a]" zoomControl={false}
      >
          <TileLayer key={baseMap} url={BASE_MAPS[baseMap]} zIndex={1} opacity={1} attribution="&copy; OpenStreetMap & CARTO" />

          {overlays.himawari && <HimawariLayer opacity={0.65} targetTime={currentFrame?.timeUTC} />}

          {overlays.radar && <RadarLayer opacity={0.65} targetTime={currentFrame?.timeUTC} />}

          {overlays.sigmet && sigmetData && (
             <GeoJSON 
                key={`sigmet-${sigmetData.features?.length || 0}`} 
                data={sigmetData} style={getSigmetStyle}
                onEachFeature={(feature, layer) => {
                    layer.on({ click: (e) => { if (e.originalEvent) e.originalEvent.stopPropagation(); handleSigmetClick(feature.properties); }});
                }}
             />
          )}

          {overlays.boundaries && boundaryData && (
            <GeoJSON key="geo-boundaries" data={boundaryData} style={boundaryStyle} interactive={false} />
          )}
          
          {overlays.airports && displayAirports.map((airport) => {
             const isSelected = selectedAirport?.id === airport.id;
             return (
                <CircleMarker 
                  key={airport.id} center={[airport.lat, airport.lon]} 
                  eventHandlers={{ click: (e) => { if (e.originalEvent) e.originalEvent.stopPropagation(); handleAirportClick(airport); } }}
                  pathOptions={{ color: isSelected ? '#ffffff' : '#bae6fd', fillColor: isSelected ? '#ef4444' : '#0ea5e9', fillOpacity: 1, weight: isSelected ? 2 : 1 }}
                  radius={isSelected ? 6 : 4}
                >
                  <Tooltip direction="top" offset={[0, -5]} opacity={1} className="font-bold text-xs">{airport.id}</Tooltip>
                </CircleMarker>
             );
          })}
      </MapContainer>
    </div>
  );

  if (!isMounted) return <div className="w-full h-[600px] bg-slate-900 rounded-[2.5rem] animate-pulse" />;
  if (isFullscreen) return createPortal(<div className="fixed inset-0 z-[9999] bg-black animate-in fade-in duration-300">{MapContent}</div>, document.body);

  return MapContent;
}