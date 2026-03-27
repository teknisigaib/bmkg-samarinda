export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Newspaper, BellRing } from "lucide-react";
import BeritaClient from "@/components/component-publikasi/BeritaClient";
import Breadcrumb from "@/components/ui/Breadcrumb";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Berita & Kegiatan | BMKG APT Pranoto Samarinda",
  description: "Berita terkini, kegiatan operasional, dan edukasi meteorologi BMKG Samarinda.",
};

async function getBerita() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category as "Berita" | "Kegiatan" | "Edukasi",
    date: new Date(post.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    author: post.author,
    excerpt: post.excerpt,
    image: post.imageUrl || "/placeholder.jpg",
    isFeatured: post.isFeatured,
  }));
}

export default async function BeritaPage() {
  const beritaData = await getBerita();
  
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 px-4 lg:px-8 space-y-6">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Publikasi" }, 
              { label: "Berita & Kegiatan" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-8 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Berita & Kegiatan
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">
              Pusat informasi publik. Memuat artikel berita terkini, dokumentasi kegiatan operasional, serta materi edukasi meteorologi dan klimatologi.
           </p>
        </section>

        {/* --- CLIENT COMPONENT (LIST BERITA) --- */}
        <BeritaClient initialData={beritaData} />

      </div>
    </div>
  );
}