import { NextResponse } from 'next/server';
import { Client } from "basic-ftp";
import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';

const FTP_CONFIG = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: (process.env.FTP_PASSWORD || "").replace(/["']/g, ""),
  secure: false,
  port: Number(process.env.FTP_PORT) || 21, 
};

// Folder remote 
const REMOTE_FOLDER = process.env.FTP_REMOTE_FOLDER || "/SAMARINDA2/WASUploaded";

// Secret Key 
const CRON_SECRET = process.env.CRON_SECRET;

// HELPER: Download File ke String
async function downloadFileToString(client: Client, fileName: string): Promise<string> {
  const chunks: any[] = [];
  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });
  
  const remoteFilePath = `${REMOTE_FOLDER}/${fileName}`;
  await client.downloadTo(writableStream, remoteFilePath);
  
  return Buffer.concat(chunks).toString('utf-8');
}

export async function GET(request: Request) {
  // 1. Cek Secret Key
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  //  CRON_SECRET
  if (!CRON_SECRET || key !== CRON_SECRET) { 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validasi config FTP sebelum konek
  if (!FTP_CONFIG.host || !FTP_CONFIG.user || !FTP_CONFIG.password) {
    return NextResponse.json({ error: 'FTP Config Missing in .env' }, { status: 500 });
  }

  const client = new Client();
  // client.ftp.verbose = true; 

  try {
    console.log("[Cron] Memulai koneksi FTP...");
    
    await client.access(FTP_CONFIG);
    await client.cd(REMOTE_FOLDER);

    // 2. Ambil List Semua File & Filter CSV
    const fileList = await client.list();
    let csvFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.csv'));

    if (csvFiles.length === 0) throw new Error("Tidak ada file CSV di server FTP.");

    // 3. Urutkan File (Terlama -> Terbaru)
    csvFiles.sort((a, b) => {
        const timeA = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
        const timeB = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
        return timeA - timeB;
    });

    // 4. Ambil 24 File Terakhir
    const targetFiles = csvFiles.slice(-24);
    console.log(`[Cron] Memproses ${targetFiles.length} file terbaru.`);

    const historyData = [];
    let currentVal = 0;
    let lastUpdateStr = "-";

    // 5. LOOP DOWNLOAD & PARSE
    for (const file of targetFiles) {
        try {
            const content = await downloadFileToString(client, file.name);
            const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            if (lines.length >= 3) {
                const dataRow = lines[2];
                const cols = dataRow.split(',');

                if (cols.length > 2) {
                    const rawTime = cols[1]; 
                    const val = parseFloat(cols[2]);
                    const pm25 = isNaN(val) || val < 0 ? 0 : val;
                    
                    const hourLabel = rawTime.split(':')[0] + ":00";

                    historyData.push({
                        time: hourLabel,
                        pm25: pm25
                    });

                    currentVal = pm25;
                    
                    if (file.modifiedAt) {
                        const d = new Date(file.modifiedAt);
                        const dd = d.getDate().toString().padStart(2, '0');
                        const mm = (d.getMonth() + 1).toString().padStart(2, '0');
                        const yyyy = d.getFullYear();
                        lastUpdateStr = `${dd}/${mm}/${yyyy} ${hourLabel}`;
                    }
                }
            }
        } catch (err) {
            console.warn(`Gagal proses file ${file.name}, skip.`);
        }
    }

    // 6. Siapkan Data JSON
    const finalData = {
        lastUpdate: lastUpdateStr,
        current: currentVal,
        history: historyData,
        timestamp: Date.now()
    };

    // 7. Simpan ke File Cache
    const CACHE_FILE_PATH = path.join('/tmp', 'pm25-cache.json');

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(finalData, null, 2));

    console.log("[Cron] Sukses update data PM2.5");
    
    return NextResponse.json({ 
      success: true, 
      data: finalData 
    });

  } catch (error: any) { 
    console.error("[Cron] Error Detail:", error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal update data',
      debug_message: error.message || 'Unknown error',
      debug_stack: error.stack
    }, { status: 500 });
    
  } finally {
    client.close();
  }
}