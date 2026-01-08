"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// --- TIPE DATA ---
export type WarningLevel = "AWAS" | "SIAGA" | "WASPADA" | "AMAN";

interface RegionData {
  id: string;      // ID atau Nama Kabupaten di GeoJSON
  name: string;
  level: WarningLevel;
}

interface ClimateMapProps {
  geoJsonData: any; // Data mentah GeoJSON
  warningData: RegionData[]; // Data status peringatan dari database (atau dummy)
  warningType: "HUJAN" | "KEKERINGAN"; // Jenis peringatan yang sedang aktif
}

// --- KONFIGURASI WARNA ---
const getColor = (level: WarningLevel) => {
  switch (level) {
    case "AWAS": return "#dc2626";    // Merah (Red-600)
    case "SIAGA": return "#ea580c";   // Oranye (Orange-600)
    case "WASPADA": return "#ca8a04"; // Kuning (Yellow-600)
    case "AMAN": return "#16a34a";    // Hijau (Green-600)
    default: return "#cbd5e1";        // Abu-abu (Slate-300) jika data null
  }
};

export default function ClimateMapClient({ geoJsonData, warningData, warningType }: ClimateMapProps) {
  
  // Fungsi styling untuk setiap wilayah (Polygon)
  const style = (feature: any) => {
    // Cari data status berdasarkan nama kabupaten di GeoJSON
    // Pastikan properti GeoJSON sesuai (misal: feature.properties.NAME_2 atau feature.properties.kabupaten)
    const regionName = feature.properties.Name_2 || feature.properties.KABUPATEN; 
    
    const regionStatus = warningData.find(
      (item) => item.name.toLowerCase() === regionName.toLowerCase()
    );

    const level = regionStatus ? regionStatus.level : "AMAN";

    return {
      fillColor: getColor(level),
      weight: 2,
      opacity: 1,
      color: 'white', // Warna garis batas
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Event handler (Hover & Click)
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const regionName = feature.properties.name || feature.properties.KABUPATEN;
    const regionStatus = warningData.find(
        (item) => item.name.toLowerCase() === regionName.toLowerCase()
    );
    const level = regionStatus ? regionStatus.level : "AMAN";

    // Tooltip sederhana saat hover
    layer.bindTooltip(`
      <div class="font-sans text-center">
        <div class="font-bold">${regionName}</div>
        <div class="text-xs">Status: ${level}</div>
      </div>
    `, { sticky: true, direction: "top" });

    // Efek Hover Highlight
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 4,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        // Reset style
        // @ts-ignore
        // layer.setStyle(style(feature)); // Cara ideal reset, atau biarkan default
         layer.setStyle({
            weight: 2,
            color: 'white',
            fillOpacity: 0.7
         })
      }
    });
  };

  return (
    <MapContainer 
      center={[0.5387, 116.4194]} // Koordinat Tengah Kalimantan Timur
      zoom={7} 
      scrollWheelZoom={false}
      className="w-full h-full rounded-xl z-0"
    >
      {/* Basemap (Peta Dasar) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Layer Polygon Kaltim */}
      {geoJsonData && (
        <GeoJSON 
          // Key penting agar React me-render ulang saat data berubah
          key={warningType} 
          data={geoJsonData} 
          // @ts-ignore
          style={style} 
          onEachFeature={onEachFeature} 
        />
      )}
      
      {/* Legend (Legenda) Overlay */}
      <div className="leaflet-bottom leaflet-right">
        <div className="leaflet-control bg-white p-4 rounded-lg shadow-lg mb-8 mr-8 border border-slate-200">
            <h4 className="font-bold text-sm mb-2 text-slate-800">Legenda Status</h4>
            <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-600 block"></span> Awas
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-orange-600 block"></span> Siaga
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-yellow-600 block"></span> Waspada
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-green-600 block"></span> Tidak Ada Peringatan
                </div>
            </div>
        </div>
      </div>

    </MapContainer>
  );
}