// src/app/page.tsx (Server Component)

import MahakamDashboard from "@/components/component-cuaca/mahakam/MahakamDashboard";
// Import dari weather-service, BUKAN mahakam-data
import { getMahakamDataFull } from "@/lib/weather-service"; 

export default async function Page() {
  // Fetch data yang sudah benar
  const data = await getMahakamDataFull();

  return (
    <div className="min-h-screen bg-slate-50">
       {/* Oper data ke dashboard */}
       <MahakamDashboard data={data} />
    </div>
  );
}