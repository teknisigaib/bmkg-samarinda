import prisma from "@/lib/prisma";
import ClimateProductsSection from "./ClimateProductsSection";

export default async function ClimateProductsWrapper() {
  try {
    const climateData = await prisma.climateData.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const formattedData = climateData.map((item) => {
      // Normalisasi teks ke huruf besar agar pengecekan tidak meleset
      const typeKey = (item.type || "").toUpperCase();
      
      let categoryLabel = item.type || "Produk Iklim";
      let targetSlug = "/iklim";

      // LOGIKA "JIKA MENGANDUNG" (FUZZY MATCHING)
      if (typeKey.includes("HARI TANPA HUJAN") || typeKey.includes("HTH")) {
        categoryLabel = "Monitoring Hari Tanpa Hujan";
        targetSlug = "/iklim/hari-tanpa-hujan";
      } 
      else if (typeKey.includes("PRAKIRAAN")) {
        categoryLabel = "Prakiraan Curah Hujan";
        targetSlug = "/iklim/prakiraan-hujan";
      } 
      else if (typeKey.includes("ANALISIS")) {
        categoryLabel = "Analisis Curah Hujan";
        targetSlug = "/iklim/analisis-hujan";
      }

      return {
        id: item.id,
        category: categoryLabel,
        title: item.title,
        // Pastikan ada spasi pada dasarian dan bulan
        date: item.period || `${item.dasarian || ''} ${item.bulan || ''}`.trim() || "Terbaru",
        imageUrl: item.imageUrl || "/placeholder.jpg",
        slug: targetSlug,
        dasarian: item.dasarian
      };
    });

    return <ClimateProductsSection data={formattedData} />;
  } catch (error) {
    console.error("Gagal memuat Produk Iklim:", error);
    return null;
  }
}