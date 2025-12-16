import { XMLParser } from "fast-xml-parser";

const BMKG_RSS_URL = "https://www.bmkg.go.id/alerts/nowcast/id/rss.xml";

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

// Return type sekarang selalu string (tidak pernah null)
export async function getPeringatanDiniKaltim(): Promise<string> {
  // Pesan Default jika aman
  const DEFAULT_MSG = "Tidak ada peringatan dini cuaca signifikan untuk wilayah Kalimantan Timur saat ini.";

  try {
    const res = await fetch(BMKG_RSS_URL, { next: { revalidate: 60 } });

    if (!res.ok) return DEFAULT_MSG;

    const xmlText = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: true,
      isArray: (name) => name === "item", 
    });

    const jsonObj = parser.parse(xmlText);
    const items = jsonObj?.rss?.channel?.item as RSSItem[] | undefined;

    if (!items || items.length === 0) {
      return DEFAULT_MSG;
    }

    // Cari peringatan khusus Kaltim
    const kaltimWarning = items.find((item) => 
       item.title?.toLowerCase().includes("kalimantan timur")
    );

    if (!kaltimWarning) {
      return DEFAULT_MSG; // Kaltim tidak ada di list = Aman
    }

    // Bersihkan teks peringatan jika ada
    let cleanText = kaltimWarning.description || "";
    cleanText = cleanText.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

    return cleanText;

  } catch (error) {
    console.error("Error parsing BMKG RSS:", error);
    return DEFAULT_MSG; // Fail-safe ke pesan aman
  }
}

export async function getLinkPeringatanDiniKaltim(): Promise<string | null> {
  try {
    const res = await fetch(BMKG_RSS_URL, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const xmlText = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: true,
      isArray: (name) => name === "item",
    });

    const jsonObj = parser.parse(xmlText);
    const items = jsonObj?.rss?.channel?.item as RSSItem[] | undefined;

    if (!items || items.length === 0) return null;

    // Cari item yang judulnya Kaltim
    const kaltimItem = items.find((item) => 
      item.title?.toLowerCase().includes("kalimantan timur")
    );

    return kaltimItem ? kaltimItem.link : null;

  } catch (error) {
    console.error("Error fetching RSS link:", error);
    return null;
  }
}