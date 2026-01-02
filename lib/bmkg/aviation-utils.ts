// lib/bmkg/aviation-utils.ts

import { ReactNode } from "react";

// --- TYPE DEFINITIONS ---

export interface ParsedMetar {
    time_zone: ReactNode;
    icao_id: string;
    station_name: string;
    latitude: string;
    longitude: string;
    elevation: string;
    observed_time: string;
    wind_direction: string;
    wind_speed: string;
    visibility: string;
    weather: string;
    temp: string;
    dew_point: string;
    pressure: string;
    symbol: string; 
}
  
export interface RawMetar {
    data_code: string;
    icao_code: string;
    observed_time?: string; // Ada di METAR & SPECI
    issued_time?: string;   // Ada di TAF
    data_text: string;
}

// --- HELPERS (Sync Functions) ---

export function filterKaltimAirports(airports: ParsedMetar[]) {
    const KALTIM_ICAO = [
      "WALS", // APT Pranoto (Samarinda)
      "WALL", // Sepinggan (Balikpapan)
      "WAQT", // Kalimarau (Berau)
      "WIII", // Soekarno-Hatta (Jakarta)
      "WARR", // Juanda
      "WAOO", // Banjarmasin
      "WAHI", // YIA
      "WAAA", // Makassar
      "WADD", // Denpasar
    ];
  
    return airports.filter(a => KALTIM_ICAO.includes(a.icao_id));
}
  
export function getFlightCategory(visibility: string, weather: string) {
    let cleanVis = visibility.replace(">=", "").replace(">", "").replace("<", "");
    let vis = parseFloat(cleanVis);
    
    if (isNaN(vis)) return "VFR"; 
  
    if (vis >= 8) return "VFR";   
    if (vis >= 5) return "MVFR";  
    return "IFR";                 
}



export function getPublicSummary(visibility: string, weather: string) {
    // 1. Tentukan Status Warna & Label
    let status = { label: "Kondisi Baik", color: "bg-green-100 text-green-700 border-green-200", icon: "safe" };
    
    // Parse Visibilitas
    let cleanVis = visibility.replace(">=", "").replace(">", "").replace("<", "");
    let vis = parseFloat(cleanVis); // KM

    // Logika Sederhana untuk Awam
    if (vis < 5 || weather.toLowerCase().includes('hujan lebat') || weather.toLowerCase().includes('badai')) {
        status = { label: "Waspada / Cuaca Buruk", color: "bg-red-100 text-red-700 border-red-200", icon: "danger" };
    } else if (vis < 8 || weather.toLowerCase().includes('hujan')) {
        status = { label: "Hati-hati / Hujan Ringan", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "warning" };
    }

    // 2. Terjemahkan Kode Cuaca (Jika perlu diperhalus)
    let humanWeather = weather;
    if (!weather || weather === '-' || weather === 'NSW') humanWeather = "Cerah / Berawan";
    if (weather.includes('TS')) humanWeather = "Hujan Badai / Guntur";
    if (weather.includes('RA')) humanWeather = "Hujan";
    if (weather.includes('HZ')) humanWeather = "Udara Kabur (Haze)";

    return { status, humanWeather };
}

export function formatWind(direction: string, speed: string) {
    if (!direction || direction === 'Variabel') return "Arah Berubah-ubah";
    // Konversi Knot ke Km/j untuk awam (opsional, tapi data API anda sudah KM/H atau Knot?)
    // Asumsi data API parsed anda 'speed' dalam km/h atau m/s. Jika raw metar biasanya Knot.
    // Kita tampilkan apa adanya dulu + arah.
    return `Dari ${direction}, Kecepatan ${speed}`;
}


// lib/bmkg/aviation-utils.ts

// ... (kode sebelumnya tetap ada)

// --- HELPER BARU: HITUNG JARAK (Haversine) ---
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Hasil dalam KM
}



// Tambahkan fungsi-fungsi ini ke dalam file aviation-utils.ts Anda

export const estimateDuration = (km: number) => {
    const speed = 550; // Avg speed km/h
    const timeInHours = km / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    return `${hours}j ${minutes}m`;
};

export const getVisibilityStatus = (visibilityStr: string) => {
    if (!visibilityStr) return { label: 'No Data', className: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' };

    // Sanitasi input
    const cleanString = visibilityStr.toString().replace(/[^0-9.]/g, '');
    let vis = parseFloat(cleanString);

    if (isNaN(vis)) return { label: 'No Data', className: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' };

    // Normalisasi (9999 = 10km, >50 = meter ke km)
    if (vis === 9999) vis = 10;
    else if (vis > 50) vis = vis / 1000;

    if (vis > 8) return { label: 'VFR (> 8 km)', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    if (vis >= 4.8) return { label: 'MVFR (4.8-8 km)', className: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    if (vis >= 1.6) return { label: 'IFR (1.6-4.8 km)', className: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
    return { label: 'LIFR (< 1.6 km)', className: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
};