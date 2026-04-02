// Interface Data Publik
export interface WeatherStationData {
  station_name: string;
  latitude: string;
  longitude: string;
  record_time: string;
  rain_total: number;
  is_offline?: boolean; 
  is_raining?: boolean; 
  type?: string;           
  air_temperature?: number;
  humidity?: number;         
  air_pressure?: number;
  wind_speed?: number;
  wind_direction?: number;   
  solar_radiation?: number;
}

// Fungsi Fetch Data dari API Gateway Anda
export async function getRealtimeWeatherData(): Promise<WeatherStationData[]> {
  try {
    const res = await fetch("https://rain.bmkgaptpranoto.com/api/pantauan-cuaca", { 
        next: { revalidate: 60 } 
    }); 
    if (!res.ok) throw new Error("Gagal fetch API Gateway");
    return await res.json();
  } catch (error) {
    console.error("Gagal mengambil data cuaca:", error);
    return []; 
  }
}