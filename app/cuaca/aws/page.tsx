import { Metadata } from 'next';
import AwsDashboardUI from '@/components/component-cuaca/aws/AwsDasboardUI';
import { transformAwsData } from '@/lib/aws-utils';
import { AwsApiData } from '@/lib/aws-types';
export const dynamic = 'force-dynamic';
// 1. Definisikan Metadata di sini (Server Side)
export const metadata: Metadata = {
  title: 'AWS Monitoring - BMKG Samarinda',
  description: 'Data cuaca real-time dari Automatic Weather Station Temindung.',
  openGraph: {
    title: 'AWS Monitoring - BMKG Samarinda',
    description: 'Suhu, Angin, dan Cuaca terkini di Samarinda.',
  },
};

// 2. Fungsi Fetch di Server (Bisa langsung ke HTTP tanpa Proxy)
// Karena ini berjalan di Node.js server, tidak kena CORS / Mixed Content block.
async function getInitialData() {
  try {
    const res = await fetch('http://202.90.199.132/aws-new/data/station/latest/4000000055', {
      cache: 'no-store', // Selalu ambil data terbaru saat refresh halaman
    });

    if (!res.ok) {
      throw new Error('Failed to fetch AWS data');
    }

    const json: AwsApiData = await res.json();
    return transformAwsData(json);
  } catch (error) {
    console.error('SSR Fetch Error:', error);
    return null;
  }
}

// 3. Page Component (Server Component by default)
export default async function AwsPage() {
  const initialData = await getInitialData();

  // Render Client Component dengan data awal
  return <AwsDashboardUI initialData={initialData} />;
}