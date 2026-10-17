import { NextResponse } from 'next/server'
import { auth } from "@/auth" // Import dari file auth.ts yang baru kita buat

// KONFIGURASI MAINTENANCE
const MAINTENANCE_PATHS: string[] = [
  // '/cuaca/maritim',     
  // '/cuaca/penerbangan',
  //'/cuaca/mahakam',
  //'/cuaca/peta-cuaca',
];

// Bungkus dengan auth() dari Auth.js
export default auth((request) => {
  const { pathname } = request.nextUrl;
  
  // --- 1. LOGIKA MAINTENANCE ---
  const isTargeted = MAINTENANCE_PATHS.some((path) => pathname.startsWith(path));

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

  // --- 2. LOGIKA AUTENTIKASI (Auth.js) ---
  const isLoggedIn = !!request.auth; // Cek apakah user memiliki session aktif
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  // Proteksi rute /admin
  if (isAdminRoute && !isLoggedIn) {
    // Tambahkan ?akses=admin agar langsung menembus cache Cloudflare!
    return NextResponse.redirect(new URL('/login?akses=admin', request.url));
  }

  // Jika sudah login tapi mencoba akses /login, lempar kembali ke /admin
  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
});

export const config = {
  // MATCHER DIPERTAHANKAN
  matcher: [
    '/admin/:path*', 
    '/login',
    '/profil/:path*',
    '/cuaca/:path*',
    '/gempa/:path*',
    '/iklim/:path*',
    '/publikasi/:path*',
    '/layanan',
    '/contact',
  ],
}