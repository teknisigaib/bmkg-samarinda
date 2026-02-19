import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { 
  Newspaper, Users, FileText, ArrowUpRight, Activity,
  CloudRain, CalendarDays, Clock, Image as ImageIcon,
  BarChart3, AlertTriangle, Info, ShieldAlert
} from "lucide-react";

export const dynamic = 'force-dynamic'; 

// Helper untuk sapaan waktu
const getGreeting = () => {
    // Menggunakan waktu lokal Indonesia (WITA/WIB disesuaikan server)
    const hour = new Date().toLocaleString("en-US", { timeZone: "Asia/Makassar", hour: 'numeric', hour12: false });
    const h = parseInt(hour);
    if (h >= 5 && h < 11) return "Selamat Pagi";
    if (h >= 11 && h < 15) return "Selamat Siang";
    if (h >= 15 && h < 18) return "Selamat Sore";
    return "Selamat Malam";
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  
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

  // AMBIL DATA STATISTIK SECARA PARALEL
  const [
    totalBerita,
    totalPublikasi,
    totalFlyerAktif,
    totalDataIklim,
    latestPosts,
    activeWarnings // <-- QUERY BARU: Mencari wilayah status AWAS/SIAGA
  ] = await Promise.all([
    prisma.post.count(), 
    prisma.publication.count(), 
    prisma.flyer.count({ where: { isActive: true } }), 
    prisma.climateData.count(), 
    prisma.post.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true, category: true }
    }),
    // Cari wilayah yang Hujan ATAU Kekeringannya level AWAS / SIAGA
    prisma.pdieRegion.findMany({
        where: {
            OR: [
                { rainLevel: { in: ['AWAS', 'SIAGA'] } },
                { droughtLevel: { in: ['AWAS', 'SIAGA'] } }
            ]
        },
        select: { name: true, rainLevel: true, droughtLevel: true }
    })
  ]);

  const greeting = getGreeting();
  const userName = user?.email?.split("@")[0] || "Admin";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. WELCOME BANNER DINAMIS */}
      <div className="relative bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 rounded-2xl p-8 md:p-10 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
            <CloudRain size={250} />
        </div>
        
        <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
                {greeting}, {userName}! 👋
            </h1>
            <p className="text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed">
                Ini adalah pusat komando Stasiun Meteorologi APT Pranoto. 
                Pantau statistik data, kelola konten website, dan perbarui informasi peringatan dini untuk masyarakat dari sini.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-blue-100">
                <span className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full shadow-inner">
                    <CalendarDays size={16} className="text-blue-200" /> 
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full shadow-inner">
                    <Info size={16} className="text-blue-200" /> Sistem Normal
                </span>
            </div>
        </div>
      </div>

      {/* 2. PANEL PERHATIAN KHUSUS (MUNCUL JIKA ADA PERINGATAN DINI) */}
      {activeWarnings.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-sm flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mt-0.5">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <div>
                  <h3 className="font-bold text-red-800 text-sm uppercase tracking-wider mb-1">Perhatian Khusus: Status Siaga/Awas Aktif</h3>
                  <p className="text-sm text-red-700 mb-2">
                      Terdapat <strong>{activeWarnings.length} wilayah</strong> yang saat ini berstatus Siaga atau Awas. Pastikan informasi publik terkait mitigasi sudah terdistribusi.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                      {activeWarnings.slice(0, 5).map((w, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white text-red-700 border border-red-200 rounded-md text-xs font-bold shadow-sm">
                              {w.name}
                          </span>
                      ))}
                      {activeWarnings.length > 5 && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">
                              +{activeWarnings.length - 5} lainnya
                          </span>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 3. STATISTIK WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md hover:border-blue-300 transition-all group">
              <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Newspaper className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Berita</p>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{totalBerita}</h3>
              </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="p-3 md:p-4 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Publikasi PDF</p>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{totalPublikasi}</h3>
              </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md hover:border-orange-300 transition-all group">
              <div className="p-3 md:p-4 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <BarChart3 className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Data Iklim</p>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{totalDataIklim}</h3>
              </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md hover:border-purple-300 transition-all group">
              <div className="p-3 md:p-4 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <ImageIcon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Banner Aktif</p>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{totalFlyerAktif}</h3>
              </div>
          </div>
      </div>

      {/* 4. DUA KOLOM: AKSES CEPAT & AKTIVITAS TERBARU */}
      {/* ... (KODE KOLOM INI SAMA PERSIS DENGAN SEBELUMNYA, TIDAK ADA YANG DIUBAH) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" /> Akses Cepat (Jalan Pintas)
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/admin/berita" className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Newspaper className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 flex items-center justify-between">
                              Kelola Berita <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Upload berita kegiatan dan artikel terbaru stasiun.</p>
                      </div>
                  </Link>

                  <Link href="/admin/peringatan-dini" className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-300 transition-all group flex flex-col gap-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                          <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 flex items-center justify-between">
                              Peringatan Dini <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Update status waspada/siaga hujan & kekeringan.</p>
                      </div>
                  </Link>

                  <Link href="/admin/publikasi" className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 flex items-center justify-between">
                              Upload Buletin <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Publikasi PDF bulanan, majalah, atau SOP baru.</p>
                      </div>
                  </Link>

                  <Link href="/admin/pegawai" className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all group flex flex-col gap-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Users className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 flex items-center justify-between">
                              Data Pegawai <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Manajemen foto profil dan jabatan staff & pimpinan.</p>
                      </div>
                  </Link>
              </div>
          </div>

          <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" /> Log Berita Terbaru
              </h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  {latestPosts.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-8">Belum ada berita yang diupload.</p>
                  ) : (
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                          {latestPosts.map((post, i) => (
                              <div key={post.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                  <div className="flex items-center justify-center w-7 h-7 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                  
                                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                      <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">{post.category}</span>
                                          <span className="text-[10px] text-slate-400 font-medium">
                                              {new Date(post.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                          </span>
                                      </div>
                                      <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{post.title}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                  
                  {latestPosts.length > 0 && (
                      <Link href="/admin/berita" className="mt-6 block w-full text-center text-sm font-bold text-blue-600 hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl">
                          Lihat Semua Berita &rarr;
                      </Link>
                  )}
              </div>
          </div>
      </div>

    </div>
  );
}