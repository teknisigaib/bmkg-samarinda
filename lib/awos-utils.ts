// lib/awos-utils.ts

// --- TYPES ---
export interface AwosItem {
  nws_Lightning: any;
  solar_radiation: number;
  sky_condition?: string;
  station_name: any;
  ICAO: string;
  category: string;
  province: any;
  present_weather: string;
  qff: string;
  barometric_pressure: string;
  stationId: string;
  _time: string;
  Runway: string; 
  air_temperature: number;
  dewpoint: number;
  qnh: number;
  qfe: number;
  humidity: number;
  wind_direction: number;
  wind_speed: number;
  visibility?: number;
  precipitation?: number;
  density_altitude?: number; 
}

export interface AwosFullData {
  rwy04: AwosItem | null;
  rwy22: AwosItem | null;
  middle: AwosItem | null;
  last_update: string;
}

export interface WindComponents {
  headwind: number;
  crosswind: number;
  isCrosswindRight: boolean;
  isTailwind: boolean;
}

export interface CloudLayer {
  type: string;
  height: number;
}

// --- MATH & PARSING FUNCTIONS ---

export function calculateWindComponents(windSpd: number, windDir: number, rwyHeading: number): WindComponents {
  const angleRad = (windDir - rwyHeading) * (Math.PI / 180);
  const headwindRaw = windSpd * Math.cos(angleRad);
  const crosswindRaw = windSpd * Math.sin(angleRad);

  return {
      headwind: Math.round(headwindRaw),
      crosswind: Math.round(Math.abs(crosswindRaw)), 
      isCrosswindRight: crosswindRaw > 0, 
      isTailwind: headwindRaw < 0
  };
}

export function parseClouds(cloudString?: string): CloudLayer[] {
  if (!cloudString || cloudString.trim() === "") return [];
  
  return cloudString.split(" ").map(layer => {
      const type = layer.substring(0, 3); 
      const heightStr = layer.substring(3);
      const height = parseInt(heightStr) * 100;
      return { type, height: isNaN(height) ? 0 : height };
  });
}

export function calculateQFE(qnh: number, elevationMeters: number = 23): number {
  if (!qnh || qnh <= 0) return 0;
  
  const tempISA = 288.15; 
  const lapseRate = 0.0065; 
  const exponent = 5.25588;
  
  const base = 1 - ((lapseRate * elevationMeters) / tempISA);
  const qfe = qnh * Math.pow(base, exponent);
  
  return Math.round(qfe * 10) / 10;
}

export function calculateQFF(qfe: number, tempCelsius: number, elevationMeters: number = 23): number {
  if (!qfe || qfe <= 0 || tempCelsius === undefined) return 0;

  const g = 9.80665; 
  const R = 287.05;  
  const tempKelvin = tempCelsius + 273.15;
  
  const exponent = (g * elevationMeters) / (R * tempKelvin);
  const qff = qfe * Math.exp(exponent);
  
  return Math.round(qff * 10) / 10;
}