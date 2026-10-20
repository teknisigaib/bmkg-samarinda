import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const prefix = formData.get("fileNamePrefix") as string || "image";
    
    // 1. Ambil nama folder tujuan (default ke 'berita' kalau kosong)
    const targetFolder = formData.get("folder") as string || "berita";

    if (!file) {
      return NextResponse.json({ success: false, error: "Tidak ada file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Arahkan direktori simpan ke dalam sub-folder spesifik (contoh: public/storage/berita)
    const uploadDir = path.join(process.cwd(), "public", "storage", targetFolder);

    // Buat folder (beserta sub-foldernya) jika belum ada
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now().toString().slice(-6);
    const filename = `${prefix}-${timestamp}.webp`; 
    const filepath = path.join(uploadDir, filename);

    // Simpan file fisik
    await writeFile(filepath, buffer);

    // 3. Format URL yang dikembalikan jadi persis kayak Supabase lama: /storage/berita/nama-file.webp
    const publicUrl = `/storage/${targetFolder}/${filename}`;
    
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("❌ Error API Upload:", error);
    return NextResponse.json({ success: false, error: "Gagal simpan file" }, { status: 500 });
  }
}