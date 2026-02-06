"use server";

import { ParsedMetar, RawMetar } from "./aviation-utils";

// Token Rahasia
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwNzNlNmUwOGU0ZjQzMzdkYzFmNjRkNzgzZGJmYmU5MzQ3ZGFmY2FiYTBhM2U5MzVjZDJmODlhOWQ1NjMwNWYiLCJpYXQiOjE3Njk5MDQwMDAsImV4cCI6MjU1NjA1NzYwMH0.s010WqlLrBY8WqPkiDRENEFdZIFCaLI8jSSJ7_6tLlY";

// --- FETCHERS ---

export async function getAllAirportsWeather(): Promise<ParsedMetar[]> {
  try {
    const url = `https://cuaca.bmkg.go.id/api/v1/aviation/latest/observation.json?api_token=${API_TOKEN}`;
    
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    if (!res.ok) throw new Error("Failed to fetch airports data");
    
    const json = await res.json();
    return json.observation.report || [];
  } catch (error) {
    console.error("Error fetching airports:", error);
    return [];
  }
}

// PERUBAHAN DI SINI: Menerima parameter 'icao'
export async function getRawMetar(icao: string): Promise<RawMetar[]> {
  try {
    const url = `https://cuaca.bmkg.go.id/api/v1/aviation/metar/${icao}?api_token=${API_TOKEN}`;
    
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error(`Failed to fetch raw METAR for ${icao}`);

    const json = await res.json();
    
    // API mengembalikan object dengan key dinamis, misal: { "WALL": [...] }
    // Kita akses menggunakan [icao]
    return json[icao] || [];
  } catch (error) {
    console.error(`Error fetching raw METAR (${icao}):`, error);
    return [];
  }
}

// 2. Get Raw SPECI (BARU)
export async function getRawSpeci(icao: string): Promise<RawMetar[]> {
  try {
    const url = `https://cuaca.bmkg.go.id/api/v1/aviation/speci/${icao}?api_token=${API_TOKEN}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch SPECI for ${icao}`);
    const json = await res.json();
    return json[icao] || [];
  } catch (error) {
    return [];
  }
}

// 3. Get Raw TAF (BARU)
export async function getRawTaf(icao: string): Promise<RawMetar[]> {
  try {
    const url = `https://cuaca.bmkg.go.id/api/v1/aviation/taf/${icao}?api_token=${API_TOKEN}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch TAF for ${icao}`);
    const json = await res.json();
    return json[icao] || [];
  } catch (error) {
    return [];
  }
}