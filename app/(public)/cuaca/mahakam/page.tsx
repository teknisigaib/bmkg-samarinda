// app/cuaca/mahakam/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import MahakamDashboard from "@/components/component-cuaca/mahakam/MahakamDashboard";
import Breadcrumb from "@/components/ui/Breadcrumb"; // Import Breadcrumb
import { getMahakamData } from "@/lib/mahakam-data"; 
import { getTidalForecast } from "@/lib/tide-service"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuaca Sungai Mahakam | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca maritim dan pasang surut Sungai Mahakam.",
};

export default async function Page() {
  const [mahakamData, tideData] = await Promise.all([
    getMahakamData(),
    getTidalForecast().catch(() => [])
  ]);

  return (
    <div className="min-h-screen">
       <div className="w-full mx-auto pt-6 pb-10 sm:px-4 lg:px-6">
           
           {/* --- 1. BREADCRUMB NAVIGATION --- */}
           <Breadcrumb 
             className="mb-10" 
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "Cuaca Sungai Mahakam" } 
             ]} 
           />

           <MahakamDashboard 
              data={mahakamData} 
              tideData={tideData} 
           />
       </div>
    </div>
  );
}