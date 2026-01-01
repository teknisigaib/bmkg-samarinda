

import type { Metadata } from "next";
import { getAllAirportsWeather, getRawMetar } from "@/lib/bmkg/aviation"; 
import { filterKaltimAirports } from "@/lib/bmkg/aviation-utils";
import AviationDashboard from "@/components/component-cuaca/cuaca-penerbangan/AviationDashboard";
// Import Komponen Baru
import AviationChart from "@/components/component-cuaca/cuaca-penerbangan/AviationChart"; 

export const metadata: Metadata = {
  title: "Cuaca Penerbangan | BMKG Samarinda",
  description: "Informasi METAR, SPECI, dan TAF untuk navigasi penerbangan wilayah Kalimantan Timur.",
  // ...
};

export default async function AviationPage() {
  const [allAirports, initialRawMetar] = await Promise.all([
    getAllAirportsWeather(),
    getRawMetar('WALS')
  ]);
  const kaltimAirports = filterKaltimAirports(allAirports);

  return (
    <div className="w-full space-y-10 max-sm:max-w-xs"> {/* Tambahkan space-y-10 agar ada jarak */}
        
        {/* BAGIAN ATAS: DASHBOARD INTERAKTIF */}
        <AviationDashboard 
            airports={kaltimAirports} 
        />

        {/* BAGIAN BAWAH: PETA LANJUTAN (BARU) */}
        <section>
            <AviationChart />
        </section>

    </div>
  );
}