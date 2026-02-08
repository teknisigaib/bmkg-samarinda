import { AwsApiData, AwsSnapshotData } from "./aws-types";

// --- RUMUS MATEMATIKA ---

export const calculateDewPoint = (temp: number, rh: number) => {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(rh / 100.0);
  return (b * alpha) / (a - alpha);
};

export const calculateHeatIndex = (temp: number, rh: number) => {
  const T = (temp * 9/5) + 32; 
  const RH = rh;
  let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));
  if (HI > 80) {
    HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH - 0.00683783*T*T - 0.05481717*RH*RH + 0.00122874*T*T*RH + 0.00085282*T*RH*RH - 0.00000199*T*T*RH*RH;
  }
  return (HI - 32) * 5/9;
};

export const calculateUV = (solRad: number) => {
  if (solRad <= 0) return 0;
  return Math.round(solRad / 40);
};

// --- FORMATTER ---

export const transformAwsData = (jsonData: AwsApiData): AwsSnapshotData => {
    const temp = parseFloat(jsonData.temp) || 0;
    const rh = parseFloat(jsonData.rh) || 0;   
    const pressure = parseFloat(jsonData.pressure) || 0;
    const rain = parseFloat(jsonData.rain) || 0;
    const solrad = parseFloat(jsonData.solrad) || 0;
    const windspeedMs = parseFloat(jsonData.windspeed) || 0;
    const winddir = parseFloat(jsonData.winddir) || 0;
    const dewPoint = calculateDewPoint(temp, rh);
    const heatIndex = calculateHeatIndex(temp, rh);
    const uvIndex = calculateUV(solrad);

    // --- LOGIKA WAKTU & TANGGAL BARU ---
  const dateObj = new Date(jsonData.waktu); // Parse "2026-02-07 07:24:00"
  const now = new Date();
  
  // Hitung selisih
  const diffMs = now.getTime() - dateObj.getTime();
  const minutesAgo = Math.floor(diffMs / 60000);

  // Default Fallback
  let dateStr = "Tanggal Tidak Valid";
  let timeStr = "--:--";

  if (!isNaN(dateObj.getTime())) {
      // Format: "Sabtu, 7 Februari 2026"
      dateStr = dateObj.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
      });
      
      // Format: "07:24"
      timeStr = dateObj.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
      });
  } else {
      // Fallback manual jika parsing gagal
      const parts = jsonData.waktu.split(' ');
      if(parts.length > 1) {
          dateStr = parts[0]; 
          timeStr = parts[1];
      }
  }

   return {
    temp,
    humidity: rh,
    pressure,
    rainRate: rain,
    rainDaily: 0, 
    windSpeed: windspeedMs,
    windDir: winddir,
    solarRad: solrad,
    heatIndex: parseFloat(heatIndex.toFixed(1)),
    uvIndex,
    dewPoint: parseFloat(dewPoint.toFixed(1)),
    lastUpdate: `${timeStr} WITA`,
    lastUpdateDate: dateStr,
    lastUpdateTime: timeStr,
    lastUpdateRaw: jsonData.waktu,
    minutesAgo: minutesAgo,
    isOnline: true,
  };
};

// --- STATUS BADGE (Helper UI) ---
export const getStatus = (type: 'temp' | 'humidity' | 'wind' | 'rain' | 'pressure' | 'solar', value: number) => {
  switch (type) {
    case 'temp':
      if (value < 24) return { label: 'SEJUK', bg: 'bg-blue-400', text: 'text-white' };
      if (value <= 32) return { label: 'NORMAL', bg: 'bg-blue-600', text: 'text-white' };
      return { label: 'HANGAT', bg: 'bg-amber-500', text: 'text-white' };
    case 'humidity':
      if (value < 45) return { label: 'KERING', bg: 'bg-amber-500', text: 'text-white' };
      if (value <= 75) return { label: 'NORMAL', bg: 'bg-blue-600', text: 'text-white' };
      return { label: 'BASAH', bg: 'bg-blue-800', text: 'text-white' };
    case 'wind':
      if (value < 5) return { label: 'CALM', bg: 'bg-slate-400', text: 'text-white' };
      if (value <= 20) return { label: 'NORMAL', bg: 'bg-blue-600', text: 'text-white' };
      return { label: 'KENCANG', bg: 'bg-red-600', text: 'text-white' };
    case 'rain':
      if (value <= 5) return { label: 'TIDAK HUJAN', bg: 'bg-slate-500', text: 'text-white', colorCode: 'slate' }; 
      if (value <= 20) return { label: 'RINGAN', bg: 'bg-sky-400', text: 'text-white', colorCode: 'sky' };
      if (value <= 50) return { label: 'SEDANG', bg: 'bg-yellow-400', text: 'text-white', colorCode: 'yellow' };
      if (value <= 100) return { label: 'LEBAT', bg: 'bg-orange-400', text: 'text-white', colorCode: 'orange' };
      return { label: 'SANGAT LEBAT', bg: 'bg-red-500', text: 'text-white', colorCode: 'red' };
    case 'pressure':
      return { label: 'STABIL', bg: 'bg-blue-600', text: 'text-white' };
    case 'solar':
      if (value < 200) return { label: 'RENDAH', bg: 'bg-slate-400', text: 'text-white' };
      if (value <= 600) return { label: 'SEDANG', bg: 'bg-amber-500', text: 'text-white' };
      return { label: 'TINGGI', bg: 'bg-red-600', text: 'text-white' };
    default:
      return { label: '-', bg: 'bg-gray-400', text: 'text-white' };
  }
};