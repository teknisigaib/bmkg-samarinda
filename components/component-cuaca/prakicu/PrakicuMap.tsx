"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface WeatherDataPoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  temp: number;
  windSpeed: number;
  windDir: number;
  image: string;
  type?: "kota" | "kecamatan" | "kelurahan";
}

interface PrakicuMapProps {
  data: WeatherDataPoint[];
  activeLayer: "icon" | "temp" | "wind";
  onZoomChange: (zoom: number) => void;
  resetTrigger: number;
  onMarkerClick: (locationId: string, locationName: string, type?: string) => void; 
  activeLocationId?: string;
  flyToTarget?: { lat: number; lon: number; zoom: number; ts: number } | null;
  // BARU: Koordinat asli GPS pengguna
  userCoords?: { lat: number; lon: number } | null; 
}

export default function PrakicuMap({ 
  data, 
  activeLayer, 
  onZoomChange, 
  resetTrigger,
  onMarkerClick,
  activeLocationId,
  flyToTarget,
  userCoords
}: PrakicuMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // 1. INISIALISASI PETA DASAR
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([0.5, 116.5], 6);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    onZoomChange(map.getZoom());
    map.on("zoomend", () => onZoomChange(map.getZoom()));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. KONTROL RESET KAMERA & TERBANG KE GPS
  useEffect(() => {
    if (mapInstanceRef.current && resetTrigger > 0) {
      mapInstanceRef.current.flyTo([0.5, 116.5], 6, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (mapInstanceRef.current && flyToTarget) {
      mapInstanceRef.current.flyTo([flyToTarget.lat, flyToTarget.lon], flyToTarget.zoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [flyToTarget]);

  // 3. PLOT DATA KE PETA (DENGAN CLICK-TO-ZOOM)
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    data.forEach((point) => {
      let htmlString = "";
      let iconSize: [number, number] = [32, 32];

      const isActiveMarker = point.id === activeLocationId;
      const highlightRing = isActiveMarker ? "ring-4 ring-blue-500/50 ring-offset-2 scale-110" : "transition-transform group-hover:scale-110";
      const tooltipStyle = "absolute top-12 text-[10px] font-bold text-slate-700 bg-white/95 border border-slate-200 px-2 py-0.5 rounded-md shadow-sm backdrop-blur-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none";

      if (activeLayer === "icon") {
        const imgEffect = isActiveMarker ? "scale-125 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "drop-shadow-md transition-transform group-hover:scale-110";
        htmlString = `<div class="relative flex flex-col items-center group cursor-pointer z-40"><img src="${point.image}" alt="cuaca" class="w-11 h-11 object-contain ${imgEffect}" /><span class="${tooltipStyle} top-10">${point.name}</span></div>`;
        iconSize = [44, 44];
      } 
      else if (activeLayer === "temp") {
        let tempColor = "#3b82f6";
        if (point.temp >= 31) tempColor = "#ef4444"; else if (point.temp >= 28) tempColor = "#f59e0b";
        htmlString = `<div class="relative flex flex-col items-center group cursor-pointer z-40"><div style="background-color: ${tempColor}" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white ${highlightRing}">${point.temp}°</div><span class="${tooltipStyle}">${point.name}</span></div>`;
        iconSize = [40, 40];
      } 
      else if (activeLayer === "wind") {
        const size = 20 + point.windSpeed; 
        const windRing = isActiveMarker ? "drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] scale-125" : "drop-shadow-md transition-transform group-hover:scale-125";
        htmlString = `<div class="relative flex flex-col items-center group cursor-pointer z-40"><div style="transform: rotate(${point.windDir}deg); width: ${size}px; height: ${size}px; color: #0284c7;" class="flex items-center justify-center ${windRing}"><svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="#0ea5e9" stroke="white" stroke-width="1.5"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg></div><span class="${tooltipStyle} top-8">${point.name}: ${point.windSpeed} km/h</span></div>`;
        iconSize = [size, size];
      }

      const customIcon = L.divIcon({ className: "bg-transparent", html: htmlString, iconSize: iconSize, iconAnchor: [iconSize[0] / 2, iconSize[1] / 2] });
      const marker = L.marker([point.lat, point.lon], { icon: customIcon });
      
      marker.on("click", () => {
        onMarkerClick(point.id, point.name, point.type);
        
        // AUTO-FLY SAAT KLIK LOKASI
        if (mapInstanceRef.current) {
          const currentMapZoom = mapInstanceRef.current.getZoom();
          let targetZoom = currentMapZoom;
          if (point.type === "kota" && currentMapZoom < 9) targetZoom = 10;
          else if (point.type === "kecamatan" && currentMapZoom < 12) targetZoom = 13;
          
          mapInstanceRef.current.flyTo([point.lat, point.lon], targetZoom, { duration: 1.2, easeLinearity: 0.25 });
        }
      });

      marker.addTo(layerGroupRef.current!);
    });
    if (userCoords) {
      const userHtml = `
        <div class="relative flex items-center justify-center w-6 h-6">
          <div class="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-60"></div>
          <div class="relative w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: "bg-transparent",
        html: userHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      // zIndexOffset 1000 agar titik user selalu berada di atas ikon BMKG
      L.marker([userCoords.lat, userCoords.lon], { icon: userIcon, zIndexOffset: 1000 }).addTo(layerGroupRef.current!);
    }
  }, [data, activeLayer, activeLocationId, onMarkerClick]);

  return <div ref={mapRef} className="w-full h-full z-0" style={{ background: "#f8fafc" }}></div>;
}