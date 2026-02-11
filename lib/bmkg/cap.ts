import { XMLParser } from "fast-xml-parser";

// Tipe Data Hasil Parsing
export interface CAPData {
  headline: string;
  description: string;
  severity: string; 
  event: string;
  sent: string;
  effective: string;
  expires: string;
  polygons: [number, number][][];
  areaDesc: string;
  web: string | null;
}

export async function getCAPAlertDetail(url: string): Promise<CAPData | null> {
  try {
    // 1. Fetch XML Detail
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;

    const xmlText = await res.text();

    // 2. Parser Config
    const parser = new XMLParser({
      ignoreAttributes: true,
      isArray: (name) => name === "polygon", 
    });

    const jsonObj = parser.parse(xmlText);
    const info = jsonObj?.alert?.info;

    if (!info) return null;

    // 3. Ambil Raw Polygons 
    const rawPolygons = info.area?.polygon as string[] || [];

    // 4. Konversi String 
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
      web: info.web || null
    };

  } catch (error) {
    console.error("Error parsing CAP XML:", error);
    return null;
  }
}