import { fetchArcgisNowcasting } from "@/lib/bmkg/nowcast";
import RunningText from "@/components/RunningText";

export default async function RunningTextWrapper() {
  try {
    // 1. Tarik data dari sistem ArcGIS terbaru kita
    const geoData = await fetchArcgisNowcasting();
    const features = geoData?.features || [];

    // 2. Jika data kosong (Cuaca Cerah)
    if (features.length === 0) {
      return <RunningText weatherText="Tidak ada peringatan dini cuaca saat ini. Seluruh wilayah Kalimantan Timur terpantau aman." />;
    }

    // 3. Jika ADA peringatan, kita kumpulkan daftar Kabupaten/Kota yang terdampak
    const impactedAreas = new Set<string>();
    let latestEndTime = 0;

    features.forEach((f: any) => {
      const props = f.properties;
      if (props.namakotakab) impactedAreas.add(props.namakotakab);
      
      // Cari waktu berakhir yang paling lama
      if (props.waktuberakhir > latestEndTime) {
        latestEndTime = props.waktuberakhir;
      }
    });

    // Ubah Set menjadi string (Contoh: "Samarinda, Balikpapan, Kutai Kartanegara")
    const areasString = Array.from(impactedAreas).join(", ");

    // Format waktu berakhir menjadi Jam WITA (Contoh: "16:30")
    let timeString = "";
    if (latestEndTime > 0) {
      const date = new Date(latestEndTime);
      timeString = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(date).replace(/\./g, ":");
    }

    // 4. Rakit kalimat Running Text-nya
    const warningText = `Berpotensi terjadi hujan dengan intensitas sedang hingga lebat yang dapat disertai kilat/petir dan angin kencang di wilayah: ${areasString}. Kondisi ini diperkirakan dapat berlangsung hingga pkl ${timeString} WITA.`;

    return <RunningText weatherText={warningText} />;

  } catch (error) {
    // Fallback jika API sedang gangguan
    return <RunningText weatherText="Tidak ada peringatan dini cuaca saat ini." />;
  }
}