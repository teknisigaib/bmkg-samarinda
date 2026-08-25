"use client";

import { ImageOverlay } from "react-leaflet";
import { useRadarLatest } from "@/components/hooks/useRadarLatest";

// Komponen internal untuk handle tiap stasiun secara independen
function SingleRadarLayer({ site, opacity, targetTime }: { site: string, opacity: number, targetTime?: string }) {
  const { radarUrl, radarBounds, radarFrames, isOffline } = useRadarLatest(site);
  
  if (isOffline || !radarUrl || !radarBounds) return null;

  let activeImageUrl: string | null = radarUrl; 

  if (targetTime && radarFrames && radarFrames.length > 0) {
      const targetMs = new Date(targetTime).getTime();
      let bestFrame = null; 

      for (const frame of radarFrames) {
          const frameMs = new Date(frame.timeUTC).getTime();
          if (frameMs <= targetMs) {
              bestFrame = frame;
          } else {
              break; 
          }
      }
      
      if (!bestFrame) {
          return null; 
      }
      
      activeImageUrl = bestFrame.url;
  }
  
  if (!activeImageUrl) return null;

  return (
    <ImageOverlay 
      url={activeImageUrl} 
      bounds={radarBounds} 
      opacity={opacity} 
      zIndex={410} 
    />
  );
}

interface MahakamRadarProps {
  opacity?: number;
  targetTime?: string; 
}

export default function MahakamRadar({ opacity = 0.65, targetTime }: MahakamRadarProps) {
  return (
    <>
      <SingleRadarLayer site="BAL" opacity={opacity} targetTime={targetTime} />
      <SingleRadarLayer site="MTW" opacity={opacity} targetTime={targetTime} />
    </>
  );
}