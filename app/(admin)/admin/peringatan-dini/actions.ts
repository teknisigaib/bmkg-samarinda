"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- FETCH DATA ---
export async function getPdieData() {
  const regions = await prisma.pdieRegion.findMany({
    orderBy: { name: 'asc' }
  });

  const meta = await prisma.pdieMeta.findUnique({
    where: { key: "periode_label" }
  });

  const documents = await prisma.pdieDocument.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return {
    regions,
    periodeLabel: meta?.value || "Periode Belum Diatur",
    documents,
  };
}

// --- UPDATE STATUS WILAYAH ---
export async function updateRegionStatus(id: string, type: "HUJAN" | "KEKERINGAN", level: string) {
  const dataToUpdate = type === "HUJAN" ? { rainLevel: level } : { droughtLevel: level };
  
  await prisma.pdieRegion.update({
    where: { id },
    data: dataToUpdate
  });

  revalidatePath("/admin/peringatan-dini");
  revalidatePath("/iklim/peringatan-dini");
}

// --- UPDATE LABEL PERIODE ---
export async function updatePeriodeLabel(newValue: string) {
  await prisma.pdieMeta.upsert({
    where: { key: "periode_label" },
    update: { value: newValue },
    create: { key: "periode_label", value: newValue }
  });

  revalidatePath("/admin/peringatan-dini");
  revalidatePath("/iklim/peringatan-dini");
}

// --- RESET SEMUA STATUS ---
export async function resetAllRegions(type: "HUJAN" | "KEKERINGAN") {
  const dataToUpdate = type === "HUJAN" ? { rainLevel: "AMAN" } : { droughtLevel: "AMAN" };

  await prisma.pdieRegion.updateMany({
    data: dataToUpdate
  });

  revalidatePath("/admin/peringatan-dini");
  revalidatePath("/iklim/peringatan-dini");
}

// --- UPLOAD DOKUMEN ---
export async function uploadDocument(
  title: string, 
  type: string, 
  date: string, 
  fileUrl: string, 
  filePath: string, 
  fileSizeMB: string
) {
  
  await prisma.pdieDocument.create({
    data: {
      title,
      fileUrl,
      filePath, 
      fileSize: fileSizeMB,
      type,
      date,
    }
  });

  revalidatePath("/admin/peringatan-dini");
  revalidatePath("/iklim/peringatan-dini");
}

// Catatan: Fungsi deleteDocument dihapus karena menggunakan global-delete.ts