// lib/awos.ts
"use server";

import { AwosFullData, AwosItem, calculateQFE, calculateQFF } from "./awos-utils";

export async function getAwosFullData(): Promise<AwosFullData | null> {
  const AWOS_URL = "https://awos.bmkgaptpranoto.com/api/awos/latest";

  try {
    const res = await fetch(AWOS_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 10 } 
    });

    if (!res.ok) return null;
    const json = await res.json();

    if (json.status !== "success" || !json.data) return null;

    const { date, time_wita, data } = json.data;
    
    // --- TAMBAHKAN PERBAIKAN FORMAT DATE DI SINI ---
    const yyyy = date.substring(0, 4);
    const mm = date.substring(4, 6);
    const dd = date.substring(6, 8);
    const timestamp = `${yyyy}-${mm}-${dd}T${time_wita}:00`;
    // -----------------------------------------------

    // Helper untuk menentukan elevasi presisi (Feet to Meters) per sensor
    const getElevationMeters = (runwayId: string) => {
      const FEET_TO_METERS = 0.3048;
      if (runwayId === "22") return 64 * FEET_TO_METERS; // ~19.507 meter
      if (runwayId === "04" || runwayId === "MID") return 65 * FEET_TO_METERS; // ~19.812 meter
      return 23; // Fallback default
    };

    // Fungsi untuk mapping JSON baru ke format AwosItem lama
    const mapToAwosItem = (raw: any, runwayId: string): AwosItem | null => {
      if (!raw) return null;
      
      const getNum = (obj: any) => typeof obj?.value === 'number' ? obj.value : 0;
      const getStr = (obj: any) => obj?.value ? String(obj.value) : "";

      // Ambil QNH & Suhu dari API AWOS
      const qnhVal = getNum(raw.QNH);
      const tempVal = getNum(raw.TEMP);
      
      // Ambil elevasi spesifik sensor
      const elevationMeters = getElevationMeters(runwayId);
      
      // Kalkulasi QFE & QFF menggunakan elevasi presisi tersebut
      const calculatedQFE = calculateQFE(qnhVal, elevationMeters);
      const calculatedQFF = calculateQFF(calculatedQFE, tempVal, elevationMeters);

      return {
        Runway: runwayId,
        stationId: runwayId,
        _time: timestamp,
        
        // Data Utama
        air_temperature: tempVal,
        dewpoint: getNum(raw.DEWP),
        qnh: qnhVal, // QNH asli langsung dari API
        qfe: calculatedQFE, // QFE dari perhitungan matematis
        humidity: getNum(raw.RH),
        wind_direction: getNum(raw.WD),
        wind_speed: getNum(raw.WS),
        visibility: getNum(raw.VIS),
        precipitation: getNum(raw.RA),
        solar_radiation: getNum(raw.SOL),
        density_altitude: getNum(raw.DA),
        
        // Data String
        sky_condition: getStr(raw.SKY),
        nws_Lightning: getStr(raw.LTX),
        
        qff: calculatedQFF > 0 ? calculatedQFF.toFixed(1) : "", // QFF dari perhitungan matematis
        
        // Data Statis / Dummy (Menjaga UI tetap aman)
        station_name: "APT Pranoto",
        ICAO: "WALS",
        category: "AWOS",
        province: "Kaltim",
        present_weather: "",
        barometric_pressure: ""
      };
    };

    return {
      rwy04: mapToAwosItem(data["04"], "04"),
      rwy22: mapToAwosItem(data["22"], "22"),
      middle: mapToAwosItem(data["M"], "MID"),
      last_update: timestamp
    };

  } catch (error) {
    console.error("Error Fetching AWOS:", error);
    return null;
  }
}