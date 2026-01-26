// lib/data.ts
import { RegionLevel } from './types';

// Tipe data untuk satu entry wilayah di "database" kita
export interface RegionData {
  id: string;
  parentId: string | null; // null jika ini Provinsi (top level)
  name: string;
  level: RegionLevel;
  // Data Cuaca Spesifik Wilayah ini
  temp: number;
  condition: string;
  icon: string;
  description: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}

// DATABASE MOCKUP (Hierarki: Jabar -> Bandung -> Coblong -> Dago)
export const allRegions: RegionData[] = [
  // LEVEL 1: PROVINSI
  {
    id: 'jabar', parentId: null, level: 'province', name: 'Jawa Barat',
    temp: 28, condition: 'Berawan', icon: 'cloud', description: 'Cuaca umum provinsi berawan.',
    windSpeed: 20, humidity: 70, pressure: 1010, visibility: 10, uvIndex: 5
  },

  // LEVEL 2: KOTA (Anak dari jabar)
  {
    id: 'bandung', parentId: 'jabar', level: 'city', name: 'Kota Bandung',
    temp: 24, condition: 'Hujan Ringan', icon: 'cloud-rain', description: 'Hujan merata di sebagian besar kota.',
    windSpeed: 15, humidity: 80, pressure: 1012, visibility: 8, uvIndex: 3
  },
  {
    id: 'cimahi', parentId: 'jabar', level: 'city', name: 'Kota Cimahi',
    temp: 25, condition: 'Cerah', icon: 'sun', description: 'Cerah berawan sepanjang hari.',
    windSpeed: 10, humidity: 65, pressure: 1011, visibility: 9, uvIndex: 6
  },

  // LEVEL 3: KECAMATAN (Anak dari bandung)
  {
    id: 'coblong', parentId: 'bandung', level: 'district', name: 'Kec. Coblong',
    temp: 22, condition: 'Mendung', icon: 'cloud', description: 'Mendung tebal di area Dago dan sekitarnya.',
    windSpeed: 12, humidity: 85, pressure: 1010, visibility: 6, uvIndex: 2
  },
  {
    id: 'sukajadi', parentId: 'bandung', level: 'district', name: 'Kec. Sukajadi',
    temp: 23, condition: 'Hujan Petir', icon: 'cloud-lightning', description: 'Waspada petir di area Paris Van Java.',
    windSpeed: 18, humidity: 88, pressure: 1009, visibility: 4, uvIndex: 1
  },

  // LEVEL 4: KELURAHAN (Anak dari coblong)
  {
    id: 'dago', parentId: 'coblong', level: 'village', name: 'Kel. Dago',
    temp: 20, condition: 'Kabut', icon: 'cloud-fog', description: 'Berkabut tebal, jarak pandang terbatas.',
    windSpeed: 5, humidity: 95, pressure: 1010, visibility: 2, uvIndex: 1
  },
  {
    id: 'sadang', parentId: 'coblong', level: 'village', name: 'Kel. Sadang Serang',
    temp: 23, condition: 'Berawan', icon: 'cloud', description: 'Berawan tebal namun kering.',
    windSpeed: 8, humidity: 75, pressure: 1012, visibility: 7, uvIndex: 3
  },
];

// Helper untuk mengambil data berdasarkan ID
export const getRegionById = (id: string) => allRegions.find(r => r.id === id);

// Helper untuk mencari anak-anak wilayah (Sub-regions)
export const getSubRegions = (parentId: string) => allRegions.filter(r => r.parentId === parentId);

// Helper untuk membuat Breadcrumbs (Mundur ke atas mencari parent)
export const getBreadcrumbs = (currentId: string) => {
  const crumbs = [];
  let current = getRegionById(currentId);
  while (current) {
    crumbs.unshift({ name: current.name, id: current.id }); // Add to beginning
    if (current.parentId) {
      current = getRegionById(current.parentId);
    } else {
      break;
    }
  }
  return crumbs;
};



// Tambahkan di bagian bawah lib/data.ts
export const hourlyForecast = [
  { time: "15:00", temp: 22, icon: "cloud-rain" },
  { time: "16:00", temp: 21, icon: "cloud-rain" },
  { time: "17:00", temp: 21, icon: "cloud" },
  { time: "18:00", temp: 20, icon: "cloud" },
  { time: "19:00", temp: 20, icon: "moon" },
];

export const dailyForecast = [
  { day: "Sabtu", date: "25 Mei", min: 20, max: 28, condition: "Hujan Ringan", icon: "cloud-rain" },
  { day: "Minggu", date: "26 Mei", min: 21, max: 29, condition: "Cerah Berawan", icon: "cloud-sun" },
  { day: "Senin", date: "27 Mei", min: 19, max: 27, condition: "Hujan Petir", icon: "cloud-lightning" },
];



// lib/data.ts

export interface GeneralForecastRow {
  time: string;
  date: string;
  weatherIcon: string;
  weatherDesc: string;
  wind: {
    direction: string; // Misal: "Barat Laut"
    deg: number;       // Derajat rotasi icon
    speed: number;     // km/j (bukan knot lagi agar lebih umum)
  };
  temp: number;
  humidity: number;
  feelsLike: number; // Tambahan: Suhu yang dirasakan
}

// Data Dummy Tabel Cuaca Umum
export const generalTableData: GeneralForecastRow[] = [
  {
    time: "01:00", date: "23 Jan 26",
    weatherIcon: "cloud-rain", weatherDesc: "Hujan Ringan",
    wind: { direction: "Barat Laut", deg: 315, speed: 20 },
    temp: 23, feelsLike: 25, humidity: 85
  },
  {
    time: "04:00", date: "23 Jan 26",
    weatherIcon: "cloud-rain", weatherDesc: "Hujan Ringan",
    wind: { direction: "Barat Laut", deg: 310, speed: 18 },
    temp: 22, feelsLike: 24, humidity: 88
  },
  {
    time: "07:00", date: "23 Jan 26",
    weatherIcon: "cloud", weatherDesc: "Berawan",
    wind: { direction: "Utara", deg: 0, speed: 10 },
    temp: 24, feelsLike: 26, humidity: 80
  },
  {
    time: "10:00", date: "23 Jan 26",
    weatherIcon: "sun", weatherDesc: "Cerah Berawan",
    wind: { direction: "Timur Laut", deg: 45, speed: 12 },
    temp: 28, feelsLike: 31, humidity: 70
  },
  {
    time: "13:00", date: "23 Jan 26",
    weatherIcon: "sun", weatherDesc: "Cerah",
    wind: { direction: "Timur", deg: 90, speed: 15 },
    temp: 31, feelsLike: 35, humidity: 65
  },
];