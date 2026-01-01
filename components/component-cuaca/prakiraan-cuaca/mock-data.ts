// components/component-cuaca/prakiraan-cuaca/mock-data.ts
import { BMKGResponse } from "./types";

export const MOCK_WEATHER_RESPONSE: BMKGResponse = {
  "lokasi": {
    "adm1": "31",
    "adm2": "31.71",
    "adm3": "31.71.03",
    "adm4": "31.71.03.1001",
    "provinsi": "DKI Jakarta",
    "kotkab": "Kota Adm. Jakarta Pusat",
    "kecamatan": "Kemayoran",
    "desa": "Kemayoran",
    "lon": 106.8453837867,
    "lat": -6.1647214778,
    "timezone": "Asia/Jakarta"
  },
  "data": [
    {
      "cuaca": [
        [
          {
            "datetime": "2025-12-29T02:00:00Z",
            "t": 30,
            "hu": 67,
            "ws": 6,
            "wd": "W",
            "weather_desc": "Berawan",
            "weather_desc_en": "Mostly Cloudy",
            "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg",
            "vs_text": "> 10 km",
            "local_datetime": "2025-12-29 09:00:00",
             // ... field lain disederhanakan untuk mock
          } as any,
          {
            "datetime": "2025-12-29T05:00:00Z",
            "t": 28,
            "hu": 77,
            "ws": 7.1,
            "wd": "W",
            "weather_desc": "Hujan Ringan",
            "weather_desc_en": "Light Rain",
            "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan ringan-am.svg",
            "vs_text": "< 8 km",
            "local_datetime": "2025-12-29 12:00:00",
          } as any,
          // ... Tambahkan sisa data dari JSON Anda disini jika perlu
          // Agar grafik terlihat bagus, saya duplikasi data dummy
          {
             "datetime": "2025-12-29T08:00:00Z", "t": 28, "hu": 77, "ws": 9.6, "wd": "SW", "weather_desc": "Hujan Ringan", "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan ringan-am.svg", "local_datetime": "2025-12-29 15:00:00"
          } as any,
          {
             "datetime": "2025-12-29T11:00:00Z", "t": 27, "hu": 83, "ws": 3.9, "wd": "W", "weather_desc": "Cerah", "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-pm.svg", "local_datetime": "2025-12-29 18:00:00"
          } as any,
          {
             "datetime": "2025-12-29T14:00:00Z", "t": 26, "hu": 86, "ws": 8.6, "wd": "SW", "weather_desc": "Cerah", "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-pm.svg", "local_datetime": "2025-12-29 21:00:00"
          } as any,
           {
             "datetime": "2025-12-29T17:00:00Z", "t": 25, "hu": 89, "ws": 9.2, "wd": "SW", "weather_desc": "Berawan", "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-pm.svg", "local_datetime": "2025-12-30 00:00:00"
          } as any,
        ]
      ]
    }
  ]
};