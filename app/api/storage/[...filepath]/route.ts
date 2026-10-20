import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// 🔥 Ubah parameter kedua menjadi context: any
export async function GET(req: Request, context: any) {
  try {
    // Ambil params dengan aman
    const params = await context.params; 
    const fileName = Array.isArray(params?.filepath) ? params.filepath.join('/') : params?.filepath;
    
    // 🔥 DETEKSI LINGKUNGAN: LOKAL VS VPS
    const isLocal = process.env.NODE_ENV !== "production";
    
    const baseDir = isLocal 
      ? path.join(process.cwd(), "public/storage") 
      : "/www/wwwroot/storage";

    const absolutePath = path.join(baseDir, fileName);

    if (!existsSync(absolutePath)) {
      return new NextResponse('File tidak ditemukan', { status: 404 });
    }

    const fileBuffer = await fs.readFile(absolutePath);
    const ext = path.extname(fileName).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.pdf') contentType = 'application/pdf';

    // Ubah bagian ini
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error saat membaca file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}