const CACHE = new Map<string, { data: WeatherData, timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 10; // 10 Menit
import { BMKGResponse, BMKGWeatherItem } from './bmkg-types';
import { WeatherData, RegionLevel } from './types';
// IMPORT HELPER YANG ANDA BERIKAN
import { calculateFeelsLike } from './weather-utils'; 

// Helper getLevel & mapWeatherIcon (TETAP SAMA)
const getLevel = (id: string): RegionLevel => {
  const parts = id.split('.');
  if (parts.length === 1) return 'province';
  if (parts.length === 2) return 'city';
  if (parts.length === 3) return 'district';
  return 'village';
};

const mapWeatherIcon = (desc: string): string => {
  const d = desc.toLowerCase();
  if (d.includes('petir')) return 'cloud-lightning';
  if (d.includes('hujan')) return 'cloud-rain';
  if (d.includes('cerah berawan')) return 'sun'; 
  if (d.includes('berawan')) return 'cloud';
  if (d.includes('kabut') || d.includes('asap')) return 'cloud-fog';
  if (d.includes('cerah')) return 'sun';
  return 'cloud';
};

const getCurrentWeatherItem = (cuacaArray: BMKGWeatherItem[][]): BMKGWeatherItem => {
  const flatList = cuacaArray.flat();
  const now = new Date();
  const found = flatList.find(w => new Date(w.local_datetime) >= now);
  return found || flatList[flatList.length - 1];
};

const getDominantString = (arr: string[]) => {
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length - arr.filter(v => v===b).length
  ).pop();
};

export const fetchBMKGData = async (locationId: string): Promise<WeatherData | null> => {
  // 1. CEK CACHE (Read)
  const cached = CACHE.get(locationId);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    console.log("Serving from cache:", locationId);
    return cached.data;
  }  

  // 2. TENTUKAN URL
  const parts = locationId.split('.');
  let url = '';

  if (parts.length === 1) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=${locationId}`;
  else if (parts.length === 2) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=${parts[0]}&adm2=${locationId}`;
  else if (parts.length === 3) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm3=${locationId}`;
  else if (parts.length === 4) url = `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm4=${locationId}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error("Gagal mengambil data BMKG");
    
    const json: BMKGResponse = await res.json();
    
    // Transformasi data
    const data = transformToUIData(json, locationId);
    
    // 3. SIMPAN KE CACHE (Write)
    // Kita simpan data yang sudah jadi (transformed) agar tidak perlu hitung ulang
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
  
  const isParentRegion = json.data.length > 1 || level !== 'village';

  let displayTemp = 0;
  let tempRangeStr: string | undefined = undefined;
  let dominantCondition = "";
  // --- UBAH 1: Inisialisasi dominantIcon dengan string kosong dulu ---
  let dominantIcon = ""; 
  let windSpeedAvg = 0;
  let humidityAvg = 0;
  
  // Data Referensi (Fallback)
  let referenceData = json.data[0];
  const specificMatch = json.data.find(d => 
    d.lokasi.adm4 === requestedId || d.lokasi.adm3 === requestedId || d.lokasi.adm2 === requestedId
  );
  if (specificMatch) referenceData = specificMatch;
  const refWeather = getCurrentWeatherItem(referenceData.cuaca);

  if (isParentRegion && json.data.length > 0) {
    // --- LOGIKA AGREGASI (PARENT) ---
    const temps: number[] = [];
    const conditions: string[] = [];
    // --- UBAH 2: Array untuk menampung URL icon ---
    const iconUrls: string[] = []; 
    let totalWs = 0;
    let totalHu = 0;

    json.data.forEach(item => {
      const w = getCurrentWeatherItem(item.cuaca);
      temps.push(w.t);
      conditions.push(w.weather_desc);
      // --- UBAH 3: Simpan URL icon dari API ---
      iconUrls.push(w.image); 
      totalWs += w.ws;
      totalHu += w.hu;
    });

    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);

    if (minT !== maxT) {
      tempRangeStr = `${minT}° - ${maxT}`;
      displayTemp = Math.round((minT + maxT) / 2);
    } else {
      displayTemp = minT;
    }

    dominantCondition = getDominantString(conditions) || refWeather.weather_desc;
    // --- UBAH 4: Cari icon dominan (URL) ---
    dominantIcon = getDominantString(iconUrls) || refWeather.image; 
    
    windSpeedAvg = Math.round(totalWs / json.data.length);
    humidityAvg = Math.round(totalHu / json.data.length);

  } else {
    // --- LOGIKA SINGLE (KELURAHAN) ---
    displayTemp = refWeather.t;
    dominantCondition = refWeather.weather_desc;
    // --- UBAH 5: Gunakan URL icon langsung ---
    dominantIcon = refWeather.image; 
    windSpeedAvg = refWeather.ws;
    humidityAvg = refWeather.hu;
  }

  // --- HITUNG REALFEEL MENGGUNAKAN HELPER BARU ---
  const realFeelValue = calculateFeelsLike(displayTemp, humidityAvg, windSpeedAvg);

  // --- FORMAT NAMA & PARENT ---
  let locationName = "Wilayah";
  if (level === 'province') locationName = rootMeta.provinsi;
  else if (level === 'city') locationName = rootMeta.kotkab || "";
  else if (level === 'district') locationName = rootMeta.kecamatan || "";
  else locationName = rootMeta.desa || "";

  // --- GENERATE NARASI/DESKRIPSI ---
  let descriptionText = "";
  if (tempRangeStr) {
    descriptionText = `Cuaca dominan ${dominantCondition} di ${locationName}. Suhu berkisar ${tempRangeStr} dengan indeks terasa rata-rata ${realFeelValue}°C.`;
  } else {
    descriptionText = `Kondisi saat ini ${dominantCondition}. Suhu terukur ${displayTemp}°C namun terasa seperti ${realFeelValue}°C akibat faktor kelembapan (${humidityAvg}%) dan angin (${windSpeedAvg} km/j).`;
  }

  // --- SUB REGIONS ---
  const subRegions = json.data.map(item => {
    const w = getCurrentWeatherItem(item.cuaca);
    let id = item.lokasi.adm4 || item.lokasi.adm3 || item.lokasi.adm2 || "";
    let name = item.lokasi.desa || item.lokasi.kecamatan || item.lokasi.kotkab || "";

    if (level === 'province') { id = item.lokasi.adm2; name = item.lokasi.kotkab || ""; }
    else if (level === 'city') { id = item.lokasi.adm3!; name = item.lokasi.kecamatan || ""; }
    else if (level === 'district') { id = item.lokasi.adm4!; name = item.lokasi.desa || ""; }

    return {
      id: id,
      name: name,
      level: getLevel(id) as any,
      temp: w.t,
      condition: w.weather_desc,
      // --- UBAH 6: Gunakan URL icon langsung ---
      icon: w.image, 
    };
  });

  return {
    location: locationName,
    parentLocation: level === 'province' ? 'Indonesia' : (rootMeta.provinsi || rootMeta.kotkab),
    level: level,
    timestamp: `Diperbarui: ${refWeather.local_datetime}`,
    
    temp: displayTemp,
    tempRange: tempRangeStr,
    condition: dominantCondition,
    description: descriptionText, 
    windSpeed: windSpeedAvg,
    humidity: humidityAvg,
    
    feelsLike: realFeelValue, 
    
    pressure: 1010,
    visibility: parseFloat(refWeather.vs_text.replace('<', '').replace('km', '').trim()) || 10,
    uvIndex: 0,
    subRegions: subRegions,

    // TABEL
    tableData: referenceData.cuaca.flat().map((w: BMKGWeatherItem) => ({
      time: w.local_datetime.split(' ')[1].slice(0, 5),
      date: w.local_datetime.split(' ')[0],
      // --- UBAH 7: Gunakan URL icon langsung ---
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