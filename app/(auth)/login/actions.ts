"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// --- FUNGSI LOGIN ---
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
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
              // MODIFIKASI: Matikan Secure agar jalan di HTTP/VPN
              cookieStore.set(name, value, {
                ...options,
                secure: false, // <--- WAJIB FALSE
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent("Email atau Password Salah")}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

// --- FUNGSI LOGOUT (SIGNOUT) ---
export async function signout() {
  const cookieStore = await cookies();

  // Kita perlu inisialisasi client lagi dengan settingan yang SAMA persis
  // agar server bisa menemukan dan menghapus cookie yang benar.
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
              // MODIFIKASI: Harus sama dengan saat Login
              cookieStore.set(name, value, {
                ...options,
                secure: false, // <--- WAJIB FALSE JUGA
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