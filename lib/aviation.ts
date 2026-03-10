// lib/aviation.ts
export const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwNzNlNmUwOGU0ZjQzMzdkYzFmNjRkNzgzZGJmYmU5MzQ3ZGFmY2FiYTBhM2U5MzVjZDJmODlhOWQ1NjMwNWYiLCJpYXQiOjE3Njk5MDQwMDAsImV4cCI6MjU1NjA1NzYwMH0.s010WqlLrBY8WqPkiDRENEFdZIFCaLI8jSSJ7_6tLlY";

export const AIRPORT_DB: Record<string, { name: string; city: string; lat: number; lon: number; elevation: string; runway: string }> = {
  "WALS": { name: "APT Pranoto", city: "Samarinda", lat: -0.3744, lon: 117.2516, elevation: "72 ft", runway: "04/22 (2,250m)" },
  "WALL": { name: "SAMS Sepinggan", city: "Balikpapan", lat: -1.2682, lon: 116.8947, elevation: "12 ft", runway: "07/25 (2,500m)" },
  "WAQT": { name: "Kalimarau", city: "Berau", lat: 2.1557, lon: 117.4326, elevation: "59 ft", runway: "01/19 (2,250m)" },
  "WIII": { name: "Soekarno-Hatta", city: "Jakarta", lat: -6.1256, lon: 106.6559, elevation: "32 ft", runway: "07/25 (3,600m)" },
  "WARR": { name: "Juanda", city: "Surabaya", lat: -7.3798, lon: 112.7878, elevation: "9 ft", runway: "10/28 (3,000m)" },
  "WAOO": { name: "Syamsudin Noor", city: "Banjarmasin", lat: -3.4473, lon: 114.7618, elevation: "66 ft", runway: "10/28 (2,500m)" },
  "WAHI": { name: "YIA", city: "Yogyakarta", lat: -7.9023, lon: 110.0558, elevation: "20 ft", runway: "11/29 (3,250m)" },
  "WAAA": { name: "Sultan Hasanuddin", city: "Makassar", lat: -5.0616, lon: 119.5540, elevation: "47 ft", runway: "03/21 (3,100m)" },
  "WADD": { name: "I Gusti Ngurah Rai", city: "Bali", lat: -8.7482, lon: 115.1672, elevation: "14 ft", runway: "09/27 (3,000m)" },
  "WAQL": { name: "Long Apung", city: "Malinau", lat: 1.7054, lon: 114.9692, elevation: "3000 ft", runway: "16/34 (840m)" },
  "WALE": { name: "Melalan", city: "Kutai Barat", lat: -0.2032, lon: 115.7602, elevation: "331 ft", runway: "03/21 (1,300m)" },
  "WAQC": { name: "Maratua", city: "Berau", lat: 2.1995, lon: 118.5974, elevation: "59 ft", runway: "06/24 (1,600m)" }
};



// --- HELPER FUNCTIONS (Dipindahkan dari route.ts) ---

function parseDetailedMetar(raw: string) {
  if (!raw || raw === "METAR NOT AVAILABLE") {
    return { temp: 0, dew: 0, wind_dir: 0, wind_spd: 0, vis: 'N/A', qnh: 0, clouds: [], weather: '-', observed_time: '-', remark: '-' };
  }
  
  const timeMatch = raw.match(/\s\d{2}(\d{2})(\d{2})Z\s/);
  const tempMatch = raw.match(/\s(M?\d{2})\/(M?\d{2})\s/); 
  const windMatch = raw.match(/(\d{3}|VRB)(\d{2,3})(?:G(\d{2,3}))?KT/);
  const visMatch = raw.match(/\s(\d{4}|9999)\s/);
  const qnhMatch = raw.match(/\sQ(\d{4})/);
  
  const cloudRegex = /(FEW|SCT|BKN|OVC|VV)(\d{3})(CB|TCU)?/g;
  const clouds = [];
  let match;
  while ((match = cloudRegex.exec(raw)) !== null) {
      // @ts-ignore
      clouds.push({ cover: match[1], height: parseInt(match[2]) * 100, type: match[3] || '' });
  }

  const wxMatch = raw.match(/\s(-|\+|VC)?(RA|DZ|SN|TS|FG|BR|HZ|FU|SQ)\s/);
  const rmkMatch = raw.match(/RMK\s+(.*)/);
  let remarkStr = '-';
  if (rmkMatch) { remarkStr = rmkMatch[1].replace('=', '').trim(); }

  return {
    temp: tempMatch ? parseInt(tempMatch[1].replace('M', '-')) : 0,
    dew: tempMatch ? parseInt(tempMatch[2].replace('M', '-')) : 0,
    wind_dir: windMatch && windMatch[1] !== 'VRB' ? parseInt(windMatch[1]) : 0,
    wind_spd: windMatch ? parseInt(windMatch[2]) : 0,
    vis: visMatch ? (visMatch[1] === '9999' ? '10km+' : `${parseInt(visMatch[1])}m`) : 'N/A',
    qnh: qnhMatch ? parseInt(qnhMatch[1]) : 0,
    clouds: clouds,
    weather: wxMatch ? wxMatch[0].trim() : '-',
    observed_time: timeMatch ? `${timeMatch[1]}:${timeMatch[2]} UTC` : '-',
    remark: remarkStr
  };
}

function extractWeatherString(jsonResponse: any, icao: string): string | null {
    try {
        if (jsonResponse && jsonResponse[icao] && Array.isArray(jsonResponse[icao])) {
            return jsonResponse[icao][0].data_text || null;
        }
        return null;
    } catch (e) { return null; }
}

// --- MAIN FETCH FUNCTION ---
export async function getAirportWeather(icao: string) {
    if (!AIRPORT_DB[icao]) return null;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Handle BMKG SSL if needed on server

    try {
        const [metarRes, speciRes, tafRes] = await Promise.all([
            fetch(`https://cuaca.bmkg.go.id/api/v1/aviation/metar/${icao}?api_token=${API_TOKEN}`, { next: { revalidate: 60 } }),
            fetch(`https://cuaca.bmkg.go.id/api/v1/aviation/speci/${icao}?api_token=${API_TOKEN}`, { next: { revalidate: 60 } }),
            fetch(`https://cuaca.bmkg.go.id/api/v1/aviation/taf/${icao}?api_token=${API_TOKEN}`, { next: { revalidate: 300 } })
        ]);

        const metarJson = await metarRes.json();
        const speciJson = await speciRes.json();
        const tafJson = await tafRes.json();

        const rawMetar = extractWeatherString(metarJson, icao);
        const rawSpeci = extractWeatherString(speciJson, icao);
        const rawTaf = extractWeatherString(tafJson, icao);

        const finalMetar = rawMetar || "METAR NOT AVAILABLE";
        const finalTaf = rawTaf || "TAF NOT AVAILABLE";
        const parsedSource = rawSpeci || finalMetar;
        const parsed = parseDetailedMetar(parsedSource);
        const info = AIRPORT_DB[icao];
        const categoryRaw = parsed.vis === '10km+' ? 'VFR' : (parseInt(parsed.vis) < 5000 ? 'IFR' : 'MVFR');

        return {
            id: icao,
            name: info.name,
            city: info.city,
            lat: info.lat,
            lon: info.lon,
            elevation: info.elevation,
            runway: info.runway,
            category: categoryRaw as 'VFR' | 'IFR' | 'LIFR',
            temp: parsed.temp,
            dew: parsed.dew,
            wind_dir: parsed.wind_dir,
            wind_spd: parsed.wind_spd,
            vis: parsed.vis,
            qnh: parsed.qnh,
            clouds: parsed.clouds,
            weather: parsed.weather,
            observed_time: parsed.observed_time,
            remark: parsed.remark,
            metar: finalMetar,
            speci: rawSpeci,
            taf: finalTaf,
            updated_at: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error fetching ${icao}:`, error);
        return null;
    }
}