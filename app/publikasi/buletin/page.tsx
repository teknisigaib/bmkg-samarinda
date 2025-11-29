import type { Metadata } from "next";
import BuletinClient from "@/components/component-publikasi/BuletinClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Arsip Buletin | BMKG Samarinda",
  description: "Unduh buletin cuaca bulanan dan laporan iklim.",
};

// Ambil data hanya yang bertipe 'Buletin'
async function getBuletin() {
  const data = await prisma.publication.findMany({
    where: { type: "Buletin" },
    orderBy: { createdAt: "desc" },
  });

  // Transformasi data agar sesuai dengan props Client Component
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    edition: item.edition || "",
    year: item.year,
    cover: item.coverUrl || "/placeholder.jpg",
    pdfUrl: item.pdfUrl,
  }));
}

export default async function BuletinPage() {
  const buletinData = await getBuletin();
  return <BuletinClient initialData={buletinData} />;
}