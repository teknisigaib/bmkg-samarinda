export const dynamic = 'force-dynamic'; 
import type { Metadata } from "next"; 
import { getPdieData } from "@/app/(admin)/admin/peringatan-dini/actions"; 
import PeringatanDiniClient from "@/components/component-iklim/PeringatanDiniClient"; 
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Peringatan Dini Iklim Ekstrem (PDIE) | BMKG APT Pranoto Samarinda",
  description: "Peringatan Dini Curah Hujan Tinggi dan Peringatan Dini Kekeringan Meteorologis di wilayah Kalimantan Timur.",
};

export default async function PeringatanDiniPage() {
  const dbData = await getPdieData();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6  space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Iklim" }, 
              { label: "Peringatan Dini Ekstrem" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              {/* Glow merah/oranye untuk tema peringatan */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Peringatan Dini Iklim Ekstrem
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-3xl mb-8">
              Sistem peringatan dini iklim ekstrem (PDIE) terkait potensi curah hujan tinggi yang dapat memicu bencana hidrometeorologi basah serta monitoring kewaspadaan kekeringan meteorologis di wilayah Kalimantan Timur.
           </p>

           
        </section>

        {/* CLIENT COMPONENT */}
        <PeringatanDiniClient initialDbData={dbData} />

      </div>
    </div>
  );
}