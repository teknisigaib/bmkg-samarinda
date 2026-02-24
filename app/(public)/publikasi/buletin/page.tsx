export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import BuletinClient from "@/components/component-publikasi/BuletinClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Arsip Buletin | BMKG Samarinda",
  description: "Unduh buletin cuaca bulanan dan laporan iklim.",
};

// --- HELPER: DETEKSI BULAN DARI TEKS ---
const MONTHS = [
  "januari", "februari", "maret", "april", "mei", "juni", 
  "juli", "agustus", "september", "oktober", "november", "desember"
];

function getMonthIndex(text: string) {
  const lowerText = text.toLowerCase();
  for (let i = 0; i < MONTHS.length; i++) {
    if (lowerText.includes(MONTHS[i])) {
      return i + 1; // Return 1 untuk Januari, 12 untuk Desember
    }
  }
  return 0; // Jika tidak ada nama bulan yang terdeteksi
}

// --- AMBIL & URUTKAN DATA ---
async function getBuletin() {
  const data = await prisma.publication.findMany({
    where: { type: "Buletin" },
    // Ambil default dari yang terbaru di-upload sbg fallback terakhir
    orderBy: { createdAt: "desc" }, 
  });

  // 1. Transformasi data
  const transformedData = data.map((item) => ({
    id: item.id,
    title: item.title,
    edition: item.edition || "",
    year: item.year,
    cover: item.coverUrl || "/placeholder.jpg",
    pdfUrl: item.pdfUrl,
  }));

  // 2. Smart Sorting (Urutkan berdasarkan Tahun, lalu Bulan)
  return transformedData.sort((a, b) => {
    // Bandingkan Tahun (Descending / Terbesar di atas)
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    if (yearA !== yearB) return yearB - yearA;

    // Jika tahunnya sama, Bandingkan Bulannya (Descending / Desember ke Januari)
    // Kita gabungkan teks edisi dan judul agar lebih akurat mendeteksi nama bulan
    const monthA = getMonthIndex(a.edition + " " + a.title);
    const monthB = getMonthIndex(b.edition + " " + b.title);
    if (monthA !== monthB) return monthB - monthA;

    // Jika tahun & bulan sama (atau gagal dideteksi), biarkan urutan bawaan database
    return 0;
  });
}

export default async function BuletinPage() {
  const buletinData = await getBuletin();
  return <BuletinClient initialData={buletinData} />;
}