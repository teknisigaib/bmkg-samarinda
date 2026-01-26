// lib/bmkg-types.ts

export interface BMKGLocation {
  adm1: string;
  adm2: string;
  adm3?: string;
  adm4?: string;
  provinsi: string;
  kotkab?: string;
  kecamatan?: string;
  desa?: string;
  lon: number;
  lat: number;
  timezone?: string;
}

export interface BMKGWeatherItem {
  wd_to: string;
  datetime: string;
  utc_datetime: string;
  local_datetime: string;
  t: number;       // Suhu
  hu: number;      // Humidity
  ws: number;      // Wind Speed (km/h atau knots)
  wd: string;      // Wind Direction (Cardinals: N, SE)
  wd_deg: number;  // Wind Direction (Degree)
  weather_desc: string;
  weather_desc_en: string;
  vs_text: string; // Visibility Text (< 8 km)
  analysis_date: string;
  image: string;   // URL Icon BMKG
}

export interface BMKGDataRow {
  lokasi: BMKGLocation;
  cuaca: BMKGWeatherItem[][]; // Array of Array (Per hari)
}

export interface BMKGResponse {
  lokasi: BMKGLocation;
  data: BMKGDataRow[];
}