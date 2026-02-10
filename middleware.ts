import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

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
            // --- BAGIAN INI YANG PENTING ---
            request.cookies.set(name, value)
            response = NextResponse.next({ request: { headers: request.headers } })
            
            // Kita TIMPA opsi bawaan Supabase
            response.cookies.set(name, value, {
              ...options,
              secure: false, // <--- WAJIB FALSE agar mau jalan di HTTP/VPN
              httpOnly: true,
              sameSite: 'lax',
            })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}