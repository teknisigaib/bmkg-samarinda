"use server"; // Eksekusi murni di Node.js Runtime Server Pusat (Ubuntu)

import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import os from 'os';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const execAsync = promisify(exec);

// ==========================================
// 1. EVALUASI KESEHATAN & METRIK SUPABASE
// ==========================================
export async function checkDatabaseHealth() {
  const startTime = performance.now();
  try {
    const [pingRes, metricRes] = await Promise.all([
      supabase.from('posts').select('id').limit(1), // Ganti 'posts' dengan salah satu nama tabel berita lu
      supabase.rpc('get_advanced_db_metrics')
    ]);

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    if (pingRes.error) throw pingRes.error;
    if (metricRes.error) throw metricRes.error;

    const metrics = metricRes.data as any;
    const dbSizeMB = (metrics.db_size_bytes / (1024 * 1024)).toFixed(2);

    let statusText = "Stabil";
    if (responseTime > 500) statusText = "Lambat";
    if (responseTime > 1500) statusText = "Kritis";

    return {
      success: true,
      status: statusText,
      responseTime,
      activeConnections: metrics.active_connections || 1,
      dbSizeMB: parseFloat(dbSizeMB),
      cacheHitRatio: metrics.cache_hit_ratio || 100,
      error: null
    };
  } catch (err: any) {
    return {
      success: false, status: "DOWN", responseTime: 0,
      activeConnections: 0, dbSizeMB: 0, cacheHitRatio: 0,
      error: err.message || "Gagal terhubung ke cluster Supabase"
    };
  }
}

// ==========================================
// 2. PENGECEKAN STATUS API PUSAT (ANTI-CORS)
// ==========================================
export async function checkExternalAPIs() {
  // Kalau mau nambah link API baru, CUKUP TAMBAH DI ARRAY SINI SAJA CUY!
  const endpoints = [
    { id: "satelit", name: "Satelit Himawari (Pusat)", url: "https://data.bmkg.go.id/DataMKG/MEWS/satelit/EH-IR.jpg" },
    { id: "gempa", name: "Data Gempa Terkini", url: "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json" },
    { id: "cuaca", name: "Cuaca Kalimantan Timur", url: "https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-KalimantanTimur.xml" }
  ];

  return await Promise.all(endpoints.map(async (api) => {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Batas aman timeout 5 detik

      const res = await fetch(api.url, { 
        method: 'GET', 
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      const endTime = performance.now();
      
      return {
        ...api,
        status: res.ok ? "online" : "error",
        statusCode: res.status,
        ping: Math.round(endTime - startTime)
      };
    } catch (error: any) {
      return {
        ...api,
        status: error.name === 'AbortError' ? "timeout" : "error",
        statusCode: 0,
        ping: 5000
      };
    }
  }));
}

// ==========================================
// 3. PROFILING RESOURCE UBUNTU v24 (OS LEVEL)
// ==========================================
export async function getServerMetrics() {
  try {
    // 1. RAM Fisik Server
    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;
    const totalRamGB = (totalRam / (1024 ** 3)).toFixed(1);
    const usedRamGB = (usedRam / (1024 ** 3)).toFixed(1);
    const ramPercentage = Math.round((usedRam / totalRam) * 100);

    // 2. CPU & Uptime
    const uptimeSeconds = os.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const loadAvg1m = os.loadavg()[0];
    const cpuCores = os.cpus().length;
    const cpuUsagePercentage = Math.min(Math.round((loadAvg1m / cpuCores) * 100), 100);
    const appMemMB = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(1);

    // 3. SSD / Disk Space Root (/)
    let disk = { total: "0", used: "0", percentage: 0 };
    try {
      const stats = await fs.statfs('/');
      const totalDiskBytes = stats.blocks * stats.bsize;
      const freeDiskBytes = stats.bfree * stats.bsize;
      const usedDiskBytes = totalDiskBytes - freeDiskBytes;
      disk.total = (totalDiskBytes / (1024 ** 3)).toFixed(1);
      disk.used = (usedDiskBytes / (1024 ** 3)).toFixed(1);
      disk.percentage = Math.round((usedDiskBytes / totalDiskBytes) * 100);
    } catch (e) { console.error(e); }

    // 4. Membaca Alokasi SWAP Langsung dari Kernel Linux
    let swap = { used: "0", total: "0", percentage: 0 };
    try {
      const memInfo = await fs.readFile('/proc/meminfo', 'utf-8');
      const swapTotalMatch = memInfo.match(/SwapTotal:\s+(\d+)\s+kB/);
      const swapFreeMatch = memInfo.match(/SwapFree:\s+(\d+)\s+kB/);
      
      if (swapTotalMatch && swapFreeMatch) {
        const totalSwapKB = parseInt(swapTotalMatch[1], 10);
        const freeSwapKB = parseInt(swapFreeMatch[1], 10);
        const usedSwapKB = totalSwapKB - freeSwapKB;
        
        swap.total = (totalSwapKB / (1024 * 1024)).toFixed(1);
        swap.used = (usedSwapKB / (1024 * 1024)).toFixed(1);
        swap.percentage = totalSwapKB > 0 ? Math.round((usedSwapKB / totalSwapKB) * 100) : 0;
      }
    } catch (e) { console.error(e); }

    // 5. Hitung Total Sockets Jaringan yang Terhubung Aktif
    let activeSockets = 0;
    try {
      const { stdout } = await execAsync("ss -ant | grep -c ESTAB || true");
      activeSockets = parseInt(stdout.trim(), 10) || 0;
    } catch (e) { console.error(e); }

    return {
      success: true,
      ram: { used: usedRamGB, total: totalRamGB, percentage: ramPercentage },
      cpu: { load: loadAvg1m.toFixed(2), cores: cpuCores, percentage: cpuUsagePercentage },
      uptime: `${days} Hari, ${hours} Jam`,
      appMemMB,
      disk,
      swap,         
      activeSockets, // Koma aman sentosa mendarat di sini
      error: null
    };
  } catch (err: any) {
    return {
      success: false,
      ram: { used: "0", total: "0", percentage: 0 },
      cpu: { load: "0.00", cores: 1, percentage: 0 },
      uptime: "Unknown", appMemMB: "0",
      disk: { total: "0", used: "0", percentage: 0 },
      swap: { total: "0", used: "0", percentage: 0 },
      activeSockets: 0,
      error: err.message || "Gagal menginterogasi subsistem kernel Linux"
    };
  }
}