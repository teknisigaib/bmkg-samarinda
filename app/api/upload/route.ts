import { NextResponse } from "next/server";
import { writeFile, mkdir, chmod } from "fs/promises";
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

    // 1. Buat format tanggal YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`;

    // 2. Buat 4 digit ID acak dari waktu
    const timestamp = Date.now().toString().slice(-4);
    
    // 3. Gabungkan jadi format: 2026-10-20-judul-berita-1234.webp
    // Cari baris ini (sekitar line 35):
    // const filename = `${dateString}-${prefix}-${timestamp}.webp`;
    
    // UBAH MENJADI:
    const ext = file.name.split('.').pop() || "webp"; // Ambil ekstensi asli file
    const filename = `${dateString}-${prefix}-${timestamp}.${ext}`; 
    const filepath = path.join(uploadDir, filename);

    // Simpan file fisik
    await writeFile(filepath, buffer);

    // 🔥 PAKSA PERMISSION JADI 755 BIAR SAMA KAYAK FILE LAMA
    await chmod(filepath, 0o755);

    // 3. Format URL yang dikembalikan jadi persis kayak Supabase lama: /storage/berita/nama-file.webp
    const publicUrl = `/storage/${targetFolder}/${filename}`;
    
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("❌ Error API Upload:", error);
    return NextResponse.json({ success: false, error: "Gagal simpan file" }, { status: 500 });
  }
}