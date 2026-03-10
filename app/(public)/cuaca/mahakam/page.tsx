// app/cuaca/mahakam/page.tsx

// PENTING: Memaksa halaman dirender ulang setiap request (agar data selalu fresh)
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import MahakamDashboard from "@/components/component-cuaca/mahakam/MahakamDashboard";
// Import dari file KHUSUS MAHAKAM yang baru kita perbaiki
import { getMahakamData } from "@/lib/mahakam-data"; 
import { getTidalForecast } from "@/lib/tide-service"; 

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuaca Sungai Mahakam | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca maritim dan pasang surut Sungai Mahakam.",
};

export default async function Page() {
  // Ambil data secara paralel
  const [mahakamData, tideData] = await Promise.all([
    getMahakamData(),
    getTidalForecast().catch(() => []) // Handle error pasut agar halaman tidak crash
  ]);

  return (
    <div className="min-h-screen">
       <MahakamDashboard 
          data={mahakamData} 
          tideData={tideData} 
       />
    </div>
  );
}