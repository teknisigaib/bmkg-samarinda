import EHSatelitSection from "@/components/component-cuaca/satelit/EHSatelitSection";
import RPSatelitSection from "@/components/component-cuaca/satelit/RPSatelitSection";

export const metadata = {
  title: "Citra Satelit Cuaca | BMKG Samarinda",
  description:
    "Citra satelit Himawari dan HCAI dari BMKG untuk pemantauan cuaca di wilayah Indonesia dan Kalimantan Timur.",
};

export default function SatelitPage() {
  return (
    <main className="min-h-screen py-6">
      <div className="w-full mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EHSatelitSection />
          <RPSatelitSection />
        </div>
        
      </div>
    </main>
  );
}
