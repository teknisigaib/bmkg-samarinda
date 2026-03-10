// lib/bmkg/tide-service.ts

export interface RawTideData {
  est: string;
  msl: string;
  lt: string;
  pred_mllw: number;
  pred_mhhw: number;
  pred_hat: number;
  t: string;
}

// ID Stasiun: Terminal Peti Kemas Palaran (dari URL yang kamu berikan)
const STATION_ID = "4000000017"; 

export async function getTidalForecast(): Promise<RawTideData[]> {
  // 1. Tentukan Rentang Tanggal (Hari Ini s/d 7 Hari Kedepan)
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  // Format YYYYMMDD
  const formatDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, "");
  
  const startDate = formatDate(now);
  const endDate = formatDate(nextWeek);

  // 2. Buat URL Dinamis
  // URL: https://maritim.bmkg.go.id/pasut/data/WITA/{STATION_ID}/{START}/{END}
  const url = `https://maritim.bmkg.go.id/pasut/data/WITA/${STATION_ID}/${startDate}/${endDate}`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 3600 } // Cache data selama 1 jam agar tidak memberatkan server BMKG
    });

    if (!res.ok) throw new Error("Gagal mengambil data pasang surut");

    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error("Error fetching tide data:", error);
    return []; // Return array kosong jika error agar web tidak crash
  }
}