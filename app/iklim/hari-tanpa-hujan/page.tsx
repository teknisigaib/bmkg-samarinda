export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import prisma from "@/lib/prisma"; 
import ClimateViewer from "@/components/component-iklim/ClimateViewer";
import { CloudRain } from "lucide-react";

export const metadata: Metadata = {
  title: "Monitoring Hari Tanpa Hujan | BMKG Samarinda",
  description: "Peta sebaran Hari Tanpa Hujan (HTH) berturut-turut di wilayah Kalimantan Timur update per dasarian.",
};

export const revalidate = 60; // Update data setiap 60 detik

// Fungsi ambil data dari Database
async function getHTHData() {
  const data = await prisma.climateData.findMany({
    where: { type: "HTH" }, // Filter tipe HTH saja
    orderBy: { createdAt: "desc" }, // Urutkan dari yang terbaru
    take: 12, // Batasi 12 data terakhir saja (1 tahun arsip cukup untuk preview)
  });

  return data.map((item, index) => ({
    id: item.id,
    title: item.title,
    period: item.period,
    dasarian: item.dasarian,
    bulan: item.bulan,
    image: item.imageUrl,
    analysis: item.content,
    isLatest: index === 0, // Item pertama = Terbaru
  }));
}

export default async function HTHPage() {
  const data = await getHTHData();

  return (
    <div className="w-full space-y-10">

      {/* Konten Dinamis */}
      {data.length > 0 ? (
        <ClimateViewer data={data} />
      ) : (
        /* Tampilan Jika Data Kosong */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <CloudRain className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Belum Ada Data</h3>
            <p className="text-gray-500 mt-1">
                Data monitoring Hari Tanpa Hujan belum tersedia di database.
            </p>
        </div>
      )}

    </div>
  );
}