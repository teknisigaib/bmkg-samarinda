import { cache } from "react"; // <-- Import fungsi cache dari React

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

// Interface Response BMKG
export interface GempaListResponse {
  Infogempa: {
    gempa: GempaData[] | GempaData; 
  };
}

export interface AutoGempaResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

// 1. GEMPA TERKINI (M 5.0+) - Dibungkus dengan React Cache
export const getGempaTerkiniList = cache(async (): Promise<GempaData[]> => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json", {
      next: { revalidate: 60 },
    });
    
    // Cegah error 429 (Too Many Requests) mematikan halaman
    if (!res.ok) {
        console.warn(`BMKG API Error (Terkini): ${res.status}`);
        return [];
    }
    
    const data: GempaListResponse = await res.json();
    const gempaRaw = data?.Infogempa?.gempa;

    if (!gempaRaw) return [];

    const gempaList: GempaData[] = Array.isArray(gempaRaw) ? gempaRaw : [gempaRaw];

    return gempaList;
  } catch (error) {
    console.error("Gagal fetch gempa terkini:", error);
    return [];
  }
});

// 2. GEMPA DIRASAKAN - Dibungkus dengan React Cache
export const getGempaDirasakanList = cache(async (): Promise<GempaData[]> => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json", {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
        console.warn(`BMKG API Error (Dirasakan): ${res.status}`);
        return [];
    }

    const data: GempaListResponse = await res.json();
    const gempaRaw = data?.Infogempa?.gempa;

    if (!gempaRaw) return [];

    const gempaList: GempaData[] = Array.isArray(gempaRaw) ? gempaRaw : [gempaRaw];
    
    return gempaList.map((g) => ({
        ...g,
        ShakemapUrl: g.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}` : undefined
    }));

  } catch (error) {
    console.error("Gagal fetch gempa dirasakan:", error);
    return [];
  }
});

// 3. AUTO GEMPA (Untuk Widget Home - 1 Data Terakhir) - Dibungkus dengan React Cache
export const getGempaTerbaru = cache(async (): Promise<GempaData | null> => {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
        console.warn(`BMKG API Error (AutoGempa): ${res.status}`);
        return null;
    }
    
    const data: AutoGempaResponse = await res.json();
    const gempa = data.Infogempa?.gempa;
    
    if(gempa && gempa.Shakemap) {
        gempa.ShakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
    }
    
    return gempa || null;
  } catch (error) {
    console.error("Gagal fetch auto gempa:", error);
    return null;
  }
});