"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polygon, GeoJSON } from "react-leaflet";
import L from "leaflet";

import { WeatherStationData } from "@/lib/api-cuaca"; 
import { HotspotData } from "@/lib/data-karhutla"; 
import { Info, MapPin, Clock, X, BarChart3, Sun, CheckCircle2, Thermometer, Wind, Gauge, SunMedium, Maximize, Minimize, ArrowLeft, Flame } from "lucide-react";

import HourlyRainChart from "./HourlyRainChart";
import RadarLayer from "@/components/component-cuaca/penerbangan/Radarlayer"; 
import HimawariLayer from "@/components/component-cuaca/penerbangan/HimawariLayer"; 
import LayerControl from "./LayerControl";
import WindLayer from "./WindLayer"; 

// 🔥 IMPORT KOMPONEN GPS BARU
import GpsControl from "./GpsControl"; 

function MapInteraction({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: () => onMapClick() });
  return null;
}

function MapFlyToController({ targetPos, zoom = 9, trigger }: { targetPos: [number, number] | null, zoom?: number, trigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (targetPos) {
      map.flyTo(targetPos, zoom, { animate: true, duration: 1.5 });
    }
  }, [targetPos, zoom, trigger, map]);
  return null;
}

const createCustomIcon = (rainTotal: number, isSelected: boolean, isOffline: boolean, type: string) => {
  let pulseColor = "";
  const coreColor = isOffline ? "bg-slate-400" : "bg-blue-500"; 
  
  if (rainTotal >= 0.2 && !isOffline) {
    if (rainTotal <= 5) pulseColor = "bg-blue-300";
    else if (rainTotal <= 20) pulseColor = "bg-green-300";
    else if (rainTotal <= 50) pulseColor = "bg-yellow-300";
    else if (rainTotal <= 100) pulseColor = "bg-orange-300";
    else if (rainTotal <= 150) pulseColor = "bg-red-300";
    else pulseColor = "bg-purple-300";
  }

  const scaleClass = isSelected ? "scale-110" : "scale-100";
  const isAWS = type === "AWS";
  const shapeStyle = isAWS ? "rounded-full h-3 w-3" : "h-3 w-3"; 
  const triangleClip = !isAWS ? "style='clip-path: polygon(50% 0%, 0% 100%, 100% 100%);'" : "";
  
  const html = `
    <div class="relative flex items-center justify-center w-full h-full ${scaleClass}">
      ${(rainTotal >= 0.2 && !isOffline) ? `<span class="animate-ping absolute inline-flex h-5 w-5 rounded-full ${pulseColor} opacity-75"></span>` : ''}
      <div ${triangleClip} class="relative inline-flex ${shapeStyle} ${coreColor} border-[1px] border-white shadow-sm transition-all duration-300"></div>
    </div>
  `;
  return L.divIcon({ html: html, className: "", iconSize: [32, 32], iconAnchor: [16, 16] });
};

const userLocationIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-10 h-10 -mt-2">
      <span class="absolute w-6 h-6 bg-indigo-500 rounded-full animate-ping opacity-60 mt-2"></span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4f46e5" stroke="#ffffff" stroke-width="2" class="w-9 h-9 relative z-10 drop-shadow-md">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    </div>
  `,
  className: "", iconSize: [40, 40], iconAnchor: [20, 38] 
});

const createHotspotIcon = (conf: number, isSelected: boolean) => {
  let colorClass = "text-yellow-500"; 
  if (conf >= 9) colorClass = "text-red-500"; 
  else if (conf >= 7) colorClass = "text-orange-500"; 
  const scaleClass = isSelected ? "scale-150" : "scale-100 hover:scale-125";
  const html = `
    <div class="relative flex items-center justify-center ${colorClass} drop-shadow-md transition-transform duration-300 ${scaleClass}">
      ${conf >= 9 ? `<span class="absolute w-5 h-5 bg-red-500 rounded-full animate-ping opacity-60"></span>` : ''}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5" class="relative z-10"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
    </div>
  `;
  return L.divIcon({ html: html, className: "", iconSize: [22, 22], iconAnchor: [11, 22] });
};

export default function WeatherMap({ data }: { data: WeatherStationData[] }) {
  const defaultCenter: [number, number] = [0.5, 116.5]; 
  
  const [selectedStation, setSelectedStation] = useState<WeatherStationData | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [flyZoom, setFlyZoom] = useState(7);
  const [flyTrigger, setFlyTrigger] = useState(0);

  const [showHotspot, setShowHotspot] = useState(false);
  const [hotspotData, setHotspotData] = useState<HotspotData[]>([]);
  const [isLoadingHotspot, setIsLoadingHotspot] = useState(false);

  const [nowcastData, setNowcastData] = useState<any>(null);

  const [showWind, setShowWind] = useState(false);
  const [windData, setWindData] = useState<any>(null);
  const [isLoadingWind, setIsLoadingWind] = useState(false);
  const [windTime, setWindTime] = useState<string | null>(null);

  const [windHoverText, setWindHoverText] = useState<string>("");

  const [kaltimMask, setKaltimMask] = useState<any[] | null>(null);
  const [kaltimBorder, setKaltimBorder] = useState<any>(null);

  useEffect(() => {
    fetch('/geojson/WilayahKaltim1.json')
      .then(res => res.json())
      .then(data => {
        setKaltimBorder(data); 
        const worldRing = [ [90, -180], [90, 180], [-90, 180], [-90, -180] ];
        const holes: any[] = [];
        
        const extractHoles = (coords: any[]) => {
          if (typeof coords[0][0] === 'number') {
            holes.push(coords.map((c: any[]) => [c[1], c[0]])); 
          } else {
            coords.forEach(extractHoles);
          }
        };
        
        if (data.features) {
          data.features.forEach((f: any) => {
            if (f.geometry && f.geometry.coordinates) extractHoles(f.geometry.coordinates);
          });
        }
        setKaltimMask([worldRing, ...holes]);
      })
      .catch(err => console.error("Gagal memuat GeoJSON Kaltim:", err));
  }, []);

  useEffect(() => {
    if (showHotspot && hotspotData.length === 0) {
      setIsLoadingHotspot(true);
      fetch('/api/hotspots')
        .then(res => res.json())
        .then(data => {
          setHotspotData(data);
          setIsLoadingHotspot(false);
        })
        .catch(err => {
          console.error("Gagal menarik hotspot:", err);
          setIsLoadingHotspot(false);
        });
    }
  }, [showHotspot, hotspotData.length]);

  useEffect(() => {
    if (showWarning && !nowcastData) {
      fetch('/api/nowcast')
        .then(res => res.json())
        .then(d => setNowcastData(d))
        .catch(err => console.error("Gagal fetch Nowcasting:", err));
    }
  }, [showWarning, nowcastData]);

  useEffect(() => {
    if (showWind && !windData) {
      setIsLoadingWind(true);
      fetch('/api/wind')
        .then(res => res.json())
        .then(data => {
          setWindData(data);
          if (data && data.length > 0 && data[0].header) {
            const refTime = data[0].header.refTime;
            const timeString = new Date(refTime).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }) + " WITA";
            setWindTime(timeString);
          }
          setIsLoadingWind(false);
        })
        .catch(err => {
          console.error("Gagal menarik data angin:", err);
          setIsLoadingWind(false);
        });
    }
  }, [showWind, windData]);

  useEffect(() => {
    if (!showWind) {
      setWindHoverText("");
      return;
    }
    const interval = setInterval(() => {
      const controlBox = document.querySelector('.leaflet-control-velocity');
      if (controlBox) {
        setWindHoverText(controlBox.textContent || "");
      }
    }, 100);
    return () => clearInterval(interval);
  }, [showWind]);

  const [touchStartY, setTouchStartY] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 50) {
      setSelectedStation(null);
      setSelectedHotspot(null);
      setIsChartModalOpen(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    document.body.style.overflow = isFullscreen ? "hidden" : "auto";
    return () => { clearTimeout(timer); document.body.style.overflow = "auto"; };
  }, [isFullscreen]);

  // ✅ FUNGSI FLYTO BARU UNTUK GPS COMPONENT
  const handleFlyTo = (pos: [number, number], zoom: number) => {
    setFlyTarget(pos);
    setFlyZoom(zoom);
    setFlyTrigger(Date.now());
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }) + " WITA";
  };

  const checkIsOffline = (station: WeatherStationData) => {
    if (station.is_offline !== undefined) return station.is_offline;
    if (!station.record_time) return true;
    return (Date.now() - new Date(station.record_time).getTime()) / (1000 * 60) > 10; 
  };

  const getStatusBadge = (rainTotal: number) => {
    if (rainTotal < 0.2) return { text: "Tidak Hujan", style: "bg-slate-50 text-slate-500 border-slate-200 font-light" };
    if (rainTotal <= 5) return { text: "Hujan Sangat Ringan", style: "bg-blue-50 text-blue-500 border-blue-200 font-light" };
    if (rainTotal <= 20) return { text: "Hujan Ringan", style: "bg-green-50 text-green-500 border-green-200 font-light" };
    if (rainTotal <= 50) return { text: "Hujan Sedang", style: "bg-yellow-50 text-yellow-600 border-yellow-200 font-light" };
    if (rainTotal <= 100) return { text: "Hujan Lebat", style: "bg-orange-50 text-orange-500 border-orange-200 font-light" };
    if (rainTotal <= 150) return { text: "Hujan Sangat Lebat", style: "bg-red-50 text-red-500 border-red-200 font-light" };
    return { text: "Hujan Ekstrem", style: "bg-purple-50 text-purple-500 border-purple-200 font-light" };
  };

  const getRainStatusContent = () => {
    const onlineStations = data.filter(s => !checkIsOffline(s));
    const currentlyRaining = onlineStations.filter(s => s.is_raining);
    const stoppedRaining = onlineStations.filter(s => !s.is_raining && s.rain_total > 0);
    const formatList = (st: typeof data) => st.sort((a, b) => b.rain_total - a.rain_total).map(s => `${s.rain_total} mm di ${s.station_name.replace("ARG ", "").replace("AWS ", "")}`).join(", ");
    if (currentlyRaining.length > 0) return { text: `LIVE: Sedang terjadi hujan sebesar ${formatList(currentlyRaining)}.`, bgClass: "bg-white/95 border-blue-200 text-blue-700 shadow-[0_4px_20px_rgba(59,130,246,0.15)]", icon: (<div className="relative flex items-center justify-center shrink-0 w-3.5 h-3.5 mr-0.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span></div>) };
    if (stoppedRaining.length > 0) return { text: `Hujan telah reda. Total curah hujan hari ini: ${formatList(stoppedRaining)}.`, bgClass: "bg-white/95 border-emerald-200 text-emerald-700 shadow-[0_4px_20px_rgba(16,185,129,0.1)]", icon: <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> };
    return { text: "Terpantau cerah. Belum ada curah hujan yang tercatat hari ini di seluruh stasiun.", bgClass: "bg-white/95 border-slate-200 text-slate-600 shadow-sm", icon: <Sun size={14} className="text-yellow-500 shrink-0" /> };
  };

  const statusContent = getRainStatusContent();

  let tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  let attribution = '&copy; <a href="https://carto.com/">CartoDB</a>';
  if (mapStyle === 'dark') tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  else if (mapStyle === 'satellite') {
    tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    attribution = '&copy; <a href="https://www.esri.com/">Esri</a>';
  }

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-[9999] w-screen h-[100dvh] bg-slate-100 rounded-none m-0" : "h-[500px] md:h-[600px] w-full relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200"}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-150%); } } 
        .animate-marquee { display: inline-block; white-space: nowrap; animation-name: marquee; animation-timing-function: linear; animation-iteration-count: infinite; padding-left: 100%; }
        
        /* 🚨 GHOST MODE */
        .leaflet-control-velocity {
          opacity: 0 !important;
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
      `}} />

      {/* STATUS HUJAN */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-[75%] max-w-[250px] sm:max-w-[480px] pointer-events-auto transition-all duration-500">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border backdrop-blur-md overflow-hidden ${statusContent.bgClass}`}>
          {statusContent.icon}
          <div className="flex-1 overflow-hidden relative w-full flex items-center">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider animate-marquee" style={{ animationDuration: `${Math.max(15, statusContent.text.length * 0.15)}s` }}>{statusContent.text}</p>
          </div>
        </div>
      </div>

      {/* KONTROL NAVIGASI KANAN ATAS */}
      <div className="absolute top-4 right-4 z-[500] pointer-events-none flex flex-col gap-2">
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-200/60 text-slate-600 hover:text-blue-500 hover:bg-white transition-all">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        
        {/* 🔥 KOMPONEN GPS BARU DIPANGGIL DI SINI */}
        <GpsControl 
          userPos={userPos} 
          setUserPos={setUserPos} 
          onFlyTo={handleFlyTo} 
          defaultCenter={defaultCenter} 
        />
      </div>

      <LayerControl 
        showRadar={showRadar} setShowRadar={setShowRadar}
        showSatellite={showSatellite} setShowSatellite={setShowSatellite}
        showHotspot={showHotspot} setShowHotspot={setShowHotspot}
        showWarning={showWarning} setShowWarning={setShowWarning}
        showStations={showStations} setShowStations={setShowStations}
        mapStyle={mapStyle} setMapStyle={setMapStyle} 
        nowcastData={nowcastData}
        isLoadingHotspot={isLoadingHotspot}
        showWind={showWind} setShowWind={setShowWind}
        isLoadingWind={isLoadingWind} windTime={windTime}
      />

      <div className="absolute inset-0 z-0">
        <MapContainer center={defaultCenter} zoom={7} scrollWheelZoom={true} className="h-full w-full" zoomControl={false}>
          <TileLayer attribution={attribution} url={tileUrl} />
          
          <MapInteraction onMapClick={() => { 
            setSelectedStation(null); 
            setSelectedHotspot(null); 
            setIsChartModalOpen(false); 
          }} />
          
          <MapFlyToController targetPos={flyTarget} zoom={flyZoom} trigger={flyTrigger} />

          {userPos && <Marker position={userPos} icon={userLocationIcon} interactive={false} />}
          
          {showSatellite && <HimawariLayer opacity={0.65} />}
          {showRadar && <RadarLayer opacity={0.65} />}
          {showWind && windData && <WindLayer data={windData} />}

          {kaltimMask && (
            <Polygon 
              positions={kaltimMask} 
              pathOptions={{ 
                fillColor: '#d1d1d1', 
                fillOpacity: mapStyle === 'dark' || mapStyle === 'satellite' ? 0.6 : 0.4,
                stroke: false 
              }} 
              interactive={false} 
            />
          )}

          {kaltimBorder && (
            <GeoJSON 
              data={kaltimBorder} 
              style={{ 
                color: mapStyle === 'dark' || mapStyle === 'satellite' ? '#94a3b8' : '#64748b', 
                weight: 0.2, 
                fillOpacity: 0
              }} 
              interactive={false}
            />
          )}

          {/* RENDER POLYGON NOWCASTING DARI ARCGIS */}
          {showWarning && nowcastData && (
            <GeoJSON 
              key={nowcastData.features?.length || 'nowcast-layer'}
              data={nowcastData}
              style={(feature: any) => {
                const isMeluas = String(feature?.properties?.tipearea || "").toLowerCase().includes("meluas");
                return {
                  fillColor: isMeluas ? "#fdfc14" : "#fdaf15",
                  weight: 0.3,
                  opacity: 1,
                  color: "#000000",
                  fillOpacity: 0.55,
                };
              }}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(`
                  <div class="p-1 font-sans">
                    <p class="font-bold text-slate-800 text-sm mb-1">🚨 Peringatan Dini Aktif</p>
                    <p class="font-bold text-slate-700">${feature.properties.namakotakab}</p>
                    <p class="text-xs text-slate-600">${feature.properties.namakecamatan}</p>
                    <p class="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${String(feature.properties.tipearea).toLowerCase().includes('meluas') ? 'bg-[#d4d404]' : 'bg-[#d9940b]'}">
                      ${feature.properties.tipearea}
                    </p>
                  </div>
                `);
              }}
            />
          )}

          {showHotspot && hotspotData.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id;
            return (
              <Marker 
                key={hotspot.id} 
                position={[hotspot.lat, hotspot.lng]} 
                icon={createHotspotIcon(hotspot.conf, isSelected)}
                eventHandlers={{
                  click: () => { setSelectedHotspot(hotspot); setSelectedStation(null); setIsChartModalOpen(false); }
                }}
              />
            )
          })}

          {data.map((station, idx) => {
            const lat = parseFloat(station.latitude); const lng = parseFloat(station.longitude);
            if (isNaN(lat) || isNaN(lng) || !showStations) return null;
            return (
              <Marker 
                key={idx} 
                position={[lat, lng]} 
                icon={createCustomIcon(station.rain_total, selectedStation?.station_name === station.station_name, checkIsOffline(station), station.type || 'ARG')}
                eventHandlers={{ click: () => { setSelectedStation(station); setSelectedHotspot(null); setIsChartModalOpen(false); } }} 
              />
            );
          })}
        </MapContainer>
      </div>

      {/* 🔴 CARD INFO ANGIN */}
      {showWind && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] w-48 sm:w-72 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden pointer-events-none transition-all duration-300 animate-in slide-in-from-right-4 fade-in">
          <div className="p-2 sm:p-3 flex items-start justify-between shrink-0 bg-white/50">
            <div className="flex gap-1.5 sm:gap-2.5 items-center">
              <Wind size={14} className="text-blue-500 shrink-0 sm:w-4 sm:h-4 mt-0.5" />
              <div>
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">INFO ANGIN 10M</p>
                <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-tight line-clamp-1">Model ECMWF</h3>
              </div>
            </div>
          </div>
          
          <div className="px-2 sm:px-3 shrink-0"><hr className="border-slate-100" /></div>
          
          <div className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2.5 min-h-[50px] sm:min-h-[64px] justify-center">
            {(() => {
              const text = windHoverText;
              const dirMatch = text.match(/([\d.]+)\s*°/);
              const spdMatch = text.match(/([\d.]+)\s*(m\/s|km\/h|kt|mph)/i);

              if (dirMatch && spdMatch) {
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Arah Angin:</span>
                      <span className="text-xs sm:text-sm font-black text-slate-800">{dirMatch[1]} <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">°</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Kecepatan:</span>
                      <span className="text-xs sm:text-sm font-black text-slate-800">{spdMatch[1]} <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">{spdMatch[2]}</span></span>
                    </div>
                  </>
                );
              }
              return (
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium text-center py-1 sm:py-2 animate-pulse">
                  Arahkan kursor ke area peta
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MASTER BOTTOM SHEET */}
      {(selectedStation || selectedHotspot) && (
        <div 
          className={`fixed inset-x-0 bottom-0 z-[1000] bg-white/50 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-slate-200/60 pb-8 sm:absolute sm:bottom-auto sm:top-4 sm:inset-x-auto sm:left-auto sm:right-16 sm:rounded-2xl sm:pb-0 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col ${
            isChartModalOpen ? 'sm:w-[480px]' : 'sm:w-72'
          }`}
          onTouchStart={!isChartModalOpen ? handleTouchStart : undefined}
          onTouchEnd={!isChartModalOpen ? handleTouchEnd : undefined}
        >
          <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0"></div>

          {/* 🔴 TAMPILAN 1: INFO STASIUN */}
          {selectedStation && (
            <>
              <div className="p-3 flex items-start justify-between shrink-0">
                <div className="flex gap-2.5 items-center">
                  {isChartModalOpen ? (
                    <button onClick={() => setIsChartModalOpen(false)} className="p-1.5 bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"><ArrowLeft size={16} /></button>
                  ) : (
                    <Info size={16} className="text-blue-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{isChartModalOpen ? 'GRAFIK TREN HARIAN' : `INFO ${selectedStation.type || 'ARG'}`}</p>
                    <h3 className="text-sm font-black text-slate-800 leading-tight line-clamp-1">{selectedStation.station_name}</h3>
                  </div>
                </div>
                <button onClick={() => { setSelectedStation(null); setIsChartModalOpen(false); }} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg hidden sm:block"><X size={16} /></button>
              </div>

              <div className="px-3 shrink-0"><hr className="border-slate-100" /></div>

              <div className="overflow-y-auto custom-scrollbar">
                {!isChartModalOpen ? (
                  <div className="flex flex-col h-full animate-in fade-in duration-300">
                    <div className="p-3 space-y-2.5">
                      <div className="flex justify-between items-center"><span className="text-xs text-slate-500 font-medium">Status:</span><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedStation.rain_total).style}`}>{getStatusBadge(selectedStation.rain_total).text}</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-slate-500 font-medium">Curah Hujan:</span><span className="text-sm font-black text-slate-800">{selectedStation.rain_total} <span className="text-[10px] font-bold text-slate-400 uppercase">mm</span></span></div>

                      {selectedStation.type === 'AWS' && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500 font-medium mb-2">Parameter Observasi AWS</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-col justify-between"><span className="text-[9px] text-slate-500 font-medium mb-1.5 flex items-center gap-1"><Thermometer size={10} className="text-blue-500" /> Suhu & RH</span><div className="flex items-center justify-between w-full mt-auto"><span className="text-[11px] font-black text-slate-700 leading-none">{selectedStation.air_temperature ?? '-'} <span className="text-[8px] font-bold text-slate-400">{"°C"}</span></span><span className="text-[11px] font-black text-slate-700 leading-none">{selectedStation.humidity ?? '-'} <span className="text-[8px] font-bold text-slate-400">{"%"}</span></span></div></div>
                            <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-col justify-between"><span className="text-[9px] text-slate-500 font-medium mb-1.5 flex items-center gap-1"><Wind size={10} className="text-blue-500" /> Angin (Dir/Spd)</span><div className="flex items-center justify-between w-full mt-auto"><span className="text-[11px] font-black text-slate-700 leading-none">{selectedStation.wind_direction ?? '-'} <span className="text-[8px] font-bold text-slate-400">{"°"}</span></span><span className="text-[11px] font-black text-slate-700 leading-none">{selectedStation.wind_speed ?? '-'} <span className="text-[8px] font-bold text-slate-400">{"m/s"}</span></span></div></div>
                            <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-col"><span className="text-[9px] text-slate-500 font-medium mb-1 flex items-center gap-1"><Gauge size={10} className="text-blue-500" /> Tekanan</span><span className="text-[11px] font-black text-slate-700 leading-none mt-auto">{selectedStation.air_pressure ?? '-'} <span className="text-[8px] font-bold text-slate-400">{"hPa"}</span></span></div>
                            <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-col"><span className="text-[9px] text-slate-500 font-medium mb-1 flex items-center gap-1"><SunMedium size={10} className="text-blue-500" /> Radiasi</span><span className="text-[11px] font-black text-slate-700 leading-none mt-auto">{selectedStation.solar_radiation ?? '-'} <span className="text-[8px] font-bold text-slate-400">{"W/m²"}</span></span></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-3"><hr className="border-slate-100" /></div>

                    <div className="p-3 space-y-2.5">
                      <div className="flex items-center gap-1.5 mb-1.5"><MapPin size={12} className="text-slate-400" /><span className="text-[10px] font-bold text-slate-500 uppercase">Koordinat</span></div>
                      <div className="flex justify-between pl-5 text-[10px] text-slate-600"><p>Lat: {parseFloat(selectedStation.latitude).toFixed(4)}</p><p>Lon: {parseFloat(selectedStation.longitude).toFixed(4)}</p></div>
                      <button onClick={() => setIsChartModalOpen(true)} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 mt-2 text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"><BarChart3 size={14} /> Lihat Tren Harian</button>
                    </div>

                    <div className="bg-slate-50 p-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium mt-auto">
                      <div className="flex items-center gap-1"><Clock size={12} /><span>Update:</span>{formatTime(selectedStation.record_time)}</div>
                      <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${checkIsOffline(selectedStation) ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'}`}>{checkIsOffline(selectedStation) ? 'Offline' : 'Online'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 w-full h-[300px] sm:h-[350px] animate-in fade-in zoom-in-95 duration-300">
                    <HourlyRainChart stationName={selectedStation.station_name} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* 🔴 TAMPILAN 2: INFO HOTSPOT */}
          {selectedHotspot && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="p-3 flex items-start justify-between shrink-0">
                <div className="flex gap-2.5 items-center">
                  <Flame size={18} className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">INFO TITIK PANAS (HOTSPOT)</p>
                    <h3 className="text-sm font-black text-slate-800 leading-tight line-clamp-1">{selectedHotspot.subDistrict}</h3>
                    {selectedHotspot.district && (
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{selectedHotspot.district}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedHotspot(null)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg hidden sm:block"><X size={16} /></button>
              </div>

              <div className="px-3 shrink-0"><hr className="border-slate-100" /></div>

              <div className="overflow-y-auto custom-scrollbar flex-1">
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Tingkat Kepercayaan:</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black border shadow-sm ${
                      selectedHotspot.conf >= 9 ? 'bg-red-50 text-red-600 border-red-200' :
                      selectedHotspot.conf >= 7 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-yellow-50 text-yellow-600 border-yellow-200'
                    }`}>
                      Level {selectedHotspot.conf} 
                      <span className="text-[9px] uppercase tracking-wider ml-1 font-bold">
                        ({selectedHotspot.conf >= 9 ? 'Tinggi' : selectedHotspot.conf >= 7 ? 'Sedang' : 'Rendah'})
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Satelit Pendeteksi:</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
                      {selectedHotspot.satellite}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Koordinat Lokasi</span>
                    </div>
                    <div className="flex justify-between pl-5 text-[10px] text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p>Lat: <span className="font-bold text-slate-700">{selectedHotspot.lat.toFixed(4)}</span></p>
                      <p>Lon: <span className="font-bold text-slate-700">{selectedHotspot.lng.toFixed(4)}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium mt-auto">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-400" />
                  <span>Waktu Observasi:</span>
                </div>
                <div className="font-bold text-slate-700 tracking-wide">
                  {selectedHotspot.date}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}