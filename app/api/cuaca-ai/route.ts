import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key kosong." }, { status: 500 });
    }

    const body = await req.json();
    const { locationName, level, weatherData } = body;

    // ==============================================================
    // KUNCI TARGET: Menggunakan model 3.1 Flash Lite Preview
    // ==============================================================
    const targetModel = "gemini-3.1-flash-lite-preview";
    console.log("🤖 [AI SYSTEM] Mengeksekusi Model:", targetModel);
    
    const model = genAI.getGenerativeModel({ model: targetModel });

    // REKAYASA PROMPT: Penambahan sapaan wajib di awal paragraf
    const prompt = `
      Kamu adalah Asisten AI BMKG. 
      TUGAS UTAMAMU adalah membacakan prakiraan cuaca KHUSUS untuk wilayah: ${locationName}.
      
      DATA MENTAH UNTUK WILAYAH INI:
      ${JSON.stringify(weatherData)}

      ATURAN WAJIB:
      1. WAJIB buka paragraf pertama dengan kalimat sapaan pembuka persis seperti ini: 
         "Halo warga ${locationName}, saya asisten AI BMKG Samarinda, berikut prakiraan cuaca dari BMKG."
      2. Jangan pernah mengubah nama wilayah target (${locationName}) menjadi nama wilayah lain.
      3. Lanjutkan merangkum kondisi cuaca secara umum...
      4. Wajib cantumkan rincian data: Rentang suhu hari ini (suhu terendah hingga tertinggi), estimasi kelembaban, dan estimasi suhu yang dirasakan (Heat Index/Wind Chill).
      5. Akhiri dengan 1 kalimat himbauan tegas/saran aktivitas untuk warga berdasarkan cuaca tersebut (contoh: "Sedia payung sebelum jam 3 sore").
      6. Batasi jawaban maksimal 2 paragraf saja. Gunakan bahasa luwes, langsung ke intinya, dan jangan bertele-tele.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ summary: text });

  } catch (error: any) {
    console.error("AI Error:", error.message || error);
    return NextResponse.json({ error: "Satelit AI menolak akses. Cek Console Terminal." }, { status: 500 });
  }
}