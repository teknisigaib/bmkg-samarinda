import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { filepath: string[] } }) {
  try {
    const fileName = params.filepath.join('/');
    
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

    return new NextResponse(fileBuffer, {
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