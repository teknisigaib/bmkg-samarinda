import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Gemini (Pastikan GEMINI_API_KEY ada di .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { summary, routeNodes } = body;

    if (!summary || !routeNodes) {
      return NextResponse.json({ error: 'Data rute tidak lengkap' }, { status: 400 });
    }

    // 1. Ekstrak data krusial untuk prompt AI
    const simplifiedNodes = routeNodes.map((n: any) => ({
      stasiun: n.station.name,
      waktu_eta: new Date(n.eta).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      cuaca: n.forecast.condition,
      angin_kmh: n.forecast.windSpeed,
      visibilitas: n.forecast.visibility_text,
      status: n.status
    }));

    // 2. Susun Prompt ke Gemini
    const prompt = `
      Anda adalah "Asisten AI SICASMA", analis cuaca untuk pelayaran Sungai Mahakam.
      Tugas Anda adalah memberikan laporan analisis cuaca rute pelayaran kapal profesional, dan mudah dipahami oleh nakhoda.
      
      DATA RINGKASAN RUTE:
      - Jarak Tempuh: ${summary.totalDist.toFixed(1)} km
      - Max Kecepatan Angin: ${summary.maxWind} km/h
      - Titik Status Bahaya: ${summary.hazardCount}
      - Titik Status Waspada: ${summary.cautionCount}

      DATA DETAIL WAYPOINT (Berurutan):
      ${JSON.stringify(simplifiedNodes)}

      INSTRUKSI PENULISAN:
      1. Berikan analisis lengkap dan padat dalam 2-3 paragraf.
      2. Paragraf 1: Ringkasan kondisi umum pelayaran (sebutkan cuaca dominan dan apakah rute secara keseluruhan tergolong Aman, Waspada, atau Bahaya).
      3. Paragraf 2 & 3: Jabarkan kondisi cuaca di sepanjang rute. Jika ada titik Waspada/Bahaya, sebutkan secara spesifik NAMA STASIUN, JAM ETA, dan penyebabnya (misal: karena jarak pandang buruk atau angin kencang). Jika aman semua, jelaskan mengapa kondisi sangat ideal.
      4. Akhiri dengan satu paragraf terpisah yang diawali persis dengan kata "Rekomendasi Navigasi:" yang berisi saran bagi nakhoda (tapi jangan terlalu teknis, dan sesuaikan kapasitas kita sebagai forecaster cuaca saja).
      5. Jangan gunakan format Markdown seperti header (#) atau teks tebal (**). Gunakan kalimat naratif biasa yang padat informasi.
    `;

    // 3. Panggil Model Gemini (Pakai gemini-1.5-flash biar super cepat)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error dari Gemini API:', error);
    return NextResponse.json({ error: 'Gagal menghasilkan analisis AI', details: error.message }, { status: 500 });
  }
}