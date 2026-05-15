"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// HELPER AUTO ZOOM
const AutoZoom = ({ geoData }: { geoData: any }) => {
  const map = useMap();
  useEffect(() => {
    if (geoData && geoData.features?.length > 0) {
      try {
        const geoJsonLayer = L.geoJSON(geoData);
        map.fitBounds(geoJsonLayer.getBounds(), { padding: [40, 40] });
      } catch (e) { console.error("Auto zoom map error", e); }
    }
  }, [geoData, map]);
  return null;
};

// HELPER WARNA BERDASARKAN TIPE AREA
const getWarningStyle = (tipeArea: string) => {
  const isMeluas = String(tipeArea || "").toLowerCase().includes("meluas");
  if (isMeluas) return { fill: "#fdfc14", label: "Area Meluas" };
  return { fill: "#fdaf15", label: "Area Terjadi" }; // Default: Terjadi
};

export default function WarningMap({ data }: { data: any }) {
  const [hoveredData, setHoveredData] = useState<any | null>(null);

  // Styling Poligon
  const onStyle = (feature: any) => {
    const style = getWarningStyle(feature.properties.tipearea);
    return { 
      color: "#000000", 
      fillColor: style.fill, 
      fillOpacity: 0.65, 
      weight: 0.3, 
      opacity: 0.6 
    };
  };

  // Bind Event & Popup ke masing-masing Poligon
  const onEachFeature = (feature: any, layer: any) => {
    const style = getWarningStyle(feature.properties.tipearea);
    
    // 1. Buat Balon Popup HTML saat area diklik
    const popupContent = `
      <div style="text-align: center; font-family: sans-serif; min-width: 120px;">
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1e293b;">Kec. ${feature.properties.namakecamatan}</h4>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">${feature.properties.namakotakab}</p>
        <div style="display: inline-block; padding: 4px 8px; background: ${style.fill}; border: 1px solid rgba(0,0,0,0.1); border-radius: 4px; font-size: 10px; font-weight: bold; color: #1e293b;">
          ${style.label}
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);

    // 2. Pasang Sensor Interaksi
    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.9, weight: 2, opacity: 1 });
        setHoveredData(feature.properties);
      },
      mouseout: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.65, weight: 1, opacity: 0.6 });
        setHoveredData(null);
      },
      click: (e: any) => {
        // Saat diklik, peta otomatis Zoom & Fokus ke kecamatan tersebut
        const map = e.target._map;
        map.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 10 });
      }
    });
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer center={[0.5, 116.4]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {data?.features?.length > 0 && (
          <>
            <AutoZoom geoData={data} />
            <GeoJSON 
              data={data} 
              style={onStyle}
              onEachFeature={onEachFeature} 
            />
          </>
        )}
      </MapContainer>

      {/* Floating Info Hover */}
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 pointer-events-none transition-all duration-300">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Area</h4>
        {hoveredData ? (
          <div>
            <div className="text-slate-800 font-bold leading-tight text-sm mb-2">Kec. {hoveredData.namakecamatan}</div>
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
               <span className="text-slate-500">Tipe Area:</span>
               <span className="font-bold px-2 py-0.5 rounded text-slate-800 shadow-sm border border-black/10" style={{ backgroundColor: getWarningStyle(hoveredData.tipearea).fill }}>
                 {getWarningStyle(hoveredData.tipearea).label}
               </span>
            </div>
            <div className="mt-2 text-[10px] text-center font-bold text-slate-500 bg-slate-50 rounded border border-slate-100 py-1">
                {hoveredData.namakotakab}
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-xs italic">Arahkan kursor ke area berwarna di peta.</div>
        )}
      </div>

      {/* Legend Map */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 text-xs pointer-events-none">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-2">Keterangan:</span>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span className="w-4 h-4 rounded border border-black/80" style={{ backgroundColor: "#fdaf15" }}></span> Area Terjadi
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span className="w-4 h-4 rounded border border-black/80" style={{ backgroundColor: "#fdfc14" }}></span> Area Meluas
            </div>
          </div>
      </div>
    </div>
  );
}