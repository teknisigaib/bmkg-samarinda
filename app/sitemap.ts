export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma"; // Pastikan import prisma benar

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Tentukan Base URL (Gunakan Environment Variable atau Fallback)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stametsamarinda.bmkg.go.id';

  // 2. Daftar Halaman Statis (Manual)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily', // Homepage sering update cuaca
      priority: 1,
    },
    // --- PROFIL (Jarang Berubah -> Monthly) ---
    {
      url: `${baseUrl}/profil/visi-misi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profil/tugas-fungsi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profil/daftar-pegawai`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // --- CUACA & DATA (Sering Berubah -> Hourly/Daily) ---
    {
      url: `${baseUrl}/cuaca/prakiraan-cuaca`,
      lastModified: new Date(),
      changeFrequency: 'hourly', // Cuaca berubah tiap jam
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cuaca/peringatan-dini`,
      lastModified: new Date(),
      changeFrequency: 'always', // Sangat kritis
      priority: 1.0, 
    },
    {
      url: `${baseUrl}/cuaca/aws`, // Data AWS Realtime
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    // ... Tambahkan halaman statis lain di sini ...
  ];

  // 3. Ambil Data Berita/Artikel dari Database (Dinamis)
  // Ini kunci agar artikel baru langsung terindeks!
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      slug: true, // Asumsi Anda punya field slug. Jika tidak, pakai ID.
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 1000, // Batasi agar sitemap tidak terlalu berat (Google max 50k URLs)
  });

  // 4. Buat URL untuk setiap Berita
  const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/berita/${post.slug}`, // Sesuaikan dengan struktur URL detail berita Anda
    lastModified: post.updatedAt,
    changeFrequency: 'weekly', // Berita lama jarang berubah setelah rilis
    priority: 0.7,
  }));

  // 5. Gabungkan Statis dan Dinamis
  return [...staticRoutes, ...dynamicRoutes];
}