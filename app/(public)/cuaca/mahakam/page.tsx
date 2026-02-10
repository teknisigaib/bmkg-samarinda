import MahakamDashboard from "@/components/component-cuaca/mahakam/MahakamDashboard";
import { getMahakamDataFull } from "@/lib/weather-service"; 

export default async function Page() {
  const data = await getMahakamDataFull();

  return (
    <div className="min-h-screen bg-slate-50">
       <MahakamDashboard data={data} />
    </div>
  );
}