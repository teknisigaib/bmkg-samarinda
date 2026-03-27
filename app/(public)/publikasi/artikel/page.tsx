export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Library, FileText } from "lucide-react";
import PublikasiListClient from "@/components/component-publikasi/PublikasiListClient";
import Breadcrumb from "@/components/ui/Breadcrumb";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Artikel & Makalah | BMKG APT Pranoto Samarinda",
  description: "Repository publikasi ilmiah, jurnal, dan artikel populer meteorologi.",
};

async function getPublikasi() {
  const data = await prisma.publication.findMany({
    where: {
      type: { in: ["Artikel", "Makalah"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return data.map((item) => ({
    id: item.id,
    type: item.type as "Artikel" | "Makalah",
    title: item.title,
    author: item.author,
    year: item.year,
    tags: item.tags,
    abstract: item.abstract || "",
    cover: item.coverUrl || undefined,
    pdfUrl: item.pdfUrl,
  }));
}

export default async function ArtikelMakalahPage() {
  const publikasiData = await getPublikasi();
  
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 px-4 lg:px-8 space-y-6">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Publikasi" }, 
              { label: "Artikel & Makalah" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Artikel & Makalah
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">
              Repositori digital publikasi ilmiah. Memuat artikel , jurnal, dan makalah penelitian terkait meteorologi dan klimatologi.
           </p>

           
        </section>

        {/* --- CLIENT COMPONENT --- */}
        <PublikasiListClient initialData={publikasiData} />

      </div>
    </div>
  );
}