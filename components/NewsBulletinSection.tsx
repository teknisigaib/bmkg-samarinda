"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper, CalendarClock } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  createdAt: Date;
  excerpt: string | null;
}

interface NewsBulletinSectionProps {
  posts: Post[];
}

export default function NewsBulletinSection({ posts }: NewsBulletinSectionProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 mb-16">
      <div className="max-w-7xl mx-auto flex flex-col">

        {/* GRID UTAMA (Rasio 7:5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* --- SISI KIRI: BERITA UTAMA (Ambil 7 Kolom) --- */}
          <div className="lg:col-span-7 flex flex-col">
            <Link 
              href={`/publikasi/berita-kegiatan/${mainPost.slug}`}
              className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
            >
              {/* Gambar Utama (flex-1 agar gambar yang melar mengisi sisa ruang, bukan teksnya) */}
              <div className="relative flex-1 min-h-[250px] sm:min-h-[300px] w-full overflow-hidden bg-slate-100 shrink-0 border-b border-slate-100">
                <Image
                  src={mainPost.imageUrl || "/placeholder.jpg"}
                  alt={mainPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                />
              </div>
              
              {/* Teks Kiri (shrink-0 agar memeluk teks dengan padat tanpa sisa ruang putih) */}
              <div className="flex flex-col p-6 shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md w-fit">
                  <CalendarClock className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {formatDate(mainPost.createdAt)}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                  {mainPost.title}
                </h3>
                
                <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
                  {mainPost.excerpt}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-xs group-hover:text-blue-700 transition-colors">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* --- SISI KANAN: LIST BERITA (Ambil 5 Kolom) --- */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6 justify-between">
            {sidePosts.map((post) => (
              <Link 
                key={post.id}
                href={`/publikasi/berita-kegiatan/${post.slug}`}
                className="group flex flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-300 h-full min-h-[140px]"
              >
                {/* Gambar Kanan (Lebar dikunci agar tidak ketarik/distorsi) */}
                <div className="relative w-[50%] shrink-0 overflow-hidden bg-slate-100 border-r border-slate-100">
                  <Image
                    src={post.imageUrl || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 150px, 200px"
                    unoptimized
                  />
                </div>

                {/* Teks Kanan */}
                <div className="flex flex-col p-4 sm:p-5 justify-center flex-1">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-xs w-fit mb-2">
                    <CalendarClock className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-4 mb-3">
                    {post.title}
                  </h4>
                  
                  <div className="mt-auto flex items-center gap-1 text-[10px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                    Buka Artikel <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Tombol Mobile */}
        <Link href="/publikasi/berita-kegiatan" className="sm:hidden mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-100 py-3.5 rounded-xl border border-blue-100 transition-colors">
          Lihat Semua Berita <ArrowRight className="w-4 h-4" />
        </Link>
        
      </div>
    </section>
  );
}