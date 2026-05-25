"use server"; // Diwajibkan oleh Next.js agar berjalan murni di lingkungan Node.js Server

import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import crypto from 'crypto';

const execAsync = promisify(exec);

// Inisialisasi Supabase Fleksibel (Mendukung NEXT_PUBLIC maupun Service Role untuk Admin)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ===================================================
// 1. EVALUASI KESEHATAN CLUSTER DATABASE SUPABASE
// ===================================================
export async function checkDatabaseHealth() {
  if (!supabase) {
    return {
      success: false, status: "ENV KOSONG", responseTime: 0,
      activeConnections: 0, dbSizeMB: 0, cacheHitRatio: 100,
      error: "Koneksi dibatalkan: Variabel Supabase di file .env belum terdeteksi."
    };
  }

  const startTime = performance.now();
  try {
    const [pingRes, metricRes] = await Promise.all([
      supabase.from('posts').select('id').limit(1), // Silakan ganti 'posts' dengan nama tabel riil lu yang paling ringan
      supabase.rpc('get_advanced_db_metrics')
    ]);

    const responseTime = Math.round(performance.now() - startTime);
    if (pingRes.error || metricRes.error) throw new Error("Database internal query anomaly");
    
    const metrics = metricRes.data as any;

    return {
      success: true,
      status: responseTime > 500 ? "Lambat" : "Stabil",
      responseTime,
      activeConnections: metrics?.active_connections || 1,
      dbSizeMB: parseFloat((metrics?.db_size_bytes / (1024 * 1024) || 0).toFixed(2)),
      cacheHitRatio: metrics?.cache_hit_ratio || 100,
      error: null
    };
  } catch (err: any) {
    return {
      success: false, status: "DOWN", responseTime: 0,
      activeConnections: 0, dbSizeMB: 0, cacheHitRatio: 100,
      error: err.message || "Gagal terkoneksi ke cluster Supabase"
    };
  }
}

// ===================================================
// 2. PENGECEKAN STATUS LATENSI JARIKAN API BMKG PUSAT
// ===================================================
export async function checkExternalAPIs() {
  const endpoints = [
    { id: "satelit", name: "Satelit Himawari (Pusat)", url: "https://data.bmkg.go.id/DataMKG/MEWS/satelit/EH-IR.jpg" },
    { id: "gempa", name: "Data Gempa Terkini", url: "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json" },
    { id: "cuaca", name: "Cuaca Kalimantan Timur", url: "https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-KalimantanTimur.xml" }
  ];

  return await Promise.all(endpoints.map(async (api) => {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // Batas timeout 4 detik

      const res = await fetch(api.url, { method: 'GET', signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeoutId);
      
      return {
        ...api,
        status: res.ok ? "online" : "error",
        ping: Math.round(performance.now() - startTime)
      };
    } catch {
      return { ...api, status: "timeout", ping: 4000 };
    }
  }));
}

// ===================================================
// 3. HYBRID METRICS ENGINE (AAPANEL API + SUBSISTEM LINUX)
// ===================================================
export async function getServerMetrics() {
  try {
    const apiUrl = process.env.AAPANEL_API_URL;
    const apiToken = process.env.AAPANEL_API_TOKEN;

    if (!apiUrl || !apiToken) throw new Error("Environment API aaPanel belum lengkap");

    // Enkripsi MD5 Signature khas aaPanel
    const requestTime = Math.floor(Date.now() / 1000);
    const tokenMd5 = crypto.createHash('md5').update(apiToken).digest('hex');
    const requestToken = crypto.createHash('md5').update(requestTime + tokenMd5).digest('hex');

    // Tembak API aaPanel (System + Network)
    const [sysResponse, netResponse] = await Promise.all([
      fetch(`${apiUrl}/system?action=GetSystemTotal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ request_time: requestTime.toString(), request_token: requestToken }),
        cache: 'no-store'
      }),
      fetch(`${apiUrl}/system?action=GetNetWork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ request_time: requestTime.toString(), request_token: requestToken }),
        cache: 'no-store'
      })
    ]);

    if (!sysResponse.ok || !netResponse.ok) throw new Error("Salah satu API aaPanel gagal merespon");

    const sysData = await sysResponse.json();
    const netData = await netResponse.json();

    // --- 1. PROSES DATA MEMORI & CPU ---
    const totalRamMB = sysData.memTotal || 7941;
    const freeRamMB = sysData.memFree || 3007;
    const usedRamMB = totalRamMB - freeRamMB;
    const ramPercentage = Math.round((usedRamMB / totalRamMB) * 100);

    const cpuLoad = (sysData.cpuRealUsed || 0).toFixed(2);
    const cpuCores = sysData.cpuNum || 4;
    const cpuPercentage = Math.min(Math.round(sysData.cpuRealUsed || 0), 100);
    const appMemMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    // --- 2. PROSES DATA BANDWIDTH ---
    const rxBytes = netData.downTotal || 0; 
    const txBytes = netData.upTotal || 0;   
    const network = {
      rxGB: (rxBytes / (1024 ** 3)).toFixed(2),
      txGB: (txBytes / (1024 ** 3)).toFixed(2)
    };
    const activeSockets = netData.连接数 || netData.connections || 0; 

    // --- 3. PROSES DATA SSD ---
    let disk = { total: "100.0", used: "20.0", percentage: 20 };
    try {
      const stats = await fs.statfs('/');
      const totalDiskBytes = stats.blocks * stats.bsize;
      disk.total = (totalDiskBytes / (1024 ** 3)).toFixed(1);
      disk.used = ((totalDiskBytes - (stats.bfree * stats.bsize)) / (1024 ** 3)).toFixed(1);
      disk.percentage = Math.round(((totalDiskBytes - (stats.bfree * stats.bsize)) / totalDiskBytes) * 100);
    } catch (e) {}

    // --- 4. DATA GRAFIK & PROSES ---
    const mockChartData = [
      { time: "11:00", cpu: 1.2, load: 0.4 },
      { time: "11:15", cpu: 2.5, load: 0.8 },
      { time: "11:30", cpu: 6.8, load: 1.7 },
      { time: "11:45", cpu: 1.9, load: 0.5 },
      { time: "12:00", cpu: cpuPercentage || 0.7, load: parseFloat(cpuLoad) * 0.4 },
    ];
    const processRanking = [
      { pid: 385254, name: "next-server (v24)", cpu: `${(sysData.cpuRealUsed || 7.01).toFixed(2)}%`, user: "www" },
      { pid: 1, name: "systemd", cpu: "0.32%", user: "root" },
      { pid: 1588, name: "nginx: worker", cpu: "0.19%", user: "www" },
      { pid: 1589, name: "postgresql cluster", cpu: "0.12%", user: "postgres" },
    ];

    // ===================================================
    // 📊 5. LOG PARSER ENGINE + LIVE DIAGNOSTIC DETECTOR
    // ===================================================
    // ===================================================
    // 📊 5. LOG PARSER ENGINE MURNI (LOG CONSOLE MODE)
    // ===================================================
    // ===================================================
    // 📊 5. LOG PARSER ENGINE MURNI (BYPASS PATH VIA SHELL)
    // ===================================================
    let webStats = { total_views: 0, unique_visitors: 0, top_pages: [] as any[], logError: null as string | null };
    
    if (process.platform !== 'win32') {
      const logPath = "/www/wwwlogs/stamet-samarinda.bmkg.go.id.log"; 
      
      try {
        // Format tanggal Nginx (Contoh: 25/May/2026)
        const formatNamaBulan = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const hariIni = new Date();
        const tglStr = `${String(hariIni.getDate()).padStart(2, '0')}/${formatNamaBulan[hariIni.getMonth()]}/${hariIni.getFullYear()}`;
        
        // Saring ekstensi statis agar murni menghitung klik halaman warga
        const filterExclude = "ico|css|js|jpg|jpeg|png|gif|svg|woff|woff2|webp|_next|/api/";

        // 🚀 BYPASS LANGSUNG: Biarkan shell Linux yang mengecek eksistensi file secara independen
        try {
          await execAsync(`test -f ${logPath}`);
        } catch {
          throw new Error(`Shell Linux juga tidak melihat file di ${logPath}. Kemungkinan Next.js dikurung di dalam Sandbox aaPanel.`);
        }

        // A. Total Klik Halaman Hari Ini
        const { stdout: totalHits } = await execAsync(`grep "${tglStr}" ${logPath} | grep -v -E "${filterExclude}" | wc -l`);
        webStats.total_views = parseInt(totalHits.trim(), 10) || 0;

        // B. Pengunjung Unik Hari Ini (IP Unik Warga Kaltim)
        const { stdout: uniqueIPs } = await execAsync(`grep "${tglStr}" ${logPath} | grep -v -E "${filterExclude}" | awk '{print $1}' | sort -u | wc -l`);
        webStats.unique_visitors = parseInt(uniqueIPs.trim(), 10) || 0;

        // C. 5 Halaman Paling Viral Hari Ini
        const { stdout: topPathRaw } = await execAsync(`grep "${tglStr}" ${logPath} | grep -v -E "${filterExclude}" | awk '{print $7}' | cut -d'?' -f1 | sort | uniq -c | sort -nr | head -n 5`);
        
        if (topPathRaw.trim()) {
          webStats.top_pages = topPathRaw.trim().split("\n").map((line) => {
            const parts = line.trim().split(/\s+/);
            return {
              hits: parseInt(parts[0], 10),
              path: parts[1] || "/"
            };
          });
        }
      } catch (e: any) {
        // Tangkap pesan error mendalam dari shell (stderr) jika ada pembatasan hak akses
        webStats.logError = `Diagnosis Masalah Server: ${e.stderr || e.message || 'Akses Ditolak Sistem OS'}`;
      }
    } else {
      // DATA DUMMY TESTING WINDOWS LOKAL
      webStats = {
        total_views: 4820, unique_visitors: 1150, logError: null,
        top_pages: [
          { path: "/", hits: 2100 },
          { path: "/cuaca/peta-cuaca", hits: 1450 }
        ]
      };
    }

    return {
      success: true,
      ram: { used: (usedRamMB / 1024).toFixed(1), total: (totalRamMB / 1024).toFixed(1), percentage: ramPercentage },
      swap: { used: "0.0", total: "2.0", percentage: 0 },
      cpu: { load: cpuLoad, cores: cpuCores, percentage: cpuPercentage },
      disk,
      uptime: sysData.time || "13 Day(s)",
      appMemMB, activeSockets, network, chartData: mockChartData, processes: processRanking,
      systemInfo: {
        os: sysData.system || "Ubuntu 24.04 LTS",
        kernel: `aaPanel v${sysData.version || "7.0.30"}`,
        nodeVersion: process.version,
        cpuModel: `Managed Processor (${cpuCores} Cores)`
      },
      webStats
    };

  } catch (err: any) {
    console.error("💥 [NOC EXCEPTION]:", err.message);
    return {
      success: false,
      ram: { used: "0.0", total: "8.0", percentage: 0 }, swap: { used: "0.0", total: "2.0", percentage: 0 },
      cpu: { load: "0.00", cores: 4, percentage: 0 }, disk: { used: "0.0", total: "100.0", percentage: 0 },
      uptime: "Error Sync aaPanel", appMemMB: "0", activeSockets: 0, network: { rxGB: "0.00", txGB: "0.00" },
      chartData: [], processes: [],
      systemInfo: { os: "Windows Local Dev", kernel: "Local Node", nodeVersion: process.version, cpuModel: "Unknown Host" },
      webStats: { total_views: 0, unique_visitors: 0, top_pages: [], diagnosticError: err.message }
    };
  }
}