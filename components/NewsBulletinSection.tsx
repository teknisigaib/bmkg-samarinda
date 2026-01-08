import Link from "next/link";
import Image from "next/image";
import { Calendar, Download, FileText, ChevronRight, ArrowRight, BookOpen } from "lucide-react";

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
  edition: string;
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
      
      {/* === HEADER SECTION (NEW STYLE) === */}
      {/* Tombol "Lihat Semua Berita" dipindah ke sini */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Publikasi Terkini
          </h2>
        </div>
        
        {/* REFACTOR 1: Link Berita dipindah ke atas dengan gaya Text Link */}
        <Link 
          href="/publikasi/berita-kegiatan" 
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          Arsip Berita
          <div className="bg-white border border-slate-200 p-1.5 rounded-full group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* === KOLOM KIRI: BERITA (Span 8) === */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          {/* Featured Post */}
          {featuredPost && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group hover:border-blue-100 transition-all">
                <Link 
                  href={`/publikasi/berita-kegiatan/${featuredPost.slug}`}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <div className="relative w-full md:w-[45%] h-60 md:h-auto flex-shrink-0 rounded-2xl overflow-hidden shadow-inner">
                    <Image 
                      src={featuredPost.imageUrl || "/placeholder.jpg"} 
                      alt={featuredPost.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                        {featuredPost.category}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center flex-1 py-2">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {formatDate(featuredPost.createdAt)}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {featuredPost.excerpt}
                    </p>
                    <span className="text-blue-600 font-semibold text-sm underline decoration-blue-200 underline-offset-4 group-hover:decoration-blue-600 transition-all w-fit">
                        Baca Selengkapnya
                    </span>
                  </div>
                </Link>
            </div>
          )}

          {/* Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/publikasi/berita-kegiatan/${post.slug}`}
                className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex items-center gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  <Image 
                    src={post.imageUrl || "/placeholder.jpg"} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col h-full justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                    {formatDate(post.createdAt)}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* === KOLOM KANAN: BULETIN (Span 4) === */}
        <div className="lg:col-span-3 flex flex-col h-full">
          
          <div className="text-slate-900 bg-white rounded-3xl p-8 shadow-xl h-full flex flex-col relative overflow-hidden">

            <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-none">Buletin</h3>
                    <span className="text-xs text-slate-400">Edisi Terbaru</span>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                {bulletin ? (
                    <>
                        <div className="relative w-50 h-60 mb-4 rounded-lg overflow-hidden shadow-2xl border border-white/10 group cursor-pointer transition-transform hover:-translate-y-2">
                            <Image 
                                src={bulletin.coverUrl || "/placeholder.jpg"} 
                                alt={bulletin.title} 
                                fill 
                                className="object-cover"
                            />
                            {/* Simple overlay for download */}
                             <a 
                                href={bulletin.pdfUrl} 
                                target="_blank"
                                className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <Download className="w-8 h-8 text-white animate-bounce" />
                            </a>
                        </div>
                        <h4 className="text-lg font-bold mb-1">{bulletin.title}</h4>
                        <p className="text-sm text-slate-400 mb-4">{bulletin.edition} • {bulletin.year}</p>
                    </>
                ) : (
                    <div className="text-slate-500 text-sm">Belum ada data.</div>
                )}
            </div>

            {/* REFACTOR 2: Tombol Buletin (Gaya Outline/Secondary) */}
            <div className="mt-0 pt-4 border-t border-white/10">
                <Link 
                    href="/publikasi/buletin" 
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-500 font-medium hover:bg-white hover:text-blue-600 transition-all group"
                >
                    <span>Lihat Arsip Buletin</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}