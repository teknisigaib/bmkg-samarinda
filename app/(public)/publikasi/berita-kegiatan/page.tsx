export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import BeritaClient from "@/components/component-publikasi/BeritaClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Berita & Kegiatan | BMKG Samarinda",
  description: "Berita terkini, kegiatan operasional, dan edukasi meteorologi.",
};

// 2. Fungsi untuk mengambil data
async function getBerita() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Transformasi Data
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category as "Berita" | "Kegiatan" | "Edukasi",
    date: new Date(post.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    author: post.author,
    excerpt: post.excerpt,
    image: post.imageUrl || "/placeholder.jpg",
    isFeatured: post.isFeatured,
  }));
}

export default async function BeritaPage() {
  const beritaData = await getBerita();
  return <BeritaClient initialData={beritaData} />;
}