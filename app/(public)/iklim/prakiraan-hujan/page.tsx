export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import PrakiraanTabs from "@/components/component-iklim/PrakiraanTabs";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Layers, CalendarClock } from "lucide-react";

export const metadata: Metadata = {
  title: "Prakiraan Hujan | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan curah hujan dasarian, bulanan, sifat hujan, dan probabilitas di wilayah Kalimantan Timur.",
};

export const revalidate = 60;

// Helper untuk fetch data by type
async function getClimateData(type: string) {
  const data = await prisma.climateData.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
    take: 12, // Batasi 12 data
  });

  return data.map((item, index) => ({
    id: item.id,
    title: item.title,
    period: item.period,
    dasarian: item.dasarian,
    bulan: item.bulan,
    image: item.imageUrl,
    analysis: item.content,
    isLatest: index === 0,
  }));
}

export default async function PrakiraanHujanPage() {
  // Ambil 4 jenis data
  const [dataDasarian, dataBulanan, dataSifat, dataProbabilitas] = await Promise.all([
    getClimateData("PrakiraanHujanDasarian"),
    getClimateData("PrakiraanHujanBulanan"),
    getClimateData("PrakiraanSifatDasarian"),
    getClimateData("PrakiraanProbabilitas"),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Iklim" }, 
              { label: "Prakiraan Hujan" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-12 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              {/* Glow biru lembut untuk tema hujan */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Prakiraan Hujan
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
              Peta dan analisis prakiraan curah hujan dasarian, bulanan, sifat hujan, hingga probabilitas curah hujan di wilayah Kalimantan Timur.
           </p>

           
        </section>

        {/* Tab Manager (Client Component) */}
        <PrakiraanTabs 
          dataDasarian={dataDasarian}
          dataBulanan={dataBulanan}
          dataSifat={dataSifat}
          dataProbabilitas={dataProbabilitas}
        />

      </div>
    </div>
  );
}