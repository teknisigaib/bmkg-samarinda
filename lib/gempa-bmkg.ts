
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
  Potensi: string;
  Dirasakan: string;
  Shakemap: string;
  ShakemapUrl?: string;
}

export interface GempaResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

export interface CuacaData {
  wilayah: string;
  cuaca: string;     
  kodeCuaca: string; 
  suhu: string;      
  kelembapan: string; 
  anginSpeed: string; 
  anginDir: string;   
  jam: string;        
}

// FUNGSI GEMPA 
export async function getGempaTerbaru(): Promise<GempaData | null> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Gagal ambil gempa");
    const data: GempaResponse = await res.json();
    const gempa = data.Infogempa.gempa;
    gempa.ShakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
    return gempa;
  } catch (error) {
    return null;
  }
}

// --- HELPER
function mapIconCode(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes("cerah berawan")) return "1";
  if (d.includes("cerah")) return "0";
  if (d.includes("berawan tebal")) return "4";
  if (d.includes("berawan")) return "3";
  if (d.includes("kabut") || d.includes("asap")) return "45";
  if (d.includes("hujan ringan")) return "60";
  if (d.includes("hujan sedang")) return "61";
  if (d.includes("hujan lebat")) return "63";
  if (d.includes("petir")) return "95";
  return "3"; 
}
