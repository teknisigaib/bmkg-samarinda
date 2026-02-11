export interface WeatherItem {
  datetime: string;
  t: number;       
  hu: number;     
  weather_desc: string;
  ws: number;    
  wd: string;      
  image: string; 
  local_datetime: string;
  vs_text: string; 
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
    cuaca: WeatherItem[][]; 
  }[];
}

export interface CuacaData {
  wilayah: string;
  cuaca: string;
  kodeCuaca: string;
  iconUrl: string;
  suhu: string;
  kelembapan: string;
  anginSpeed: string;
  anginDir: string;
  jam: string;
}

export async function getCuacaDetail(kodeWilayah: string = "64.72.09.1003"): Promise<WeatherResponse | null> {
  try {
    const res = await fetch(
      `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kodeWilayah}`,
      { next: { revalidate: 300 } } 
    );

    if (!res.ok) throw new Error("Gagal fetch API BMKG");
    
    return await res.json();
  } catch (error) {
    console.error("Fetch Cuaca Error:", error);
    return null;
  }
}

// Fungsi  Widget Home
export async function getCuacaSamarinda(): Promise<CuacaData | null> {
    const data = await getCuacaDetail();
    if (!data || !data.data[0]) return null;

    const allForecasts = data.data[0].cuaca.flat();
    const now = new Date();

    const current = allForecasts.reduce((prev, curr) => {
        const prevTime = new Date(prev.local_datetime).getTime();
        const currTime = new Date(curr.local_datetime).getTime();
        const nowTime = now.getTime();
        return Math.abs(currTime - nowTime) < Math.abs(prevTime - nowTime) ? curr : prev;
    });

    return {
        wilayah: data.lokasi.kotkab, 
        cuaca: current.weather_desc,
        kodeCuaca: "0", 
        iconUrl: current.image,
        suhu: current.t.toString(),
        kelembapan: current.hu.toString(),
        anginSpeed: current.ws.toString(),
        anginDir: current.wd,
        jam: new Date(current.local_datetime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) + " WITA"
    };
}