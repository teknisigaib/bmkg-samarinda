import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Share2, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await prisma.post.findUnique({ where: { slug } });
  if (!news) return { title: "Berita Tidak Ditemukan" };
  return { title: `${news.title} | BMKG Samarinda`, description: news.excerpt };
}

export default async function DetailBeritaPage({ params }: PageProps) {
  const { slug } = await params;

  const news = await prisma.post.findUnique({ where: { slug } });
  if (!news) notFound();

  const otherNews = await prisma.post.findMany({
    where: { slug: { not: slug } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-white pt-4 pb-16"> 
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* --- MAIN CONTENT (Span 8) --- */}
            <article className="lg:col-span-8">
                
                {/* 1. HEADER SECTION */}
                
                {/* --- UBAH DISINI: TOMBOL KEMBALI SIMPEL --- */}
                <Link 
                    href="/publikasi/berita-kegiatan" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Kembali ke Arsip Berita
                </Link>

                {/* Judul H1 */}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                    {news.title}
                </h1>

                {/* Meta Data (Satu Baris Rapi) */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        news.category === 'Kegiatan' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {news.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{formatDate(news.createdAt)}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{news.author}</span>
                    </div>
                </div>

                {/* 2. FEATURED IMAGE */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-sm mb-8 bg-slate-100">
                    <Image
                        src={news.imageUrl || "/placeholder.jpg"}
                        alt={news.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* 3. CONTENT BODY (Dengan Justify Fix) */}
                <div
                    className="
                        prose prose-lg prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-900 
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:my-8
                        [&>p]:text-justify [&>p]:hyphens-auto
                    "
                >
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </div>

                {/* 4. SHARE FOOTER */}
                <div className="mt-12 pt-6 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm font-bold text-slate-700">Bagikan artikel ini:</span>
                        <div className="flex gap-2">
                             <a 
                                href={`https://wa.me/?text=${encodeURIComponent(news.title + " " + (process.env.NEXT_PUBLIC_SITE_URL ?? "") + "/publikasi/berita-kegiatan/" + slug)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition text-sm font-semibold"
                            >
                                <Share2 className="w-4 h-4" /> WhatsApp
                            </a>
                            <button className="px-4 py-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition text-sm font-semibold">
                                Salin Link
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* --- SIDEBAR --- */}
            <aside className="lg:col-span-4 space-y-8">
                
                {/* Tombol kembali mobile (Opsional, sudah ada di atas tapi bisa dibiarkan untuk akses cepat di bawah) */}
                <Link href="/publikasi/berita-kegiatan" className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-slate-500 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Daftar Berita Lainnya
                </Link>

                <div className="sticky top-28 space-y-8">
                    {/* Widget Berita Lainnya */}
                    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-50">
                            Berita Terkini
                        </h3>
                        <div className="flex flex-col gap-5">
                            {otherNews.map((item) => (
                                <Link key={item.id} href={`/publikasi/berita-kegiatan/${item.slug}`} className="group flex gap-3 items-start">
                                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-slate-100">
                                        <Image 
                                            src={item.imageUrl || "/placeholder.jpg"} 
                                            alt={item.title} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                                            {item.title}
                                        </h4>
                                        <span className="text-xs text-slate-400 block">
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

        </div>
      </div>
    </div>
  );
}