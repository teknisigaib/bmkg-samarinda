"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- CREATE BERITA ---
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  // 1. Ambil Input Tanggal Manual
  const dateInput = formData.get("date") as string;
  const createdAt = dateInput ? new Date(dateInput) : new Date();

  // Buat slug
  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  await prisma.post.create({
    data: {
      title,
      slug: `${slug}-${Date.now()}`,
      category,
      excerpt,
      content,
      imageUrl,
      author: author || "Admin BMKG",
      isFeatured: false,
      createdAt: createdAt, // <-- Simpan Tanggal Manual
    },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/publikasi/berita-kegiatan");
  // return success object, JANGAN redirect
  return { success: true };
}

// --- UPDATE BERITA ---
export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  // 1. Ambil Input Tanggal Manual
  const dateInput = formData.get("date") as string;
  const createdAt = dateInput ? new Date(dateInput) : undefined; 

  await prisma.post.update({
    where: { id },
    data: {
      title,
      category,
      excerpt,
      content,
      imageUrl,
      author,
      createdAt: createdAt, // <-- Update Tanggal
    },
  });

  revalidatePath("/admin/berita");
  revalidatePath(`/publikasi/berita-kegiatan/${id}`); 
  return { success: true };
}

// --- DELETE BERITA ---
export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/berita");
}

// --- TOGGLE FEATURED ---
export async function setFeatured(id: string) {
  await prisma.post.updateMany({ data: { isFeatured: false } });
  await prisma.post.update({ where: { id }, data: { isFeatured: true } });
  revalidatePath("/admin/berita");
}

// ==========================================
// ACTIONS UNTUK PUBLIKASI (Buletin/Artikel)
// ==========================================

export async function createPublication(formData: FormData) {
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const year = formData.get("year") as string;
  const edition = formData.get("edition") as string;
  const abstract = formData.get("abstract") as string;
  const pdfUrl = formData.get("pdfUrl") as string;
  const coverUrl = formData.get("coverUrl") as string;
  
  // Proses Tags (Pisahkan koma menjadi array)
  // Contoh input: "Iklim, Hujan, Banjir" -> ["Iklim", "Hujan", "Banjir"]
  const tagsInput = formData.get("tags") as string;
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : [];

  await prisma.publication.create({
    data: {
      type,
      title,
      author,
      year,
      edition: edition || null, // Jika kosong set null
      abstract: abstract || null,
      tags: tags,
      pdfUrl,
      coverUrl: coverUrl || null,
    },
  });

  // Refresh cache
  revalidatePath("/publikasi/buletin");
  revalidatePath("/publikasi/artikel"); // atau /makalah
  revalidatePath("/admin/publikasi");
  redirect("/admin/publikasi");
}

export async function updatePublication(id: string, formData: FormData) {
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const year = formData.get("year") as string;
  const edition = formData.get("edition") as string;
  const abstract = formData.get("abstract") as string;
  const pdfUrl = formData.get("pdfUrl") as string;
  const coverUrl = formData.get("coverUrl") as string;
  const tagsInput = formData.get("tags") as string;
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : [];

  await prisma.publication.update({
    where: { id },
    data: {
      type, title, author, year,
      edition: edition || null,
      abstract: abstract || null,
      tags,
      pdfUrl,
      coverUrl: coverUrl || null,
    },
  });

  revalidatePath("/publikasi/buletin");
  revalidatePath("/publikasi/artikel");
  revalidatePath("/admin/publikasi");
  redirect("/admin/publikasi");
}

export async function deletePublication(id: string) {
  await prisma.publication.delete({ where: { id } });
  revalidatePath("/publikasi/buletin");
  revalidatePath("/publikasi/artikel");
  revalidatePath("/admin/publikasi");
}