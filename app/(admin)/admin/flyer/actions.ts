"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- 1. TAMBAH FLYER BARU ---
export async function createFlyer(formData: FormData) {
  // Ambil data dari form yang dikirim
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const imageUrl = formData.get("imageUrl") as string; // URL gambar dari Supabase

  // Validasi sederhana
  if (!title || !imageUrl) {
    return { error: "Judul dan Gambar wajib diisi." };
  }

  try {
    // Simpan ke Database
    await prisma.flyer.create({
      data: {
        title,
        link,
        image: imageUrl,
        isActive: true, // Default langsung aktif
      },
    });

    // Refresh Homepage dan Admin Flyer
    revalidatePath("/"); 
    revalidatePath("/admin/flyer"); 
    
    return { success: true };
  } catch (error) {
    console.error("Gagal membuat flyer:", error);
    return { error: "Gagal menyimpan ke database." };
  }
}

// --- 2. UBAH STATUS (AKTIF/NON-AKTIF) ---
export async function toggleFlyerStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.flyer.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    
    revalidatePath("/");
    revalidatePath("/admin/flyer");
    return { success: true };
  } catch (error) {
    return { error: "Gagal update status." };
  }
}

// Catatan: Fungsi deleteFlyer dihapus karena sudah digantikan oleh global-delete.ts