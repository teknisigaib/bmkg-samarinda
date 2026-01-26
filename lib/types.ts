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
  feelsLike: number;
  condition: string;
  description: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  breadcrumbs: BreadcrumbItem[];
  subRegions: SubRegionSummary[];
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  tableData?: GeneralForecastRow[];
  tempRange?: string; // FIELD BARU: Opsional, hanya untuk tampilan Provinsi
}