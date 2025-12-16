import { XMLParser } from "fast-xml-parser";

// Tipe Data Hasil Parsing
export interface CAPData {
  headline: string;
  description: string;
  severity: string; // Moderate, Severe
  event: string;
  sent: string;
  effective: string;
  expires: string;
  polygons: [number, number][][]; // Array of Array of [Lat, Lng]
  areaDesc: string;
}

export async function getCAPAlertDetail(url: string): Promise<CAPData | null> {
  try {
    // 1. Fetch XML Detail
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 menit
    if (!res.ok) return null;

    const xmlText = await res.text();

    // 2. Parser Config
    const parser = new XMLParser({
      ignoreAttributes: true,
      // Pastikan 'polygon' selalu dianggap array meskipun cuma 1
      isArray: (name) => name === "polygon", 
    });

    const jsonObj = parser.parse(xmlText);
    const info = jsonObj?.alert?.info;

    if (!info) return null;

    // 3. Ambil Raw Polygons (String)
    // Struktur XML: <area><polygon>...</polygon><polygon>...</polygon></area>
    const rawPolygons = info.area?.polygon as string[] || [];

    // 4. Konversi String "Lat,Long Lat,Long" menjadi Array [[Lat, Long], ...]
    const cleanPolygons = rawPolygons.map((polyStr) => {
        return polyStr.trim().split(" ").map((coordPair) => {
            const [lat, lng] = coordPair.split(",");
            return [parseFloat(lat), parseFloat(lng)] as [number, number];
        });
    });

    return {
      headline: info.headline,
      description: info.description,
      severity: info.severity,
      event: info.event,
      sent: info.sent,
      effective: info.effective,
      expires: info.expires,
      areaDesc: info.area?.areaDesc,
      polygons: cleanPolygons,
    };

  } catch (error) {
    console.error("Error parsing CAP XML:", error);
    return null;
  }
}