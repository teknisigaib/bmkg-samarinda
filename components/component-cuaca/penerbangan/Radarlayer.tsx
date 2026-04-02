"use client";

import { ImageOverlay, Circle, Pane } from "react-leaflet";
import { useRadarLatest } from "@/components/hooks/useRadarLatest";

function SingleRadarLayer({ site, opacity, targetTime }: { site: string, opacity: number, targetTime?: string }) {
  const { radarUrl, radarBounds, radarFrames, isOffline } = useRadarLatest(site);
  
  if (isOffline || !radarUrl || !radarBounds) return null;

  let activeImageUrl: string | null = radarUrl; 

  if (targetTime && radarFrames && radarFrames.length > 0) {
      const targetMs = new Date(targetTime).getTime();
      
      // PERUBAHAN UTAMA: Mulai dengan status KOSONG (null)
      let bestFrame = null; 

      for (const frame of radarFrames) {
          const frameMs = new Date(frame.timeUTC).getTime();
          if (frameMs <= targetMs) {
              bestFrame = frame;
          } else {
              break; 
          }
      }
      
      // Jika setelah dicari tidak ada yang cocok (slider terlalu di masa lalu)
      if (!bestFrame) {
          return null; // Auto-Hide: Jangan render gambar radar apa-apa di titik waktu ini
      }
      
      activeImageUrl = bestFrame.url;
  }
  
  if (!activeImageUrl) return null;

  return (
    <ImageOverlay 
      url={activeImageUrl} 
      bounds={radarBounds} 
      opacity={opacity} 
      zIndex={300} 
    />
  );
}

interface RadarLayerProps {
  opacity?: number;
  targetTime?: string; 
}

export default function RadarLayer({ opacity = 0.65, targetTime }: RadarLayerProps) {
  const RADAR_STATIONS = [
    { id: "BAL", name: "Balikpapan", lat: -1.259733, lon: 116.897, radius: 200000 },
    { id: "MTW", name: "Muara Teweh", lat: -0.941719, lon: 114.896027, radius: 200000 },
    { id: "TRK", name: "Tarakan", lat: 3.326, lon: 117.565, radius: 240000 },
  ];

  return (
    <>
      <SingleRadarLayer site="BAL" opacity={opacity} targetTime={targetTime} />
      <SingleRadarLayer site="MTW" opacity={opacity} targetTime={targetTime} />
      <SingleRadarLayer site="TRK" opacity={opacity} targetTime={targetTime} />

      <Pane name="radar-rings-pane" style={{ opacity: 0.15, zIndex: 250 }}>
        {RADAR_STATIONS.map((station) => (
          <Circle
            key={`ring-${station.id}`}
            center={[station.lat, station.lon]}
            radius={station.radius}
            interactive={false}
            pathOptions={{ stroke: true, color: '#9CA3AF', weight: 1, fillColor: '#D1D5DB', fillOpacity: 1, interactive: false }}
          />
        ))}
      </Pane>
    </>
  );
}