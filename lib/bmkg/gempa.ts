// lib/bmkg/gempa.ts

export interface GempaData {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi?: string;
  Dirasakan?: string;
  Shakemap?: string;
  ShakemapUrl?: string;
}

// Interface Response BMKG (Bisa Array atau Object)
export interface GempaListResponse {
  Infogempa: {
    gempa: GempaData[] | GempaData; // Bisa array, bisa single object
  };
}

export interface AutoGempaResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

// ---------------------------------------------------------
// 1. GEMPA TERKINI (M 5.0+)
// ---------------------------------------------------------
export async function getGempaTerkiniList(): Promise<GempaData[]> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json", {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return [];
    
    const data: GempaListResponse = await res.json();
    const gempaRaw = data?.Infogempa?.gempa;

    if (!gempaRaw) return [];

    // NORMALISASI: Pastikan output selalu Array
    // Jika BMKG mengembalikan Object (karena cuma 1 gempa), bungkus jadi [Object]
    const gempaList: GempaData[] = Array.isArray(gempaRaw) ? gempaRaw : [gempaRaw];

    return gempaList;
  } catch (error) {
    console.error("Gagal fetch gempa terkini:", error);
    return [];
  }
}

// ---------------------------------------------------------
// 2. GEMPA DIRASAKAN
// ---------------------------------------------------------
export async function getGempaDirasakanList(): Promise<GempaData[]> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json", {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return [];

    const data: GempaListResponse = await res.json();
    const gempaRaw = data?.Infogempa?.gempa;

    if (!gempaRaw) return [];

    // NORMALISASI: Pastikan output selalu Array
    const gempaList: GempaData[] = Array.isArray(gempaRaw) ? gempaRaw : [gempaRaw];
    
    // Map data untuk menambah URL Shakemap
    return gempaList.map((g) => ({
        ...g,
        ShakemapUrl: g.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}` : undefined
    }));

  } catch (error) {
    console.error("Gagal fetch gempa dirasakan:", error);
    return [];
  }
}

// ---------------------------------------------------------
// 3. AUTO GEMPA (Untuk Widget Home - 1 Data Terakhir)
// ---------------------------------------------------------
export async function getGempaTerbaru(): Promise<GempaData | null> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return null;
    
    const data: AutoGempaResponse = await res.json();
    const gempa = data.Infogempa.gempa;
    
    // Tambah URL Shakemap
    gempa.ShakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
    
    return gempa;
  } catch (error) {
    return null;
  }
}