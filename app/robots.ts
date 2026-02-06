import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Jangan indeks API
    },
    sitemap: 'https://stametaptpranoto.bmkg.go.id/sitemap.xml', // Ganti domain
  };
}