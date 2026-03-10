"use client";

import { TileLayer } from "react-leaflet";
import { useRadarLatest } from "@/components/hooks/useRadarLatest";

interface RadarLayerProps {
  opacity?: number;
  showLabel?: boolean;
}

export default function RadarLayer({ opacity = 0.8, showLabel = false }: RadarLayerProps) {
  const { layerData, isOffline } = useRadarLatest();

  if (isOffline || !layerData) return null;

  return (
    <>
      <TileLayer
        key={layerData.url} 
        url={layerData.url}
        opacity={opacity}
        zIndex={3} // Radar harus di atas Satelit (z=2)
      />
      
      {showLabel && (
        <div className="leaflet-bottom leaflet-right" style={{ bottom: "20px", right: "10px", pointerEvents: "none" }}>
          <div className="leaflet-control bg-black/60 text-cyan-400 px-2 py-1 rounded text-[10px] font-mono font-bold backdrop-blur-sm border border-cyan-500/30">
            RADAR: {layerData.timeLabel}
          </div>
        </div>
      )}
    </>
  );
}