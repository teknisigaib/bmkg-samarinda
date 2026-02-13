"use server";

// Tipe Data AWOS (Gabungan field dari kedua jenis site)
export interface AwosItem {
  _time: string;
  Runway: string; // "4", "22", atau "Middle"
  air_temperature: number;
  dewpoint: number;
  barometric_pressure: number; // QFE/QNH ada di sini atau field terpisah
  qnh: number;
  qfe: number;
  humidity: number;
  wind_direction: number;
  wind_speed: number;
  // Field khusus 04/22
  visibility?: number;
  sky_condition?: string;
  present_weather?: string;
  // Field khusus Middle
  solar_radiation?: number;
  precipitation?: number;
}

export interface AwosFullData {
  rwy04: AwosItem | null;
  rwy22: AwosItem | null;
  middle: AwosItem | null;
  last_update: string;
}

export async function getAwosFullData(): Promise<AwosFullData | null> {
  const LOGIN_URL = process.env.AWOS_LOGIN_URL!;
  const BASE_DATA_URL = process.env.AWOS_DATA_URL!; // URL tanpa query param
  const USERNAME = process.env.AWOS_USERNAME!;
  const PASSWORD = process.env.AWOS_PASSWORD!;

  // ID Station
  const ID_04 = "7000000088";
  const ID_22 = "7000000089";
  const ID_MID = "7000000090";

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    // --- 1. LOGIN (Cukup sekali) ---
    const loginPayload = { username: USERNAME, password: PASSWORD };
    const loginRes = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload),
      redirect: 'manual',
      cache: 'no-store'
    });

    const cookieHeader = loginRes.headers.get('set-cookie');
    if (!cookieHeader) return null;
    const sessionCookie = cookieHeader.split(';')[0]; 

    // --- 2. FETCH PARALEL (3 Request Sekaligus) ---
    // Helper function fetcher
    const fetchSite = async (id: string) => {
      // Pastikan URL di .env tidak berakhiran "/" atau sesuaikan logic ini
      // Contoh hasil: http://ip/api/live?stationId=7000000088
      const url = `${BASE_DATA_URL}?stationId=${id}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 
            'Cookie': sessionCookie,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 30 } // Cache 30 detik
      });
      if (!res.ok) return null;
      return await res.json();
    };

    const [data04, data22, dataMid] = await Promise.all([
        fetchSite(ID_04),
        fetchSite(ID_22),
        fetchSite(ID_MID)
    ]);

    // Format Return
    return {
        rwy04: data04 || null,
        rwy22: data22 || null,
        middle: dataMid || null,
        // Ambil waktu dari salah satu data yang berhasil
        last_update: dataMid?._time || data04?._time || new Date().toISOString()
    };

  } catch (error) {
    console.error("Error AWOS System:", error);
    return null;
  }
}