import type { Metadata } from "next";
import PublikasiListClient from "@/components/component-publikasi/PublikasiListClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Artikel & Makalah | BMKG Samarinda",
  description: "Repository publikasi ilmiah dan artikel populer.",
};

async function getPublikasi() {
  // Ambil data yang tipenya 'Artikel' ATAU 'Makalah'
  const data = await prisma.publication.findMany({
    where: {
      type: { in: ["Artikel", "Makalah"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return data.map((item) => ({
    id: item.id,
    type: item.type as "Artikel" | "Makalah",
    title: item.title,
    author: item.author,
    year: item.year,
    tags: item.tags,
    abstract: item.abstract || "",
    cover: item.coverUrl || undefined, // undefined biar tidak muncul kalau kosong
    pdfUrl: item.pdfUrl,
  }));
}

export default async function ArtikelMakalahPage() {
  const publikasiData = await getPublikasi();
  return <PublikasiListClient initialData={publikasiData} />;
}