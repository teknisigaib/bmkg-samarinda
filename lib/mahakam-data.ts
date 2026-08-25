// lib/mahakam-data.ts

// ==========================================
// 1. HELPER FORMATTER & TRANSLATOR
// ==========================================

export const formatVisibility = (meters: number | undefined | null): string => {
  if (meters === undefined || meters === null) return "-";
  if (meters >= 10000) return "> 10 km";
  const km = (meters / 1000).toFixed(1);
  return `${km.replace('.', ',')} km`;
};

export const translateWindDir = (code: string | undefined | null): string => {
  if (!code) return "-";
  const map: Record<string, string> = {
    'N': 'Utara', 'NNE': 'Utara Timur Laut', 'NE': 'Timur Laut', 'ENE': 'Timur Timur Laut',
    'E': 'Timur', 'ESE': 'Timur Tenggara', 'SE': 'Tenggara', 'SSE': 'Selatan Tenggara',
    'S': 'Selatan', 'SSW': 'Selatan Barat Daya', 'SW': 'Barat Daya', 'WSW': 'Barat Barat Daya',
    'W': 'Barat', 'WNW': 'Barat Barat Laut', 'NW': 'Barat Laut', 'NNW': 'Utara Barat Laut',
    'VARIABLE': 'Berubah-ubah', 'CALM': 'Tenang'
  };
  return map[code.toUpperCase()] || code;
};

// ==========================================
// 2. SENTRALISASI PARAMETER NAVIGASI
// ==========================================

export const NAV_THRESHOLDS = {
  DANGER: {
      MAX_WIND_KMH: 25,         // Angin di atas ini = Bahaya (Merah)
      MIN_VISIBILITY_M: 1000,   // Visibilitas di bawah ini = Bahaya (Merah)
      BAD_WEATHER_KEYWORDS: ['lebat', 'petir', 'badai'] // Keyword cuaca ekstrem
  },
  CAUTION: {
      MAX_WIND_KMH: 20,         // Angin di atas ini = Waspada (Kuning)
      MIN_VISIBILITY_M: 2000,   // Visibilitas di bawah ini = Waspada (Kuning)
      BAD_WEATHER_KEYWORDS: ['sedang', 'hujan', 'kabut']
  }
};

export const getNavigationStatus = (condition: string, windSpeed: number, visibilityMeters: number): 'aman' | 'waspada' | 'bahaya' => {
  const cond = (condition || '').toLowerCase();
  
  // 1. Cek Kriteria Bahaya
  if (
      windSpeed >= NAV_THRESHOLDS.DANGER.MAX_WIND_KMH || 
      visibilityMeters <= NAV_THRESHOLDS.DANGER.MIN_VISIBILITY_M ||
      NAV_THRESHOLDS.DANGER.BAD_WEATHER_KEYWORDS.some(kw => cond.includes(kw))
  ) {
      return 'bahaya';
  }
  
  // 2. Cek Kriteria Waspada
  if (
      windSpeed >= NAV_THRESHOLDS.CAUTION.MAX_WIND_KMH || 
      visibilityMeters <= NAV_THRESHOLDS.CAUTION.MIN_VISIBILITY_M ||
      NAV_THRESHOLDS.CAUTION.BAD_WEATHER_KEYWORDS.some(kw => cond.includes(kw))
  ) {
      return 'waspada';
  }

  // 3. Sisanya Aman
  return 'aman';
};

// ==========================================
// 3. DEFINISI TIPE DATA (INTERFACE)
// ==========================================

export interface MahakamForecastItem {
  time: string;
  condition: string;
  weatherIcon: string;
  temp: number;
  rain: number;       
  windSpeed: number;
  windDeg: number; 
  windDir: string; 
  humidity: number;
  tcc: number; 
  visibility_val: number;
  visibility_text: string;
}

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
  rain?: number;      
  iconUrl?: string;
  windSpeed?: number;
  windDeg?: number;
  windDir?: string;
  humidity?: number;
  tcc?: number;
  visibility?: number; 
  visibilityDisplay?: string;
  
  forecasts?: MahakamForecastItem[];
}

// ==========================================
// 4. DATA LOKASI STATIS JALUR MAHAKAM
// ==========================================

export const MAHAKAM_LOCATIONS: MahakamLocation[] = [
  // --- MAHAKAM ULU ---
  {
    id: '1', bmkgId: '64.11.04', name: 'Long Apari', regency: 'Mahakam Ulu', lat: 0.7752711, lng: 114.2729414, type: 'hulu', desc: 'Wilayah hulu', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '2', bmkgId: '64.11.05', name: 'Long Pahangai', regency: 'Mahakam Ulu', lat: 0.8880385, lng: 114.6912092, type: 'hulu', desc: 'Wilayah hulu', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '3', bmkgId: '64.11.01', name: 'Long Bagun', regency: 'Mahakam Ulu', lat: 0.6215737, lng: 115.1588523, type: 'hulu', desc: 'Wilayah hulu', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '4', bmkgId: '64.11.03', name: 'Laham', regency: 'Mahakam Ulu', lat: 0.3561736, lng: 115.3966892, type: 'hulu', desc: 'Wilayah hulu', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '5', bmkgId: '64.11.02', name: 'Long Hubung', regency: 'Mahakam Ulu', lat: 0.266671, lng: 115.441706, type: 'hulu', desc: 'Wilayah hulu', weather: '-', temp: 0,
    visibility: undefined
  },

  // --- KUTAI BARAT ---
  {
    id: '6', bmkgId: '64.07.05', name: 'Long Iram', regency: 'Kutai Barat', lat: 0.0212217, lng: 115.5508303, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '7', bmkgId: '64.07.19', name: 'Tering', regency: 'Kutai Barat', lat: -0.0724, lng: 115.6503, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '8', bmkgId: '64.07.06', name: 'Melak', regency: 'Kutai Barat', lat: -0.1258, lng: 115.7568, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '9', bmkgId: '64.07.18', name: 'Mook Manaar Bulatn', regency: 'Kutai Barat', lat: -0.170, lng: 115.820, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '10', bmkgId: '64.07.07', name: 'Barong Tongkok', regency: 'Kutai Barat', lat: -0.216, lng: 115.750, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },  
  {
    id: '11', bmkgId: '64.07.20', name: 'Sekolaq Darat', regency: 'Kutai Barat', lat: -0.220, lng: 115.800, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },

  {
    id: '12', bmkgId: '64.07.10', name: 'Muara Pahu', regency: 'Kutai Barat', lat: -0.3229, lng: 116.0649, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '13', bmkgId: '64.07.13', name: 'Penyinggahan', regency: 'Kutai Barat', lat: -0.372, lng: 116.253, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '14', bmkgId: '64.02.01', name: 'Muara Muntai', regency: 'Kutai Kartanegara', lat: -0.360, lng: 116.325, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },

  // --- KUTAI KARTANEGARA ---
  {
    id: '15', bmkgId: '64.02.18', name: 'Muara Wis', regency: 'Kutai Kartanegara', lat: -0.2971, lng: 116.4611, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '16', bmkgId: '64.02.08', name: 'Kota Bangun', regency: 'Kutai Kartanegara', lat: -0.2357, lng: 116.5747, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '17', bmkgId: '64.02.11', name: 'Muara Kaman', regency: 'Kutai Kartanegara', lat: -0.1935, lng: 116.7718, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '18', bmkgId: '64.02.07', name: 'Sebulu', regency: 'Kutai Kartanegara', lat: -0.3184, lng: 116.9325, type: 'tengah', desc: 'Wilayah tengah', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '19', bmkgId: '64.02.16', name: 'Tenggarong Seberang', regency: 'Kutai Kartanegara', lat: -0.380, lng: 117.020, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  
  {
    id: '20', bmkgId: '64.02.06', name: 'Tenggarong', regency: 'Kutai Kartanegara', lat: -0.4101, lng: 116.9932, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '21', bmkgId: '64.02.15', name: 'Loa Kulu', regency: 'Kutai Kartanegara', lat: -0.5193, lng: 117.0262, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '22', bmkgId: '64.02.03', name: 'Loa Janan', regency: 'Kutai Kartanegara', lat: -0.580, lng: 117.068, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '23', bmkgId: '64.72.03', name: 'Loa Janan Ilir', regency: 'Samarinda', lat: -0.5388, lng: 117.0989, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },  
  {
    id: '24', bmkgId: '64.72.06', name: 'Sungai Kunjang', regency: 'Samarinda', lat: -0.518, lng: 117.106, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '25', bmkgId: '64.72.03', name: 'Samarinda Ulu', regency: 'Samarinda', lat: -0.490, lng: 117.135, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '26', bmkgId: '64.72.02', name: 'Samarinda Seberang', regency: 'Samarinda', lat: -0.5062, lng: 117.1317, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '27', bmkgId: '64.72.01', name: 'Samarinda Kota', regency: 'Samarinda', lat: -0.5064, lng: 117.1493, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '28', bmkgId: '64.72.04', name: 'Samarinda Ilir', regency: 'Samarinda', lat: -0.501, lng: 117.156, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '29', bmkgId: '64.72.01', name: 'Palaran', regency: 'Samarinda', lat: -0.584, lng: 117.143, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '30', bmkgId: '64.72.05', name: 'Sambutan', regency: 'Samarinda', lat: -0.5568, lng: 117.195, type: 'hilir', desc: 'Wilayah hilir', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '31', bmkgId: '64.02.04', name: 'Anggana', regency: 'Kutai Kartanegara', lat: -0.5821, lng: 117.3432, type: 'muara', desc: 'Wilayah muara', weather: '-', temp: 0,
    visibility: undefined
  },

  {
    id: '32', bmkgId: '64.02.05', name: 'Sanga Sanga', regency: 'Kutai Kartanegara', lat: -0.6199, lng: 117.2958, type: 'muara', desc: 'Wilayah muara', weather: '-', temp: 0,
    visibility: undefined
  },
  {
    id: '33', bmkgId: '64.02.03', name: 'Muara Jawa', regency: 'Kutai Kartanegara', lat: -0.8176, lng: 117.2613, type: 'muara', desc: 'Wilayah muara', weather: '-', temp: 0,
    visibility: undefined
  }
];

// ==========================================
// 5. LOGIKA FETCHING & DATA MAPPING
// ==========================================

export async function getMahakamData(): Promise<MahakamLocation[]> {
  const uniqueAdm2 = new Set<string>();
  MAHAKAM_LOCATIONS.forEach(loc => {
    if(loc.bmkgId.includes('.')) {
        const adm2Code = loc.bmkgId.split('.').slice(0, 2).join('.');
        uniqueAdm2.add(adm2Code);
    }
  });

  const fetchPromises = Array.from(uniqueAdm2).map(async (adm2) => {
    const url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm2=${adm2}`;
    try {
      const res = await fetch(url, { 
        next: { revalidate: 0 }, 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) return null;
      
      const json = await res.json();
      return { adm2, data: json.data }; 
    } catch (e) {
      return null;
    }
  });

  const regionResults = await Promise.all(fetchPromises);

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

  const finalData = MAHAKAM_LOCATIONS.map((loc) => {
    const rawWeatherData = weatherMap[loc.bmkgId];

    if (!rawWeatherData) {
      return { ...loc, visibilityDisplay: "-" };
    }

    try {
      const flatWeather = Array.isArray(rawWeatherData) ? rawWeatherData.flat() : [];
      if (flatWeather.length === 0) return loc;

      // Safe Date Sorter: Memastikan format waktu aman (ISO 8601) untuk disortir
      flatWeather.sort((a: any, b: any) => {
        const safeTimeA = typeof a.datetime === 'string' ? a.datetime.replace(' ', 'T') : a.datetime;
        const safeTimeB = typeof b.datetime === 'string' ? b.datetime.replace(' ', 'T') : b.datetime;
        return new Date(safeTimeA).getTime() - new Date(safeTimeB).getTime();
      });

      const forecastList: MahakamForecastItem[] = flatWeather.map((c: any) => {
        const vsVal = c.vs || 0; 
        const safeTime = typeof c.datetime === 'string' ? c.datetime.replace(' ', 'T') : c.datetime;
        
        return {
          time: safeTime,
          condition: c.weather_desc || "Berawan",
          weatherIcon: c.image || "",
          temp: c.t || 0,
          rain: c.tp || 0,
          windSpeed: c.ws || 0,
          windDeg: c.wd_deg || 0,
          windDir: c.wd || "-",
          humidity: c.hu || 0,
          tcc: c.tcc || 0,
          visibility_val: vsVal,
          visibility_text: formatVisibility(vsVal)
        };
      });

      const now = new Date().getTime();
      let closestData = forecastList[0];
      let minDiff = Infinity;

      forecastList.forEach((item) => {
        const itemTime = new Date(item.time).getTime();
        if (!isNaN(itemTime)) {
          const diff = Math.abs(now - itemTime);
          if (diff < minDiff) {
            minDiff = diff;
            closestData = item;
          }
        }
      });

      return {
        ...loc, 
        weather: closestData.condition,
        temp: closestData.temp,
        rain: closestData.rain,
        iconUrl: closestData.weatherIcon,
        windSpeed: closestData.windSpeed,
        windDeg: closestData.windDeg,
        windDir: closestData.windDir,
        humidity: closestData.humidity,
        tcc: closestData.tcc,
        // Menyimpan nilai original visibility agar bisa dipakai logika thresholds
        visibility: closestData.visibility_val / 1000, 
        visibilityDisplay: closestData.visibility_text,
        forecasts: forecastList
      };

    } catch (err) {
      return loc;
    }
  });

  return finalData;
}