// lib/awos-utils.ts

// --- TYPES (Dipindahkan dari lib/awos.ts) ---
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

export function calculateDensityAltitude(temp: number, qnh: number, elevation: number = 75): number {
    const pressureAlt = (1013.25 - qnh) * 27 + elevation;
    const isaTemp = 15 - (2 * (elevation / 1000));
    const densityAlt = pressureAlt + (120 * (temp - isaTemp));
    return Math.round(densityAlt);
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