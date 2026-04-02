"use client";

import { useState, useEffect } from "react";
// 👉 Tambahkan GeoJSON di import
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polygon, Tooltip, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { WeatherStationData } from "@/lib/api-cuaca"; 
import { HotspotData } from "@/lib/data-karhutla"; 
import { Info, MapPin, Clock, X, BarChart3, Sun, CheckCircle2, Thermometer, Droplets, Wind, Gauge, SunMedium, Maximize, Minimize, ArrowLeft, LocateFixed, Loader2, Flame } from "lucide-react";

import HourlyRainChart from "./HourlyRainChart";
import RadarLayer from "@/components/component-cuaca/penerbangan/Radarlayer"; 
import HimawariLayer from "@/components/component-cuaca/penerbangan/HimawariLayer"; 
import LayerControl from "./LayerControl";
import WindLayer from "./WindLayer"; // Sesuaikan dengan path Anda 

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

// --- HELPER: IKON STASIUN CUACA ---
const createCustomIcon = (rainTotal: number, isSelected: boolean, isOffline: boolean, type: string) => {
  let pulseColor = "";
  if (rainTotal > 0 && !isOffline) {
    if (rainTotal <= 5) pulseColor = "bg-slate-400";
    else if (rainTotal <= 20) pulseColor = "bg-sky-400";
    else if (rainTotal <= 50) pulseColor = "bg-yellow-400";
    else if (rainTotal <= 100) pulseColor = "bg-orange-500";
    else pulseColor = "bg-red-500";
  }
  const coreColor = isOffline ? "bg-slate-400" : "bg-blue-500";
  const scaleClass = isSelected ? "scale-110" : "scale-100";
  const isAWS = type === "AWS";
  const shapeStyle = isAWS ? "rounded-full h-3 w-3" : "h-3 w-3"; 
  const triangleClip = !isAWS ? "style='clip-path: polygon(50% 0%, 0% 100%, 100% 100%);'" : "";
  const html = `
    <div class="relative flex items-center justify-center w-full h-full ${scaleClass}">
      ${(rainTotal > 0 && !isOffline) ? `<span class="animate-ping absolute inline-flex h-5 w-5 rounded-full ${pulseColor} opacity-75"></span>` : ''}
      <div ${triangleClip} class="relative inline-flex ${shapeStyle} ${coreColor} border-[1px] border-white shadow-sm transition-all duration-300"></div>
    </div>
  `;
  return L.divIcon({ html: html, className: "", iconSize: [32, 32], iconAnchor: [16, 16] });
};

// --- HELPER: IKON LOKASI GPS ---
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

// --- HELPER: IKON API HOTSPOT (SKALA 1-10) ---
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
  const [isLocating, setIsLocating] = useState(false);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [flyZoom, setFlyZoom] = useState(7);
  const [flyTrigger, setFlyTrigger] = useState(0);

  const [showHotspot, setShowHotspot] = useState(false);
  const [hotspotData, setHotspotData] = useState<HotspotData[]>([]);
  const [isLoadingHotspot, setIsLoadingHotspot] = useState(false);

  const [capData, setCapData] = useState<any>(null);

  const [showWind, setShowWind] = useState(false);
  const [windData, setWindData] = useState<any>(null);
  const [isLoadingWind, setIsLoadingWind] = useState(false);
  const [windTime, setWindTime] = useState<string | null>(null);

  // 👉 STATE BARU UNTUK GEOJSON & MASKING
  const [kaltimMask, setKaltimMask] = useState<any[] | null>(null);
  const [kaltimBorder, setKaltimBorder] = useState<any>(null);

  // 👉 FETCH GEOJSON KALTIM & BUAT POLIGON TERBALIK (MASK)
  useEffect(() => {
    fetch('/geojson/WilayahKaltim1.json')
      .then(res => res.json())
      .then(data => {
        setKaltimBorder(data); // Simpan untuk garis batas
        
        // Buat kotak raksasa menutupi seluruh dunia
        const worldRing = [ [90, -180], [90, 180], [-90, 180], [-90, -180] ];
        const holes: any[] = [];
        
        // Ekstrak koordinat Kaltim sebagai "lubang"
        const extractHoles = (coords: any[]) => {
          if (typeof coords[0][0] === 'number') {
            holes.push(coords.map((c: any[]) => [c[1], c[0]])); // Tukar Lng,Lat jadi Lat,Lng
          } else {
            coords.forEach(extractHoles);
          }
        };
        
        if (data.features) {
          data.features.forEach((f: any) => {
            if (f.geometry && f.geometry.coordinates) extractHoles(f.geometry.coordinates);
          });
        }
        
        // Gabungkan dunia dan lubang
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
    if (showWarning && !capData) {
      fetch('/api/warnings')
        .then(res => res.json())
        .then(d => setCapData(d))
        .catch(err => console.error("Gagal fetch CAP:", err));
    }
  }, [showWarning, capData]);

  // 👉 FETCH DATA ANGIN SAAT TOGGLE DINYALAKAN
  useEffect(() => {
    if (showWind && !windData) {
      setIsLoadingWind(true);
      fetch('/api/wind')
        .then(res => res.json())
        .then(data => {
          setWindData(data);
          // Ekstrak waktu dari JSON Header Open-Meteo
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

  const handleLocateMe = () => {
    if (userPos) {
      setUserPos(null); 
      setFlyTarget(defaultCenter); 
      setFlyZoom(7); 
      setFlyTrigger(Date.now());
      return;
    }
    setIsLocating(true);
    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const d = await res.json();
        if (d.latitude && d.longitude) {
          setUserPos([parseFloat(d.latitude), parseFloat(d.longitude)]);
          setFlyTarget([parseFloat(d.latitude), parseFloat(d.longitude)]);
          setFlyZoom(10); setFlyTrigger(Date.now()); setIsLocating(false);
        } else throw new Error("Gagal parsing IP");
      } catch (err) {
        alert("Gagal melacak lokasi."); setIsLocating(false);
      }
    };
    if (!navigator.geolocation) return fallbackToIP();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setFlyTarget([pos.coords.latitude, pos.coords.longitude]);
        setFlyZoom(12); setFlyTrigger(Date.now()); setIsLocating(false);
      },
      (err) => fallbackToIP(),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 } 
    );
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
    if (rainTotal === 0) return { text: "Tidak Hujan", style: "bg-slate-100 text-slate-600 border-slate-200" };
    if (rainTotal <= 5) return { text: "Hujan Sangat Ringan", style: "bg-slate-100 text-slate-600 border-slate-300" };
    if (rainTotal <= 20) return { text: "Hujan Ringan", style: "bg-sky-100 text-sky-700 border-sky-300" };
    if (rainTotal <= 50) return { text: "Hujan Sedang", style: "bg-yellow-100 text-yellow-800 border-yellow-400" };
    if (rainTotal <= 100) return { text: "Hujan Lebat", style: "bg-orange-100 text-orange-800 border-orange-400" };
    return { text: "Hujan Ekstrem", style: "bg-red-100 text-red-700 border-red-300" };
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

  const getSeverityColor = (s: string) => {
    const l = s?.toLowerCase() || "";
    return l.includes("extreme") ? "#ef4444" : l.includes("severe") ? "#f97316" : "#eab308";
  };

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-[9999] w-screen h-screen bg-slate-100 rounded-none m-0" : "h-[500px] md:h-[600px] w-full relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200"}`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-150%); } } 
        .animate-marquee { display: inline-block; white-space: nowrap; animation-name: marquee; animation-timing-function: linear; animation-iteration-count: infinite; padding-left: 100%; }
        
        /* 👇 SULAP KOTAK INFO ANGIN JADI TAILWIND CARD (MIRIP ARG/AWS) 👇 */
        .leaflet-control-velocity { 
          background-color: rgba(255, 255, 255, 0.98) !important; 
          backdrop-filter: blur(12px) !important; 
          border: 1px solid #f1f5f9 !important; 
          border-radius: 1.25rem !important; /* rounded-2xl / 3xl */
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important; 
          padding: 16px 20px !important; 
          color: #1e293b !important; /* slate-800 */
          margin-top: 110px !important; 
          margin-right: 16px !important; 
          z-index: 1000 !important;
          pointer-events: none !important; 
          min-width: 240px !important;
          font-family: inherit !important;
        }

        /* HEADER CARD (Menambahkan Judul Info dan Garis Bawah) */
        .leaflet-control-velocity::before {
          content: "ⓘ INFO ANGIN";
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          color: #3b82f6; /* text-blue-500 (Senada dengan icon ARG) */
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #f1f5f9; /* slate-100 */
          padding-bottom: 12px;
          margin-bottom: 12px;
        }

        /* Teks Nilai Kecepatan dan Arah */
        .leaflet-control-velocity .velocity-overlay,
        .leaflet-control-velocity {
          font-size: 13px !important;
          font-weight: 800 !important;
          color: #0f172a !important; /* slate-900 */
          line-height: 1.6 !important;
        }
      `}} />

      {/* STATUS HUJAN */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-[75%] max-w-[280px] sm:max-w-[360px] pointer-events-auto transition-all duration-500">
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
        <button onClick={handleLocateMe} disabled={isLocating} className={`pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all border ${isLocating ? 'text-blue-500 border-slate-200/60' : userPos ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-slate-600 border-slate-200/60 hover:text-blue-500 hover:bg-white'}`}>
          {isLocating ? <Loader2 size={20} className="animate-spin" /> : <LocateFixed size={20} />}
        </button>
      </div>

      <LayerControl 
        showRadar={showRadar} setShowRadar={setShowRadar}
        showSatellite={showSatellite} setShowSatellite={setShowSatellite}
        showHotspot={showHotspot} setShowHotspot={setShowHotspot}
        showWarning={showWarning} setShowWarning={setShowWarning}
        showStations={showStations} setShowStations={setShowStations}
        mapStyle={mapStyle} setMapStyle={setMapStyle} 
        capData={capData}
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
          
          {/* LAYER CUACA: Satelit & Radar ditaruh SEBELUM Mask Kaltim */}
          {showSatellite && <HimawariLayer opacity={0.65} />}
          {showRadar && <RadarLayer opacity={0.65} />}
          {/* 👉 RENDER ANGIN (KIRIM DATA LEWAT PROPS) */}
          {showWind && windData && <WindLayer data={windData} />}

          {/* 👉 LAYER EFEK SPOTLIGHT (MASKING) */}
          {/* Ini akan menggelapkan semua area di luar Kaltim, termasuk menutupi radar/satelit di area tersebut */}
          {kaltimMask && (
            <Polygon 
              positions={kaltimMask} 
              pathOptions={{ 
                fillColor: '#0f172a', // Warna gelap (Slate 900)
                fillOpacity: mapStyle === 'dark' || mapStyle === 'satellite' ? 0.6 : 0.4, // Lebih pekat di mode gelap
                stroke: false 
              }} 
              interactive={false} // Agar klik mouse tembus ke layer bawahnya
            />
          )}

          {/* 👉 GARIS BATAS KALTIM */}
          {/* Digambar secara halus agar Kaltim terlihat lebih terdefinisi */}
          {kaltimBorder && (
            <GeoJSON 
              data={kaltimBorder} 
              style={{ 
                color: mapStyle === 'dark' || mapStyle === 'satellite' ? '#94a3b8' : '#64748b', // Warna garis batas (Slate)
                weight: 0.2, 
                fillOpacity: 0
              }} 
              interactive={false}
            />
          )}

          {/* RENDER POLIGON PERINGATAN DINI (CAP BMKG) */}
          {showWarning && capData?.active && capData.polygons.map((poly: any, idx: number) => (
            <Polygon 
              key={`cap-${idx}`}
              positions={poly}
              pathOptions={{ color: getSeverityColor(capData.severity), fillColor: getSeverityColor(capData.severity), fillOpacity: 0.35, weight: 1 }}
            >
              <Tooltip sticky>
                <div className="p-1">
                  <p className="font-bold text-xs text-red-600">{capData.event}</p>
                  <p className="text-[10px] text-slate-600">{capData.areaDesc}</p>
                </div>
              </Tooltip>
            </Polygon>
          ))}

          {/* RENDER TITIK HOTSPOT */}
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

          {/* RENDER STASIUN CUACA */}
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

      {/* MASTER BOTTOM SHEET */}
      {(selectedStation || selectedHotspot) && (
        <div 
          className={`fixed inset-x-0 bottom-0 z-[1000] bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-slate-200/60 pb-8 sm:absolute sm:bottom-auto sm:top-4 sm:inset-x-auto sm:left-auto sm:right-16 sm:rounded-2xl sm:pb-0 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col ${
            isChartModalOpen ? 'sm:w-[480px]' : 'sm:w-72'
          }`}
          onTouchStart={!isChartModalOpen ? handleTouchStart : undefined}
          onTouchEnd={!isChartModalOpen ? handleTouchEnd : undefined}
        >
          <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0"></div>

          {/* 🔴 TAMPILAN 1: INFO STASIUN / GRAFIK */}
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

          {/* 🔴 TAMPILAN 2: INFO HOTSPOT (TITIK API) */}
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