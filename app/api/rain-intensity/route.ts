import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Ambil parameter dari URL (Nama Stasiun & Tanggal)
  const { searchParams } = new URL(request.url);
  const stationName = searchParams.get('stationName');
  const date = searchParams.get('date');

  if (!stationName || !date) {
    return NextResponse.json({ error: "Parameter stationName dan date wajib diisi" }, { status: 400 });
  }

  try {
    // 2. LOGIN DARI SERVER (Menggunakan Endpoint Auth yang Benar)
    const loginRes = await fetch("https://monitoringarg.bmkgaptpranoto.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }) // Kredensial aman di sini
    });

    if (!loginRes.ok) throw new Error("Gagal login ke API eksternal (Cek kembali username/password)");
    const loginData = await loginRes.json();
    
    // Sesuaikan dengan respons API Anda (biasanya loginData.token atau loginData.data.token)
    const token = loginData.token || loginData.data?.token || loginData.accessToken; 
    
    if (!token) throw new Error("Token tidak ditemukan dalam respons login");

    // 3. AMBIL DATA INTENSITAS MENGGUNAKAN TOKEN
    const apiUrl = `https://monitoringarg.bmkgaptpranoto.com/api/intensity-data?stationName=${encodeURIComponent(stationName)}&date=${date}`;
    const dataRes = await fetch(apiUrl, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!dataRes.ok) throw new Error("Gagal mengambil data intensitas dari API BMKG");
    const rainData = await dataRes.json();

    // 4. KEMBALIKAN DATA KE FRONTEND KITA
    return NextResponse.json(rainData);

  } catch (error: any) {
    console.error("API Proxy Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}