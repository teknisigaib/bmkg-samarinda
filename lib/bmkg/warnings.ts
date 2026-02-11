import { XMLParser } from "fast-xml-parser";

const BMKG_RSS_URL = "https://www.bmkg.go.id/alerts/nowcast/id/rss.xml";

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

export async function getPeringatanDiniKaltim(): Promise<string> {
 
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

    // peringatan khusus Kaltim
    const kaltimWarning = items.find((item) =>
      item.title?.toLowerCase().includes("kalimantan timur")
    );

    if (!kaltimWarning) {
      return DEFAULT_MSG;
    }

    let cleanText = kaltimWarning.description || "";
    cleanText = cleanText.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

    return cleanText;

  } catch (error) {
    console.error("Error parsing BMKG RSS:", error);
    return DEFAULT_MSG;
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

    const kaltimItem = items.find((item) =>
      item.title?.toLowerCase().includes("kalimantan timur")
    );

    return kaltimItem ? kaltimItem.link : null;

  } catch (error) {
    console.error("Error fetching RSS link:", error);
    return null;
  }
}