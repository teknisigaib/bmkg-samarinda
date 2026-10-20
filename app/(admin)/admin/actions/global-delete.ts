"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

interface DeleteProps {
  id: string;
  model: "post" | "flyer" | "publication" | "pegawai" | "kinerja" | "pdieDocument" | "iklim"; 
  fileUrl?: string | null;
  // bucketName sudah dihapus karena kita pakai storage lokal
  revalidateUrl: string;
}

export async function globalDelete(params: DeleteProps) {
  const { id, model, fileUrl, revalidateUrl } = params;

  try {
    // 1. HAPUS FILE FISIK DI SERVER LOKAL (AAPANEL)
    if (fileUrl && fileUrl.startsWith("/storage/")) {
      // Hilangkan awalan "/storage/" untuk mendapatkan nama file murni
      const fileName = fileUrl.replace("/storage/", "");
      
      // Arahkan langsung ke direktori storage aaPanel lu
      const absolutePath = path.join("/www/wwwroot/storage", fileName);

      try {
        // Hapus file fisiknya
        await fs.unlink(absolutePath);
        console.log(`✅ File fisik terhapus: ${absolutePath}`);
      } catch (fsError: any) {
        // Jika file tidak ditemukan di folder (ENOENT), abaikan agar data DB tetap bisa dihapus
        if (fsError.code !== 'ENOENT') {
          console.error(`❌ Gagal hapus file fisik ${absolutePath}:`, fsError);
        }
      }
    }

    // 2. HAPUS DATA DI DATABASE (PRISMA) 
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
      case "kinerja":
        await prisma.performanceDoc.delete({ where: { id } }); 
        break;
      case "pegawai":
        await prisma.employee.delete({ where: { id } });
        break;
      case "pdieDocument":
        await prisma.pdieDocument.delete({ where: { id } });
        break;
      case "iklim":
        await prisma.climateData.delete({ where: { id } }); 
        break;
      default:
        throw new Error("Tabel/Model tidak dikenali!");
    }

    // 3. REFRESH HALAMAN ADMIN
    revalidatePath(revalidateUrl);
    return { success: true, message: "Data dan file berhasil dihapus!" };

  } catch (error) {
    console.error(`❌ Gagal menghapus data dari model ${model}:`, error);
    return { error: "Terjadi kesalahan sistem saat menghapus data." };
  }
}