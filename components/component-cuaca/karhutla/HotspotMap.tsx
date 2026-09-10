"use client";

import { MapContainer, TileLayer, GeoJSON, useMap, ZoomControl, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useMemo } from "react";
import { Info, Compass, Calendar, Maximize, Minimize, X } from "lucide-react";

interface HotspotItem {
  id: number; bujur: string; lintang: string; kepercayaan: number;
  kabupaten: string; kecamatan: string; satelit: string; tanggal: string; waktu: string;
}

interface HotspotMapProps {
  data: HotspotItem[];
  mapStyle: string;
  spartanDate: string;
  showFfmc: boolean;
  showIsi: boolean;
  showFwi: boolean;
  spartanOpacity: number;
}

const getStatusInfo = (conf: number) => {
  if (conf >= 9) return { label: "Tinggi", color: "#f00707", bg: "bg-red-50", text: "text-red-700" };
  if (conf >= 8) return { label: "Sedang", color: "#f3e309", bg: "bg-yellow-50", text: "text-yellow-700" };
  return { label: "Rendah", color: "#13ce1d", bg: "bg-green-50", text: "text-green-700" };
};

// 🚀 FIX: Visual titik 11x11px (seperti radius 5.5), tapi hitbox sentuh 24x24px, tanpa efek Glow.
const createHotspotIcon = (conf: number, isSelected: boolean) => {
  const bgColor = conf >= 9 ? "#f00707" : conf >= 8 ? "#f3e309" : "#13ce1d";
  const scaleClass = isSelected ? "transform scale-125 ring-2 ring-white/50" : "hover:scale-110";
  
  const html = `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="relative inline-flex rounded-full border-[1.5px] border-white shadow-sm transition-all duration-200 ${scaleClass}" style="background-color: ${bgColor}; width: 11px; height: 11px;"></div>
    </div>
  `;
  return L.divIcon({ html: html, className: "", iconSize: [24, 24], iconAnchor: [12, 12] });
};

const AutoBounds = ({ data }: { data: HotspotItem[] }) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.length > 0) {
      try {
        const latLngs = data.map(item => [parseFloat(item.lintang), parseFloat(item.bujur)] as [number, number]);
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.error("Bounds error", e);
      }
    } else {
      map.setView([-0.5, 117], 7);
    }
  }, [data, map]);
  return null;
};

// Deteksi Klik Peta Kosong
function MapInteraction({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: () => onMapClick() });
  return null;
}

export default function HotspotMap({ data, mapStyle, spartanDate, showFfmc, showIsi, showFwi, spartanOpacity }: HotspotMapProps) {
  const [hoveredSpot, setHoveredSpot] = useState<{ props: HotspotItem, lat: number, lng: number } | null>(null);
  const [kaltimMask, setKaltimMask] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Logic Swipe-to-Dismiss Mobile
  const [touchStartY, setTouchStartY] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 50) setHoveredSpot(null);
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const elem = document.getElementById("karhutla-map-wrapper") || document.documentElement;
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    }
  };

  useEffect(() => {
    fetch('/geojson/WilayahKaltim1.json')
      .then(res => res.json())
      .then(geoJson => {
        const worldOuter = [ [-180, 90], [180, 90], [180, -90], [-180, -90], [-180, 90] ];
        let holes: any[] = [];
        const features = geoJson.features || [geoJson];
        features.forEach((feature: any) => {
          if (feature.geometry?.type === 'Polygon') holes.push(feature.geometry.coordinates[0]);
          else if (feature.geometry?.type === 'MultiPolygon') feature.geometry.coordinates.forEach((poly: any) => holes.push(poly[0]));
        });
        setKaltimMask({
          type: "FeatureCollection",
          features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [worldOuter, ...holes] }, properties: {} }]
        });
      })
      .catch(err => console.error("Gagal memuat GeoJSON WilayahKaltim1:", err));
  }, []);

  const getBasemapUrl = () => {
    if (mapStyle === 'dark') return "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=cb1_32wf_1_a69d1812376e13fad46ef99a";
    if (mapStyle === 'satellite') return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_32wf_1_a69d1812376e13fad46ef99a"; 
  };

  const todayTime = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}0000`;
  }, []);

  const spartanTime = useMemo(() => {
    if (!spartanDate) return "";
    return `${spartanDate.replace(/-/g, "")}0000`;
  }, [spartanDate]);

  const statusInfo = hoveredSpot ? getStatusInfo(hoveredSpot.props.kepercayaan) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-top.leaflet-right .leaflet-control-zoom { margin-top: 64px !important; border: 1px solid rgba(226, 232, 240, 0.8) !important; box-shadow: 0 8px 30px -4px rgba(0,0,0,0.15) !important; }
      `}} />

      <div className="absolute inset-0 z-0">
        <MapContainer center={[-0.5, 117]} zoom={7} zoomControl={false} className="w-full h-full bg-[#020617]" preferCanvas={true}>
          
          <TileLayer key={mapStyle} attribution='&copy; CARTO' url={getBasemapUrl()} />
          <ZoomControl position="topright" />
          <AutoBounds data={data} />

          <MapInteraction onMapClick={() => setHoveredSpot(null)} />

          {/* LAYER SPARTAN */}
          {showFfmc && spartanTime && <TileLayer key={`ffmc-${spartanTime}`} url={`https://spartan.bmkg.go.id/map/rgb_req/spartan/ffmc/0/${todayTime}/${spartanTime}/{z}/{x}/{y}.png`} opacity={spartanOpacity} zIndex={5} tms={true} />}
          {showIsi && spartanTime && <TileLayer key={`isi-${spartanTime}`} url={`https://spartan.bmkg.go.id/map/rgb_req/spartan/isi/0/${todayTime}/${spartanTime}/{z}/{x}/{y}.png`} opacity={spartanOpacity} zIndex={6} tms={true} />}
          {showFwi && spartanTime && <TileLayer key={`fwi-${spartanTime}`} url={`https://spartan.bmkg.go.id/map/rgb_req/spartan/fwi/0/${todayTime}/${spartanTime}/{z}/{x}/{y}.png`} opacity={spartanOpacity} zIndex={7} tms={true} />}

          {/* MASKING GELAP KALTIM */}
          {kaltimMask && (
            <GeoJSON 
              key={`kaltim-mask-${mapStyle}`}
              data={kaltimMask}
              interactive={false}
              style={{
                fillColor: mapStyle === 'dark' ? '#020617' : '#0f172a', 
                fillOpacity: mapStyle === 'satellite' ? 0.85 : 0.75,    
                color: '#64748b', weight: 0.6, opacity: 0.9, fillRule: 'evenodd' as any                              
              }}
            />
          )}

          {/* RENDERING HOTSPOT MARKER MURNI */}
          {data && data.map((item) => {
            const lat = parseFloat(item.lintang);
            const lng = parseFloat(item.bujur);
            if (isNaN(lat) || isNaN(lng)) return null;

            const isSelected = hoveredSpot?.props.id === item.id;
            
            return (
              <Marker 
                key={item.id} 
                position={[lat, lng]} 
                icon={createHotspotIcon(item.kepercayaan || 0, isSelected)}
                eventHandlers={{
                  click: () => {
                    setHoveredSpot({ props: item, lat, lng });
                  }
                }}
              />
            );
          })}

        </MapContainer>
      </div>

      <button 
        onClick={toggleFullscreen}
        title={isFullscreen ? "Keluar Fullscreen" : "Tampilan Penuh"}
        className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] border border-slate-200/80 text-slate-600 hover:text-blue-500 hover:bg-white transition-all focus:outline-none pointer-events-auto"
      >
        {isFullscreen ? <Minimize size={18} strokeWidth={2.5} /> : <Maximize size={18} strokeWidth={2.5} />}
      </button>
      
      {/* 🚀 INFO WINDOW: Dibikin sangat compact & slim di Mobile */}
      <div 
        className={`absolute z-[2000] bg-white/95 backdrop-blur-md transition-transform duration-300 pointer-events-auto
          /* MOBILE CSS: Padding dikurangi jauh (p-3 pb-4), memakan lebih sedikit ruang layar */
          bottom-0 left-0 w-full p-3 pb-4 rounded-t-xl shadow-[0_-8px_30px_-4px_rgba(0,0,0,0.15)] border-t border-slate-200/80
          ${hoveredSpot ? "translate-y-0" : "translate-y-full"} 
          /* DESKTOP CSS */
          md:top-4 md:right-[64px] md:bottom-auto md:left-auto md:w-[260px] md:p-4 md:rounded-xl md:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] md:border md:translate-y-0
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Garis Swipe (Mobile) lebih tipis & mepet */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-0 mb-2 md:hidden shrink-0"></div>

        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between border-b border-slate-100 pb-2 pointer-events-auto">
           <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> INFO TITIK PANAS</span>
           {hoveredSpot && (
             <button onClick={() => setHoveredSpot(null)} className="md:hidden bg-slate-100 hover:bg-slate-200 text-slate-500 p-1.5 rounded-full transition-colors">
               <X size={14} strokeWidth={2.5} />
             </button>
           )}
        </h4>

        {hoveredSpot && statusInfo ? (
          <div className="pointer-events-auto pb-1 md:pb-0">
            <div className="text-slate-800 font-bold leading-tight text-sm mb-0.5 line-clamp-1 capitalize">
                Kec. {hoveredSpot.props.kecamatan?.toLowerCase() || "Tidak Diketahui"}
            </div>
            <div className="text-slate-500 text-[10px] md:text-[11px] font-semibold tracking-widest uppercase mb-2 pb-1.5 border-b border-slate-100 line-clamp-1">
                {hoveredSpot.props.kabupaten || "Kabupaten Tidak Diketahui"}
            </div>
            
            <div className="flex flex-col gap-1.5 md:gap-2">
               <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1.5 md:px-2.5 md:py-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium">Kepercayaan</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase tracking-widest ${statusInfo.bg} ${statusInfo.text}`}> 
                      {statusInfo.label} ({hoveredSpot.props.kepercayaan})
                  </span>
               </div>
               <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1.5 md:px-2.5 md:py-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium">Satelit Pantau</span>
                  <span className="font-semibold text-slate-700 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">{hoveredSpot.props.satelit}</span>
               </div>
               <div className="flex flex-col gap-1 md:gap-1.5 text-[11px] bg-slate-50 px-2 py-1.5 md:px-2.5 md:py-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Compass className="w-3.5 h-3.5 text-blue-500" /> <span>Koordinat</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-slate-700 font-semibold bg-white px-2 py-1 rounded shadow-inner border border-slate-200">
                    <span>Lat: {hoveredSpot.lat.toFixed(5)}</span>
                    <span>Lon: {hoveredSpot.lng.toFixed(5)}</span>
                  </div>
               </div>
               <div className="text-[9px] text-center text-slate-400 mt-1 md:mt-1.5 flex items-center justify-center gap-1 font-medium uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {hoveredSpot.props.tanggal.split("T")[0]} | {hoveredSpot.props.waktu} WIB
               </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:block pointer-events-auto text-slate-400 text-[10px] font-medium leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
            Arahkan kursor pada titik di peta untuk melihat rincian lokasi, tingkat kepercayaan, dan koordinat.
          </div>
        )}
      </div>

    </>
  );
}