import type { Metadata } from "next";
import WeatherDashboard from "@/components/component-cuaca/prakiraan-cuaca/WeatherDashboard"; // Import komponen baru
import { WeatherResponse } from "@/lib/bmkg/types";

export const metadata: Metadata = {
  title: "Prakiraan Cuaca Detail | BMKG",
  description: "Monitor perubahan suhu dan cuaca di wilayah Anda.",
};

async function getData(): Promise<WeatherResponse | null> {
  try {
    // API Sesuai Request
    const res = await fetch("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=64.72.09.1003", {
      next: { revalidate: 300 }, // Cache 5 menit
    });
    
    if (!res.ok) throw new Error("Gagal fetch data");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Page() {
  const data = await getData();

  if (!data) {
    return <div className="p-10 text-center">Gagal memuat data cuaca.</div>;
  }

  return (
    <div >
      {/* Header Halaman */}
      <div className="w-full mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-900">Prakiraan Cuaca</h1>
        <p className="text-gray-500 text-center">Informasi cuaca terkini dan prediksi harian. di provinsi kalimantan timur. Data prakiraan cuaca dalam level kelurahan</p>
      </div>

      {/* Dashboard */}
      <WeatherDashboard response={data} />
    </div>
  );
}