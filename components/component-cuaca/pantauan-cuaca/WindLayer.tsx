"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// 👉 Sekarang menerima data langsung dari props
export default function WindLayer({ data }: { data: any }) {
  const map = useMap();

  useEffect(() => {
    // Jika data belum ada, jangan lakukan apa-apa
    if (!data || data.length === 0) return;

    let velocityLayer: any = null;

    try {
      require("leaflet-velocity");

      // @ts-ignore
      velocityLayer = L.velocityLayer({
        displayValues: true,
       displayOptions: {
            velocityType: "Arah", // 👈 Teks akan menjadi "Arah: ... Speed: ..."
            displayPosition: "topright", 
            displayEmptyString: "Arahkan kursor ke garis angin", // 👈 Teks instruksi
            angleConvention: "bearingCW",
            speedUnit: "m/s",
          },
        data: data,           
        maxVelocity: 15,      
        velocityScale: 0.02,        
        particleAge: 80,            
        particleMultiplier: 1 / 500, 
        lineWidth: 1.5,             
        colorScale: [
          "#3b82f6", "#10b981", "#eab308", "#f97316", "#ef4444"
        ],
      });

      velocityLayer.addTo(map);
    } catch (error) {
      console.error("Gagal memuat animasi angin:", error);
    }

    return () => {
      if (velocityLayer && map.hasLayer(velocityLayer)) {
        map.removeLayer(velocityLayer);
      }
    };
  }, [map, data]); // Me-render ulang jika map atau data berubah

  return null; 
}