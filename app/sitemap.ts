export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //  Base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stamet-samarinda.devbmkg.my.id';

  // 2. Daftar Halaman Statis
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
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
    {
      url: `${baseUrl}/cuaca/prakiraan-cuaca`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cuaca/peringatan-dini`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0, 
    },
    {
      url: `${baseUrl}/cuaca/aws`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];

  // 3. Ambil Data Berita/Artikel dari Database (Dinamis)
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 1000,
  });

  // 4. Buat URL untuk setiap Berita
  const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/berita/${post.slug}`, 
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 5. Gabungkan Statis dan Dinamis
  return [...staticRoutes, ...dynamicRoutes];
}