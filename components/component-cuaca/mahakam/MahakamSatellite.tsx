"use client";

import { TileLayer } from "react-leaflet";
import { useHimawariData } from "@/components/hooks/useHimawariData";

interface MahakamSatelliteProps {
  opacity?: number;
  targetTime?: string; 
}

export default function MahakamSatellite({ opacity = 0.65, targetTime }: MahakamSatelliteProps) {
  const { frames, latest, isError } = useHimawariData();

  // Guard clause
  if (isError || !frames || frames.length === 0) return null;

  // LOGIKA MESIN WAKTU (Sinkronisasi dengan Timeline Slider)
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
    <TileLayer
      key={`sat-${activeFrame.timeUTC}`} 
      url={activeFrame.url}
      opacity={opacity}
      zIndex={400} // Set ke 400 (Di atas Peta Dasar, tapi di bawah Radar 410)
      tms={true}       
      noWrap={true}    
      maxNativeZoom={9}
    />
  );
}