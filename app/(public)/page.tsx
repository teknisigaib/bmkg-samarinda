export const revalidate = 30;

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

// KOMPONEN UI
import ServiceSection from "@/components/ServiceSection";
import AppPromo from "@/components/AppPromo";
import NewsBulletinSection from "@/components/NewsBulletinSection";
import FlyerSection from "@/components/FlyerSection";
import LiveRainfallTicker from "@/components/LiveRainfallTicker";
import PublicServices from "@/components/PublicServices";

// WRAPPERS 
import InfoWidgetWrapper from "@/components/InfoWidgetWrapper";
import RunningTextWrapper from "@/components/RunningTextWrapper";
import AviationSection from "@/components/AviationSection";
import ClimateProductsWrapper from "@/components/ClimateProductsWrapper";

// SKELETONS 
const SkeletonBase = ({ className }: { className: string }) => (
  <div className={`bg-slate-200 animate-pulse rounded-2xl ${className}`} />
);
const WidgetSkeleton = () => <SkeletonBase className="w-full h-[280px] shadow-sm" />;
const AviationSkeleton = () => <SkeletonBase className="w-full h-[400px]" />;
const RunningTextSkeleton = () => <div className="w-full h-12 bg-slate-200 animate-pulse" />;

// 🔥 KOMPONEN JUDUL SEGMEN (KONSISTEN TENGAH DENGAN AKSEN) 🔥
const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="w-full flex flex-col items-center text-center mb-10 sm:mb-14">
    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 relative pb-4 inline-block">
      {title}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-600 rounded-full"></span>
    </h2>
    {subtitle && (
      <p className="text-slate-500 mt-4 max-w-2xl text-sm md:text-base px-4">
        {subtitle}
      </p>
    )}
  </div>
);

export default async function HomePage() {
  const isBuildTime = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder');

  let heroPost: any = null;
  let latestPosts: any[] = [];
  let flyers: any[] = [];

  if (!isBuildTime) {
    try {
        const [rawHeroPost, rawLatestPosts, rawFlyers] = await Promise.all([
            prisma.post.findFirst({ where: { isFeatured: true } }),
            prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
            prisma.flyer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } })
        ]);

        if (rawHeroPost) heroPost = rawHeroPost;
        else if (rawLatestPosts.length > 0) heroPost = rawLatestPosts[0];
        
        latestPosts = rawLatestPosts.filter(p => p.id !== heroPost?.id).slice(0, 4);
        flyers = rawFlyers;
    } catch (e) { console.error("DB Error", e); }
  }

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden selection:bg-blue-600 selection:text-white pt-4">
      
      {/* 1. RUNNING TEXT */}
      <Suspense fallback={<RunningTextSkeleton />}>
          <RunningTextWrapper />
      </Suspense>

      {/* 2. HERO SECTION */}
      {heroPost && (
        <section className="relative w-full flex items-center overflow-hidden bg-slate-900 pt-20 pb-40 md:pt-28 md:pb-48 mt-0">
          <div className="absolute inset-0 z-0">
             <Image 
               src={heroPost.imageUrl || "/placeholder.jpg"} 
               alt="Hero" 
               fill 
               priority 
               className="object-cover opacity-30 mix-blend-overlay" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12">
             <div className="max-w-5xl">
                <span className="inline-block bg-yellow-400 text-slate-900 font-bold px-3 py-1 rounded text-xs uppercase tracking-widest mb-4">Berita Utama</span>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-md">
                    {heroPost.title}
                </h1>
                
                <p className="text-slate-200 text-base md:text-lg mb-8 max-w-3xl line-clamp-3 drop-shadow">
                    {heroPost.excerpt}
                </p>
                
                <Link href={`/publikasi/berita-kegiatan/${heroPost.slug}`} className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 w-fit shadow-lg">
                  Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>
        </section>
      )}

      {/* 3. WIDGET DASBOR TERPADU (OVERLAP HERO) */}
      <div className="-mt-20 md:-mt-28 relative z-30 px-4 sm:px-6 lg:px-12 mb-16">
         <div className="bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col">
            <div className="w-full relative z-20">
               <Suspense fallback={<WidgetSkeleton />}>
                   <InfoWidgetWrapper />
               </Suspense>
            </div>
            <div className="w-full h-px bg-slate-200 relative z-20"></div>
            <div className="w-full bg-slate-50 relative z-10">
               <LiveRainfallTicker />
            </div>
         </div>
      </div>

      {/* ========================================= */}
      {/* POLA ZEBRA DIMULAI DARI SINI */}
      {/* ========================================= */}

      {/* 4. AVIATION SECTION (LATAR ABU-ABU) */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle title="Informasi Penerbangan" subtitle="Data cuaca aktual untuk keselamatan jalur udara" />
          <div className=" sm:px-6 lg:px-12">
            <Suspense fallback={<AviationSkeleton />}><AviationSection /></Suspense>
          </div>
        </div>
      </section>

      {/* 5. LAYANAN PUBLIK (LATAR PUTIH) */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle title="Layanan Publik BMKG" subtitle="Akses cepat ke berbagai layanan informasi dan pengaduan" />
          <PublicServices />
        </div>
      </section>

      {/* 6. PRODUK IKLIM (LATAR ABU-ABU) */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle title="Produk Iklim" subtitle="Analisis dan prakiraan curah hujan serta monitoring kekeringan wilayah" />
          <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse rounded-2xl w-full" />}>
          <ClimateProductsWrapper />
          </Suspense>
        </div>
      </section>

      {/* 7. INFOGRAFIS & PERINGATAN (LATAR PUTIH) */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle title="Infografis & Peringatan" subtitle="Materi publikasi visual terbaru dari BMKG Kaltim" />
          <FlyerSection flyers={flyers} />
        </div>
      </section>

      {/* 8. BERITA TERKINI (LATAR ABU-ABU) */}
      <section className="w-full py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle title="Berita Terkini" subtitle="Kabar terbaru seputar kegiatan dan analisis cuaca" />
          <NewsBulletinSection posts={latestPosts} />
        </div>
      </section>

      {/* 9. PROMO APLIKASI */}
      <AppPromo />

    </main>
  );
}