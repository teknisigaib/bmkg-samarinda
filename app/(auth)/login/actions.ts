// actions.ts
"use server";

import { signIn, signOut } from "@/auth"; // Sesuaikan path ke auth.ts
import { AuthError } from "next-auth";

// --- KONFIGURASI RATE LIMIT ---
const MAX_ATTEMPTS = 5;
const WINDOW_TIME = 15 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; firstAttemptTime: number }>();

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    return true; 
  }
  if (now - record.firstAttemptTime > WINDOW_TIME) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    return true; 
  }
  if (record.count >= MAX_ATTEMPTS) return false;
  record.count += 1;
  return true; 
}

// --- FUNGSI LOGIN ---
export async function login(formData: FormData) {
  // 1. Ambil Data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // (Opsional) Ambil IP untuk Rate Limit. Di Next.js 14/15, headers() bersifat async.
  // Jika kode ini error, gunakan library headers bawaan Next.js
  const ip = "unknown-ip"; 
  const isAllowed = await checkRateLimit(ip);
  
  if (!isAllowed) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." };
  }

  // 2. Eksekusi Login via Auth.js
  try {
    // redirect: false agar kita bisa nangkep error-nya tanpa dilempar Next.js
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin", // Otomatis dilempar ke /admin kalau sukses
    });
  } catch (error) {
    // Auth.js melempar tipe AuthError kalau gagal
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Kredensial tidak valid. Periksa kembali email dan password." };
        default:
          return { error: "Terjadi kesalahan pada sistem autentikasi." };
      }
    }
    throw error; // Wajib di-throw agar fitur redirect Auth.js bekerja
  }
}

// --- FUNGSI LOGOUT ---
export async function signout() {
  await signOut({ redirectTo: "/login" });
}