// File: lib/bmkg/gempa.ts
import { cache } from "react";

export interface GempaData {
  Tanggal: string;
  Jam: string;
  DateTime: string; // Format ISO UTC
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi?: string;
  Dirasakan?: string;
  Shakemap?: string; // Biasanya cuma ada di autogempa
  ShakemapUrl?: string; // Field tambahan buatan kita
}

export interface GempaListResponse {
  Infogempa: {
    gempa: GempaData[] | GempaData; 
  };
}

export interface AutoGempaResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

// 🔥 GLOBAL EMERGENCY CACHE
let emergencyTerkini: GempaData[] = [];
let emergencyDirasakan: GempaData[] = [];
let emergencyTerbaru: GempaData | null = null;

const BMKG_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

const validateBMKGResponse = (text: string) => {
  return text.includes("Infogempa") && !text.includes("<html");
};

// 🔥 HELPER BARU: Merakit URL Shakemap untuk Gempa Dirasakan berdasarkan DateTime
const generateFeltShakemapUrl = (dateTimeUtc: string) => {
  if (!dateTimeUtc) return undefined;
  try {
    // DateTime dari BMKG berformat UTC ISO (misal: 2026-05-15T01:00:00+00:00)
    const d = new Date(dateTimeUtc);
    
    // Nama file shakemap BMKG menggunakan penamaan waktu WIB (+7 jam)
    // Trik: Ubah jam object Date ke +7, lalu ambil UTC-nya untuk constructor penamaan
    const wibDate = new Date(d.getTime() + (7 * 60 * 60 * 1000));
    
    const yyyy = wibDate.getUTCFullYear();
    const mm = String(wibDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(wibDate.getUTCDate()).padStart(2, '0');
    const hh = String(wibDate.getUTCHours()).padStart(2, '0');
    const min = String(wibDate.getUTCMinutes()).padStart(2, '0');
    const ss = String(wibDate.getUTCSeconds()).padStart(2, '0');
    
    return `https://data.bmkg.go.id/DataMKG/TEWS/${yyyy}${mm}${dd}${hh}${min}${ss}.mmi.jpg`;
  } catch (e) {
    return undefined;
  }
};

// 1. GEMPA TERKINI (M 5.0+) - Tidak diubah
export const getGempaTerkiniList = cache(async (): Promise<GempaData[]> => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json", {
      next: { revalidate: 60 },
      headers: BMKG_HEADERS
    });
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const textData = await res.text();
    if (!validateBMKGResponse(textData)) throw new Error("Data tidak valid");
    const data: GempaListResponse = JSON.parse(textData);
    const gempaRaw = data?.Infogempa?.gempa;
    if (gempaRaw) {
      emergencyTerkini = Array.isArray(gempaRaw) ? gempaRaw : [gempaRaw];
    }
    return emergencyTerkini;
  } catch (error) {
    console.error("⚠️ Gagal fetch terkini:", error);
    return emergencyTerkini;
  }
});

// 2. GEMPA DIRASAKAN - 🔥 DIPERBAIKI DISINI 🔥
export const getGempaDirasakanList = cache(async (): Promise<GempaData[]> => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json", {
      next: { revalidate: 60 },
      headers: BMKG_HEADERS
    });
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const textData = await res.text();
    if (!validateBMKGResponse(textData)) throw new Error("Data tidak valid");

    const data: GempaListResponse = JSON.parse(textData);
    const gempaRaw = data?.Infogempa?.gempa;

    if (gempaRaw) {
      const gempaList: GempaData[] = Array.isArray(gempaRaw) ? gempaRaw : [gempaRaw];
      
      // 🔥 Perbaikan: Merakit ShakemapUrl menggunakan generateFeltShakemapUrl, bukan field Shakemap
      emergencyDirasakan = gempaList.map((g) => ({
          ...g,
          ShakemapUrl: generateFeltShakemapUrl(g.DateTime) // Gunakan helper baru
      }));
    }
    
    return emergencyDirasakan;
  } catch (error) {
    console.error("⚠️ Gagal fetch dirasakan:", error);
    return emergencyDirasakan;
  }
});

// 3. AUTO GEMPA - Tidak diubah
export const getGempaTerbaru = cache(async (): Promise<GempaData | null> => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      next: { revalidate: 60 },
      headers: BMKG_HEADERS
    });
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const textData = await res.text();
    if (!validateBMKGResponse(textData)) throw new Error("Data tidak valid");
    const data: AutoGempaResponse = JSON.parse(textData);
    const gempa = data.Infogempa?.gempa;
    if(gempa) {
        // autogempa punya field Shakemap, jadi ini tetap aman
        if(gempa.Shakemap) {
            gempa.ShakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
        }
        emergencyTerbaru = gempa;
    }
    return emergencyTerbaru;
  } catch (error) {
    console.error("⚠️ Gagal fetch auto gempa:", error);
    return emergencyTerbaru;
  }
});