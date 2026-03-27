export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { BookOpen, FileText } from "lucide-react";
import BuletinClient from "@/components/component-publikasi/BuletinClient";
import Breadcrumb from "@/components/ui/Breadcrumb";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Arsip Buletin | BMKG APT Pranoto Samarinda",
  description: "Unduh buletin cuaca bulanan dan laporan iklim wilayah Kalimantan Timur.",
};

// --- HELPER: DETEKSI BULAN DARI TEKS ---
const MONTHS = [
  "januari", "februari", "maret", "april", "mei", "juni", 
  "juli", "agustus", "september", "oktober", "november", "desember"
];

function getMonthIndex(text: string) {
  const lowerText = text.toLowerCase();
  for (let i = 0; i < MONTHS.length; i++) {
    if (lowerText.includes(MONTHS[i])) {
      return i + 1; 
    }
  }
  return 0; 
}

// --- AMBIL & URUTKAN DATA ---
async function getBuletin() {
  const data = await prisma.publication.findMany({
    where: { type: "Buletin" },
    orderBy: { createdAt: "desc" }, 
  });

  const transformedData = data.map((item) => ({
    id: item.id,
    title: item.title,
    edition: item.edition || "",
    year: item.year,
    cover: item.coverUrl || "/placeholder.jpg",
    pdfUrl: item.pdfUrl,
  }));

  return transformedData.sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    if (yearA !== yearB) return yearB - yearA;

    const monthA = getMonthIndex(a.edition + " " + a.title);
    const monthB = getMonthIndex(b.edition + " " + b.title);
    if (monthA !== monthB) return monthB - monthA;

    return 0;
  });
}

export default async function BuletinPage() {
  const buletinData = await getBuletin();
  
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 px-4 lg:px-8 space-y-6">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Publikasi" }, 
              { label: "Buletin Cuaca" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Buletin Cuaca & Iklim
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">
              Pusat arsip publikasi berkala. Unduh dan baca laporan tinjauan cuaca, evaluasi iklim, dan prospek meteorologi bulanan BMKG.
           </p>

        </section>

        {/* --- CLIENT COMPONENT (LIST BULETIN) --- */}
        <BuletinClient initialData={buletinData} />

      </div>
    </div>
  );
}