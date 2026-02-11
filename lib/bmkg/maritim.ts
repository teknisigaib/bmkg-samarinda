const FETCH_TIMEOUT_MS = 5000;

export interface MaritimeForecast {
  valid_from: string;
  valid_to: string;
  time_desc: string; 
  weather: string;
  weather_desc: string;
  warning_desc: string;
  wave_cat: string;
  wave_desc: string;
  wind_from: string;
  wind_to: string;
  wind_speed_min: number;
  wind_speed_max: number;
}

export interface MaritimeData {
  code: string;
  name: string;
  issued: string;
  data: MaritimeForecast[];
}

export interface WaveOverviewItem {
  issued: string;
  today: string;  
  tomorrow: string;
  h2: string;
  h3: string;
}

export type OverviewData = Record<string, WaveOverviewItem>;

// Helper Warna Gelombang
export const getWaveColor = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("tenang")) return "#10b981"; 
  if (cat.includes("rendah")) return "#3b82f6"; 
  if (cat.includes("sedang")) return "#eab308";
  if (cat.includes("tinggi")) return "#f97316";
  if (cat.includes("ekstrem")) return "#ef4444"; 
  return "#cbd5e1";
};


// 1. Fetch Detail Wilayah
export async function getMaritimeWeather(code: string, name: string): Promise<MaritimeData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const encodedName = encodeURIComponent(name); 
    const url = `https://peta-maritim.bmkg.go.id/public_api/perairan/${code}_${encodedName}.json`;
    
    const res = await fetch(url, { 
        next: { revalidate: 3600 },
        signal: controller.signal 
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return await res.json();

  } catch (error: any) {
    if (error.name === 'AbortError') {
        console.warn(`⏳ Timeout fetch detail maritim (${name}) > 5s`);
    } else {
        console.error("Gagal fetch detail maritim:", error);
    }
    return null;
  }
}

// 2. Overview 
export async function getWaveOverview(): Promise<OverviewData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = "https://peta-maritim.bmkg.go.id/public_api/overview/gelombang.json";
    
    const res = await fetch(url, { 
        next: { revalidate: 3600 },
        signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return await res.json();

  } catch (error: any) {
    if (error.name === 'AbortError') {
        console.warn("⏳ Timeout fetch overview gelombang > 5s");
    } else {
        console.error("Gagal fetch overview gelombang:", error);
    }
    return null;
  }
}

// TIPE DATA PELABUHAN 
export interface PortForecastItem {
  issued: string;
  valid_from: string;
  valid_to: string;
  weather: string;
  weather_desc: string;
  warning_desc: string;
  wind_from: string;
  wind_to: string;
  wind_speed_min: number;
  wind_speed_max: number;
  wave_desc: string;
  wave_cat: string;
  visibility: number;
  temp_min: number;
  temp_max: number;
  rh_min: number;
  rh_max: number;
  high_tide: number; 
  low_tide: number;  
}

export interface PortData {
  port_id: string;
  name: string;
  info: string;
  latitude: number;
  longitude: number;
  data: PortForecastItem[];
}

// 3. Fetch Pelabuhan
export async function getPortWeather(portId: string, portName: string): Promise<PortData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const encodedName = encodeURIComponent(portName);
    const url = `https://peta-maritim.bmkg.go.id/public_api/pelabuhan/${portId}_${encodedName}.json`;
    
    const res = await fetch(url, { 
        next: { revalidate: 3600 },
        signal: controller.signal 
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return await res.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
        console.warn(`⏳ Timeout fetch pelabuhan ${portName} > 5s`);
    } else {
        console.error(`Gagal fetch pelabuhan ${portName}:`, error);
    }
    return null;
  }
}

import { MARITIME_GEOJSON } from "@/components/component-cuaca/cuaca-maritim/geojson";

// FETCH WARNING
export async function getMaritimeWarnings(): Promise<string[]> {
  try {
    const overview = await getWaveOverview();
    
    if (!overview) return [];

    const warnings: string[] = [];

    MARITIME_GEOJSON.features.forEach((feature: any) => {
      const code = feature.properties.WP_1;
      const name = feature.properties.WP_IMM;
      
      const statusToday = overview[code]?.today;

      if (["Sedang", "Tinggi", "Ekstrem"].includes(statusToday)) {
         let height = "";
         
         if (statusToday === "Sedang") height = "1.25-2.50 m";
         else if (statusToday === "Tinggi") height = "2.50-4.0 m";
         else if (statusToday === "Ekstrem") height = "> 4.0 m";

         warnings.push(`GELOMBANG ${statusToday.toUpperCase()} (${height}) di ${name}`);
      }
    });

    return warnings;
  } catch (error) {
    console.error("Gagal generate warning maritim:", error);
    return [];
  }
}