"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, Marker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MahakamLocation, getNavigationStatus } from '@/lib/mahakam-data'; 
import { Wind, Thermometer, Cloud, Eye, Maximize, Minimize, Route, Navigation, Timer, Gauge, BarChart2 } from 'lucide-react'; 
import * as turf from '@turf/turf';
import ForecastControl from './ForecastControl';
import LayerControl, { MapLayersState } from './LayerControl';
import MahakamRadar from './MahakamRadar';
import MahakamSatellite from './MahakamSatellite';
import MapInfoCard from './MapInfoCard';
import MeteogramView from './MeteogramView';
import RoutePlanner, { RouteNode, SimulationData } from './RoutePlanner';
import AllStationsMeteogram from './AllStationsMeteogram'; 

const KECAMATAN_TO_STATION_MAP: Record<string, string> = {
  "Anggana": "Anggana", "Sambutan": "Sambutan", "Samarinda Kota": "Samarinda Kota",
  "Samarinda Ilir": "Samarinda Ilir", "Samarinda Ulu": "Samarinda Ulu",
  "Sungai Kunjang": "Sungai Kunjang", "Samarinda Seberang": "Samarinda Seberang",
  "Palaran": "Palaran", "Loa Janan Ilir": "Loa Janan Ilir", "Loa Janan": "Loa Janan",
  "Loa Kulu": "Loa Kulu", "Tenggarong": "Tenggarong", "Tenggarong Seberang": "Tenggarong Seberang",
  "Sebulu": "Sebulu", "Muara Kaman": "Muara Kaman", "Kota Bangun": "Kota Bangun",
  "Muara Wis": "Muara Wis", "Muara Muntai": "Muara Muntai", "Muara Pahu": "Muara Pahu",
  "Penyinggahan": "Penyinggahan", "Melak": "Melak", "Mook Manaar Bulatn": "Mook Manaar Bulatn",
  "Barong Tongkok": "Barong Tongkok", "Sekolaq Darat": "Sekolaq Darat", "Tering": "Tering",
  "Long Iram": "Long Iram", "Laham": "Laham", "Long Hubung": "Long Hubung",
  "Long Bagun": "Long Bagun", "Long Pahangai": "Long Pahangai", "Long Apari": "Long Apari"
};


interface RiverMapProps {
  initialData: MahakamLocation[];
  onViewDetail?: (loc: MahakamLocation) => void;
}

type MarkerMode = 'weather' | 'temp' | 'wind' | 'visibility';

const createCustomDynamicIcon = (loc: any, isActive: boolean, mode: MarkerMode) => {
  const activeClassContainer = isActive ? 'scale-110 z-[1000]' : 'z-[500]';
  const isRouteHighlight = loc.isRouteNode ? 'ring-2 ring-blue-500 bg-blue-50 shadow-blue-500/30' : 'ring-1 ring-slate-200 bg-white';
  const activeClassBox = isActive ? 'ring-2 ring-blue-500 bg-blue-50' : isRouteHighlight;
  
  let iconContent = '';
  if (mode === 'weather') {
    iconContent = loc.iconUrl ? `<img src="${loc.iconUrl}" class="w-8 h-8 object-contain" />` : `<div class="w-6 h-6 bg-slate-200 rounded-full"></div>`;
  } else if (mode === 'temp') {
    iconContent = `<span class="text-sm font-bold text-slate-700">${loc.temp !== undefined ? loc.temp : '-'}°</span>`;
  } else if (mode === 'wind') {
    iconContent = `<div class="flex flex-col items-center justify-center gap-0.5 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${loc.windDeg || 0}deg)"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg><span class="text-[9px] font-bold text-slate-700 leading-none">${loc.windSpeed !== undefined ? loc.windSpeed : '-'}</span></div>`;
  } else if (mode === 'visibility') {
    iconContent = `<div class="flex flex-col items-center justify-center mt-0.5 px-1"><span class="text-[10px] font-bold text-slate-700 leading-tight text-center">${loc.visibility_text || '-'}</span></div>`;
  }

  return L.divIcon({
    html: `<div class="relative flex items-center justify-center ${activeClassContainer} transition-all duration-300"><div class="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${activeClassBox}">${iconContent}</div><div class="absolute -bottom-1 w-2 h-2 rotate-45 bg-white border-r border-b border-slate-200"></div></div>`,
    className: 'custom-leaflet-icon', iconSize: [40, 40], iconAnchor: [20, 44]
  });
};

function SetBounds({ coords, trigger }: { coords: [number, number][], trigger: any }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], animate: true });
    }
  }, [trigger, map]);
  return null;
}

function MapResizer({ isFullscreen }: { isFullscreen: boolean }) {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(timeout);
  }, [isFullscreen, map]);
  return null;
}

function BoatCamera({ boatCoords }: { boatCoords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
     if (boatCoords) {
        map.panTo(boatCoords, { animate: true, duration: 0.1 });
     }
  }, [boatCoords, map]);
  return null;
}

export default function RiverMap({ initialData, onViewDetail }: RiverMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [visualGeoJson, setVisualGeoJson] = useState<any>(null);
  const [engineGeoJson, setEngineGeoJson] = useState<any>(null);
  const [selectedLoc, setSelectedLoc] = useState<MahakamLocation | null>(null);
  const [timeIndex, setTimeIndex] = useState(0); 
  const [mapStyle, setMapStyle] = useState('light');
  
  const [meteogramLocation, setMeteogramLocation] = useState<MahakamLocation | null>(null);
  const [markerMode, setMarkerMode] = useState<MarkerMode>('weather');
  const [activeLayers, setActiveLayers] = useState<MapLayersState>({ radar: false, satellite: false });
  const [layerOpacity, setLayerOpacity] = useState({ radar: 0.65, satellite: 0.65 });
  const geoJsonRef = useRef<any>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isRoutePlannerActive, setIsRoutePlannerActive] = useState(false);
  const [activeRouteNodes, setActiveRouteNodes] = useState<RouteNode[] | null>(null);
  const [activeRouteGeoJson, setActiveRouteGeoJson] = useState<any>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simDistanceKm, setSimDistanceKm] = useState(0);
  const [simData, setSimData] = useState<SimulationData | null>(null);

  const [showAllMeteogram, setShowAllMeteogram] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/maps/alur-mahakam-segmented3.geojson')
      .then(res => res.json())
      .then(data => setVisualGeoJson(data));
    fetch('/maps/alur-navigasi-engine.geojson')
      .then(res => res.json())
      .then(data => setEngineGeoJson(data));

    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const timestamps = useMemo(() => {
      const validLoc = initialData.find(l => l.forecasts && l.forecasts.length > 0);
      return validLoc && validLoc.forecasts ? validLoc.forecasts.map(f => f.time) : [];
  }, [initialData]);

  const displayData = useMemo(() => {
      if (activeRouteNodes && activeRouteNodes.length > 0) {
        return activeRouteNodes.map(node => ({
          ...node.station,
          weather: node.forecast.condition,
          temp: node.forecast.temp,
          iconUrl: node.forecast.weatherIcon,
          windSpeed: node.forecast.windSpeed,
          windDeg: node.forecast.windDeg,
          visibility_text: node.forecast.visibility_text,
          isRouteNode: true 
        }));
      }

      if (timestamps.length === 0) return initialData;
      return initialData.map(loc => {
          const forecast = loc.forecasts?.[timeIndex];
          if (forecast) {
              return { 
                ...loc, weather: forecast.condition, temp: forecast.temp, iconUrl: forecast.weatherIcon, 
                windSpeed: forecast.windSpeed, windDeg: forecast.windDeg, visibility_text: forecast.visibility_text 
              };
          }
          return loc;
      });
  }, [initialData, timeIndex, timestamps, activeRouteNodes]);

  const dynamicSelectedLoc = selectedLoc ? displayData.find(loc => loc.id === selectedLoc.id) || selectedLoc : null;

  const baseGeoJsonLayer = useMemo(() => {
    if (!visualGeoJson) return null;
    return <GeoJSON ref={geoJsonRef} data={visualGeoJson} style={{ color: '#cbd5e1', weight: 4, opacity: activeRouteNodes ? 0.3 : 0.9 }} />;
  }, [visualGeoJson, activeRouteNodes]);

  const renderedMarkers = useMemo(() => {
    return displayData.map((loc) => {
      const isActive = selectedLoc?.id === loc.id;
      return (
        <Marker 
          key={loc.id} position={[loc.lat, loc.lng]} 
          icon={createCustomDynamicIcon(loc, isActive, markerMode)} 
          eventHandlers={{ click: () => {
             if (!isRoutePlannerActive) setSelectedLoc(loc);
          }}}
        />
      );
    });
  }, [displayData, selectedLoc, markerMode, isRoutePlannerActive]);

  useEffect(() => {
    if (geoJsonRef.current && displayData.length > 0 && !activeRouteNodes) {
      geoJsonRef.current.eachLayer((layer: any) => {
        const stationRef = KECAMATAN_TO_STATION_MAP[layer.feature.properties.nm_kecamatan];
        const weatherData = displayData.find(loc => loc.name === stationRef);
        
        let segmentColor = '#3b82f6'; // Default Biru Aman
        
        if (weatherData && weatherData.forecasts && weatherData.forecasts[timeIndex]) {
          const forecast = weatherData.forecasts[timeIndex];
          // REFACTOR: Panggil getNavigationStatus tersentralisasi
          const status = getNavigationStatus(
            forecast.condition || '',
            forecast.windSpeed || 0,
            forecast.visibility_val || 99999
          );

          if (status === 'bahaya') segmentColor = '#ef4444';
          else if (status === 'waspada') segmentColor = '#f59e0b';
        }

        layer.setStyle({ color: segmentColor, weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round' });
      });
    }
  }, [displayData, visualGeoJson, activeRouteNodes, timeIndex]);

  const getBasemapUrl = () => {
    if (mapStyle === 'dark') return "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";
    if (mapStyle === 'satellite') return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"; 
  };

  useEffect(() => {
    if (!isSimulating || !activeRouteGeoJson || !simData) return;

    let animationFrame: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      const timeMultiplier = 1800; 
      const distDelta = (simData.speedKmh / 3600000) * deltaTime * timeMultiplier;

      setSimDistanceKm(prev => {
         const nextDist = prev + distDelta;
         if (nextDist >= simData.totalDistanceKm) {
            setIsSimulating(false);
            return simData.totalDistanceKm; 
         }
         return nextDist;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isSimulating, activeRouteGeoJson, simData]);

  const boatStatus = useMemo(() => {
     if (!activeRouteGeoJson || !simData) return null;
     
     try {
         let lineToMeasure = activeRouteGeoJson;
         if (lineToMeasure.type === 'FeatureCollection' && lineToMeasure.features.length > 0) lineToMeasure = lineToMeasure.features[0];
         if (lineToMeasure.geometry && lineToMeasure.geometry.type === 'MultiLineString') lineToMeasure = turf.lineString(lineToMeasure.geometry.coordinates[0]);
         if (!lineToMeasure.geometry || !lineToMeasure.geometry.coordinates || lineToMeasure.geometry.coordinates.length < 2) return null;

         const validDistance = isNaN(simDistanceKm) ? 0 : Math.max(0, simDistanceKm);
         const point = turf.along(lineToMeasure, validDistance, { units: 'kilometers' });
         
         const prevDist = Math.max(0, validDistance - 0.05);
         const prevPoint = turf.along(lineToMeasure, prevDist, { units: 'kilometers' });
         const bearing = turf.bearing(prevPoint, point);

         const simulatedTime = new Date(simData.departureTime.getTime() + (validDistance / simData.speedKmh) * 3600000);

         let currentForecast = null;
         let currentStationName = "Menganalisa...";
         if (activeRouteNodes && activeRouteNodes.length > 0) {
            const closestNode = activeRouteNodes.reduce((prev, curr) => 
              Math.abs(curr.distanceKm - validDistance) < Math.abs(prev.distanceKm - validDistance) ? curr : prev
            );
            currentForecast = closestNode.forecast;
            currentStationName = closestNode.station.name;
         }

         return {
           coords: [point.geometry.coordinates[1], point.geometry.coordinates[0]] as [number, number],
           bearing,
           timeStr: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(simulatedTime).replace('.', ':'),
           weather: currentForecast,
           stationName: currentStationName
         };
     } catch (err) {
         console.warn("⚠️ Mesin Animasi Turf.js Mencegah Crash:", err);
         return null;
     }
  }, [activeRouteGeoJson, simDistanceKm, simData, activeRouteNodes]);

  const boatMarkerIcon = useMemo(() => {
    if (!boatStatus) return undefined;
    return L.divIcon({
      html: `
        <div style="transform: rotate(${boatStatus.bearing}deg); transition: transform 0.1s linear; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.5" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
            <path d="M12 2L4 20l8-4 8 4-8-18z"/>
          </svg>
        </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }, [boatStatus]);

  if (!isMounted) return <div className="h-[500px] w-full animate-pulse rounded-2xl bg-slate-100" />;

  return (
    <div className="w-full relative z-0">
      <div 
        ref={mapContainerRef} 
        className={`w-full relative group bg-slate-50 transition-all duration-300 overflow-hidden ${isFullscreen ? 'h-screen rounded-none' : 'h-[600px] rounded-2xl shadow-2xl border border-slate-200'}`}
      >
        
        {isRoutePlannerActive && (
          <RoutePlanner 
            locations={initialData} 
            engineGeoJson={engineGeoJson} 
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onClose={() => {
              setIsRoutePlannerActive(false);
              setActiveRouteNodes(null); 
              setActiveRouteGeoJson(null);
              setIsSimulating(false);
              setSimDistanceKm(0);
              setSimData(null);
            }} 
            onRouteCalculated={(nodes, slicedGeojson, calculatedSimData) => {
              setActiveRouteNodes(nodes);
              setActiveRouteGeoJson(slicedGeojson);
              setSimData(calculatedSimData || null);
              setSimDistanceKm(0);
              setIsSimulating(false);
            }}
          />
        )}

        {!isRoutePlannerActive && (
          <>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-1.5">
              <button onClick={() => setMarkerMode('weather')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${markerMode === 'weather' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}><Cloud className="w-4 h-4" /> <span className="hidden sm:inline">Cuaca</span></button>
              <button onClick={() => setMarkerMode('temp')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${markerMode === 'temp' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}><Thermometer className="w-4 h-4" /> <span className="hidden sm:inline">Suhu</span></button>
              <button onClick={() => setMarkerMode('wind')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${markerMode === 'wind' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}><Wind className="w-4 h-4" /> <span className="hidden sm:inline">Angin</span></button>
              <button onClick={() => setMarkerMode('visibility')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${markerMode === 'visibility' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}><Eye className="w-4 h-4" /> <span className="hidden sm:inline">Visibility</span></button>
            </div>
            
            <LayerControl activeLayers={activeLayers} onToggleLayer={(l) => setActiveLayers(p => ({...p, [l]: !p[l]}))} mapStyle={mapStyle} setMapStyle={setMapStyle} layerOpacity={layerOpacity} onOpacityChange={(l, v) => setLayerOpacity(p => ({ ...p, [l]: v }))} />
            
            {timestamps.length > 0 && <ForecastControl timestamps={timestamps} selectedIndex={timeIndex} onSelect={setTimeIndex} />}
            <MapInfoCard location={dynamicSelectedLoc} onClose={() => setSelectedLoc(null)} onShowMeteogram={setMeteogramLocation} />
          </>
        )}

        {isSimulating && simData && boatStatus && (
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2000] w-[380px] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 animate-in slide-in-from-bottom-8">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Simulasi</span>
                    <span className="text-slate-300 text-[9px]">•</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider truncate max-w-[130px]">{boatStatus.stationName}</span>
                 </div>
                 <div className="bg-slate-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded border border-slate-200 font-mono shadow-sm">
                    {boatStatus.timeStr} WITA
                 </div>
              </div>

              <div className="mb-2">
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jarak Tempuh</span>
                    <span className="text-[11px] font-black text-slate-800">{simDistanceKm.toFixed(1)} <span className="text-[9px] text-slate-500 font-bold">/ {simData.totalDistanceKm.toFixed(1)} km</span></span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                   <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-200" style={{ width: `${(simDistanceKm / simData.totalDistanceKm) * 100}%` }}></div>
                 </div>
              </div>

              <div className="flex items-center justify-between bg-blue-50/50 rounded-lg border border-blue-100/50 p-2 shadow-sm gap-2">
                 <div className="flex items-center gap-2 shrink-0 w-[35%]">
                    {boatStatus.weather?.weatherIcon ? (
                       <img src={boatStatus.weather.weatherIcon} alt="weather" className="w-7 h-7 object-contain drop-shadow-sm" />
                    ) : (
                       <Cloud className="w-6 h-6 text-slate-400" />
                    )}
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-800 leading-none mb-1 line-clamp-1" title={boatStatus.weather?.condition || '-'}>{boatStatus.weather?.condition || '-'}</span>
                       <span className="text-[9px] font-bold text-orange-500 flex items-center gap-0.5 leading-none">
                          <Thermometer className="w-3 h-3" /> {boatStatus.weather?.temp || '-'}°C
                       </span>
                    </div>
                 </div>

                 <div className="h-6 w-px bg-blue-100/70 shrink-0"></div>

                 <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 flex-1 text-[9px] font-bold text-slate-500 pl-1">
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-blue-400" /> {boatStatus.weather?.windSpeed || 0} km/h</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-teal-400" /> <span className="truncate max-w-[50px]" title={boatStatus.weather?.visibility_text || '-'}>{boatStatus.weather?.visibility_text || '-'}</span></span>
                    <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-indigo-400" style={{ transform: `rotate(${boatStatus.weather?.windDeg || 0}deg)` }} /> {boatStatus.weather?.windDeg || 0}°</span>
                    <span className="flex items-center gap-1"><Gauge className="w-3 h-3 text-emerald-500" /> <span className="text-emerald-600 font-black">{simData.speedKnots} kts</span></span>
                 </div>
              </div>
           </div>
        )}

        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button onClick={toggleFullscreen} className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:scale-105 transition-all duration-200 group flex items-center justify-center">
               {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            </button>
            {!isRoutePlannerActive && (
               <>
                 <button onClick={() => { setIsRoutePlannerActive(true); setSelectedLoc(null); }} className="bg-blue-600/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-blue-500 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-200 group flex items-center justify-center" title="Route Planner">
                     <Route className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </button>
                 {/* TOMBOL BARU UNTUK METEOGRAM SEMUA STASIUN */}
                 <button onClick={() => setShowAllMeteogram(true)} className="bg-blue-600/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-blue-500 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-200 group flex items-center justify-center" title="Meteogram Seluruh Area">
                     <BarChart2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </button>
               </>
            )}
        </div>

        {/* RENDER MODAL METEOGRAM SEMUA STASIUN */}
        {showAllMeteogram && (
           <AllStationsMeteogram 
             locations={initialData} 
             timeIndex={timeIndex} 
             timestamps={timestamps} 
             onSelectTime={setTimeIndex}
             onClose={() => setShowAllMeteogram(false)} 
           />
        )}

        {meteogramLocation && (
          <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto">
              <div className="absolute inset-0 cursor-pointer" onClick={() => setMeteogramLocation(null)} />
              <div className="relative w-full max-w-5xl mx-auto my-8 shadow-2xl rounded-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-300">
                  <MeteogramView data={meteogramLocation} onClose={() => setMeteogramLocation(null)} />
              </div>
          </div>
        )}

        <MapContainer preferCanvas={true} center={[-0.502, 117.153]} zoom={9} scrollWheelZoom={true} className="h-full w-full z-0" zoomControl={false}>
            <MapResizer isFullscreen={isFullscreen} />
            <TileLayer key={mapStyle} url={getBasemapUrl()} attribution='&copy; CARTO' />
            {activeLayers.satellite && <MahakamSatellite opacity={layerOpacity.satellite} targetTime={timestamps[timeIndex]} />}
            {activeLayers.radar && <MahakamRadar opacity={layerOpacity.radar} targetTime={timestamps[timeIndex]} />}
            
            {baseGeoJsonLayer}

            {activeRouteGeoJson && (
              <>
                <GeoJSON key={`glow-${Math.random()}`} data={activeRouteGeoJson} style={{ color: '#60a5fa', weight: 8, opacity: 0.5, lineCap: 'round', lineJoin: 'round' }} />
                <GeoJSON key={`core-${Math.random()}`} data={activeRouteGeoJson} style={{ color: '#1d4ed8', weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />
              </>
            )}
            
            <SetBounds coords={displayData.map(l => [l.lat, l.lng])} trigger={activeRouteNodes ? 'route' : 'initial'} />
            
            {isSimulating && boatStatus && <BoatCamera boatCoords={boatStatus.coords} />}
            {boatStatus && boatMarkerIcon && <Marker position={boatStatus.coords} icon={boatMarkerIcon} zIndexOffset={9999} />}
            {renderedMarkers}
        </MapContainer>
      </div>
    </div>
  );
}