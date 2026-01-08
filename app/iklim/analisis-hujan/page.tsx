import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import AnalisisTabs from "@/components/component-iklim/AnalisisTabs";

export const metadata: Metadata = {
  title: "Analisis Hujan | BMKG Samarinda",
  description: "Informasi analisis curah hujan dasarian, bulanan, sifat hujan, dan hari hujan.",
};

export const revalidate = 60;

// Helper Fetcher
async function getClimateData(type: string) {
  const data = await prisma.climateData.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return data.map((item, index) => ({
    id: item.id,
    title: item.title,
    period: item.period,
    dasarian: item.dasarian,
    bulan: item.bulan,
    image: item.imageUrl,
    analysis: item.content,
    isLatest: index === 0,
  }));
}

export default async function AnalisisHujanPage() {
  // Ambil 4 Tipe Data Sekaligus
  const [hujanDasarian, hujanBulanan, sifatBulanan, hariHujan] = await Promise.all([
    getClimateData("AnalisisHujanDasarian"),
    getClimateData("AnalisisHujanBulanan"),
    getClimateData("AnalisisSifatBulanan"),
    getClimateData("AnalisisHariHujan"),
  ]);

  return (
    <div className="w-full space-y-8">

      {/* Tabs Client */}
      <AnalisisTabs 
        hujanDasarian={hujanDasarian}
        hujanBulanan={hujanBulanan}
        sifatBulanan={sifatBulanan}
        hariHujan={hariHujan}
      />

    </div>
  );
}