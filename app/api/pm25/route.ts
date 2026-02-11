import { NextResponse } from 'next/server';
import { getCachedData, updateDataFromFTP } from '@/lib/pm25-service';

const REVALIDATE_TIME = 30 * 60 * 1000; 

export async function GET() {
  try {
    // Ambil data dari file lokal 
    let cachedData = await getCachedData();
    const now = Date.now();

    // Jika file tidak ada sama sekali
    if (!cachedData) {
      console.log("⚠️ Cache kosong, melakukan fetch awal (User menunggu)...");
      cachedData = await updateDataFromFTP();
      
      if (!cachedData) {
        return NextResponse.json({ success: false, error: "Gagal mengambil data awal" }, { status: 500 });
      }
      return NextResponse.json({ success: true, ...cachedData });
    }

    // 3. Konsep STALE-WHILE-REVALIDATE
    const dataAge = now - cachedData.timestamp;
    
    if (dataAge > REVALIDATE_TIME) {
      updateDataFromFTP().catch(err => console.error("Background update failed", err));
    } else {
      console.log("Menggunakan data cache");
    }

    // 4.  kembalikan data
    return NextResponse.json({ 
      success: true, 
      ...cachedData 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}