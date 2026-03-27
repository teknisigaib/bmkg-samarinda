export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import prisma from "@/lib/prisma"; 
import ClimateViewer from "@/components/component-iklim/ClimateViewer";
import { CloudRain, CloudOff, CalendarRange } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Monitoring Hari Tanpa Hujan | BMKG APT Pranoto Samarinda",
  description: "Peta sebaran Hari Tanpa Hujan (HTH) berturut-turut di wilayah Kalimantan Timur update per dasarian.",
};

export const revalidate = 300; 

// Fungsi ambil data dari Database
async function getHTHData() {
  const data = await prisma.climateData.findMany({
    where: { type: "HTH" }, // Filter tipe HTH
    orderBy: { createdAt: "desc" },
    take: 12, // Batasi 12 data terakhir
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

export default async function HTHPage() {
  const data = await getHTHData();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Iklim" }, 
              { label: "Hari Tanpa Hujan (HTH)" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-12 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              {/* Glow kuning pucat untuk tema kemarau/HTH */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Hari Tanpa Hujan (HTH)
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
              Peta sebaran deret Hari Tanpa Hujan (HTH) berturut-turut di wilayah Kalimantan Timur, diperbarui secara berkala setiap dasarian.
           </p>

        </section>

        {/* Konten Dinamis (Client Component) */}
        {data.length > 0 ? (
          <ClimateViewer data={data} />
        ) : (
          /* Tampilan Jika Data Kosong */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
              <div className="bg-slate-50 p-5 rounded-full border border-slate-100 mb-5">
                  <CloudRain className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Belum Ada Data</h3>
              <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">
                  Data monitoring Hari Tanpa Hujan (HTH) belum tersedia di database. Silakan cek kembali nanti.
              </p>
          </div>
        )}

      </div>
    </div>
  );
}