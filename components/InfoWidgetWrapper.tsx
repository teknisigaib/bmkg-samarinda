import { getGempaTerbaru } from "@/lib/bmkg/gempa";
import { getKaltimWeather } from "@/lib/weather-service";
import InfoWidget from "@/components/InfoWidget"; // Komponen UI asli Anda

export default async function InfoWidgetWrapper() {
  const [gempaData, listCuaca] = await Promise.all([
    getGempaTerbaru().catch(() => null),
    getKaltimWeather().catch(() => [])
  ]);

  return <InfoWidget dataGempa={gempaData} listCuaca={listCuaca} />;
}