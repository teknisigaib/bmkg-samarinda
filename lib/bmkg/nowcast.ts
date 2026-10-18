// lib/bmkg/nowcast.ts

export async function fetchArcgisNowcasting() {
  const baseUrl = "https://datacuaca.bmkg.go.id/arcgis/rest/services/production/nowcasting_public/MapServer/2/query";
  
  const params = new URLSearchParams({
    f: "geojson",
    where: "namaprovinsi='KALIMANTAN TIMUR'",
    outFields: "idlaporan,namakotakab,namakecamatan,waktupembuatan,waktuberlaku,waktuberakhir,kategoridampak,tipearea",
    returnGeometry: "true",
    spatialRel: "esriSpatialRelIntersects",
    orderByFields: "no_sorting ASC"
  });

  try {
    const url = `${baseUrl}?${params.toString()}`;

    const res = await fetch(url, { 
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://datacuaca.bmkg.go.id/",
        "Connection": "keep-alive"
      }
    });
    
    const rawText = await res.text();

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = JSON.parse(rawText);

    if (data.error) {
      console.error("⚠️ [NOWCAST] Error spesifik dari ArcGIS:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ [NOWCAST] Gagal fetchArcgisNowcasting:", error);
    return null;
  }
}