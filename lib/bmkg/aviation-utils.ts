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

    if (vis > 8) return { label: '(> 8 km)', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    if (vis >= 4.8) return { label: '(4.8-8 km)', className: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    if (vis >= 1.6) return { label: '(1.6-4.8 km)', className: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
    return { label: '(< 1.6 km)', className: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
};






import L from "leaflet";

// --- KONSTANTA ---
export const HAZARD_COLORS: Record<string, string> = {
  TS: "#ef4444",   // Red (Thunderstorm)
  TURB: "#f59e0b", // Orange (Turbulence)
  ICE: "#06b6d4",  // Cyan (Icing)
  VA: "#64748b",   // Slate (Volcanic Ash)
  TC: "#d946ef",   // Magenta (Tropical Cyclone)
  MTW: "#8b5cf6",  // Violet (Mountain Wave)
  DS: "#a8a29e",   // Brownish (Dust Storm)
  SS: "#a8a29e",   // Sand (Sand Storm)
};

// --- ICON HELPERS (HTML STRING ONLY) ---
// Kita pisahkan logic HTML string agar file ini tidak terlalu bergantung pada objek 'L' saat SSR
export const getPlaneIconHtml = (color: string, rotation: number) => `
  <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transform: rotate(${rotation}deg);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="m5 12 3-5m11 5-3-5"/><path d="m4 19 3-2.5"/><path d="m20 19-3-2.5"/></svg>
  </div>
`;

export const getRadarIconHtml = () => `
  <div class="relative flex items-center justify-center w-6 h-6">
    <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
  </div>
`;

// --- MATH HELPERS ---
export const getCurvedPath = (start: [number, number], end: [number, number]) => {
  const lat1 = start[0], lng1 = start[1], lat2 = end[0], lng2 = end[1];
  const midLat = (lat1 + lat2) / 2, midLng = (lng1 + lng2) / 2;
  const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
  const curvature = dist * 0.15;
  const path = [];
  for (let t = 0; t <= 1; t += 0.02) {
    path.push([
      (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * (midLat + curvature) + t * t * lat2,
      (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2
    ] as [number, number]);
  }
  return path;
};

// --- DATE HELPERS ---
export const formatDateToRadar = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`;
};

export const formatDateToSatellite = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:00Z`;
};

export const formatDisplayTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
};

export const getInitialDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes());
  now.setMinutes(now.getMinutes() - (now.getMinutes() % 10));
  return now;
};

// --- COLOR LOGIC ---
export const getVisibilityColor = (visibilityStr: string) => {
  if (!visibilityStr) return '#64748b';
  const cleanString = visibilityStr.toString().replace(/[^0-9.]/g, '');
  let vis = parseFloat(cleanString);
  if (isNaN(vis)) return '#64748b';
  if (vis === 9999) vis = 10; else if (vis > 50) vis = vis / 1000;
  if (vis > 8) return '#22c55e'; if (vis >= 4.8) return '#06b6d4'; if (vis >= 1.6) return '#eab308'; return '#ef4444';
};

// --- SIGMET HELPERS ---
export const getSigmetStyle = (feature: any) => {
  const color = HAZARD_COLORS[feature.properties.hazard] || '#94a3b8';
  return { color, weight: 2, opacity: 1, fillColor: color, fillOpacity: 0.2, dashArray: '5, 5' };
};

export const getSigmetTooltipContent = (properties: any) => {
  const p = properties;
  const color = HAZARD_COLORS[p.hazard] || '#ccc';
  const top = p.top === 0 ? "SFC" : `FL${Math.round(p.top / 100)}`;
  const base = p.base === 0 ? "SFC" : `FL${Math.round(p.base / 100)}`;

  return `
    <div class="font-sans text-xs">
        <div class="font-bold text-sm mb-1 flex items-center gap-2">
            <span style="background-color: ${color}; width: 10px; height: 10px; border-radius: 2px;"></span>
            ${p.hazard} ${p.qualifier || ''}
        </div>
        <div class="grid grid-cols-2 gap-x-2 text-slate-600 mb-1">
            <span><b>Vert:</b> ${base} - ${top}</span>
            <span><b>Mov:</b> ${p.dir || '-'}</span>
        </div>
        <div class="p-1 bg-slate-100 rounded border border-slate-200 font-mono text-[9px] text-slate-700 max-w-[350px] break-words whitespace-pre-wrap">
            ${p.rawSigmet}
        </div>
    </div>`;
};




// ... (kode lama tetap ada)

// --- TIME STEP GENERATOR ---
// Menghasilkan array waktu mundur ke belakang (untuk slider)
// intervalMinutes: 10 untuk satelit, 5 untuk radar
// totalDurationMinutes: 120 (2 jam) untuk satelit, 60 (1 jam) untuk radar
export const generateTimeSteps = (intervalMinutes: number, totalDurationMinutes: number): Date[] => {
  const steps: Date[] = [];
  const now = getInitialDate(); // Waktu "sekarang" (dibulatkan)
  
  // Mulai dari masa lalu (Now - Duration) sampai Now
  const startTime = new Date(now.getTime() - totalDurationMinutes * 60000);
  
  let currentTime = startTime;
  while (currentTime <= now) {
    steps.push(new Date(currentTime));
    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
  }
  
  return steps;
};


export const RADAR_DBZ_COLORS = [
    '#00FFFF', // 5-10
    '#0080FF', // 10-15
    '#008080', // 15-20
    '#00FF00', // 20-25
    '#00C000', // 25-30
    '#80FF00', // 30-35
    '#FFFF00', // 35-40
    '#FFC000', // 40-45
    '#FF8000', // 45-50
    '#FF0000', // 50-55
    '#C00000', // 55-60
    '#FF00FF', // 60-65
    '#800080'  // >65
];

export const RADAR_DBZ_LABELS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65];

// ... export SATELLITE_LEGEND_STOPS tetap ada ...

// ... kode lama tetap ada ...

// --- DATA LEGENDA SATELLITE BARU (DISCRETE IR ENHANCED) ---
// Warna diambil dari referensi: Red (Cold/-100) -> Orange -> Green -> Blue -> Black (Warm/+60)
export const SATELLITE_IR_COLORS = [
    '#e93f33', // -100 (Red)
    '#ea5456', // -80 (Peach)
    '#f8d4b8', // -60 (Orange)
    '#f6c38c', // -40 (Yellow)
    '#f29f33', // -30 (Lime)
    '#eb5a33', // -20 (Cyan-Green)
    '#cd9b28', // -10 (Light Blue)
    '#c5bb24', // 0 (Medium Blue)
    '#9cd313', // +10 (Dark Blue)
    '#76e787',
    '#5fc192',
    '#43affb',
    '#4987fb',
    '#3462b4',
    '#0e4882',
    '#000000',
    '#000000'
];

// Label yang akan ditampilkan di bawah setiap segmen warna
export const SATELLITE_IR_LABELS = [
    '-100', '-80', '-60', '-40', '-30', '-20', '-10', '0', '10', '20','60'
];
