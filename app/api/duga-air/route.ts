import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.hidrologi.id/duga-air', {
      cache: 'no-store' // Biar datanya selalu real-time
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { error: 'Gagal mengambil data dari server hidrologi' },
      { status: 500 }
    );
  }
}