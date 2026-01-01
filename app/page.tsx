import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ArrowRight, Calendar, Download, FileText } from "lucide-react";
import RunningText from "@/components/RunningText"; // Import Running Text
import InfoWidget from "@/components/InfoWidget";   // Import Widget
import { getGempaTerbaru } from "@/lib/bmkg/gempa"; // <-- Cek path ini
import { getCuacaSamarinda } from "@/lib/bmkg/cuaca"; // <-- Cek path ini
import AviationSection from "@/components/AviationSection";
import ServiceSection from "@/components/ServiceSection"; // <--- Import
import AppPromo from "@/components/AppPromo";             // <--- Import


// Helper Format Tanggal
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const revalidate = 60; 

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

  // 2. Ambil 3 Berita Terbaru
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

  // 4. Ambil Data Gempa Terbaru
  // AMBIL DATA GEMPA & CUACA (Parallel Fetching agar cepat)
  const [gempaData, cuacaData] = await Promise.all([
    getGempaTerbaru(),
    getCuacaSamarinda(),
  ]);

  return (
    <main className="min-h-screen max-w-8xl bg-gray-50 mt-6">
      
      {/* 1. RUNNING TEXT (Peringatan Dini) */}
      <RunningText />

      {/* 2. HERO SECTION */}
      {heroPost && (
        <section className="relative bg-blue-900 text-white overflow-hidden pb-24"> {/* Tambah pb-24 biar widget tidak nutup teks */}
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

      {/* 3. WIDGET CUACA & GEMPA (Posisi Overlap Hero) */}
      <InfoWidget dataGempa={gempaData} dataCuaca={cuacaData} />

      {/* 4. AVIATION SECTION (BARU) */}
      <AviationSection />

      {/* 5. LAYANAN PUBLIK */}
      <ServiceSection />

      {/* 6. BERITA TERKINI & BULETIN */}
      <section className="max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Kolom Kiri: Berita List */}
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
                        Berita Terkini
                    </h2>
                    <Link href="/publikasi/berita-kegiatan" className="text-blue-600 text-sm font-medium hover:underline">
                        Lihat Semua
                    </Link>
                </div>

                <div className="grid gap-6">
                    {latestPosts.map((post) => (
                        <Link 
                            key={post.id} 
                            href={`/publikasi/berita-kegiatan/${post.slug}`}
                            className="group flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                <Image 
                                    src={post.imageUrl || "/placeholder.jpg"} 
                                    alt={post.title} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <span className={`px-2 py-0.5 rounded font-medium ${
                                        post.category === 'Kegiatan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {post.category}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.createdAt)}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Kolom Kanan: Buletin Widget */}
            <div className="space-y-8">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Publikasi Terbaru
                </h2>

                {latestBulletin ? (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">NEW</div>
                        
                        <div className="relative w-32 h-44 mx-auto mb-4 shadow-lg rounded overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                            <Image 
                                src={latestBulletin.coverUrl || "/placeholder.jpg"}
                                alt={latestBulletin.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1 leading-tight">{latestBulletin.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{latestBulletin.edition} • {latestBulletin.year}</p>
                        
                        <a 
                            href={latestBulletin.pdfUrl} 
                            target="_blank"
                            className="block w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Download className="w-4 h-4" /> Unduh PDF
                        </a>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500 text-sm">
                        Belum ada buletin.
                    </div>
                )}

                {/* Tautan Cepat */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-4">Layanan Informasi</h4>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href="/cuaca/penerbangan" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:translate-x-1 transition-all">
                                <ArrowRight className="w-4 h-4 text-blue-400" /> Cuaca Penerbangan
                            </Link>
                        </li>
                        <li>
                            <Link href="/cuaca/maritim" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:translate-x-1 transition-all">
                                <ArrowRight className="w-4 h-4 text-blue-400" /> Cuaca Maritim
                            </Link>
                        </li>
                        <li>
                            <Link href="/gempa/gempa-terbaru" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:translate-x-1 transition-all">
                                <ArrowRight className="w-4 h-4 text-blue-400" /> Info Gempa Terkini
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
      </section>

      {/*  7. PROMO APLIKASI */}
      <AppPromo />

    </main>
  );
}