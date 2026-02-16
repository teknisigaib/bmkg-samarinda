export const dynamic = "force-dynamic";

import { Suspense } from "react"; // IMPORT PENTING
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

// KOMPONEN UI
import ServiceSection from "@/components/ServiceSection";
import AppPromo from "@/components/AppPromo";
import NewsBulletinSection from "@/components/NewsBulletinSection";
import FlyerSection from "@/components/FlyerSection";

// WRAPPERS (Komponen yang fetch data lambat)
import InfoWidgetWrapper from "@/components/InfoWidgetWrapper";
import RunningTextWrapper from "@/components/RunningTextWrapper";
import AviationSection from "@/components/AviationSection"; // Pastikan ini sudah fetch sendiri

// SKELETONS (Tampilan Loading Sementara)
// Anda bisa buat komponen cantik, tapi div sederhana cukup untuk tes
const WidgetSkeleton = () => (
  <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl shadow-sm flex items-center justify-center text-gray-400">
    Memuat Data BMKG...
  </div>
);
const AviationSkeleton = () => (
  <div className="w-full h-96 bg-gray-200 animate-pulse rounded-3xl shadow-sm mt-8"></div>
);
const RunningTextSkeleton = () => (
  <div className="w-full h-10 bg-gray-300 animate-pulse"></div>
);

export default async function HomePage() {
  const isBuildTime = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder');

  // --- 1. FETCH HANYA DATABASE (DATA CEPAT) ---
  // Kita biarkan ini mem-block halaman sebentar karena database biasanya < 0.5s
  let heroPost: { id: string; title: string; slug: string; category: string; content: string; excerpt: string; imageUrl: string | null; author: string; isFeatured: boolean; createdAt: Date; updatedAt: Date; } | null = null;
  let latestPosts: any[] = [];
  let formattedBulletin = null;
  let flyers: any[] = [];

  if (!isBuildTime) {
    try {
        const [rawHeroPost, rawLatestPosts, rawBulletin, rawFlyers] = await Promise.all([
            prisma.post.findFirst({ where: { isFeatured: true } }),
            prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
            prisma.publication.findFirst({ where: { type: "Buletin" }, orderBy: { createdAt: "desc" } }),
            prisma.flyer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } })
        ]);

        // Logic Hero
        if (rawHeroPost) {
            heroPost = rawHeroPost;
        } else if (rawLatestPosts.length > 0) {
            heroPost = rawLatestPosts[0];
        }
        latestPosts = rawLatestPosts.filter(p => p.id !== heroPost?.id).slice(0, 3);
        
        // Logic Bulletin
        if (rawBulletin) {
            formattedBulletin = { ...rawBulletin }; // Simplify for brevity
        }
        flyers = rawFlyers;

    } catch (e) { console.error("DB Error", e); }
  }

  // --- 2. RENDER (STREAMING) ---
  return (
    <main className="min-h-screen max-w-7xl mx-auto bg-gray-50 mt-6">
      
      {/* 1. RUNNING TEXT (Lambat -> Dipisah) */}
      <Suspense fallback={<RunningTextSkeleton />}>
          <RunningTextWrapper />
      </Suspense>

      {/* 2. HERO SECTION (Cepat -> Langsung Tampil) */}
      {/* 2. HERO SECTION */}
      {heroPost && (
        <section className="relative bg-blue-900 text-white overflow-hidden pb-24">
          {/* ... (Isi Hero Section tetap sama) ... */}
          <div className="absolute inset-0 z-0">
             {/* ... Gambar ... */}
             <Image src={heroPost.imageUrl || "/placeholder.jpg"} alt="" fill className="object-cover opacity-20" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col justify-center min-h-[50vh]">
             {/* ... Konten Teks Hero ... */}
             <span className="inline-block bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full text-xs w-fit mb-4 uppercase tracking-wider shadow-lg">Berita Utama</span>
             <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 max-w-4xl drop-shadow-md">{heroPost.title}</h1>
             <p className="text-blue-100 text-lg mb-8 max-w-2xl line-clamp-2 drop-shadow-sm">{heroPost.excerpt}</p>
             <div className="flex gap-4">
               <Link href={`/publikasi/berita-kegiatan/${heroPost.slug}`} className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2 shadow-lg">
                 Baca Selengkapnya<ArrowRight className="w-4 h-4" />
               </Link>
             </div>
          </div>
        </section>
      )}

      {/* 3. WIDGET CUACA & GEMPA (Sangat Lambat -> Dipisah) */}
      <div className="-mt-4 relative z-20">
         <Suspense fallback={<WidgetSkeleton />}>
            <InfoWidgetWrapper />
         </Suspense>
      </div>

      {/* 4. AVIATION SECTION (Lambat -> Dipisah) */}
      <Suspense fallback={<AviationSkeleton />}>
          <AviationSection />
      </Suspense>

      {/* 5. BAGIAN LAIN (Statis/Cepat) */}
      <ServiceSection />
      <FlyerSection flyers={flyers} />
      <NewsBulletinSection posts={latestPosts} bulletin={formattedBulletin} />
      <AppPromo />

    </main>
  );
}