import { NextResponse } from 'next/server';

// ==========================================
// KONFIGURASI GRID KALIMANTAN TIMUR
// ==========================================
const N_LAT = 3.0;    // Batas Utara (Kaltara)
const S_LAT = -3.0;   // Batas Selatan (Paser/Kalsel)
const W_LON = 113.5;  // Batas Barat (Kubar/Mahulu border)
const E_LON = 119.5;  // Batas Timur (Selat Makassar)
const RESOLUTION = 0.5; // Jarak antar titik (0.5 derajat = ~55 Km)

export async function GET() {
  try {
    // 1. BUAT JARING-JARING KOORDINAT (GRID)
    const lats: number[] = [];
    const lons: number[] = [];
    
    // Looping dari Utara ke Selatan, Barat ke Timur
    for (let lat = N_LAT; lat >= S_LAT; lat -= RESOLUTION) {
      for (let lon = W_LON; lon <= E_LON; lon += RESOLUTION) {
        lats.push(parseFloat(lat.toFixed(2)));
        lons.push(parseFloat(lon.toFixed(2)));
      }
    }

    // Hitung jumlah baris (ny) dan kolom (nx)
    const nx = Math.floor((E_LON - W_LON) / RESOLUTION) + 1;
    const ny = Math.floor((N_LAT - S_LAT) / RESOLUTION) + 1;

    // 2. FETCH KE OPEN-METEO (Tanpa perlu SDK khusus, cukup fetch bawaan Next.js)
    // Karena URL bisa sangat panjang jika titiknya ratusan, kita gunakan trik koma
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats.join(',')}&longitude=${lons.join(',')}&current=wind_speed_10m,wind_direction_10m&timezone=Asia/Makassar`;
    
    const response = await fetch(url, { next: { revalidate: 1800 } }); // Cache 30 menit
    if (!response.ok) throw new Error("Gagal mengambil data dari Open-Meteo");
    
    const rawData = await response.json();

    // 3. KONVERSI KECEPATAN & ARAH MENJADI VEKTOR U DAN V
    const uData: number[] = [];
    const vData: number[] = [];

    // Open-Meteo mengembalikan array object jika request multi-koordinat
    rawData.forEach((location: any) => {
      const speed = location.current.wind_speed_10m; // km/h
      const dir = location.current.wind_direction_10m; // derajat
      
      // Rumus Meteorologi: Konversi ke U dan V (Meter per second)
      const speedMs = speed / 3.6; // Konversi km/h ke m/s
      const rad = (dir * Math.PI) / 180; // Derajat ke Radian
      
      const u = -speedMs * Math.sin(rad); // Komponen Barat-Timur
      const v = -speedMs * Math.cos(rad); // Komponen Selatan-Utara
      
      uData.push(parseFloat(u.toFixed(2)));
      vData.push(parseFloat(v.toFixed(2)));
    });

    // 4. SUSUN MENJADI FORMAT STANDAR "LEAFLET-VELOCITY" (GRIB-like JSON)
    const currentTime = new Date().toISOString();
    
    const velocityData = [
      {
        header: {
          parameterCategory: 2,
          parameterNumber: 2, // 2 = U-Component
          lo1: W_LON,
          lo2: E_LON,
          la1: N_LAT,
          la2: S_LAT,
          dx: RESOLUTION,
          dy: RESOLUTION,
          nx: nx,
          ny: ny,
          refTime: currentTime
        },
        data: uData
      },
      {
        header: {
          parameterCategory: 2,
          parameterNumber: 3, // 3 = V-Component
          lo1: W_LON,
          lo2: E_LON,
          la1: N_LAT,
          la2: S_LAT,
          dx: RESOLUTION,
          dy: RESOLUTION,
          nx: nx,
          ny: ny,
          refTime: currentTime
        },
        data: vData
      }
    ];

    return NextResponse.json(velocityData);
    
  } catch (error) {
    console.error("Wind API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}