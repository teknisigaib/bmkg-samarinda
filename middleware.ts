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

  // Logika Redirect:
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

  // AUTH SUPABASE
  
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
            request.cookies.set(name, value)
            response = NextResponse.next({ request: { headers: request.headers } })
            
            response.cookies.set(name, value, {
              ...options,
              secure: false,
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