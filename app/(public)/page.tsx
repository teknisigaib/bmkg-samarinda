export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

// KOMPONEN UI
import RunningText from "@/components/RunningText";
import InfoWidget from "@/components/InfoWidget";
import AviationSection from "@/components/AviationSection";
import ServiceSection from "@/components/ServiceSection";
import AppPromo from "@/components/AppPromo";
import NewsBulletinSection from "@/components/NewsBulletinSection";
import FlyerSection from "@/components/FlyerSection";

// DATA FETCHING
import { getGempaTerbaru } from "@/lib/bmkg/gempa";
import { getKaltimWeather } from "@/lib/weather-service";
import { getRawMetar, getRawTaf } from "@/lib/bmkg/aviation";
import { getPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getMaritimeWarnings } from "@/lib/bmkg/maritim";

// ISR (Opsional, tapi bagus untuk cache di mode dynamic)
export const revalidate = 60; 

export default async function HomePage() {
  const isBuildTime = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder');

  // --- 1. INISIALISASI VARIABEL KOSONG (Nilai Default) ---
  let heroPost: { id: string; title: string; slug: string; category: string; content: string; excerpt: string; imageUrl: string | null; author: string; isFeatured: boolean; createdAt: Date; updatedAt: Date; } | null = null;
  let latestPosts: any[] = [];
  let formattedBulletin = null;
  let flyers: any[] = [];
  
  let gempaData = null;
  let listCuacaKaltim: any[] = [];
  let aviationData = { metar: [] as any[], taf: [] as any[] };
  let warningData = { weather: "", maritime: [] as string[] };

  // --- 2. FETCHING PARALEL (SUPER CEPAT) ---
  if (!isBuildTime) {
    try {
      console.log("Fetching ALL Homepage data parallel...");

      // KITA JALANKAN SEMUA REQUEST BERSAMAAN
      const [
        // Database (Cepat)
        rawHeroPost,
        rawLatestPosts,
        rawBulletin,
        rawFlyers,
        // API External (Lambat - kita catch error per item)
        gData,
        cData,
        rawMetar,
        rawTaf,
        wText,
        mWarnings
      ] = await Promise.all([
        prisma.post.findFirst({ where: { isFeatured: true } }),
        prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
        prisma.publication.findFirst({ where: { type: "Buletin" }, orderBy: { createdAt: "desc" } }),
        prisma.flyer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
        
        getGempaTerbaru().catch(e => null),
        getKaltimWeather().catch(e => []),
        getRawMetar("WALS").catch(e => []),
        getRawTaf("WALS").catch(e => []),
        getPeringatanDiniKaltim().catch(e => "Tidak ada peringatan dini."),
        getMaritimeWarnings().catch(e => [])
      ]);

      // --- 3. OLAH DATA DATABASE ---
      // Logika Hero Post
      if (rawHeroPost) {
        heroPost = rawHeroPost;
      } else if (rawLatestPosts.length > 0) {
        heroPost = rawLatestPosts[0];
      }

      // Logika Latest Posts (exclude hero)
      latestPosts = rawLatestPosts
        .filter(p => p.id !== heroPost?.id)
        .slice(0, 3);

      // Logika Bulletin
      if (rawBulletin) {
        formattedBulletin = {
          id: rawBulletin.id,
          title: rawBulletin.title,
          edition: rawBulletin.edition,
          year: rawBulletin.year,
          coverUrl: rawBulletin.coverUrl,
          pdfUrl: rawBulletin.pdfUrl,
        };
      }

      flyers = rawFlyers;

      // --- 4. OLAH DATA EXTERNAL ---
      gempaData = gData;
      listCuacaKaltim = cData || [];
      aviationData = { metar: rawMetar || [], taf: rawTaf || [] };
      warningData = { weather: wText || "", maritime: mWarnings || [] };

    } catch (error) {
      console.error("⚠️ Error Fetching Homepage Data:", error);
    }
  }

  // --- 5. RENDER HALAMAN ---
  return (
    <main className="min-h-screen max-w-7xl mx-auto bg-gray-50 mt-6">
      
      {/* 1. RUNNING TEXT (Menerima Data) */}
      <RunningText 
        weatherText={warningData.weather} 
        marineWarnings={warningData.maritime} 
      />

      {/* 2. HERO SECTION */}
      {heroPost ? (
        <section className="relative bg-blue-900 text-white overflow-hidden pb-24">
          <div className="absolute inset-0 z-0">
             <Image 
               src={heroPost.imageUrl || "/placeholder.jpg"} 
               alt="Background" 
               fill 
               className="object-cover opacity-20" 
               priority 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col justify-center min-h-[50vh]">
             <span className="inline-block bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full text-xs w-fit mb-4 uppercase tracking-wider shadow-lg">
               Berita Utama
             </span>
             <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 max-w-4xl drop-shadow-md">
               {heroPost.title}
             </h1>
             <p className="text-blue-100 text-lg mb-8 max-w-2xl line-clamp-2 drop-shadow-sm">
               {heroPost.excerpt}
             </p>
             <div className="flex gap-4">
               <Link href={`/publikasi/berita-kegiatan/${heroPost.slug}`} className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2 shadow-lg">
                 Baca Selengkapnya ...<ArrowRight className="w-4 h-4" />
               </Link>
             </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-blue-900 text-white pb-24 min-h-[50vh] flex items-center justify-center">
             <div className="text-center px-4">
                <h1 className="text-3xl font-bold mb-2">BMKG Samarinda</h1>
                <p>Memuat informasi terkini...</p>
             </div>
        </section>
      )}

      {/* 3. WIDGET CUACA & GEMPA */}
      <div className="-mt-4 relative z-20">
         <InfoWidget 
           dataGempa={gempaData}
           listCuaca={listCuacaKaltim}
         />
      </div>

      {/* 4. AVIATION SECTION (Menerima Data) */}
      <AviationSection 
        rawMetars={aviationData.metar} 
        rawTafs={aviationData.taf} 
      />

      {/* 5. LAYANAN PUBLIK */}
      <ServiceSection />

      {/* 6. FLYER */}
      <FlyerSection flyers={flyers} />

      {/* 7. BERITA & BULETIN */}
      <NewsBulletinSection 
        posts={latestPosts} 
        bulletin={formattedBulletin} 
      />

      {/* 8. PROMO */}
      <AppPromo />

    </main>
  );
}