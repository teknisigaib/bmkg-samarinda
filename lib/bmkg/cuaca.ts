// lib/bmkg/cuaca.ts

// Tipe Data Sesuai JSON Baru
export interface WeatherItem {
  datetime: string;
  t: number;       // Suhu
  hu: number;      // Kelembapan
  weather_desc: string;
  ws: number;      // Wind Speed
  wd: string;      // Wind Direction
  image: string;   // Icon URL dari BMKG
  local_datetime: string;
  vs_text: string; // Visibilitas
  tcc: number;
}

export interface WeatherResponse {
  lokasi: {
    desa: string;
    kecamatan: string;
    kotkab: string;
    provinsi: string;
  };
  data: {
    cuaca: WeatherItem[][]; // Array 2D (Hari -> Jam)
  }[];
}

export async function getCuacaDetail(kodeWilayah: string = "64.72.09.1003"): Promise<WeatherResponse | null> {
  try {
    const res = await fetch(
      `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kodeWilayah}`,
      { next: { revalidate: 300 } } // Cache 5 menit
    );

    if (!res.ok) throw new Error("Gagal fetch API BMKG");
    
    return await res.json();
  } catch (error) {
    console.error("Fetch Cuaca Error:", error);
    return null;
  }
}

// Fungsi Ringkas untuk Widget Home (Mengambil jam terdekat saja)
// Kita gunakan logika yang sama, tapi return data simple
export async function getCuacaSamarinda() {
    const data = await getCuacaDetail();
    if (!data || !data.data[0]) return null;

    // Ratakan array 2D jadi 1D biar mudah cari jam terdekat
    const allForecasts = data.data[0].cuaca.flat();
    const now = new Date();

    // Cari yang paling dekat dengan jam sekarang
    const current = allForecasts.reduce((prev, curr) => {
        const prevTime = new Date(prev.local_datetime).getTime();
        const currTime = new Date(curr.local_datetime).getTime();
        const nowTime = now.getTime();
        return Math.abs(currTime - nowTime) < Math.abs(prevTime - nowTime) ? curr : prev;
    });

    return {
        wilayah: data.lokasi.kotkab, // "Kota Samarinda"
        cuaca: current.weather_desc,
        kodeCuaca: "0", // Kita abaikan kode manual, pakai image URL dari API langsung nanti
        iconUrl: current.image, // URL Icon langsung dari BMKG!
        suhu: current.t.toString(),
        kelembapan: current.hu.toString(),
        anginSpeed: current.ws.toString(),
        anginDir: current.wd,
        jam: new Date(current.local_datetime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) + " WITA"
    };
}
