import { getAwosFullData } from "@/lib/awos";
import AwosDisplay from "./AwosDisplay";

export default async function AwosWidget() {
  // Fetch di server agar tidak expose kredensial di client
  const fullData = await getAwosFullData();

  return (
    <div className="w-full">
      <AwosDisplay fullData={fullData} />
    </div>
  );
}