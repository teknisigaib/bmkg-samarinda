// lib/bmkg/nowcast.ts

export async function fetchArcgisNowcasting() {
  // Layer 2 is "Nowcasting aktif" in the nowcasting_public MapServer.
  const endpoint = "https://datacuaca.bmkg.go.id/arcgis/rest/services/production/nowcasting_public/MapServer/2/query";
  
  const params = new URLSearchParams({
    f: "geojson",
    where: "namaprovinsi='KALIMANTAN TIMUR'",
    outFields: "idlaporan,namakotakab,namakecamatan,waktupembuatan,waktuberlaku,waktuberakhir,kategoridampak,tipearea",
    returnGeometry: "true",
    spatialRel: "esriSpatialRelIntersects",
    orderByFields: "no_sorting ASC"
  });

  try {
    const res = await fetch(`${endpoint}?${params.toString()}`, {
      next: { revalidate: 300 },
    });

    const contentType = res.headers.get("content-type") ?? "";
    const body = await res.text();
    let payload: any;

    try {
      payload = JSON.parse(body);
    } catch {
      if (res.headers.get("cf-mitigated") === "challenge" || /just a moment/i.test(body)) {
        throw new Error(
          "Permintaan server ke BMKG ditahan oleh Cloudflare. Minta BMKG mengizinkan IP server atau menyediakan endpoint/API untuk akses server."
        );
      }

      const preview = body.replace(/\s+/g, " ").slice(0, 300);
      throw new Error(
        `Respons ArcGIS bukan JSON (HTTP ${res.status}, ${contentType || "content-type tidak diketahui"}): ${preview}`
      );
    }

    // ArcGIS may return an error object even when the HTTP status is 200.
    if (!res.ok || payload?.error) {
      const details = payload?.error
        ? `${payload.error.code ?? "ArcGIS"}: ${payload.error.message ?? JSON.stringify(payload.error)}`
        : `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`Gagal mengambil data dari ArcGIS (${details})`);
    }

    return payload;
  } catch (error) {
    console.error("❌ Error fetchArcgisNowcasting:", error);
    return null;
  }
}
