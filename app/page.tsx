// src/app/page.tsx

// 1. HAPUS 'force-dynamic' agar fitur Cache/ISR jalan (SEO Lebih Bagus)
// export const dynamic = 'force-dynamic'; 

import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

// --- COMPONENTS ---
import RunningText from "@/components/RunningText";
import InfoWidget from "@/components/InfoWidget";
import AviationSection from "@/components/AviationSection";
import ServiceSection from "@/components/ServiceSection";
import AppPromo from "@/components/AppPromo";
import NewsBulletinSection from "@/components/NewsBulletinSection";
import FlyerSection from "@/components/FlyerSection";

// --- DATA FETCHING ---
import { getGempaTerbaru } from "@/lib/bmkg/gempa";
import { getKaltimWeather } from "@/lib/weather-service"; 

// 2. Gunakan ISR (Update cache setiap 60 detik)
// Ini bikin web secepat statis, tapi data update tiap menit.
export const revalidate = 60; 

export default async function HomePage() {
  // --- INISIALISASI VARIABEL KOSONG (DEFAULT) ---
  let heroPost: any = null;
  let latestPosts: any[] = [];
  let formattedBulletin: any = null;
  let gempaData: any = null;
  let listCuacaKaltim: any = null;
  let flyers: any[] = [];

  // 3. CEK APAKAH SEDANG PROSES BUILD (GITHUB ACTIONS)
  // Kita cek apakah URL database valid atau dummy (placeholder)
  const isBuildTime = !process.env.DATABASE_URL || 
                      process.env.DATABASE_URL.includes('placeholder') ||
                      process.env.DATABASE_URL === "undefined";

  // 4. LOGIKA PENGAMBILAN DATA (Hanya jalan jika BUKAN build time)
  if (!isBuildTime) {
    try {
      console.log("Fetching data for Homepage...");

      // A. Ambil Data Database (Parallel biar cepat)
      const [rawHeroPost, rawLatestPosts, rawBulletin, rawFlyers] = await Promise.all([
        // Hero Post
        prisma.post.findFirst({ where: { isFeatured: true } }),
        // Latest Posts (ambil agak banyak buat filter nanti)
        prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
        // Buletin
        prisma.publication.findFirst({ where: { type: "Buletin" }, orderBy: { createdAt: "desc" } }),
        // Flyers
        prisma.flyer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } })
      ]);

      // Logic Fallback Hero Post (Jika tidak ada yang featured, ambil yang paling baru)
      if (rawHeroPost) {
        heroPost = rawHeroPost;
      } else if (rawLatestPosts.length > 0) {
        heroPost = rawLatestPosts[0];
      }

      // Filter Latest Post (Supaya tidak dobel dengan Hero)
      latestPosts = rawLatestPosts
        .filter(p => p.id !== heroPost?.id)
        .slice(0, 3); // Ambil 3 sisa

      // Formatting Bulletin
      if (rawBulletin) {
        formattedBulletin = {
          id: rawBulletin.id,
          title: rawBulletin.title,
          edition: rawBulletin.edition || undefined, 
          year: rawBulletin.year,
          coverUrl: rawBulletin.coverUrl,
          pdfUrl: rawBulletin.pdfUrl,
        };
      }

      flyers = rawFlyers;

      // B. Ambil Data API External (Gempa & Cuaca)
      // Kita pisah try-catch nya agar kalau API BMKG error, web tetap jalan
      try {
        const [gData, cData] = await Promise.all([
          getGempaTerbaru(),
          getKaltimWeather()
        ]);
        gempaData = gData;
        listCuacaKaltim = cData;
      } catch (apiError) {
        console.error("Gagal mengambil data BMKG/Cuaca:", apiError);
        // Biarkan null, nanti widget akan menampilkan state 'Data tidak tersedia'
      }

    } catch (dbError) {
      console.error("Gagal koneksi Database (mungkin build time atau DB down):", dbError);
      // Data tetap kosong/null, halaman akan tetap render kerangka
    }
  } else {
    console.log("⚠️ Skipping Data Fetching during Build Time to prevent crash.");
  }

  // --- RENDER HALAMAN ---
  return (
    <main className="min-h-screen max-w-8xl bg-gray-50 mt-6">
      
      {/* 1. RUNNING TEXT */}
      <RunningText />

      {/* 2. HERO SECTION */}
      {/* Kita tambahkan kondisi: Tampilkan placeholder jika heroPost kosong (saat build) */}
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
        // Fallback UI saat Build / Loading / Data Kosong (Biar tidak jelek)
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

      {/* 4. AVIATION SECTION */}
      <AviationSection />

      {/* 5. LAYANAN PUBLIK */}
      <ServiceSection />

      {/* 6. FLYER / PENGUMUMAN */}
      <FlyerSection flyers={flyers} />

      {/* 7. BERITA & BULETIN */}
      <NewsBulletinSection 
        posts={latestPosts} 
        bulletin={formattedBulletin} 
      />

      {/* 8. PROMO APLIKASI */}
      <AppPromo />

    </main>
  );
}