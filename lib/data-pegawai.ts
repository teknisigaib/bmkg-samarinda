"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface Pegawai {
  id: string;
  name: string;
  position: string;
  group: "Pimpinan" | "Struktural" | "Fungsional";
  image: string;
}

// GET (READ) 
export async function getPegawai() {
  try {
    const data = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'asc', 
      },
    });

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      group: p.group as "Pimpinan" | "Struktural" | "Fungsional", 
      image: p.image || "", 
    }));
  } catch (error) {
    console.error("Gagal ambil data pegawai:", error);
    return [];
  }
}

// SAVE (CREATE / UPDATE) 
export async function savePegawai(data: Pegawai) {
  try {
    if (data.id) {
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
      //  CREATE 
      await prisma.employee.create({
        data: {
          name: data.name,
          position: data.position,
          group: data.group,
          image: data.image,
        },
      });
    }

    revalidatePath("/admin/pegawai"); 
    revalidatePath("/profil/daftar-pegawai");
    return { success: true };

  } catch (error) {
    console.error("Gagal simpan pegawai:", error);
    return { success: false, error: "Gagal menyimpan data" };
  }
}

//  DELETE 
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