"use client";

import {
  Sun,
  CloudSun,
  Cloud,
  Cloudy,
  Wind,
  Waves,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
} from "lucide-react";

type WeatherCondition = 
  | "Cerah"
  | "Cerah Berawan"
  | "Berawan"
  | "Berawan Tebal"
  | "Asap"
  | "Kabut"
  | "Hujan Ringan"
  | "Hujan Sedang"
  | "Hujan Lebat"
  | "Hujan Lokal"
  | "Hujan Badai"
  | string;

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
}

export default function WeatherIcon({ condition, className = "w-8 h-8" }: WeatherIconProps) {
  
  // Menambahkan kelas warna yang spesifik untuk setiap kondisi
  switch (condition) {
    case "Cerah":
      return <Sun className={`${className} text-yellow-500`} />;
    case "Cerah Berawan":
      return <CloudSun className={`${className} text-yellow-400`} />;
    case "Berawan":
      return <Cloud className={`${className} text-gray-400`} />;
    case "Berawan Tebal":
      return <Cloudy className={`${className} text-gray-600`} />;
    case "Asap":
      return <Wind className={`${className} text-slate-500`} />;
    case "Kabut":
      return <Waves className={`${className} text-gray-400`} />;
    case "Hujan Ringan":
    case "Hujan Lokal":
      return <CloudDrizzle className={`${className} text-blue-500`} />;
    case "Hujan Sedang":
      return <CloudRain className={`${className} text-blue-600`} />;
    case "Hujan Lebat":
      return <CloudRainWind className={`${className} text-indigo-600`} />;
    case "Hujan Badai":
      return <CloudLightning className={`${className} text-slate-700`} />;
    default:
      return <Cloud className={`${className} text-gray-500`} />;
  }
}