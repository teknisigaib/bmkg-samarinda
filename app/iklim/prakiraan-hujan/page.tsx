import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import PrakiraanTabs from "@/components/component-iklim/PrakiraanTabs";

export const metadata: Metadata = {
  title: "Prakiraan Hujan | BMKG Samarinda",
  description: "Informasi prakiraan curah hujan dasarian, bulanan, sifat hujan, dan probabilitas.",
};

export const revalidate = 60;

// Helper untuk fetch data by type
async function getClimateData(type: string) {
  const data = await prisma.climateData.findMany({
    where: { type },
    orderBy: { createdAt: "desc" },
    take: 12, // Batasi 12 data terakhir saja agar ringan
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

export default async function PrakiraanHujanPage() {
  // Ambil 4 jenis data secara parallel (Cepat)
  const [dataDasarian, dataBulanan, dataSifat, dataProbabilitas] = await Promise.all([
    getClimateData("PrakiraanHujanDasarian"),
    getClimateData("PrakiraanHujanBulanan"),
    getClimateData("PrakiraanSifatDasarian"),
    getClimateData("PrakiraanProbabilitas"),
  ]);

  return (
    <div className="w-full space-y-8">
      
      {/* Header Halaman */}
      <div className="border-b text-center border-gray-200 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Prakiraan Hujan
        </h1>
        <p className="text-gray-500 max-w-3xl mx-auto text-sm md:text-base">
            Informasi prediksi curah hujan wilayah Kalimantan Timur yang meliputi prakiraan deterministik (dasarian/bulanan), sifat hujan, serta peluang (probabilitas) curah hujan.
        </p>
      </div>

      {/* Tab Manager (Client Component) */}
      <PrakiraanTabs 
        dataDasarian={dataDasarian}
        dataBulanan={dataBulanan}
        dataSifat={dataSifat}
        dataProbabilitas={dataProbabilitas}
      />

    </div>
  );
}