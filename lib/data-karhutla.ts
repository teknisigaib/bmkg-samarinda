"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface HotspotData {
  id: string;
  lat: number;
  lng: number;
  conf: number;
  district: string;
  subDistrict: string;
  satellite: string;
  date: string;
}

// GET (Public)
export async function getHotspots() {
  try {
    const data = await prisma.hotspot.findMany({
      orderBy: { date: 'desc' },
      take: 500 // Batasi agar peta tidak berat jika data ribuan
    });
    
    return data.map(h => ({
      id: h.id,
      lat: h.latitude,
      lng: h.longitude,
      conf: h.confidence || 0,
      district: h.district,
      subDistrict: h.subDistrict,
      satellite: h.satellite,
      date: h.date.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("Gagal ambil hotspot:", error);
    return [];
  }
}

// BULK INSERT (Admin)
// Menerima string mentah dari Excel/TSV
export async function importHotspots(rawData: string) {
  try {
    // 1. Hapus data lama (Opsional: agar peta selalu fresh hari ini)
    // await prisma.hotspot.deleteMany({}); 
    
    // 2. Parsing Data
    const rows = rawData.trim().split('\n');
    const validData = [];

    for (const row of rows) {
      // Asumsi format: Long | Lat | Conf | Region | Prov | Kab | Kec | Sat | Date | Time ...
      // Split by Tab (\t) atau Spasi berulang
      const cols = row.split(/\t/); 
      
      if (cols.length < 8) continue; // Skip baris rusak

      const lng = parseFloat(cols[0]); // Longitude biasanya kolom pertama di data Sipongi
      const lat = parseFloat(cols[1]);
      const conf = parseInt(cols[2]) || 0;
      const prov = cols[4];
      const kab = cols[5];
      const kec = cols[6];
      const sat = cols[7];
      const dateStr = cols[8]; // YYYY-MM-DD

      // Filter hanya Kaltim (jaga-jaga admin copas semua Kalimantan)
      if (prov?.includes("TIMUR") && !isNaN(lat) && !isNaN(lng)) {
        validData.push({
          latitude: lat,
          longitude: lng,
          confidence: conf,
          province: prov,
          district: kab,
          subDistrict: kec,
          satellite: sat,
          date: new Date(dateStr)
        });
      }
    }

    if (validData.length === 0) return { success: false, msg: "Tidak ada data valid ditemukan." };

    // 3. Simpan ke Database
    await prisma.hotspot.createMany({
      data: validData
    });

    revalidatePath("/cuaca/karhutla");
    return { success: true, count: validData.length };

  } catch (error) {
    console.error("Import error:", error);
    return { success: false, msg: "Gagal import data." };
  }
}

// DELETE ALL (Reset Data)
export async function clearHotspots() {
  await prisma.hotspot.deleteMany({});
  revalidatePath("/cuaca/karhutla");
  return { success: true };
}