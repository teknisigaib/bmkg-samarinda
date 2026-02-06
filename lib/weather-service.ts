// src/lib/weather-service.ts

const CACHE = new Map<string, { data: WeatherData, timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 10; // 10 Menit

import { BMKGResponse, BMKGWeatherItem } from './bmkg-types';
import { WeatherData, RegionLevel } from './types';
import { calculateFeelsLike } from './weather-utils';
import { MAHAKAM_LOCATIONS } from '@/lib/mahakam-data';

// --- HELPERS ---
const getLevel = (id: string): RegionLevel => {
  const parts = id.split('.');
  if (parts.length === 1) return 'province';
  if (parts.length === 2) return 'city';
  if (parts.length === 3) return 'district';
  return 'village';
};

// --- HELPER SINKRONISASI WAKTU (The Fixer) ---
// Mencari data cuaca yang jam-nya paling dekat dengan sekarang (bukan sekadar jam pertama)
const getCurrentWeatherItem = (cuacaArray: BMKGWeatherItem[][]): BMKGWeatherItem => {
  const flatList = cuacaArray.flat();
  const now = new Date();
  let closestItem = flatList[0];
  let minDiff = Infinity;

  flatList.forEach(item => {
    // Pastikan format local_datetime didukung browser (biasanya "YYYY-MM-DD HH:mm:ss")
    const itemTime = new Date(item.local_datetime).getTime();
    const diff = Math.abs(now.getTime() - itemTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestItem = item;
    }
  });

  return closestItem;
};

// --- CORE FETCHING ---
export const fetchBMKGData = async (locationId: string): Promise<WeatherData | null> => {
  const cached = CACHE.get(locationId);
  const now = Date.now();
  
  // 1. Cek In-Memory Cache dulu (Layer 1)
  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }

  const parts = locationId.split('.');
  let url = '';
  if (parts.length === 1) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=${locationId}`;
  else if (parts.length === 2) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=${parts[0]}&adm2=${locationId}`;
  else if (parts.length === 3) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm3=${locationId}`;
  else if (parts.length === 4) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm4=${locationId}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error("Gagal mengambil data BMKG");
    
    const json: BMKGResponse = await res.json();
    const data = transformToUIData(json, locationId);
    
    // 2. Simpan ke In-Memory Cache (Layer 2)
    CACHE.set(locationId, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error("Error fetching BMKG data:", error);
    return null;
  }
};

const transformToUIData = (json: BMKGResponse, requestedId: string): WeatherData => {
  const rootMeta = json.lokasi;
  const level = getLevel(requestedId);
  
  // Cari data spesifik lokasi (jika json berisi banyak lokasi/parent)
  let referenceData = json.data[0];
  const specificMatch = json.data.find(d => 
    d.lokasi.adm4 === requestedId || d.lokasi.adm3 === requestedId || d.lokasi.adm2 === requestedId
  );
  if (specificMatch) referenceData = specificMatch;

  // AMBIL DATA TERKINI (SINKRON)
  const refWeather = getCurrentWeatherItem(referenceData.cuaca);
  const realFeelValue = calculateFeelsLike(refWeather.t, refWeather.hu, refWeather.ws);

  let locationName = "Wilayah";
  if (level === 'province') locationName = rootMeta.provinsi;
  else if (level === 'city') locationName = rootMeta.kotkab || "";
  else if (level === 'district') locationName = rootMeta.kecamatan || "";
  else locationName = rootMeta.desa || "";

  // Mapping Sub-regions (jika level provinsi/kota)
  const subRegions = json.data.map(item => {
    const w = getCurrentWeatherItem(item.cuaca);
    let id = item.lokasi.adm4 || item.lokasi.adm3 || item.lokasi.adm2 || "";
    let name = item.lokasi.desa || item.lokasi.kecamatan || item.lokasi.kotkab || "";

    if (level === 'province') { id = item.lokasi.adm2 ?? ""; name = item.lokasi.kotkab ?? ""; }
    else if (level === 'city') { id = item.lokasi.adm3 ?? ""; name = item.lokasi.kecamatan ?? ""; }
    else if (level === 'district') { id = item.lokasi.adm4 ?? ""; name = item.lokasi.desa ?? ""; }

    return {
      id: id,
      name: name,
      level: getLevel(id) as any,
      temp: w.t,
      condition: w.weather_desc,
      icon: w.image, // URL Icon Subregion
    };
  });

  return {
    location: locationName,
    parentLocation: level === 'province' ? 'Indonesia' : (rootMeta.provinsi || rootMeta.kotkab || ""),
    level: level,
    timestamp: `Diperbarui: ${refWeather.local_datetime}`,
    
    // Data Utama
    temp: refWeather.t,
    condition: refWeather.weather_desc,
    iconUrl: refWeather.image,
    windSpeed: refWeather.ws,
    humidity: refWeather.hu,
    tcc: refWeather.tcc,
    feelsLike: realFeelValue,
    
    // Visibility
    visibility: parseFloat(refWeather.vs_text.replace(/[<>=a-zA-Z]/g, '').trim()) || 10,
    
    uvIndex: 0,
    subRegions: subRegions,
    tempRange: undefined, // Bisa diaktifkan ulang jika butuh range suhu min-max
    description: `Kondisi ${refWeather.weather_desc} dengan suhu ${refWeather.t}°C.`,
    
    // Data Tabel (Forecast 24 Jam)
    tableData: referenceData.cuaca.flat().map((w: BMKGWeatherItem) => ({
      time: w.local_datetime.split(' ')[1].slice(0, 5),
      date: w.local_datetime.split(' ')[0], // Date untuk Detail View
      weatherIcon: w.image,
      weatherDesc: w.weather_desc,
      wind: {
        direction: w.wd_to || w.wd,
        deg: w.wd_deg,
        speed: w.ws
      },
      temp: w.t,
      feelsLike: calculateFeelsLike(w.t, w.hu, w.ws),
      humidity: w.hu
    }))
  };
};

// --- FUNGSI 1: AMBIL DATA PROVINSI (KALTIM) ---
// Digunakan untuk list cuaca kota-kota di halaman utama
export const getKaltimWeather = async () => {
  try {
    const res = await fetch(
      "https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=64",
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error("Gagal mengambil data cuaca provinsi");

    const responseData = await res.json();

    if (!responseData.data || !Array.isArray(responseData.data)) {
      return [];
    }

    const formattedList = responseData.data.map((item: any) => {
      const namaWilayah = item.lokasi.kotkab || "Wilayah";
      const current = getCurrentWeatherItem(item.cuaca);

      if (!current) return null;

      return {
        wilayah: namaWilayah,
        suhu: current.t,
        cuaca: current.weather_desc,
        kodeCuaca: String(current.weather),
        iconUrl: current.image || "",
        jam: current.local_datetime 
              ? current.local_datetime.split(' ')[1].substring(0, 5) 
              : "Terkini",
        anginSpeed: Math.round(current.ws * 1.852),
        anginDir: current.wd,
        kelembapan: current.hu
      };
    });

    return formattedList
      .filter((item: any) => item !== null)
      .sort((a: any, b: any) => a.wilayah.localeCompare(b.wilayah));

  } catch (error) {
    console.error("Error fetching Kaltim weather:", error);
    return [];
  }
};

// --- FUNGSI 2: AMBIL DATA MAHAKAM (DASHBOARD) ---
// Digunakan untuk Monitoring Rute Sungai
export const getMahakamDataFull = async () => {
  const promises = MAHAKAM_LOCATIONS.map(async (loc) => {
    const weatherData = await fetchBMKGData(loc.bmkgId);
    
    if (!weatherData) return { ...loc, weather: 'N/A', temp: 0 };

    return {
      ...loc,
      weather: weatherData.condition,
      temp: weatherData.temp,
      iconUrl: weatherData.iconUrl || "",
      windSpeed: weatherData.windSpeed,
      humidity: weatherData.humidity,
      feelsLike: weatherData.feelsLike,
      windDeg: weatherData.tableData?.[0]?.wind.deg || 0,
      visibility: weatherData.visibility,
      
      // Data Forecast untuk Detail View (Modal)
      forecasts: weatherData.tableData?.map(item => ({
        time: item.time,
        date: item.date,
        temp: item.temp,
        weatherIcon: item.weatherIcon,
        condition: item.weatherDesc,
        windSpeed: item.wind.speed,
        windDeg: item.wind.deg
      })) || []
    };
  });

  return await Promise.all(promises);
};