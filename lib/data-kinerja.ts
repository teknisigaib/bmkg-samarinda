"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface KinerjaDoc {
  id: string;
  title: string;
  category: string;
  year: string;
  fileUrl: string;
  fileSize: string;
}

// GET
export async function getKinerjaDocs() {
  try {
    const data = await prisma.performanceDoc.findMany({
      orderBy: { createdAt: 'desc' }, // Terbaru di atas
    });
    return data;
  } catch (error) {
    console.error("Gagal ambil dokumen:", error);
    return [];
  }
}

// SAVE
export async function saveKinerjaDoc(data: KinerjaDoc) {
  try {
    if (data.id) {
      // Update
      await prisma.performanceDoc.update({
        where: { id: data.id },
        data: {
          title: data.title,
          category: data.category,
          year: data.year,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize
        }
      });
    } else {
      // Create
      await prisma.performanceDoc.create({
        data: {
          title: data.title,
          category: data.category,
          year: data.year,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize || "Unknown"
        }
      });
    }
    revalidatePath("/transparansi/kinerja");
    revalidatePath("/admin/kinerja");
    return { success: true };
  } catch (error) {
    console.error("Gagal simpan:", error);
    return { success: false };
  }
}

// DELETE
export async function deleteKinerjaDoc(id: string) {
  try {
    await prisma.performanceDoc.delete({ where: { id } });
    revalidatePath("/transparansi/kinerja");
    revalidatePath("/admin/kinerja");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}