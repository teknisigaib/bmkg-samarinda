export interface HotspotData {
  id: string;
  lat: number;
  lng: number;
  conf: number;
  satellite: string;
  date: string;
  subDistrict: string;
  district?: string;
}

// Helper: Format Date ke YYYYMMDD
const formatDateYMD = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

// Helper: Fetch Data per Tanggal (LOGIKA H-1 SUDAH DIHAPUS, MURNI TANGGAL ASLI)
async function fetchBMKGHotspot(targetDate: Date): Promise<HotspotData[]> {
  
  const dateStr = formatDateYMD(targetDate);
  
  // URL File TXT BMKG langsung menggunakan tanggal yang direquest
  const url = `https://cews.bmkg.go.id/tempatirk/HOTSPOT/${dateStr}/hotspot_${dateStr}.txt`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 jam

    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Failed to fetch hotspot data: ${res.status}`);
    }

    const textData = await res.text();
    if (!textData) return [];

    // Pecah per baris
    const lines = textData.trim().split('\n');

    // Skip Baris Pertama (Header)
    const dataRows = lines.slice(1);

    const cleanData = dataRows
      .map((line, index) => {
        const col = line.split('\t');
        if (col.length < 10) return null;

        const prov = col[4]?.trim() || ""; 
        
        // Filter Khusus KALIMANTAN TIMUR
        if (!prov.toUpperCase().includes("KALIMANTAN TIMUR")) return null;

        return {
          id: `${dateStr}-${index}`,
          lng: parseFloat(col[0]),        
          lat: parseFloat(col[1]),       
          conf: parseInt(col[2]) || 0,    
          district: col[5]?.trim(),       
          subDistrict: col[6] ? `Kec. ${col[6].trim()}` : "Kecamatan Tdk Teridentifikasi", 
          satellite: col[7]?.trim(),     
          date: `${col[8]} ${col[9]} WIB`, // Biarkan string waktu asli satelit
        };
      })
      .filter((item) => item !== null) as HotspotData[];

    return cleanData;

  } catch (error) {
    console.error(`Error fetching hotspot for URL date ${dateStr}:`, error);
    return [];
  }
}

// Ambil Trend 7 Hari Terakhir (Digunakan oleh komponen KarhutlaStats)
export async function getHotspotTrend() {
  const promises = [];
  const today = new Date();

  // Loop 7 hari ke belakang untuk display
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    promises.push(fetchBMKGHotspot(d));
  }

  const results = await Promise.all(promises);

  return results.map((dailyData, index) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - index)); 
    return {
      date: d.toISOString(),
      count: dailyData.length,
    };
  });
}

// Ambil Data RAW 7 Hari Terakhir (Digunakan oleh Map)
export async function getRawWeeklyHotspots(): Promise<HotspotData[]> {
  const promises = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    promises.push(fetchBMKGHotspot(d));
  }

  const results = await Promise.all(promises);
  return results.flat();
}