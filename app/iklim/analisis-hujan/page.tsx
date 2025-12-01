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
      
      {/* Header */}
      <div className="border-b text-center border-gray-200 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Analisis Hujan
        </h1>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl max-w-4xl mx-auto">
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Informasi hasil analisis curah hujan historis (yang sudah terjadi) di wilayah Kalimantan Timur, meliputi analisis intensitas, sifat hujan, dan distribusi hari hujan.
            </p>
        </div>
      </div>

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