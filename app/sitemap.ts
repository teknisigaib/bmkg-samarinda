export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //  Base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stamet-samarinda.bmkg.go.id';

  // 2. Daftar Halaman Statis
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/profil/visi-misi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/profil/tugas-fungsi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/profil/daftar-pegawai`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
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
      changeFrequency: 'hourly',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/cuaca/penerbangan`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/cuaca/maritim`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7, 
    },
    {
      url: `${baseUrl}/cuaca/satelit`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/cuaca/karhutla`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/cuaca/aws`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gempa/gempa-terbaru`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gempa/gempa-dirasakan`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iklim/hari-tanpa-hujan`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iklim/prakiraan-hujan`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iklim/analisis-hujan`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iklim/peringatan-dini`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iklim/kualitas-udara`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publikasi/berita-kegiatan`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publikasi/buletin`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/publikasi/artikel`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.6,
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