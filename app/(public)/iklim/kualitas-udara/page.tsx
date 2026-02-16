import type { Metadata } from "next";
import AirQualityView from "@/components/component-iklim/kualitas-udara/AirQualityView";
import fs from 'fs';
import path from 'path';
import os from 'os';

export const metadata: Metadata = {
  title: "Kualitas Udara | BMKG APT Pranoto Samarinda",
  description: "Monitoring Kualitas Udara (PM2.5) Kota Samarinda secara real-time.",
};

async function getPm25Data() {
  try {
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, 'pm25-cache.json');

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Gagal baca cache di server:", error);
  }

  // Data default jika file belum ada/error
  return { 
    success: false, 
    current: 0, 
    history: [], 
    lastUpdate: "-" 
  };
}

export default async function AirQualityPage() {
  // Ambil data sebelum halaman dikirim ke browser
  const initialData = await getPm25Data();

  // Oper data ke Component View
  return <AirQualityView initialData={initialData} />;
}