// lib/types.ts
import { GeneralForecastRow } from './data';

export type RegionLevel = 'province' | 'city' | 'district' | 'village';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Interface AirQuality DIHAPUS

export interface SubRegionSummary {
  id: string;
  name: string;
  level: RegionLevel;
  temp: number;
  condition: string;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  min: number;
  max: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  location: string;
  parentLocation: string;
  level: RegionLevel;
  timestamp: string;
  
  temp: number;
  tempRange?: string;
  condition: string;
  description: string;
  windSpeed: number;
  humidity: number;
  iconUrl: string;
  
  // --- PASTIKAN INI TCC, BUKAN PRESSURE ---
  tcc: number; 
  // pressure: number; // (Hapus baris ini jika masih ada)
  
  feelsLike: number;
  visibility: number;
  uvIndex: number;
  
  subRegions: {
    id: string;
    name: string;
    level: RegionLevel;
    temp: number;
    condition: string;
    icon: string;
  }[];

  tableData: {
    time: string;
    date: string;
    weatherIcon: string;
    weatherDesc: string;
    wind: {
      direction: string;
      deg: number;
      speed: number;
    };
    temp: number;
    feelsLike: number;
    humidity: number;
  }[];
}