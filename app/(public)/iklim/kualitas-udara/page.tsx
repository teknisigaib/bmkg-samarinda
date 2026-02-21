import type { Metadata } from "next";
import AirQualityView from "@/components/component-iklim/kualitas-udara/AirQualityView";
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; 

export const metadata: Metadata = {
  title: "Kualitas Udara | BMKG APT Pranoto Samarinda",
  description: "Monitoring Kualitas Udara (PM2.5) Kota Samarinda secara real-time.",
};

async function getPm25Data() {
  try {

    const filePath = path.join(process.cwd(), 'public', 'data', 'pm25-cache.json');

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } else {
       console.log("File tidak ditemukan di:", filePath);
    }
  } catch (error) {
    console.error("Gagal baca cache di server:", error);
  }

  // Data default...
  return { success: false, current: 0, history: [], lastUpdate: "-" };
}

export default async function AirQualityPage() {
  const initialData = await getPm25Data();

  return <AirQualityView initialData={initialData} />;
}