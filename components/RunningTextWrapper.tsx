import { getPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getMaritimeWarnings } from "@/lib/bmkg/maritim";
import RunningText from "@/components/RunningText"; // UI Asli

export default async function RunningTextWrapper() {
  const [weatherText, marineWarnings] = await Promise.all([
    getPeringatanDiniKaltim().catch(() => "Tidak ada peringatan dini."),
    getMaritimeWarnings().catch(() => [])
  ]);

  return <RunningText weatherText={weatherText} marineWarnings={marineWarnings} />;
}