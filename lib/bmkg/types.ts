// lib/bmkg/types.ts

export interface WeatherDataPoint {
  datetime: string;
  local_datetime: string;
  t: number;       // Suhu
  hu: number;      // Kelembapan
  weather_desc: string; // Deskripsi (Berawan, Hujan, dll)
  ws: number;      // Wind Speed
  wd: string;      // Wind Direction (N, SW, etc)
  image: string;   // URL Icon
  vs_text: string; // Visibility
}

export interface WeatherLocation {
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
}

export interface WeatherResponse {
  lokasi: WeatherLocation;
  data: {
    cuaca: WeatherDataPoint[][]; // Array 2D: [Hari1[], Hari2[], Hari3[]]
  }[];
}