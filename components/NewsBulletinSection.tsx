import Link from "next/link";
import Image from "next/image";
import { Calendar, Download, ChevronRight, ArrowRight, BookOpen } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  category: string;
  createdAt: Date;
}

interface Bulletin {
  id: string;
  title: string;
  edition?: string | null;
  year: string;
  coverUrl: string | null;
  pdfUrl: string;
}

interface NewsBulletinProps {
  posts: Post[];
  bulletin: Bulletin | null;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function NewsBulletinSection({ posts, bulletin }: NewsBulletinProps) {
  const [featuredPost, ...otherPosts] = posts;

  return (
    <section className="w-full mx-auto py-16 bg-slate-50">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Publikasi Terkini
          </h2>
        </div>
        
        <Link 
          href="/publikasi/berita-kegiatan" 
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          Arsip Berita
          <div className="bg-white border border-slate-200 p-1.5 rounded-full group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* GRID  3 KOLOM UTAMA (2 Kiri : 1 Kanan)  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
        
        {/* KOLOM KIRI (BERITA) */}
        <div className="lg:col-span-2 flex flex-col gap-8 h-full">
          
          {/* Featured Post (Berita Utama) */}
          {featuredPost && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group hover:border-blue-100 transition-all hover:shadow-md flex-1">
                <Link 
                  href={`/publikasi/berita-kegiatan/${featuredPost.slug}`}
                  className="flex flex-col md:flex-row gap-6 h-full"
                >
                  <div className="relative w-full md:w-[45%] min-h-[240px] md:h-auto flex-shrink-0 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                    <Image 
                      src={featuredPost.imageUrl || "/placeholder.jpg"} 
                      alt={featuredPost.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                        {featuredPost.category}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center flex-1 py-2">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-3 uppercase tracking-wider">
                        <Calendar className="w-4 h-4" /> 
                        {formatDate(featuredPost.createdAt)}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5">
                        {featuredPost.excerpt}
                    </p>
                    <span className="text-blue-600 font-bold text-sm underline decoration-blue-200 underline-offset-4 group-hover:decoration-blue-600 transition-all w-fit mt-auto">
                        Baca Selengkapnya
                    </span>
                  </div>
                </Link>
            </div>
          )}

          {/* Other Posts (2 Berita Kecil ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/publikasi/berita-kegiatan/${post.slug}`}
                className="group bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col gap-4"
              >
                {/* Gambar Diperbesar */}
                <div className="relative w-full h-48 sm:h-52 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <Image 
                    src={post.imageUrl || "/placeholder.jpg"} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                      {post.category}
                  </div>
                </div>
                {/* Teks di Bawah Gambar */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <h4 className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* (BULETIN) */}
        <div className="lg:col-span-1 flex flex-col h-full">
          
          <div className="text-slate-900 bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>

            {/* Header Buletin */}
            <div className="relative z-10 flex items-center gap-4 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-xl leading-none text-slate-800">Buletin Stasiun</h3>
                    <span className="text-sm font-medium text-slate-500 mt-1 block">Edisi Terbaru</span>
                </div>
            </div>
            
            {/* Konten Buletin */}
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 w-full py-4">
                {bulletin ? (
                    <>
                        {/* Ukuran Cover Buletin Disesuaikan */}
                        <div className="relative w-48 sm:w-56 aspect-[3/4] mb-6 rounded-lg overflow-hidden shadow-2xl border border-slate-200 group cursor-pointer transition-transform hover:-translate-y-2">
                            <Image 
                                src={bulletin.coverUrl || "/placeholder.jpg"} 
                                alt={bulletin.title} 
                                fill 
                                className="object-cover"
                            />
                             <a 
                                href={bulletin.pdfUrl} 
                                target="_blank"
                                className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm"
                            >
                                <Download className="w-10 h-10 mb-2 animate-bounce" />
                                <span className="text-xs font-bold tracking-wider">UNDUH PDF</span>
                            </a>
                        </div>
                        <h4 className="text-xl font-bold mb-1 text-slate-800 px-4">{bulletin.title}</h4>
                        <p className="text-sm font-semibold text-blue-600 mb-4 bg-blue-50 px-3 py-1 rounded-full">{bulletin.edition} • {bulletin.year}</p>
                    </>
                ) : (
                    <div className="text-slate-400 text-sm font-medium flex flex-col items-center gap-2">
                      <BookOpen className="w-10 h-10 opacity-20" />
                      Belum ada buletin terbaru.
                    </div>
                )}
            </div>

            {/* Tombol Arsip Buletin */}
            <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
                <Link 
                    href="/publikasi/buletin" 
                    className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 text-sm text-slate-600 font-bold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group"
                >
                    <span>Lihat Seluruh Arsip Buletin</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}