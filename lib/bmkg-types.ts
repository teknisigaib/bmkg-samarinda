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
  weather: any;
  wd_to: string;
  datetime: string;
  utc_datetime: string;
  local_datetime: string;
  t: number;       
  hu: number;      
  ws: number;     
  wd: string;     
  wd_deg: number; 
  weather_desc: string;
  weather_desc_en: string;
  vs_text: string; 
  analysis_date: string;
  image: string;   
  tcc: number
}

export interface BMKGDataRow {
  lokasi: BMKGLocation;
  cuaca: BMKGWeatherItem[][];
}

export interface BMKGResponse {
  lokasi: BMKGLocation;
  data: BMKGDataRow[];
}