import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { 
  Newspaper, 
  Users, 
  FileText, 
  ArrowUpRight, 
  Activity,
  CloudRain,
  CalendarDays,
  Clock
} from "lucide-react";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  
  // 1. Ambil User Login untuk Sapaan
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-8 text-white shadow-lg overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
            <CloudRain size={200} />
        </div>
        
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
                Selamat Datang, {user?.email?.split("@")[0] || "Admin"}! 👋
            </h1>
            <p className="text-blue-100 max-w-xl">
                Ini adalah panel kontrol Stasiun Meteorologi APT Pranoto. 
                Pantau data, kelola konten, dan perbarui informasi publik dari sini.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm font-medium text-blue-100">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <CalendarDays size={16} /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
