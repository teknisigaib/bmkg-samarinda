"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Await cookies() (Standar Next.js 15 / Latest)
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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Error ini diabaikan jika dipanggil dari Server Component
            // Tapi wajib ada strukturnya.
          }
        },
      },
    }
  );

  // Proses Login ke Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Redirect kembali ke login dengan pesan error di URL
    // encodeURIComponent agar URL aman
    return redirect(`/login?error=${encodeURIComponent("Email atau Password Salah")}`);
  }

  // Jika sukses:
  revalidatePath("/", "layout"); // Bersihkan cache
  redirect("/admin"); // Masuk dashboard
}

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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Error ignored
          }
        },
      },
    }
  );

  // Hapus session di server Supabase
  await supabase.auth.signOut();

  // Bersihkan cache agar data lama tidak muncul
  revalidatePath("/", "layout");
  
  // Tendang user kembali ke halaman login
  redirect("/login");
}