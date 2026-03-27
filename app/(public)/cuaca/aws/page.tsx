import { Metadata } from 'next';
import AwsDashboardUI from '@/components/component-cuaca/aws/AwsDasboardUI';
import { getAwsStationData } from './actions'; // Import Server Action
import { DEFAULT_STATION_ID } from '@/lib/aws-config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AWS Monitoring | BMKG APT Pranoto Samarinda',
  description: 'Data cuaca real-time dari Automatic Weather Station.',
};

export default async function AwsPage() {
  // Fetch data awal langsung di server saat render halaman
  const initialData = await getAwsStationData(DEFAULT_STATION_ID);

  return <AwsDashboardUI initialData={initialData} />;
}