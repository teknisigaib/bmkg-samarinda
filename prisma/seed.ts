import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. BERSIHKAN DATA LAMA
  await prisma.post.deleteMany()
  await prisma.publication.deleteMany()

  // 2. SEED BERITA (Post)
  const posts = [
    {
      title: "BMKG Samarinda Gelar Sekolah Lapang Cuaca Nelayan 2024",
      slug: "slcn-2024",
      category: "Kegiatan",
      excerpt: "Meningkatkan pemahaman nelayan terhadap informasi cuaca maritim demi keselamatan pelayaran.",
      content: "<p>Isi berita lengkap...</p>",
      imageUrl: "https://images.unsplash.com/photo-1524591434253-02c28771a95d?q=80&w=2070&auto=format&fit=crop",
      author: "Humas",
      isFeatured: true,
    },
    {
      title: "Waspada Potensi Hujan Lebat Disertai Angin Kencang",
      slug: "waspada-hujan-lebat",
      category: "Berita",
      excerpt: "Analisis dinamika atmosfer menunjukkan adanya belokan angin yang memicu pertumbuhan awan hujan.",
      content: "<p>Isi berita...</p>",
      imageUrl: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=1000&auto=format&fit=crop",
      author: "Forecaster",
      isFeatured: false,
    },
  ]

  for (const post of posts) {
    await prisma.post.create({ data: post })
  }

  // 3. SEED PUBLIKASI (Buletin, Artikel, Makalah)
  const publications = [
    // --- BULETIN ---
    {
      type: "Buletin",
      title: "Buletin Analisis Hujan & Prakiraan Hujan Bulanan",
      year: "2024",
      edition: "November 2024",
      coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
      author: "Stasiun Klimatologi",
      tags: ["Hujan", "Bulanan"],
    },
    {
      type: "Buletin",
      title: "Buletin Cuaca Maritim & Penerbangan",
      year: "2024",
      edition: "Oktober 2024",
      coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
      author: "Stasiun Meteorologi",
      tags: ["Maritim", "Penerbangan"],
    },
    
    // --- ARTIKEL ---
    {
      type: "Artikel",
      title: "Mengenal Fenomena La Nina dan Dampaknya",
      year: "2024",
      abstract: "La Nina bukan sekadar hujan lebat biasa. Pahami mekanisme pendinginan suhu muka laut Pasifik.",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
      author: "Dr. Asep Meteorologi",
      tags: ["Iklim", "Fenomena"],
    },

    // --- MAKALAH ---
    {
      type: "Makalah",
      title: "Verifikasi Akurasi Prediksi Curah Hujan Model WRF-ARW",
      year: "2023",
      abstract: "Penelitian ini bertujuan untuk mengevaluasi performa model Weather Research and Forecasting (WRF).",
      pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
      author: "Tim Riset BMKG",
      tags: ["Model Numerik", "Verifikasi"],
    },
  ]

  for (const pub of publications) {
    await prisma.publication.create({ data: pub })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })