"use server";

import prisma from "@/lib/prisma"; // Import helper yang kita buat di langkah 2
import { revalidatePath } from "next/cache";

// Kita sesuaikan Type dengan yang dibutuhkan Frontend
export interface Pegawai {
  id: string;
  name: string;
  position: string;
  group: "Pimpinan" | "Struktural" | "Fungsional";
  image: string;
}

// --- 1. GET (READ) ---
export async function getPegawai() {
  try {
    const data = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'asc', // Urutkan dari yang pertama dibuat
      },
    });

    // Mapping data Prisma ke Interface Frontend
    // (Prisma mengembalikan null untuk image, tapi frontend butuh string kosong jika tidak ada)
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      group: p.group as "Pimpinan" | "Struktural" | "Fungsional", // Type casting
      image: p.image || "", // Handle null
    }));
  } catch (error) {
    console.error("Gagal ambil data pegawai:", error);
    return [];
  }
}

// --- 2. SAVE (CREATE / UPDATE) ---
export async function savePegawai(data: Pegawai) {
  try {
    if (data.id) {
      // --- UPDATE (Jika ada ID) ---
      await prisma.employee.update({
        where: { id: data.id },
        data: {
          name: data.name,
          position: data.position,
          group: data.group,
          image: data.image,
        },
      });
    } else {
      // --- CREATE (Jika ID kosong) ---
      await prisma.employee.create({
        data: {
          name: data.name,
          position: data.position,
          group: data.group,
          image: data.image,
        },
      });
    }

    // Refresh halaman agar data baru langsung muncul
    revalidatePath("/admin/pegawai"); 
    revalidatePath("/profil/daftar-pegawai");
    return { success: true };

  } catch (error) {
    console.error("Gagal simpan pegawai:", error);
    return { success: false, error: "Gagal menyimpan data" };
  }
}

// --- 3. DELETE ---
export async function deletePegawai(id: string) {
  try {
    await prisma.employee.delete({
      where: { id },
    });

    revalidatePath("/admin/pegawai");
    revalidatePath("/profil/daftar-pegawai");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus pegawai:", error);
    return { success: false };
  }
}