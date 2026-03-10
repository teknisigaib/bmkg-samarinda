// lib/awos.ts
"use server";

// Import tipe data dari file utils
import { AwosFullData } from "./awos-utils";

export async function getAwosFullData(): Promise<AwosFullData | null> {
  const LOGIN_URL = process.env.AWOS_LOGIN_URL!;
  const BASE_DATA_URL = process.env.AWOS_DATA_URL!; 
  const USERNAME = process.env.AWOS_USERNAME!;
  const PASSWORD = process.env.AWOS_PASSWORD!;

  const ID_04 = "7000000088";
  const ID_22 = "7000000090";
  const ID_MID = "7000000089";

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    const loginRes = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
      cache: 'no-store'
    });

    const cookieHeader = loginRes.headers.get('set-cookie');
    if (!cookieHeader) return null;
    const sessionCookie = cookieHeader.split(';')[0]; 

    const fetchSite = async (id: string) => {
      const res = await fetch(`${BASE_DATA_URL}?stationId=${id}`, {
        method: 'GET',
        headers: { 
            'Cookie': sessionCookie,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 10 } 
      });
      if (!res.ok) return null;
      const json = await res.json();
      return Array.isArray(json) ? json[0] : json; 
    };

    const [data04, data22, dataMid] = await Promise.all([
        fetchSite(ID_04),
        fetchSite(ID_22),
        fetchSite(ID_MID)
    ]);

    return {
        rwy04: data04 || null,
        rwy22: data22 || null,
        middle: dataMid || null,
        last_update: dataMid?._time || new Date().toISOString()
    };

  } catch (error) {
    console.error("Error Fetching AWOS:", error);
    return null;
  }
}