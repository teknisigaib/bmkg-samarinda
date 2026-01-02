// components/component-cuaca/prakiraan-cuaca/types.ts

export interface BMKGWeatherItem {
  datetime: string;
  local_datetime: string;
  t: number;        // Suhu
  hu: number;       // Humidity
  ws: number;       // Wind Speed
  wd: string;       // Wind Direction
  weather_desc: string;
  weather_desc_en: string;
  image: string;
  vs_text: string;  // Visibility
  time_index: string;
}

export interface BMKGLocation {
  adm1: string;
  adm2: string;
  adm3: string; 
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface BMKGResponse {
  lokasi: BMKGLocation;
  data:Array<{
      cuaca: Array<BMKGWeatherItem[]>; // Perhatikan ini array di dalam array
  }>;
}