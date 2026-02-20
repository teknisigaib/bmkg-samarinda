"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

// --- KONFIGURASI RATE LIMIT ---
const MAX_ATTEMPTS = 5;          // Maksimal 5x percobaan
const WINDOW_TIME = 15 * 60 * 1000; // Dalam waktu 15 Menit

// Penyimpanan sementara di Memori Server (Map)
const loginAttempts = new Map<string, { count: number; firstAttemptTime: number }>();

// --- HELPER: CEK RATE LIMIT ---
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

  if (record.count >= MAX_ATTEMPTS) {
    return false; // DITOLAK
  }

  record.count += 1;
  return true; 
}

// --- FUNGSI LOGIN ---
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // 1. Ambil IP Address User & Protokol
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown-ip";
  
  // FIX: Cek apakah Nginx meneruskan request via HTTPS
  const isHttps = headerList.get("x-forwarded-proto") === "https" || headerList.get("origin")?.startsWith("https://") || false;

  // 2. Cek Rate Limit Sebelum ke Database
  const isAllowed = await checkRateLimit(ip);
  
  if (!isAllowed) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return redirect(`/login?error=${encodeURIComponent("Terlalu banyak percobaan. Coba lagi dalam 15 menit.")}`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                secure: isHttps, // <-- DINAMIS SESUAI JARINGAN
                httpOnly: true,
                sameSite: 'lax',
                path: '/',       // <-- WAJIB ADA
              });
            });
          } catch {
            // Error ignored
          }
        },
      },
    }
  );

  // 3. Proses Login Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return redirect(`/login?error=${encodeURIComponent("Email atau Password Salah")}`);
  }

  // 4. Jika Sukses, Reset Rate Limit
  if (loginAttempts.has(ip)) {
    loginAttempts.delete(ip);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

// --- FUNGSI LOGOUT ---
export async function signout() {
  const cookieStore = await cookies();
  const headerList = await headers();
  const isHttps = headerList.get("x-forwarded-proto") === "https" || headerList.get("origin")?.startsWith("https://") || false;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                secure: isHttps, // <-- DINAMIS SESUAI JARINGAN
                httpOnly: true,
                sameSite: 'lax',
                path: '/',       // <-- WAJIB ADA
              });
            });
          } catch {
            // Error ignored
          }
        },
      },
    }
  );

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}