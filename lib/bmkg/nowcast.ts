// lib/bmkg/nowcast.ts

export async function fetchArcgisNowcasting() {
  const baseUrl = "https://nowcasting.bmkg.go.id/arcgis/rest/services/production/nowcasting_publik_phase2/MapServer/2/query";
  
  const params = new URLSearchParams({
    f: "geojson",
    where: "namaprovinsi='KALIMANTAN TIMUR'",
    outFields: "idlaporan,namakotakab,namakecamatan,waktupembuatan,waktuberlaku,waktuberakhir,kategoridampak,tipearea",
    returnGeometry: "true",
    spatialRel: "esriSpatialRelIntersects",
    orderByFields: "no_sorting ASC"
  });

  try {
    const res = await fetch(`${baseUrl}?${params.toString()}`, { 
      next: { revalidate: 300 } 
    });
    
    if (!res.ok) throw new Error("Gagal mengambil data dari ArcGIS");
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetchArcgisNowcasting:", error);
    return null;
  }
}