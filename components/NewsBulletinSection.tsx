"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Newspaper } from "lucide-react";

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

  // Mengambil 1 berita utama, dan 3 berita sampingan (index 1 sampai 3)
  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  // Helper format tanggal: "30 Apr 2026"
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 mb-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* GRID UTAMA - 50:50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* SISI KIRI: BERITA UTAMA */}
          <div className="flex flex-col h-full">
            <Link 
              href={`/publikasi/berita-kegiatan/${mainPost.slug}`}
              className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:shadow-lg transition-all duration-300"
            >
              {/* Gambar Utama */}
              <div className="relative aspect-[16/8] lg:aspect-[16/9] w-full overflow-hidden bg-slate-100 rounded-2xl shrink-0">
                <Image
                  src={mainPost.imageUrl || "/placeholder.jpg"}
                  alt={mainPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
              
              {/* Teks Kiri */}
              <div className="flex flex-col flex-1 mt-4 px-2">
                <div className="text-sm font-semibold text-slate-500 mb-1.5">
                  {formatDate(mainPost.createdAt)}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                  {mainPost.title}
                </h3>
                
                <p className="text-slate-500 text-sm sm:text-base leading-snug line-clamp-2 mb-4">
                  {mainPost.excerpt}
                </p>

                <div className="mt-auto font-bold text-blue-700 flex items-center gap-2 group-hover:text-blue-800 transition-colors pt-2">
                  Baca selengkapnya <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* SISI KANAN: LIST BERITA (3 KARTU) */}
          <div className="flex flex-col gap-4 sm:gap-6 h-full">
            {sidePosts.map((post) => (
              <Link 
                key={post.id}
                href={`/publikasi/berita-kegiatan/${post.slug}`}
                className="group flex flex-row items-center bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-300 flex-1"
              >
                {/* Gambar Kotak Kanan - Disesuaikan agar muat 3 dengan proporsional */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0 overflow-hidden bg-slate-100 rounded-xl">
                  <Image
                    src={post.imageUrl || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100px, 150px"
                    unoptimized
                  />
                </div>

                {/* Teks Kanan */}
                <div className="flex flex-col flex-1 pl-4">
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">
                    {formatDate(post.createdAt)}
                  </div>
                  
                  {/* Diubah jadi line-clamp-2 agar tidak kepanjangan dan merusak tinggi kotak */}
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  
                  <div className="mt-auto font-bold text-blue-700 flex items-center gap-1.5 text-xs sm:text-sm group-hover:text-blue-800 transition-colors">
                    Baca selengkapnya <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}