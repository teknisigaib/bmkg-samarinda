"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// ... (Kode customIcon tetap sama) ...
const customIcon = L.divIcon({
  className: "custom-pin",
  html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); position: relative;">
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white;"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

interface LocationMapProps {
  coords: { lat: number; lng: number } | null;
  label: string;
  onMapClick?: (lat: number, lng: number) => void; // Tambah prop ini
}

// Komponen penangkap klik
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Komponen Helper Controller (tetap sama)
function MapController({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 13, { duration: 2 });
    }
  }, [coords, map]);
  return null;
}

export default function LocationMap({ coords, label, onMapClick }: LocationMapProps) {
  // Tambah state lokal untuk marker sementara saat user klik
  const [tempMarker, setTempMarker] = useState<{lat: number, lng: number} | null>(null);

  // Jika coords dari parent berubah (hasil dropdown), hapus marker temp
  useEffect(() => {
      if (coords) setTempMarker(null);
  }, [coords]);

  const handleInternalClick = (lat: number, lng: number) => {
      setTempMarker({ lat, lng });
      if (onMapClick) onMapClick(lat, lng);
  };

  const displayCoords = coords || tempMarker;

  return (
    <div className="h-full w-full z-0 relative">
      <MapContainer center={[-2.5489, 118.0149]} zoom={5} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
        
        <MapController coords={coords} />
        <MapClickHandler onMapClick={handleInternalClick} />

        {displayCoords && (
          <Marker position={[displayCoords.lat, displayCoords.lng]} icon={customIcon}>
            <Popup>{coords ? label : "Mencari data wilayah..."}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}