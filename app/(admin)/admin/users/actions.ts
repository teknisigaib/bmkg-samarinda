"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth"; // Pastikan path ke auth.ts benar

export async function createUser(formData: FormData) {
  // 1. Cek Autentikasi (Proteksi ganda di sisi server)
  const session = await auth();
  if (!session?.user) {
    return { error: "Akses ditolak. Anda harus login untuk menambah user." };
  }

  // 2. Ambil data dari form
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 3. Validasi dasar
  if (!name || !email || !password) {
    return { error: "Semua kolom wajib diisi." };
  }
  if (password !== confirmPassword) {
    return { error: "Password dan Konfirmasi Password tidak cocok." };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  try {
    // 4. Cek apakah email sudah terdaftar di DB
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email ini sudah terdaftar. Gunakan email lain." };
    }

    // 5. HASH PASSWORD (SANGAT PENTING!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Simpan ke database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    return { success: true, message: "Pengguna berhasil ditambahkan!" };

  } catch (error) {
    console.error("Gagal membuat user:", error);
    return { error: "Terjadi kesalahan internal pada server." };
  }
}