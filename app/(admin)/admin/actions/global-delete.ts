"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

interface DeleteProps {
  id: string;
  model: "post" | "flyer" | "publication" | "pegawai" | "kinerja" | "pdieDocument" | "iklim"; 
  fileUrl?: string | null;
  revalidateUrl: string;
}

// Helper untuk menghapus file lokal di dalam container Docker
async function deleteLocalFile(fileUrl?: string | null) {
  if (!fileUrl || !fileUrl.startsWith("/storage/")) return;

  try {
    // Hilangkan awalan "/storage/" -> contoh: "berita/2026-10-20-judul-1234.webp"
    const relativePath = fileUrl.replace("/storage/", "");

    // Arahkan ke folder internal container (/app/public/storage)
    const absolutePath = path.join(process.cwd(), "public", "storage", relativePath);

    await fs.unlink(absolutePath);
    console.log(`✅ File fisik terhapus: ${absolutePath}`);
  } catch (fsError: any) {
    if (fsError.code !== 'ENOENT') {
      console.error(`❌ Gagal hapus file fisik (${fileUrl}):`, fsError);
    }
  }
}

export async function globalDelete(params: DeleteProps) {
  const { id, model, fileUrl, revalidateUrl } = params;

  try {
    // 1. KHUSUS PUBLIKASI: Hapus PDF dan Cover sekaligus dari DB & Storage
    if (model === "publication") {
      const pubData = await prisma.publication.findUnique({
        where: { id },
        select: { pdfUrl: true, coverUrl: true }
      });

      if (pubData) {
        await deleteLocalFile(pubData.pdfUrl);
        await deleteLocalFile(pubData.coverUrl);
      }
    } else {
      // 2. UNTUK MODEL LAIN: Hapus file fisik sesuai fileUrl yang dikirim
      await deleteLocalFile(fileUrl);
    }

    // 3. HAPUS DATA DI DATABASE (PRISMA) 
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

    // 4. REFRESH HALAMAN ADMIN
    revalidatePath(revalidateUrl);
    return { success: true, message: "Data dan file berhasil dihapus!" };

  } catch (error) {
    console.error(`❌ Gagal menghapus data dari model ${model}:`, error);
    return { error: "Terjadi kesalahan sistem saat menghapus data." };
  }
}