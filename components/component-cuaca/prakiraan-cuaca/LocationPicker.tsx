"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Fix Icon Leaflet
const customIcon = L.divIcon({
  className: "custom-pin",
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0 relative">
      <MapContainer 
        center={[-6.200000, 106.816666]} // Default Jakarta
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <LocationMarker onSelect={onLocationSelect} />
      </MapContainer>
      
      {/* Overlay Instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-xs font-medium text-slate-600 z-[1000]">
        Klik peta untuk melihat prakiraan cuaca
      </div>
    </div>
  );
}