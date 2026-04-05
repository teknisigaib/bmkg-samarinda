export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WeatherMapWrapper from "@/components/component-cuaca/peta-cuaca/WeatherMapWrapper"; 
// 👉 Import fungsi dari lib yang baru kita buat
import { getRealtimeWeatherData } from "@/lib/api-cuaca";

export const metadata: Metadata = {
  title: "Pantauan Cuaca Real-Time | BMKG APT Pranoto Samarinda",
  description: "Pantauan curah hujan dan kondisi cuaca real-time dari stasiun otomatis (ARG & AWS) di Kalimantan Timur.",
};

export default async function PantauanCuacaPage() {
  // 👉 Panggil fungsinya di sini
  const weatherData = await getRealtimeWeatherData();

  return (
    <div className="min-h-screen pb-24 bg-slate-50/50">
      <div className="w-full mx-auto pt-6">
        
        <Breadcrumb 
          className="mb-8" 
          items={[
            { label: "Beranda", href: "/" },
            { label: "Cuaca", href: "/cuaca" }, 
            { label: "Pantauan Cuaca Real-Time" } 
          ]} 
        />

        <section className="relative flex flex-col items-center justify-center text-center mb-10 mx-auto pt-2 max-w-3xl">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900">
              Pantauan Cuaca Real-Time
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4">
              Data observasi curah hujan terkini dari stasiun otomatis terpadu di wilayah Kalimantan Timur. Data diperbarui setiap menit secara real-time.
           </p>
        </section>

        <WeatherMapWrapper data={weatherData} />

      </div>
    </div>
  );
}