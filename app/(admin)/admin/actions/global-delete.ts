"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js"; 

interface DeleteProps {
  id: string;
  model: "post" | "flyer" | "publication" | "pegawai" | "kinerja" | "pdieDocument" | "iklim"; 
  fileUrl?: string | null;
  bucketName?: string;
  revalidateUrl: string;
}

export async function globalDelete(params: DeleteProps) {
  const { id, model, fileUrl, bucketName, revalidateUrl } = params;

  try {
    // ==========================================
    // 1. HAPUS FILE DI STORAGE DENGAN KUNCI DEWA
    // ==========================================
    if (fileUrl && bucketName && fileUrl.includes("supabase.co")) {
      const basePath = `/storage/v1/object/public/${bucketName}/`;
      const filePath = fileUrl.includes(basePath) ? fileUrl.split(basePath)[1] : null;

      if (filePath) {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY! 
        );

        const { error } = await supabaseAdmin.storage.from(bucketName).remove([filePath]);
        if (error) console.error("❌ Gagal hapus file Storage:", error.message);
      }
    }

    // ==========================================
    // 2. HAPUS DATA DI DATABASE (PRISMA)
    // ==========================================
    switch (model) {
      case "post":
        await prisma.post.delete({ where: { id } });
        break;
      case "flyer":
        await prisma.flyer.delete({ where: { id } });
        break;
      case "publication":
        await prisma.publication.delete({ where: { id } });
        break;

      // 2. TAMBAHKAN CASE KINERJA DI SINI
      case "kinerja":
        // Sesuaikan "kinerjaDoc" dengan nama model di schema.prisma Anda
        await prisma.performanceDoc.delete({ where: { id } }); 
        break;

        case "pegawai":
        await prisma.employee.delete({ where: { id } }); // Sesuaikan "pegawai" dengan nama model di schema.prisma
        break;

        case "pdieDocument":
        await prisma.pdieDocument.delete({ where: { id } });
        break;

        case "iklim":
        await prisma.climateData.delete({ where: { id } }); // Sesuaikan dengan nama model Prisma Anda
        break;

      default:
        throw new Error("Tabel tidak dikenali!");
    }

    // ==========================================
    // 3. REFRESH HALAMAN ADMIN
    // ==========================================
    revalidatePath(revalidateUrl);
    return { success: true, message: "Data dan file berhasil dihapus!" };

  } catch (error) {
    console.error(`❌ Gagal menghapus ${model}:`, error);
    return { error: "Terjadi kesalahan sistem saat menghapus data." };
  }
}