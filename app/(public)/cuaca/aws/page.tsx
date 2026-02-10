import { Metadata } from 'next';
import AwsDashboardUI from '@/components/component-cuaca/aws/AwsDasboardUI';
import { transformAwsData } from '@/lib/aws-utils';
import { AwsApiData } from '@/lib/aws-types';
export const dynamic = 'force-dynamic';

// Metadata
export const metadata: Metadata = {
  title: 'AWS Monitoring - BMKG Samarinda',
  description: 'Data cuaca real-time dari Automatic Weather Station Temindung.',
  openGraph: {
    title: 'AWS Monitoring - BMKG Samarinda',
    description: 'Suhu, Angin, dan Cuaca terkini di Samarinda.',
  },
};

// 2. Fungsi Fetch di Server
async function getInitialData() {
  try {
    const res = await fetch('http://202.90.199.132/aws-new/data/station/latest/4000000055', {
      cache: 'no-store',
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

// 3. Page Component
export default async function AwsPage() {
  const initialData = await getInitialData();
  return <AwsDashboardUI initialData={initialData} />;
}