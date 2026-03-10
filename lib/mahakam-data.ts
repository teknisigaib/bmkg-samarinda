import { ReactNode } from "react";

// ==========================================
// 0. HELPER FORMATTER (BARU)
// ==========================================
const formatVisibility = (meters: number): string => {
  if (meters === undefined || meters === null) return "-";
  
  // Jika >= 10.000 meter, tulis "> 10 km"
  if (meters >= 10000) {
    return "> 10 km";
  }

  // Jika di bawah 10km, ubah ke km dengan 1 desimal
  // Contoh: 4560 -> 4.56 -> 4.6 -> "4,6 km"
  const km = (meters / 1000).toFixed(1); 
  return `${km.replace('.', ',')} km`;
};

// ==========================================
// 1. DEFINISI TIPE DATA
// ==========================================
export interface MahakamLocation {
  id: string;
  bmkgId: string;
  name: string;
  regency: string;
  lat: number;
  lng: number;
  type: 'hulu' | 'tengah' | 'hilir' | 'muara';
  desc: string;
  
  weather: string;
  temp: number;
  iconUrl?: string;
  windSpeed?: number;
  windDeg?: number;
  humidity?: number;
  visibility?: number; // Nilai numerik (dalam km) untuk sorting/logic
  visibilityDisplay?: string; // NEW: Nilai string untuk tampilan ("4,6 km", "> 10 km")
  
  forecasts?: {
    time: string;
    condition: string;
    weatherIcon: string;
    temp: number;
    windSpeed: number;
    windDeg: number;
    humidity: number;
    visibility_val: number; // Raw meter
    visibility_text: string; // Formatted text
  }[];
}

// ==========================================
// 2. DATA STATIS
// ==========================================
export const MAHAKAM_LOCATIONS: MahakamLocation[] = [
  // --- MAHAKAM ULU ---
  { id: '1', bmkgId: '64.11.04', name: 'Long Apari', regency: 'Mahakam Ulu', lat: 0.7755, lng: 114.2728, type: 'hulu', desc: 'Wilayah hulu Sungai Mahakam', weather: '-', temp: 0 },
  { id: '2', bmkgId: '64.11.05', name: 'Long Pahangai', regency: 'Mahakam Ulu', lat: 0.8876, lng: 114.6884, type: 'hulu', desc: 'Wilayah hulu Sungai Mahakam', weather: '-', temp: 0 },
  { id: '3', bmkgId: '64.11.01', name: 'Long Bagun', regency: 'Mahakam Ulu', lat: 0.6216, lng: 115.1599, type: 'hulu', desc: 'Wilayah hulu Sungai Mahakam', weather: '-', temp: 0 },
  { id: '4', bmkgId: '64.11.03', name: 'Laham', regency: 'Mahakam Ulu', lat: 0.34, lng: 115.4044, type: 'hulu', desc: 'Wilayah hulu Sungai Mahakam', weather: '-', temp: 0 },
  { id: '5', bmkgId: '64.11.02', name: 'Long Hubung', regency: 'Mahakam Ulu', lat: 0.2483, lng: 115.4552, type: 'hulu', desc: 'Wilayah hulu Sungai Mahakam', weather: '-', temp: 0 },

  // --- KUTAI BARAT ---
  { id: '6', bmkgId: '64.07.05', name: 'Long Iram', regency: 'Kutai Barat', lat: 0.0325, lng: 115.5782, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '7', bmkgId: '64.07.19', name: 'Tering', regency: 'Kutai Barat', lat: -0.0724, lng: 115.6503, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '8', bmkgId: '64.07.06', name: 'Melak', regency: 'Kutai Barat', lat: -0.1258, lng: 115.7568, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '9', bmkgId: '64.07.10', name: 'Muara Pahu', regency: 'Kutai Barat', lat: -0.3229, lng: 116.0649, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '10', bmkgId: '64.07.13', name: 'Penyinggahan', regency: 'Kutai Barat', lat: -0.372, lng: 116.253, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },

  // --- KUTAI KARTANEGARA ---
  { id: '11', bmkgId: '64.02.18', name: 'Muara Wis', regency: 'Kutai Kartanegara', lat: -0.2971, lng: 116.4611, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '12', bmkgId: '64.02.08', name: 'Kota Bangun', regency: 'Kutai Kartanegara', lat: -0.2357, lng: 116.5747, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '13', bmkgId: '64.02.11', name: 'Muara Kaman', regency: 'Kutai Kartanegara', lat: -0.1935, lng: 116.7718, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '14', bmkgId: '64.02.07', name: 'Sebulu', regency: 'Kutai Kartanegara', lat: -0.3184, lng: 116.9325, type: 'tengah', desc: 'Wilayah tengah Sungai Mahakam', weather: '-', temp: 0 },
  { id: '15', bmkgId: '64.02.06', name: 'Tenggarong', regency: 'Kutai Kartanegara', lat: -0.4101, lng: 116.9932, type: 'hilir', desc: 'Wilayah hilir Sungai Mahakam', weather: '-', temp: 0 },
  { id: '16', bmkgId: '64.02.15', name: 'Loa Kulu', regency: 'Kutai Kartanegara', lat: -0.5193, lng: 117.0262, type: 'hilir', desc: 'Wilayah hilir Sungai Mahakam', weather: '-', temp: 0 },
  
  // --- SAMARINDA ---
  { id: '17', bmkgId: '64.72.03', name: 'Loa Janan Ilir', regency: 'Samarinda', lat: -0.5388, lng: 117.0989, type: 'hilir', desc: 'Wilayah hilir Sungai Mahakam', weather: '-', temp: 0 },
  { id: '18', bmkgId: '64.72.02', name: 'Samarinda Seberang', regency: 'Samarinda', lat: -0.5062, lng: 117.1317, type: 'hilir', desc: 'Wilayah hilir Sungai Mahakam', weather: '-', temp: 0 },
  { id: '19', bmkgId: '64.72.01', name: 'Samarinda Kota', regency: 'Samarinda', lat: -0.5064, lng: 117.1493, type: 'hilir', desc: 'Wilayah hilir Sungai Mahakam', weather: '-', temp: 0 },
  { id: '20', bmkgId: '64.72.05', name: 'Sambutan', regency: 'Samarinda', lat: -0.5568, lng: 117.195, type: 'hilir', desc: 'Wilayah hilir Sungai Mahakam', weather: '-', temp: 0 },

  // --- MUARA ---
  { id: '21', bmkgId: '64.02.05', name: 'Sanga Sanga', regency: 'Kutai Kartanegara', lat: -0.6199, lng: 117.2958, type: 'muara', desc: 'Wilayah muara Sungai Mahakam', weather: '-', temp: 0 },
  { id: '22', bmkgId: '64.02.04', name: 'Anggana', regency: 'Kutai Kartanegara', lat: -0.5821, lng: 117.3432, type: 'muara', desc: 'Wilayah muara Sungai Mahakam', weather: '-', temp: 0 },
  { id: '23', bmkgId: '64.02.03', name: 'Muara Jawa', regency: 'Kutai Kartanegara', lat: -0.8176, lng: 117.2613, type: 'muara', desc: 'Wilayah muara Sungai Mahakam', weather: '-', temp: 0 },
];

// ==========================================
// 3. LOGIKA FETCHING TEROPTIMASI
// ==========================================
export async function getMahakamData(): Promise<MahakamLocation[]> {
  
  // 1. Ekstrak kode ADM2 (Kabupaten)
  const uniqueAdm2 = new Set<string>();
  MAHAKAM_LOCATIONS.forEach(loc => {
    if(loc.bmkgId.includes('.')) {
        const adm2Code = loc.bmkgId.split('.').slice(0, 2).join('.');
        uniqueAdm2.add(adm2Code);
    }
  });

  // 2. Fetch data per Kabupaten
  const fetchPromises = Array.from(uniqueAdm2).map(async (adm2) => {
    const url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm2=${adm2}`;
    
    try {
      const res = await fetch(url, { 
        next: { revalidate: 0 }, 
        headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://cuaca.bmkg.go.id/',
            'Origin': 'https://cuaca.bmkg.go.id',
            'Accept': 'application/json, text/plain, */*'
        }
      });
      
      if (!res.ok) {
          console.error(`>> Mahakam: Error fetching ${adm2} - Status: ${res.status}`);
          return null;
      }
      
      const json = await res.json();
      return { adm2, data: json.data }; 
    } catch (e) {
      console.error(`>> Mahakam: Exception fetching ${adm2}:`, e);
      return null;
    }
  });

  const regionResults = await Promise.all(fetchPromises);

  // 3. Buat Dictionary Data Cuaca
  const weatherMap: Record<string, any> = {};

  regionResults.forEach((result) => {
    if (result && result.data) {
      result.data.forEach((kecamatanData: any) => {
        const adm3 = kecamatanData.lokasi?.adm3; 
        if (adm3) {
            weatherMap[adm3] = kecamatanData.cuaca;
        }
      });
    }
  });

  // 4. Map Data Cuaca
  const finalData = MAHAKAM_LOCATIONS.map((loc) => {
    const rawWeatherData = weatherMap[loc.bmkgId];

    if (!rawWeatherData) {
        return {
            ...loc,
            visibilityDisplay: "-"
        };
    }

    try {
        const flatWeather = Array.isArray(rawWeatherData) ? rawWeatherData.flat() : [];

        if (flatWeather.length === 0) return loc;

        flatWeather.sort((a: any, b: any) => 
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );

        // Transformasi format
        const forecastList = flatWeather.map((c: any) => {
            const vsVal = c.vs || 0; // Ambil nilai vs (meter)
            return {
                time: c.datetime,
                condition: c.weather_desc || "Berawan",
                weatherIcon: c.image || "",
                temp: c.t || 0,
                windSpeed: c.ws || 0,
                windDeg: c.wd_deg || 0,
                humidity: c.hu || 0,
                visibility_val: vsVal,           // Simpan nilai mentah (number)
                visibility_text: formatVisibility(vsVal) // Panggil helper format
            };
        });

        // Cari Data "Saat Ini"
        const now = new Date().getTime();
        let closestData = forecastList[0];
        let minDiff = Infinity;

        forecastList.forEach((item: any) => {
            const itemTime = new Date(item.time).getTime();
            const diff = Math.abs(now - itemTime);
            if (diff < minDiff) {
                minDiff = diff;
                closestData = item;
            }
        });

        if (!closestData) return loc;

        return {
            ...loc, 
            weather: closestData.condition,
            temp: closestData.temp,
            iconUrl: closestData.weatherIcon,
            windSpeed: closestData.windSpeed,
            windDeg: closestData.windDeg,
            humidity: closestData.humidity,
            // LOGIKA VISIBILITY UTAMA
            visibility: closestData.visibility_val / 1000, // Simpan sbg KM (number)
            visibilityDisplay: closestData.visibility_text, // Simpan sbg String terformat
            forecasts: forecastList
        };
    } catch (err) {
        console.error(`>> Mahakam: Error processing ${loc.name}:`, err);
        return loc;
    }
  });

  return finalData;
}