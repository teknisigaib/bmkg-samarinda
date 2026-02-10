import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Inisialisasi Response Awal
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. Buat Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Mengambil semua cookies
        getAll() {
          return request.cookies.getAll()
        },
        // Menyimpan semua cookies (PENTING: set di request & response)
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // 3. Cek User Session (Ini akan me-refresh token jika expired)
  const { data: { user } } = await supabase.auth.getUser()

  // --- LOGIKA PROTEKSI ROUTE ---

  // A. Jika mau masuk /admin tapi BELUM login -> Tendang ke /login
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // B. Jika SUDAH login tapi iseng buka /login -> Lempar ke dashboard
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  // Middleware jalan di rute admin dan halaman login saja (hemat resource)
  matcher: ['/admin/:path*', '/login'],
}