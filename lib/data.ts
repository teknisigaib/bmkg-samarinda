
import { RegionLevel } from './types';

export interface RegionData {
  id: string;
  parentId: string | null; 
  name: string;
  level: RegionLevel;
  temp: number;
  condition: string;
  icon: string;
  description: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}


export interface GeneralForecastRow {
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
  humidity: number;
  feelsLike: number; 
}
