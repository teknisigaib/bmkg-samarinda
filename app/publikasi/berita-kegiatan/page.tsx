import type { Metadata } from "next";
import BeritaClient from "@/components/component-publikasi/BeritaClient";
import prisma from "@/lib/prisma"; // 1. Import helper Prisma

export const metadata: Metadata = {
  title: "Berita & Kegiatan | BMKG Samarinda",
  description: "Berita terkini, kegiatan operasional, dan edukasi meteorologi.",
};

// 2. Fungsi untuk mengambil data dari Database
async function getBerita() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc', // Urutkan dari yang terbaru
    },
  });

  // 3. Transformasi Data
  // Prisma mengembalikan format 'Date', tapi Client Component butuh 'String'
  // Kita format tanggalnya di sini biar rapi.
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category as "Berita" | "Kegiatan" | "Edukasi", // Type casting
    date: new Date(post.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }), // Mengubah '2023-11-20T...' jadi '20 Nov 2023'
    author: post.author,
    excerpt: post.excerpt,
    image: post.imageUrl || "/placeholder.jpg", // Fallback jika gambar kosong
    isFeatured: post.isFeatured,
  }));
}

export default async function BeritaPage() {
  // 4. Panggil data
  const beritaData = await getBerita();

  // 5. Lempar data ke Client Component via props
  return <BeritaClient initialData={beritaData} />;
}