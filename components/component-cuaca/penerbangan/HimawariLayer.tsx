"use client";

import { TileLayer } from "react-leaflet";
import { useHimawariData } from "@/components/hooks/useHimawariData";

interface HimawariLayerProps {
  opacity?: number;
  showLabel?: boolean; 
  targetTime?: string; // TAMBAHAN: Menerima komando waktu dari Slider
}

export default function HimawariLayer({ opacity = 0.65, showLabel = false, targetTime }: HimawariLayerProps) {
  const { frames, latest, isError } = useHimawariData();

  if (isError || frames.length === 0) return null;

  // LOGIKA MESIN WAKTU (Nearest Neighbor)
  let activeFrame = latest; 

  if (targetTime && frames.length > 0) {
      const targetMs = new Date(targetTime).getTime();
      let bestFrame = frames[0]; 

      // Cari frame yang waktunya paling mendekati (<= targetTime)
      for (const frame of frames) {
          const frameMs = new Date(frame.timeUTC).getTime();
          if (frameMs <= targetMs) {
              bestFrame = frame;
          } else {
              break; 
          }
      }
      activeFrame = bestFrame;
  }

  if (!activeFrame) return null;

  return (
    <>
      <TileLayer
        key={`sat-${activeFrame.timeUTC}`} 
        url={activeFrame.url}
        opacity={opacity}
        zIndex={2} 
        tms={true}       
        noWrap={true}    
        maxNativeZoom={9}
      />
      
      {showLabel && (
        <div className="leaflet-bottom leaflet-left" style={{ bottom: "20px", left: "10px", pointerEvents: "none" }}>
          <div className="leaflet-control bg-black/60 text-emerald-400 px-2 py-1 rounded text-[10px] font-mono font-bold backdrop-blur-sm border border-emerald-500/30">
            SAT: {activeFrame.label}
          </div>
        </div>
      )}
    </>
  );
}