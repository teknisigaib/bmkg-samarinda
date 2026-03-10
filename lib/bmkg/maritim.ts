// lib/bmkg/maritim.ts

import { ReactNode } from "react";

export interface NewMaritimeForecastItem {
  tides: ReactNode;
  visibility: string;
  time: string;
  weather: string;
  temp_avg: number;
  rh_avg: number;
  wind_from: string;
  wind_speed: number;
  wind_gust: number;
  wave_cat: string;
  wave_height: number;
  current_to: string;
  current_speed: number;
}

export interface NewMaritimeDetailResponse {
  code: string;
  name: string;
  issued: string;
  valid_from: string;
  valid_to: string;
  forecast_day1: NewMaritimeForecastItem[];
  "forecast_day2-4": NewMaritimeForecastItem[];
}

export function combineForecasts(data: NewMaritimeDetailResponse): NewMaritimeForecastItem[] {
  const day1 = data.forecast_day1 || [];
  const dayNext = data["forecast_day2-4"] || [];
  return [...day1, ...dayNext];
}

// --- FUNGSI BARU: Mencari index data yang paling dekat dengan jam sekarang ---
export function findClosestIndex(data: NewMaritimeForecastItem[]): number {
  const now = new Date().getTime(); // Waktu user sekarang (epoch)
  let closestDiff = Infinity;
  let closestIdx = 0;

  data.forEach((item, idx) => {
    // API BMKG formatnya "2025-03-04 00:00 UTC", JS Date otomatis parse ini sebagai UTC
    const itemTime = new Date(item.time).getTime();
    const diff = Math.abs(now - itemTime);

    // Cari selisih waktu terkecil
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIdx = idx;
    }
  });

  return closestIdx;
}

export const createSlug = (name: string): string => {
  if (!name) return "";
  return name.toLowerCase().trim()
    .replace(/\s+/g, ' ').replace(/\s-\s/g, '-')
    .replace(/\s/g, '-').replace(/[^\w-]/g, '').replace(/--+/g, '-');
};

export const getWaveColor = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("tenang")) return "#10b981"; 
  if (cat.includes("rendah")) return "#3b82f6"; 
  if (cat.includes("sedang")) return "#eab308"; 
  if (cat.includes("tinggi")) return "#f97316"; 
  if (cat.includes("ekstrem")) return "#ef4444"; 
  return "#94a3b8";
};

export const getWindRotation = (direction: string): number => {
  if (!direction) return 0;
  // 1. Bersihkan string: lowercase dan hapus spasi berlebih
  const dir = direction.toLowerCase().replace(/\s+/g, ' ').trim();
  // 2. Cek Arah Mata Angin (Prioritas: Dua Kata Dulu!)
  if (dir.includes("timur laut")) return 45;
  if (dir.includes("tenggara")) return 135;
  if (dir.includes("barat daya")) return 225;
  if (dir.includes("barat laut")) return 315;
  // 3. Cek Satu Kata
  if (dir.includes("utara")) return 0;
  if (dir.includes("timur")) return 90;
  if (dir.includes("selatan")) return 180;
  if (dir.includes("barat")) return 270;
  
  return 0;
};

// Daftar Wilayah Kaltim
export const KALTIM_AREAS = [
  "Perairan Berau", "Perairan Maratua", "Perairan Kutai Timur",
  "Perairan Penajam - Balikpapan", "Perairan Paser", "Perairan Kotabaru",
  "Perairan Tolitoli", "Perairan Donggala - Palu", "Perairan Pasangkayu",
  "Perairan Tikke", "Perairan Topoyo", "Perairan Mamuju", "Perairan Tapalang",
  "Perairan Malunda", "Perairan Sendana", "Perairan Majene", "Perairan Balanipa",
  "Perairan Polewali", "Perairan Pinrang", "Perairan Barru",
  "Selat Makassar bagian utara", "Selat Makassar bagian tengah",
  "Perairan Kutai Kartanegara - Bontang", "Selat Makassar bagian selatan",
  "Perairan pangkep", "perairan makassar", "perairan jeneponto"
];

export const KALTIM_PORTS = [
  "Pelabuhan Semayang",
  "Pelabuhan Peti Kemas",
  "Pelabuhan Kampung Baru",
  "Pelabuhan Penajam Paser Utara",
  "Pelabuhan Tanah Grogot Pondong",
  "Pelabuhan Maloy",
  "Pelabuhan tanjung Santan",
  "Pelabuhan Pulau Derawan",
  "Pelabuhan Kariangau, Balikpapan",
  "Pelabuhan Tanjung Laut",
  "Pelabuhan Sangkulirang",
  "Pelabuhan Kuala Samboja",
  "Pelabuhan Mantritip",
  "pelabuhan Lhok Tuan",
  "Pelabuhan Tanjung Batu, Balikpapan",
  "Pelabuhan Pulau Maratua",
  "Pelabuhan Nusantara - Pare Pare",
  "Pelabuhan Majene"
];

export async function getWilmetosGeoJson() {
  try {
    const res = await fetch("https://maritim.bmkg.go.id/api/data/wilmetos", {
      next: { revalidate: 86400 }, // Cache 24 Jam (Data peta jarang berubah)
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    
    if (!res.ok) throw new Error("Gagal ambil GeoJSON");
    return await res.json();
  } catch (error) {
    console.error("GeoJSON Fetch Error:", error);
    return null;
  }
}