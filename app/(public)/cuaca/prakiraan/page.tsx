import { Metadata } from "next";
import WeatherClient from "@/components/component-cuaca/prakiraan-cuaca/WeatherClient"; // Sesuaikan path jika Anda menyimpannya di folder berbeda

export const metadata: Metadata = {
  title: "Prakiraan Cuaca Terkini | BMKG APT Pranoto Samarinda",
  description: "Cek prakiraan cuaca hari ini dan esok secara akurat hingga tingkat kecamatan dan desa. Dapatkan informasi suhu, kelembapan, dan angin langsung dari data resmi BMKG.",
  keywords: ["prakiraan cuaca", "cuaca samarinda", "cuaca kalimantan timur", "cuaca hari ini", "BMKG", "suhu udara"],
  openGraph: {
    title: "Prakiraan Cuaca Terkini - BMKG",
    description: "Pantau cuaca harian dan informasi meteorologi wilayah Anda secara akurat.",
  }
};

export default function PrakiraanCuacaPage() {
  return (
    <>
      <WeatherClient />
    </>
  );
}