"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

// --- KONFIGURASI RATE LIMIT ---
const MAX_ATTEMPTS = 5;          // Maksimal 5x percobaan
const WINDOW_TIME = 15 * 60 * 1000; // Dalam waktu 15 Menit

// Penyimpanan sementara di Memori Server (Map)
// Key: IP Address, Value: { count, firstAttemptTime }
const loginAttempts = new Map<string, { count: number; firstAttemptTime: number }>();

// --- HELPER: CEK RATE LIMIT ---
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Jika belum ada record, buat baru
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    return true; // Boleh lanjut
  }

  // Jika waktu jendela (15 menit) sudah lewat, reset hitungan
  if (now - record.firstAttemptTime > WINDOW_TIME) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    return true; // Boleh lanjut
  }

  // Jika masih dalam jendela waktu, cek jumlah percobaan
  if (record.count >= MAX_ATTEMPTS) {
    return false; // DITOLAK (Terlalu banyak mencoba)
  }

  // Tambah hitungan percobaan
  record.count += 1;
  return true; // Boleh lanjut
}

// --- FUNGSI LOGIN ---
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // 1. Ambil IP Address User
  const headerList = await headers();
  // x-forwarded-for biasanya dipakai jika di balik proxy/load balancer (Docker/Nginx)
  const ip = headerList.get("x-forwarded-for") || "unknown-ip";

  // 2. Cek Rate Limit Sebelum ke Database
  const isAllowed = await checkRateLimit(ip);
  
  if (!isAllowed) {
    // Jika kena limit, jangan panggil Supabase. Langsung tolak.
    // Opsional: Tambah delay 2 detik biar hacker kesal
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
              // TETAP PERTAHANKAN SETTINGAN VPN ANDA
              cookieStore.set(name, value, {
                ...options,
                secure: false, // Wajib false untuk HTTP/VPN
                httpOnly: true,
                sameSite: 'lax',
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
    // --- TEKNIK PERLAMBATAN (Artificial Delay) ---
    // Jika password salah, tahan 2 detik. 
    // Ini mencegah serangan timing attack dan memperlambat brute force.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return redirect(`/login?error=${encodeURIComponent("Email atau Password Salah")}`);
  }

  // 4. Jika Sukses, Hapus Record Rate Limit (Reset)
  // Agar user yang asli tidak terblokir jika login sukses
  if (loginAttempts.has(ip)) {
    loginAttempts.delete(ip);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

// --- FUNGSI LOGOUT (Tetap Sama) ---
export async function signout() {
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
                secure: false, // Wajib false
                httpOnly: true,
                sameSite: 'lax',
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