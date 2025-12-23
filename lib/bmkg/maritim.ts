// lib/bmkg/maritim.ts

// --- Tipe Data untuk API Detail (Per Area) ---
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

// --- Tipe Data untuk API Overview (Untuk Peta) ---
export interface WaveOverviewItem {
  issued: string;
  today: string;    // "Sedang", "Rendah", dll
  tomorrow: string;
  h2: string;
  h3: string;
}

export type OverviewData = Record<string, WaveOverviewItem>;

// --- Helper Warna Gelombang ---
export const getWaveColor = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("tenang")) return "#10b981"; // Emerald-500 (0.1 - 0.5 m)
  if (cat.includes("rendah")) return "#3b82f6"; // Blue-500 (0.5 - 1.25 m)
  if (cat.includes("sedang")) return "#eab308"; // Yellow-500 (1.25 - 2.5 m)
  if (cat.includes("tinggi")) return "#f97316"; // Orange-500 (2.5 - 4.0 m)
  if (cat.includes("ekstrem")) return "#ef4444"; // Red-500 (> 4.0 m)
  return "#cbd5e1"; // Slate-300 (Tidak ada data)
};

// --- Fetcher Functions ---

// 1. Fetch Detail (Dipanggil SAAT KLIK area)
export async function getMaritimeWeather(code: string, name: string): Promise<MaritimeData | null> {
  try {
    const encodedName = encodeURIComponent(name); 
    const url = `https://peta-maritim.bmkg.go.id/public_api/perairan/${code}_${encodedName}.json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Gagal fetch detail maritim:", error);
    return null;
  }
}

// 2. Fetch Overview (Dipanggil SAAT LOAD halaman)
export async function getWaveOverview(): Promise<OverviewData | null> {
  try {
    const url = "https://peta-maritim.bmkg.go.id/public_api/overview/gelombang.json";
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Gagal fetch overview gelombang:", error);
    return null;
  }
}





// --- TIPE DATA PELABUHAN ---
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
  visibility: number; // Jarak pandang (km/m)
  temp_min: number;
  temp_max: number;
  rh_min: number;
  rh_max: number;
  high_tide: number; // Pasang (m)
  low_tide: number;  // Surut (m)
}

export interface PortData {
  port_id: string;
  name: string;
  info: string;
  latitude: number;
  longitude: number;
  data: PortForecastItem[];
}

// ... (Fetcher Overview & MaritimeWeather tetap ada) ...

// 3. FETCH PELABUHAN (Satu per satu)
export async function getPortWeather(portId: string, portName: string): Promise<PortData | null> {
  try {
    // Format nama file biasanya: {ID}_{Nama}.json
    // Contoh: 0194_Samarinda.json
    // Kita perlu memastikan nama sesuai format URL BMKG. 
    // Untuk keamanan, biasanya kita cukup pakai ID jika backend mendukung, 
    // tapi karena URL BMKG statis, kita construct manual.
    
    const encodedName = encodeURIComponent(portName);
    const url = `https://peta-maritim.bmkg.go.id/public_api/pelabuhan/${portId}_${encodedName}.json`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Gagal fetch pelabuhan ${portName}:`, error);
    return null;
  }
}



// ... (Kode sebelumnya tetap ada) ...

// Import Data GeoJSON untuk mencocokkan kode dengan nama wilayah
// Pastikan path import ini sesuai dengan lokasi file geojson.ts Anda
import { MARITIME_GEOJSON } from "@/components/component-cuaca/cuaca-maritim/geojson";

// 3. FETCH WARNINGS (Untuk Running Text Home)
// lib/bmkg/maritim.ts

// ... (Import & Code sebelumnya tetap sama) ...

// 3. FETCH WARNINGS (Updated: Include "Sedang")
export async function getMaritimeWarnings(): Promise<string[]> {
  try {
    const overview = await getWaveOverview();
    if (!overview) return [];

    const warnings: string[] = [];

    // Loop data GeoJSON untuk cek setiap wilayah
    MARITIME_GEOJSON.features.forEach((feature: any) => {
      const code = feature.properties.WP_1;
      const name = feature.properties.WP_IMM;
      
      // Ambil status hari ini
      const statusToday = overview[code]?.today;

      // Filter: Sedang, Tinggi, dan Ekstrem
      if (["Sedang", "Tinggi", "Ekstrem"].includes(statusToday)) {
         let height = "";
         
         // Tentukan label tinggi gelombang
         if (statusToday === "Sedang") height = "1.25-2.50 m";
         else if (statusToday === "Tinggi") height = "2.50-4.0 m";
         else if (statusToday === "Ekstrem") height = "> 4.0 m";

         // Format Pesan
         warnings.push(`GELOMBANG ${statusToday.toUpperCase()} (${height}) di ${name}`);
      }
    });

    return warnings;
  } catch (error) {
    console.error("Gagal generate warning maritim:", error);
    return [];
  }
}