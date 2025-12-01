"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- CREATE ---
export async function createClimateData(formData: FormData) {
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const period = formData.get("period") as string;
  const dasarian = formData.get("dasarian") as string;
  const bulan = formData.get("bulan") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.climateData.create({
    data: {
      type,
      title,
      period,
      dasarian,
      bulan,
      content,
      imageUrl,
    },
  });

  // Revalidate halaman publik terkait
  if (type === "HTH") revalidatePath("/iklim/hari-tanpa-hujan");
  // Tambahkan revalidate lain nanti

  revalidatePath("/admin/iklim/hth");
  redirect("/admin/iklim/hth");
}

// --- UPDATE ---
export async function updateClimateData(id: string, formData: FormData) {
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const period = formData.get("period") as string;
  const dasarian = formData.get("dasarian") as string;
  const bulan = formData.get("bulan") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.climateData.update({
    where: { id },
    data: {
      title, period, dasarian, bulan, content, imageUrl
    },
  });

  if (type === "HTH") revalidatePath("/iklim/hari-tanpa-hujan");
  revalidatePath("/admin/iklim/hth");
  redirect("/admin/iklim/hth");
}

// --- DELETE ---
export async function deleteClimateData(id: string) {
  await prisma.climateData.delete({ where: { id } });
  revalidatePath("/iklim/hari-tanpa-hujan");
  revalidatePath("/admin/iklim/hth");
}