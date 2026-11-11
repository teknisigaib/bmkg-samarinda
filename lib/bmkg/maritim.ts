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

export interface MaritimeLocation {
  id: string;
  name: string;
  lat?: number;
  lon?: number;
}

export function combineForecasts(data: NewMaritimeDetailResponse): NewMaritimeForecastItem[] {
  const day1 = data.forecast_day1 || [];
  const dayNext = data["forecast_day2-4"] || [];
  return [...day1, ...dayNext];
}

// --- FUNGSI: Mencari index data yang paling dekat dengan jam sekarang ---
export function findClosestIndex(data: NewMaritimeForecastItem[]): number {
  const now = new Date().getTime(); 
  let closestDiff = Infinity;
  let closestIdx = 0;

  data.forEach((item, idx) => {
    const itemTime = new Date(item.time).getTime();
    const diff = Math.abs(now - itemTime);

    if (diff < closestDiff) {
      closestDiff = diff;
      closestIdx = idx;
    }
  });

  return closestIdx;
}

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
  const dir = direction.toLowerCase().replace(/\s+/g, ' ').trim();
  if (dir.includes("timur laut")) return 45;
  if (dir.includes("tenggara")) return 135;
  if (dir.includes("barat daya")) return 225;
  if (dir.includes("barat laut")) return 315;
  if (dir.includes("utara")) return 0;
  if (dir.includes("timur")) return 90;
  if (dir.includes("selatan")) return 180;
  if (dir.includes("barat")) return 270;
  return 0;
};

// --- DATA: Pemetaan Area Kaltim dengan Kode ID Baru BMKG ---
export const KALTIM_AREAS: MaritimeLocation[] = [
  { id: "P.Y.02", name: "Perairan Berau" },
  { id: "P.Y.01", name: "Perairan Maratua" },
  { id: "P.Y.03", name: "Perairan Kutai Timur" },
  { id: "P.Y.05", name: "Perairan Penajam - Balikpapan" },
  { id: "P.Y.06", name: "Perairan Paser" },
  { id: "P.X.04", name: "Perairan Kotabaru" },
  { id: "P.AC.02", name: "Perairan Tolitoli" },
  { id: "P.AC.03", name: "Perairan Donggala - Palu" },
  { id: "P.AD.01", name: "Perairan Pasangkayu" },
  { id: "P.AD.02", name: "Perairan Tikke" },
  { id: "P.AD.03", name: "Perairan Topoyo" },
  { id: "P.AD.04", name: "Perairan Mamuju" },
  { id: "P.AD.05", name: "Perairan Tapalang" },
  { id: "P.AD.06", name: "Perairan Malunda" },
  { id: "P.AD.07", name: "Perairan Sendana" },
  { id: "P.AD.08", name: "Perairan Majene" },
  { id: "P.AD.09", name: "Perairan Balanipa" },
  { id: "P.AD.10", name: "Perairan Polewali" },
  { id: "P.AE.01", name: "Perairan Pinrang" },
  { id: "P.AE.02", name: "Perairan Barru" },
  { id: "M.22",   name: "Selat Makassar bagian utara" },
  { id: "M.23",   name: "Selat Makassar bagian tengah" },
  { id: "P.Y.04", name: "Perairan Kutai Kartanegara - Bontang" },
  { id: "M.24",   name: "Selat Makassar bagian selatan" },
  { id: "P.AE.03", name: "Perairan pangkep" },
  { id: "P.AE.04", name: "perairan makassar" },
  { id: "P.AE.05", name: "perairan jeneponto" }
];

// --- DATA: Pemetaan Pelabuhan Kaltim & Kaltara ---
export const KALTIM_PORTS: MaritimeLocation[] = [
  // KALIMANTAN TIMUR
  { id: "XY001", name: "Pelabuhan Peti Kemas", lat: -0.604997065999953, lon: 117.543173626 },
  { id: "XY002", name: "Pelabuhan Semayang", lat: -1.272882327, lon: 116.805795195 },
  { id: "XY003", name: "Pelabuhan Kampung Baru", lat: -1.219, lon: 116.815 },
  { id: "XY004", name: "Pelabuhan Kariangau, Balikpapan", lat: -1.21583534899997, lon: 116.769720721 },
  { id: "XY005", name: "Pelabuhan Penajam Paser Utara", lat: -1.23003571399993, lon: 116.764046271 },
  { id: "XY006", name: "Pelabuhan Tanjung Laut", lat: 0.112033390000022, lon: 117.49257468 },
  { id: "XY007", name: "Pelabuhan Tanah Grogot Pondong", lat: -1.803415806, lon: 116.251183151 },
  { id: "XY008", name: "Pelabuhan Sangkulirang", lat: 0.961218276000068, lon: 117.990215801 },
  { id: "XY009", name: "Pelabuhan Maloy", lat: 0.803924757, lon: 117.934180336 },
  { id: "XY010", name: "Pelabuhan Kuala Samboja", lat: -1.019706666, lon: 117.115545565 },
  { id: "XY011", name: "Pelabuhan Tanjung Redeb", lat: 2.16051793100007, lon: 117.97264703 },
  { id: "XY012", name: "Pelabuhan Mantritip", lat: 2.01477094800003, lon: 117.816420005 },
  { id: "XY013", name: "Pelabuhan Sangatta", lat: 0.529357654, lon: 117.645374582 },
  { id: "XY014", name: "Pelabuhan Lhok Tuan", lat: 0.16546330400007, lon: 117.487574392 },
  { id: "XY015", name: "Pelabuhan Tanjung Santan", lat: -0.103522904, lon: 117.46595892 },
  { id: "XY016", name: "Pelabuhan Tanjung Batu, Balikpapan", lat: 2.2774885, lon: 118.0908716 },
  { id: "XY017", name: "Pelabuhan Pulau Derawan", lat: 2.1960199, lon: 117.6127193 },
  { id: "XY018", name: "Pelabuhan Pulau Maratua", lat: 2.2753417, lon: 118.5585963 },
  
  // KALIMANTAN UTARA
  { id: "XZ001", name: "Pelabuhan Malundung Tarakan", lat: 3.28329, lon: 117.595442 },
  { id: "XZ002", name: "Pelabuhan Feri Juata Laut Tarakan", lat: 3.430715285, lon: 117.537088388 },
  { id: "XZ003", name: "Pelabuhan Tanjung Selor", lat: 2.90164422000003, lon: 117.717795207 },
  { id: "XZ004", name: "Pelabuhan Bunyu", lat: 3.461869569, lon: 117.83715921 },
  { id: "XZ007", name: "Pelabuhan Tunon Taka Nunukan", lat: 4.144225609, lon: 117.66702 },


  // SULAWESI BARAT
{ id: "AD001", name: "Pelabuhan Tanjung Silopo", lat: -3.476270261, lon: 119.446881909 },
{ id: "AD002", name: "Pelabuhan Polewali", lat: -3.432896202, lon: 119.339230399 },
{ id: "AD003", name: "Pelabuhan Tinambung", lat: -3.51634766, lon: 119.038356119 },
{ id: "AD004", name: "Pelabuhan Majene", lat: -3.545897084, lon: 118.966016518 },
{ id: "AD005", name: "Pelabuhan Baru Majene", lat: -3.558534409, lon: 118.945662928 },
{ id: "AD006", name: "Pelabuhan Palipi", lat: -3.31369919, lon: 118.849564749 },
{ id: "AD007", name: "Pelabuhan Panamboang", lat: -3.006, lon: 118.84 },
{ id: "AD008", name: "Pelabuhan Dermaga Dungkait", lat: -2.853470648, lon: 118.803950345 },
{ id: "AD009", name: "Pelabuhan Ferry Mamuju", lat: -2.675072218, lon: 118.867482051 },
{ id: "AD010", name: "Pelabuhan Kelas I Mamuju (Simboro)", lat: -2.6681382, lon: 118.893579723 },
{ id: "AD011", name: "Pelabuhan Belang-Belang", lat: -2.474573404, lon: 119.127912733 },
{ id: "AD012", name: "Pelabuhan Sabakattang", lat: -2.220308371, lon: 117.410732323 },
  { id: "AD013", name: "Pelabuhan Babana", lat: -2.097554791, lon: 119.193055852 },
  { id: "AD014", name: "Pelabuhan Cinoki", lat: -1.680534457, lon: 119.282088621 },
  { id: "AD015", name: "Pelabuhan Pasang Kayu SMART Mamuju", lat: -1.135922656, lon: 119.398053502 },
  { id: "AD016", name: "Pelabuhan Ambo", lat: -2.538119, lon: 117.944765 },
  { id: "AD017", name: "Pelabuhan Popongan", lat: -2.4585871963963, lon: 117.376677617157 },
  { id: "AD018", name: "Pelabuhan Salissingan", lat: -2.31509256228807, lon: 117.231649328598 },
  // SULAWESI SELATAN
{ id: "AE001", name: "Pelabuhan Galesong - Takalar", lat: -5.324445759, lon: 119.356121493 },
{ id: "AE002", name: "Pelabuhan Soekarno Hatta - Makassar", lat: -5.122342358, lon: 119.407789228 },
{ id: "AE003", name: "Pelabuhan Maccini Baji - Pangkajene Kepulauan", lat: -4.774400263, lon: 119.492060891 },
{ id: "AE004", name: "Pelabuhan Garongkong - Barru", lat: -4.37733499599994, lon: 119.612338393 },
{ id: "AE005", name: "Pelabuhan Nusantara - Pare Pare", lat: -4.01444988099996, lon: 119.609922057 },
{ id: "AE014", name: "Pelabuhan Perikanan Be'ba - Takalar", lat: -5.274, lon: 119.375 },
{ id: "AE015", name: "Pelabuhan Perikanan Untia - Makassar", lat: -5.068, lon: 119.476 },
  
// SULAWESI TENGAH
{ id: "AC001", name: "Pelabuhan Taipa", lat: -0.77953, lon: 119.85814 },
{ id: "AC002", name: "Pelabuhan Pantoloan", lat: -0.710675791, lon: 119.855417377 },
{ id: "AC003", name: "Pelabuhan Wani", lat: -0.694891971, lon: 119.840240897 },
{ id: "AC004", name: "Pelabuhan Donggala", lat: -0.66597, lon: 119.74458 },
{ id: "AC005", name: "Pelabuhan Ogoamas", lat: 0.741200848, lon: 120.104873251 },
{ id: "AC006", name: "Pelabuhan Perikanan Pantai Ogotua", lat:  0.95802605, lon: 120.25321922 },
{ id: "AC007", name: "Pelabuhan Daerah Haji Hayyun Tolitoli", lat:  1.037709056, lon: 120.809498953 },

];


