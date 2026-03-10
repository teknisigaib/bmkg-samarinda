import { getPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import RunningText from "@/components/RunningText";

export default async function RunningTextWrapper() {

  const weatherText = await getPeringatanDiniKaltim().catch(() => "Tidak ada peringatan dini cuaca saat ini.");

  return <RunningText weatherText={weatherText} />;
}