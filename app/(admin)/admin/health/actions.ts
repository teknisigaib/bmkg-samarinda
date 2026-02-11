"use server";

import prisma from "@/lib/prisma";

export interface ServiceStatus {
  id: string;
  name: string;
  url: string; // URL untuk ditest
  status: "UP" | "DOWN" | "SLOW";
  latency: number; // dalam milidetik (ms)
  lastCheck: string;
  type: "DATABASE" | "API" | "INTERNAL";
}

const SERVICES_TO_CHECK = [
  {
    id: "bmkg-gempa",
    name: "API Gempa (Data BMKG)",
    url: "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
    type: "API"
  },
  {
    id: "bmkg-cuaca",
    name: "API Cuaca (BMKG.go.id)",
    url: "https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=64",
    type: "API"
  },
  {
    id: "bmkg-maritim",
    name: "API Maritim (Peta Maritim)",
    url: "https://peta-maritim.bmkg.go.id/public_api/overview/gelombang.json",
    type: "API"
  },
  {
    id: "ogimet-metar",
    name: "API Penerbangan (Ogimet)",
    url: "https://www.ogimet.com/display_metars2.php", // Cek koneksi ke Ogimet
    type: "API"
  },
];

export async function checkSystemHealth(): Promise<ServiceStatus[]> {
  const results: ServiceStatus[] = [];
  const now = new Date().toLocaleTimeString('id-ID');

  // 1. CEK DATABASE (PRISMA)
  const dbStart = performance.now();
  let dbStatus: ServiceStatus["status"] = "UP";
  try {
    // Query ringan untuk tes koneksi
    await prisma.$queryRaw`SELECT 1`; 
  } catch (error) {
    dbStatus = "DOWN";
    console.error("DB Check Failed:", error);
  }
  const dbEnd = performance.now();
  results.push({
    id: "database",
    name: "Database Utama (Supabase)",
    url: "Internal Prisma Connection",
    status: dbStatus,
    latency: Math.round(dbEnd - dbStart),
    lastCheck: now,
    type: "DATABASE"
  });

  // 2. CEK API EXTERNAL
  // Kita jalankan paralel agar cepat
  const apiChecks = SERVICES_TO_CHECK.map(async (service) => {
    const start = performance.now();
    let status: ServiceStatus["status"] = "UP";
    
    try {
      // Timeout 5 detik, jika lebih dianggap DOWN/SLOW
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(service.url, { 
        method: 'HEAD', // Cuma cek header (lebih ringan)
        signal: controller.signal,
        cache: 'no-store' 
      });
      
      clearTimeout(timeoutId);

      if (!res.ok && res.status !== 405) { // 405 Method Not Allowed kadang terjadi di HEAD, tapi server hidup
         // Jika HEAD gagal, coba GET sebentar
         const resGet = await fetch(service.url, { method: 'GET', signal: controller.signal });
         if(!resGet.ok) status = "DOWN";
      }
      
    } catch (error) {
      status = "DOWN";
    }

    const end = performance.now();
    const latency = Math.round(end - start);

    // Tentukan status SLOW jika latency > 2 detik
    if (status === "UP" && latency > 2000) status = "SLOW";

    return {
      id: service.id,
      name: service.name,
      url: service.url,
      status: status,
      latency: status === "DOWN" ? 0 : latency,
      lastCheck: now,
      type: "API" as const
    };
  });

  const apiResults = await Promise.all(apiChecks);
  return [...results, ...apiResults];
}