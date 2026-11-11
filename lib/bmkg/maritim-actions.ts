// lib/bmkg/maritim-actions.ts
"use server";

import { NewMaritimeDetailResponse } from "./maritim";

// 1. Bypass aturan ketat Sertifikat SSL di Node.js (Sama seperti trik di AWOS)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// 2. Buat Header yang menyamar sebagai Browser Chrome Asli untuk menipu sistem blokir BMKG
const BMKG_HEADERS = { 
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "Referer": "https://maritim.bmkg.go.id/",
  "Connection": "keep-alive"
};

export async function getWilmetosGeoJson() {
  try {
    const res = await fetch("https://maritim.bmkg.go.id/marine2026-data/meta/wilmetos.min.geojson", {
      next: { revalidate: 86400 }, // Cache 24 Jam
      headers: BMKG_HEADERS
    });
    
    if (!res.ok) {
       console.warn(`[BMKG Warn] GeoJSON Wilmetos gagal. Status: ${res.status}`);
       return null;
    }
    return await res.json();
  } catch (error) {
    console.error("GeoJSON Fetch Error:", error);
    return null;
  }
}

export async function getPelabuhanData(portId: string): Promise<NewMaritimeDetailResponse | null> {
  try {
    // String murni tanpa encodeURIComponent agar persis seperti di browser
    const url = `https://maritim.bmkg.go.id/marine2026-data/pelabuhan/${portId}.json`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, 
      headers: BMKG_HEADERS
    });
    
    if (!res.ok) {
       console.warn(`[BMKG Warn] Pelabuhan ${portId} gagal (Status: ${res.status}) | URL: ${url}`);
       return null; 
    }
    return await res.json();
  } catch (error) {
    console.error(`Fetch Error Pelabuhan (${portId}):`, error);
    return null;
  }
}

export async function getPerairanData(areaId: string): Promise<NewMaritimeDetailResponse | null> {
  try {
    // String murni tanpa encodeURIComponent agar persis seperti di browser
    const url = `https://maritim.bmkg.go.id/marine2026-data/perairan/${areaId}.json`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, 
      headers: BMKG_HEADERS
    });
    
    if (!res.ok) {
       console.warn(`[BMKG Warn] Perairan ${areaId} gagal (Status: ${res.status}) | URL: ${url}`);
       return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Fetch Error Perairan (${areaId}):`, error);
    return null;
  }
}