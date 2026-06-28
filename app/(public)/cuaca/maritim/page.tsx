import MaritimeDashboard from "@/components/component-cuaca/cuaca-maritim/MaritimeDashboard";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Prakiraan Cuaca Maritim | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca perairan dan pelabuhan di wilayah perairan Kalimantan Timur.",
};

export default function MaritimePage() {
  return (
    <div className="min-h-screen">
       <div className="w-full mx-auto pt-0 pb-10 sm:px-4 lg:px-6">
           <Breadcrumb 
             className="mb-4" 
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "Cuaca Maritim" } 
             ]} 
           />
           
           {/* Kita panggil komponen kliennya di sini TANPA mengirim props initialData */}
           <MaritimeDashboard />
       </div>
    </div>
  );
}