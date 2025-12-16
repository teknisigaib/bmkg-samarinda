"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// --- KONFIGURASI WILAYAH KALTIM ---
// Koordinat Tengah Kaltim (Kira-kira di Kutai Kartanegara)
const CENTER_KALTIM: [number, number] = [0.5387, 116.4194]; 

// Batas Wilayah (SouthWest, NorthEast)
// Ini adalah "Pagar" agar user tidak bisa geser ke Jawa atau Sulawesi
const BOUNDS_KALTIM: L.LatLngBoundsExpression = [
  [-2.6, 113.5], // Titik Kiri Bawah (Barat Daya)
  [2.6, 119.5]   // Titik Kanan Atas (Timur Laut)
];

// Fix icon marker default Leaflet di Next.js yang sering error/hilang
const iconDefault = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = iconDefault;

// Component untuk mengatur batas secara programatik saat load
const BoundsEnforcer = () => {
    const map = useMap();
    useEffect(() => {
        map.setMaxBounds(BOUNDS_KALTIM);
        map.setMinZoom(7); // Zoom minimal (agar tidak zoom out melihat dunia)
    }, [map]);
    return null;
};

interface KaltimMapProps {
    onSelect: (coords: { lat: number; lng: number }) => void;
}

export default function KaltimMap({ onSelect }: KaltimMapProps) {
  return (
    <MapContainer 
        center={CENTER_KALTIM} 
        zoom={8} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        // Properti kunci untuk membatasi geseran:
        maxBounds={BOUNDS_KALTIM} 
        maxBoundsViscosity={1.0} // 1.0 = Tembok keras (tidak bisa ditarik sama sekali)
        minZoom={7}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Helper untuk menegakkan aturan batas */}
      <BoundsEnforcer />

      {/* Marker Statis di Tengah (Contoh Visual) */}
      <Marker position={CENTER_KALTIM}>
        <Popup>
          Pusat Kalimantan Timur
        </Popup>
      </Marker>

      {/* Nanti di sini Anda bisa menambahkan logika:
         <MapEvents onClick={(e) => onSelect(e.latlng)} /> 
         untuk menangkap klik user 
      */}

    </MapContainer>
  );
}