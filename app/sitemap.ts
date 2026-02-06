import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://stametaptpranoto.bmkg.go.id'; // Ganti dengan domain asli nanti

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/cuaca/mahakam`,
      lastModified: new Date(),
      changeFrequency: 'hourly', // Karena update tiap jam
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kualitas-udara`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ];
}