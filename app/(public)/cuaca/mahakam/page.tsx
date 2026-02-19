import MahakamDashboard from "@/components/component-cuaca/mahakam/MahakamDashboard";
import { getMahakamDataFull } from "@/lib/weather-service"; 

export default async function Page() {
  const data = await getMahakamDataFull();

  return (
    <div className="min-h-screen">
       <MahakamDashboard data={data} />
    </div>
  );
}