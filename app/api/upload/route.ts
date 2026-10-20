import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const prefix = formData.get("fileNamePrefix") as string || "image";

    if (!file) return NextResponse.json({ success: false, error: "Tidak ada file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🔥 DETEKSI LINGKUNGAN: LOKAL VS VPS
    const isLocal = process.env.NODE_ENV !== "production";
    
    // Jika lokal, simpan di folder public/storage. Jika VPS, simpan di aaPanel.
    const uploadDir = isLocal 
      ? path.join(process.cwd(), "public/storage") 
      : "/www/wwwroot/storage";

    // Pastikan folder ada
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now().toString().slice(-6);
    const filename = `${prefix}-${timestamp}.webp`; 
    const filepath = path.join(uploadDir, filename);

    // Simpan file fisik
    await writeFile(filepath, buffer);

    const publicUrl = `/storage/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("❌ Error API Upload:", error);
    return NextResponse.json({ success: false, error: "Gagal simpan file" }, { status: 500 });
  }
}