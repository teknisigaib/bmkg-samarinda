export interface WeatherDataPoint {
  tcc: number;
  datetime: string;
  local_datetime: string;
  t: number;      
  hu: number;      
  weather_desc: string; 
  ws: number;      
  wd: string;     
  image: string;   
  vs_text: string; 
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
    cuaca: WeatherDataPoint[][]; 
  }[];
}