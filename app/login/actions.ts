"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  // 1. Ambil input dari form
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // 2. Siapkan Cookie Store (Next.js 15 butuh 'await')
  const cookieStore = await cookies();

  // 3. Buat Client Supabase Khusus Server
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 4. Proses Login
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Jika gagal, kembalikan error (redirect dengan query param error)
    return redirect("/login?error=Login Gagal, Cek Email/Password");
  }

  // 5. Jika sukses, refresh path dan lempar ke admin
  revalidatePath("/", "layout");
  redirect("/admin");
}