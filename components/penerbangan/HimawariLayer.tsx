"use client";

import { TileLayer } from "react-leaflet";
import { useHimawariLatest } from "@/components/hooks/useHimawariLatest";

interface HimawariLayerProps {
  opacity?: number;
  showLabel?: boolean; 
}

export default function HimawariLayer({ opacity = 0.6, showLabel = false }: HimawariLayerProps) {
  const { layerData, isOffline } = useHimawariLatest();

  if (isOffline || !layerData) return null;

  return (
    <>
      <TileLayer
        // Key penting agar Leaflet me-render ulang saat URL berubah
        key={layerData.url} 
        url={layerData.url}
        opacity={opacity}
        zIndex={2} // Satelit biasanya di bawah Radar
      />
      
      {showLabel && (
        <div className="leaflet-bottom leaflet-left" style={{ bottom: "20px", left: "10px", pointerEvents: "none" }}>
          <div className="leaflet-control bg-black/60 text-emerald-400 px-2 py-1 rounded text-[10px] font-mono font-bold backdrop-blur-sm border border-emerald-500/30">
            SAT: {layerData.timeLabel}
          </div>
        </div>
      )}
    </>
  );
}