// lib/bmkg/cuaca.ts

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

// Helper Mapping Icon
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

export async function getCuacaSamarinda(): Promise<CuacaData | null> {
  try {
    const KODE_WILAYAH = "64.72.09.1003";
    
    const res = await fetch(
      `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${KODE_WILAYAH}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error(`Gagal fetch API BMKG: ${res.status}`);
    
    const response = await res.json();

    if (!response.data || response.data.length === 0) return null;

    const lokasi = response.data[0].lokasi;
    const listCuaca = response.data[0].cuaca;
    const allForecasts = listCuaca.flat();
    const now = new Date();
    
    const closestForecast = allForecasts.reduce((prev: any, curr: any) => {
      const prevDate = new Date(prev.local_datetime);
      const currDate = new Date(curr.local_datetime);
      return (Math.abs(currDate.getTime() - now.getTime()) < Math.abs(prevDate.getTime() - now.getTime())) 
        ? curr 
        : prev;
    });

    if (!closestForecast) return null;

    return {
      wilayah: `Samarinda (${lokasi.desa})`,
      cuaca: closestForecast.weather_desc,
      kodeCuaca: mapIconCode(closestForecast.weather_desc),
      suhu: closestForecast.t.toString(),
      kelembapan: closestForecast.hu.toString(),
      anginSpeed: closestForecast.ws.toString(),
      anginDir: closestForecast.wd,
      jam: new Date(closestForecast.local_datetime).toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit"
      }) + " WITA"
    };

  } catch (error) {
    console.error("Fetch Cuaca Error:", error);
    return null;
  }
}