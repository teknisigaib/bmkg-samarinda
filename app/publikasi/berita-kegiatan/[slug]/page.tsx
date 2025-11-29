import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Clock, Home, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma"; // 1. Import Prisma
// HAPUS import MOCK_NEWS

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper untuk format tanggal Indonesia
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// --- 1. GENERATE METADATA DARI DATABASE ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Ambil data dari DB berdasarkan slug
  const news = await prisma.post.findUnique({
    where: { slug: slug },
  });

  if (!news) {
    return { title: "Berita Tidak Ditemukan | BMKG Samarinda" };
  }

  return {
    title: `${news.title} | BMKG Samarinda`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      url: `/publikasi/berita-kegiatan/${slug}`,
      images: news.imageUrl ? [{ url: news.imageUrl }] : [],
      type: "article",
    },
  };
}

// --- 2. MAIN COMPONENT ---
export default async function DetailBeritaPage({ params }: PageProps) {
  const { slug } = await params;

  // A. Ambil Berita Utama dari DB
  const news = await prisma.post.findUnique({
    where: { slug: slug },
  });

  // Jika tidak ketemu di DB -> 404
  if (!news) {
    notFound();
  }

  // B. Ambil "Berita Lainnya" dari DB (Kecuali berita yang sedang dibuka)
  const otherNews = await prisma.post.findMany({
    where: {
      slug: { not: slug }, // Jangan ambil berita yang sama
    },
    orderBy: { createdAt: "desc" },
    take: 3, // Ambil 3 saja
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-500">Publikasi</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <Link href="/publikasi/berita-kegiatan" className="hover:text-blue-600 transition-colors">
            Berita & Kegiatan
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-blue-600 font-medium truncate max-w-[200px]">
            {news.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- MAIN ARTICLE --- */}
          <article className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    news.category === 'Kegiatan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {news.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {formatDate(news.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {news.author}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                {news.title}
              </h1>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-gray-100">
                <Image
                  src={news.imageUrl || "/placeholder.jpg"} // Handle gambar kosong
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </header>

            {/* Isi Konten */}
            <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed space-y-6">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>

            {/* Share Button */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
               <span className="text-gray-500 text-sm font-medium">Bagikan informasi ini:</span>
               <div className="flex gap-3">
                 <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`${news.title} - Baca selengkapnya: https://bmkgaptpranoto.com/publikasi/berita-kegiatan/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition font-medium text-sm"
                 >
                    <Share2 className="w-4 h-4" /> WhatsApp
                 </a>
               </div>
            </div>
          </article>

          {/* --- SIDEBAR --- */}
          <aside className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
                    Berita Lainnya
                  </h3>
                  <Link href="/publikasi/berita-kegiatan" className="text-xs font-semibold text-blue-600 hover:underline">
                    Lihat Semua
                  </Link>
              </div>

              <div className="space-y-5">
                {otherNews.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/publikasi/berita-kegiatan/${item.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                      <Image 
                        src={item.imageUrl || "/placeholder.jpg"} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}