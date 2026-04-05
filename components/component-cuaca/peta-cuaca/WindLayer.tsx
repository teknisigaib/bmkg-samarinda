"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function WindLayer({ data }: { data: any }) {
  const map = useMap();
  const velocityLayerRef = useRef<any>(null);

  useEffect(() => {
    // 🛡️ PROTEKSI 1: Pastikan map dan data benar-benar siap
    if (!data || data.length === 0 || !map) return;

    const initWind = () => {
      try {
        // Load plugin
        require("leaflet-velocity");

        // 🛡️ PROTEKSI 2: Bersihkan layer lama jika masih nyangkut di memori
        if (velocityLayerRef.current) {
          if (map.hasLayer(velocityLayerRef.current)) {
            map.removeLayer(velocityLayerRef.current);
          }
          velocityLayerRef.current = null;
        }

        // Konfigurasi Layer
        // @ts-ignore
        const newLayer = L.velocityLayer({
          displayValues: true,
          displayOptions: {
            velocityType: "",
            position: "bottomleft",
            emptyString: "Arahkan",
            angleConvention: "bearingCW",
            speedUnit: "m/s",
          },
          data: data,
          maxVelocity: 15,
          velocityScale: 0.02,
          particleAge: 80,
          particleMultiplier: 1 / 500,
          lineWidth: 1.5,
          colorScale: ["#3b82f6", "#10b981", "#eab308", "#f97316", "#ef4444"],
        });

        // 🛡️ PROTEKSI 3: Tambahkan pengaman pada fungsi internal plugin sebelum ditambah ke peta
        // Ini adalah "Monkey Patch" untuk mencegah error containerPointToLayerPoint
        const originalOnAdd = newLayer.onAdd;
        newLayer.onAdd = function(mapInstance: any) {
          if (!mapInstance || !mapInstance._container) return;
          return originalOnAdd.call(this, mapInstance);
        };

        newLayer.addTo(map);
        velocityLayerRef.current = newLayer;

      } catch (error) {
        console.error("Gagal memuat animasi angin:", error);
      }
    };

    // Gunakan requestAnimationFrame agar eksekusi selaras dengan render peta
    const rafId = requestAnimationFrame(initWind);

    // 🧹 SIKAT BERSIH TOTAL
    return () => {
      cancelAnimationFrame(rafId);
      
      if (velocityLayerRef.current) {
        const layer = velocityLayerRef.current;
        
        // Hentikan semua proses animasi internal plugin secara paksa
        if (layer._canvas) {
          layer._canvas.remove();
        }
        
        try {
          // Cabut dari peta hanya jika map masih ada
          if (map && map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        } catch (e) {
          // Telan error "null reading" di sini
        }
        
        velocityLayerRef.current = null;
      }
    };
  }, [map, data]);

  return null;
}