export interface AwsApiData {
  idaws: string;
  waktu: string;
  windspeed: string;
  winddir: string;
  temp: string;
  rh: string;
  pressure: string;
  rain: string;
  solrad: string;
}

export interface AwsSnapshotData {
  temp: number;
  humidity: number;
  pressure: number;
  rainRate: number;
  rainDaily: number;
  windSpeed: number;
  windDir: number;
  solarRad: number;
  heatIndex: number;
  uvIndex: number;
  dewPoint: number;
  lastUpdate: string;
  isOnline: boolean;
  lastUpdateRaw: string;
  minutesAgo: number;
}