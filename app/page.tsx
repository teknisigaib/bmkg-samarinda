import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import RunningText from "@/components/RunningText";
import InfoWidget from "@/components/InfoWidget";
import { getGempaTerbaru } from "@/lib/bmkg/gempa";
import { getCuacaSamarinda } from "@/lib/bmkg/cuaca";
import AviationSection from "@/components/AviationSection";
import ServiceSection from "@/components/ServiceSection";
import AppPromo from "@/components/AppPromo";
import NewsBulletinSection from "@/components/NewsBulletinSection";
import FlyerSection from "@/components/FlyerSection"; // <--- Import

// Helper Format Tanggal (Bisa dipindah ke utils jika mau, tapi dibiarkan disini tidak apa-apa)
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const revalidate = 30; 

export default async function HomePage() {
  // 1. Ambil Berita Utama
  let heroPost = await prisma.post.findFirst({
    where: { isFeatured: true },
  });

  if (!heroPost) {
    heroPost = await prisma.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }

  // 2. Ambil 3 Berita Terbaru (Kecuali Hero)
  const latestPosts = await prisma.post.findMany({
    where: { id: { not: heroPost?.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // 3. Ambil Buletin Terbaru
  const latestBulletin = await prisma.publication.findFirst({
    where: { type: "Buletin" },
    orderBy: { createdAt: "desc" },
  });

  // 4. Ambil Data Gempa & Cuaca
  const [gempaData, cuacaData] = await Promise.all([
    getGempaTerbaru(),
    getCuacaSamarinda(),
  ]);

  // 5. AMBIL DATA FLYER 
  const flyers = await prisma.flyer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen max-w-8xl bg-gray-50 mt-6">
      
      {/* 1. RUNNING TEXT */}
      <RunningText />

      {/* 2. HERO SECTION */}
      {heroPost && (
        <section className="relative bg-blue-900 text-white overflow-hidden pb-24">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroPost.imageUrl || "/placeholder.jpg"}
              alt="Hero Background"
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
              <Link
                href={`/publikasi/berita-kegiatan/${heroPost.slug}`}
                className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition flex items-center gap-2 shadow-lg"
              >
                Baca Selengkapnya <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. WIDGET CUACA & GEMPA */}
      <InfoWidget dataGempa={gempaData} dataCuaca={cuacaData} />

      {/* 4. AVIATION SECTION */}
      <AviationSection />

      {/* 5. LAYANAN PUBLIK */}
      <ServiceSection />

      {/* 6. FLYER / PENGUMUMAN (BARU) */}
      <FlyerSection flyers={flyers} />

      {/* 6. BERITA & BULETIN (KOMPONEN BARU) */}
      <NewsBulletinSection posts={latestPosts} bulletin={latestBulletin} />

      {/* 7. PROMO APLIKASI */}
      <AppPromo />

    </main>
  );
}