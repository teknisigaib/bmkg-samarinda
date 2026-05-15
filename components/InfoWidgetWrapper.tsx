import { getGempaTerbaru } from "@/lib/bmkg/gempa";
import { getKaltimWeather } from "@/lib/weather-service";
import InfoWidget from "@/components/InfoWidget";

export default async function InfoWidgetWrapper() {
  // Fetch PM2.5 dari API Gateway Eksternal dengan cache 60 detik
  const fetchPm25 = fetch("https://pm25.bmkgaptpranoto.com/api/v1/pm25", { 
    next: { revalidate: 60 } 
  })
    .then(res => (res.ok ? res.json() : null))
    .catch(() => null);

  // Jalankan 3 tugas secara paralel agar loading website super cepat
  const [gempaData, listCuaca, dataPm25] = await Promise.all([
    getGempaTerbaru().catch(() => null),
    getKaltimWeather().catch(() => []),
    fetchPm25
  ]);

  return <InfoWidget dataGempa={gempaData} listCuaca={listCuaca} dataPm25={dataPm25} />;
}