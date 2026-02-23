import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // KONFIGURASI MAINTENANCE
  const MAINTENANCE_PATHS: string[] = [
    // '/cuaca/maritim',     
    // '/cuaca/penerbangan',
  ];

  const { pathname } = request.nextUrl;
  const isTargeted = MAINTENANCE_PATHS.some((path) => pathname.startsWith(path));

  // Logika Redirect Maintenance:
  if (
      isTargeted && 
      !pathname.startsWith('/maintenance') && 
      !pathname.startsWith('/_next') && 
      !pathname.startsWith('/static') &&
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/login')
  ) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // --- AUTH SUPABASE ---
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // FIX: Deteksi apakah request ini dari Domain (HTTPS) atau Lokal/VPN (HTTP)
  const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request: { headers: request.headers } })
            
            response.cookies.set(name, value, {
              ...options,
              secure: isHttps, // <-- DINAMIS: True untuk Domain, False untuk IP Lokal
              httpOnly: true,
              sameSite: 'lax',
              path: '/',       // <-- WAJIB: Agar cookie berlaku di semua halaman (/admin, dll)
            })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ==========================================
  // PERUBAHAN DI SINI: Redirect dengan parameter
  // ==========================================
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    // Tambahkan ?akses=admin agar langsung menembus cache Cloudflare!
    return NextResponse.redirect(new URL('/login?akses=admin', request.url))
  }

  // Baris ini tetap aman, karena request.nextUrl.pathname hanya membaca "/login" 
  // (parameter "?akses=admin" otomatis diabaikan dalam pengecekan string ini)
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  // UPDATE MATCHER
  matcher: [
    '/admin/:path*', 
    '/login',
    '/profil/:path*',
    '/cuaca/:path*',
    '/gempa/:path*',
    '/iklim/:path*',
    '/publikasi/:path*',
  ],
}