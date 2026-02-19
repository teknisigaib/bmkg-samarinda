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

export const dynamic = 'force-dynamic';

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
  
  try {
      await client.downloadTo(writableStream, remoteFilePath);
      return Buffer.concat(chunks).toString('utf-8');
  } catch (err) {
      console.error(`Gagal download file ${fileName}:`, err);
      return "";
  }
}

export async function GET(request: Request) {
  // 1. Cek Secret Key (Keamanan)
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!CRON_SECRET || key !== CRON_SECRET) { 
    return NextResponse.json({ error: 'Unauthorized: Invalid Cron Key' }, { status: 401 });
  }

  // Validasi config FTP
  if (!FTP_CONFIG.host || !FTP_CONFIG.user) {
    return NextResponse.json({ error: 'FTP Config Missing in .env' }, { status: 500 });
  }

  const client = new Client();
  // client.ftp.verbose = true; 

  try {
    console.log("[Cron] Memulai koneksi FTP...");
    
    await client.access(FTP_CONFIG);
    await client.cd(REMOTE_FOLDER);

    // 2. Ambil List File CSV
    const fileList = await client.list();
    let csvFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.csv'));

    if (csvFiles.length === 0) {
        throw new Error("Tidak ada file CSV di server FTP.");
    }

    // 3. Urutkan File (Terlama -> Terbaru) berdasarkan Modified Date
    csvFiles.sort((a, b) => {

        const timeA = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
        const timeB = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
        return timeA - timeB;
    });

    // 4. Ambil 24 File Terakhir 
    const targetFiles = csvFiles.slice(-24);
    console.log(`[Cron] Memproses ${targetFiles.length} file terbaru dari total ${csvFiles.length}.`);

    const historyData = [];
    let currentVal = 0;
    let lastUpdateStr = "-";

    // 5. LOOP DOWNLOAD & PARSE
    for (const file of targetFiles) {
        try {
            const content = await downloadFileToString(client, file.name);
            if (!content) continue;

            const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            if (lines.length >= 3) {
                const dataRow = lines[2];
                const cols = dataRow.split(',');

                if (cols.length > 2) {
                    const rawTime = cols[1]; 
                    const val = parseFloat(cols[2]);
                    const pm25 = isNaN(val) || val < 0 ? 0 : val;
                    
                    // Format Jam
                    const hourLabel = rawTime.includes(':') ? rawTime.split(':')[0] + ":00" : rawTime;

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
            console.warn(`[Cron] Skip file ${file.name} karena error parsing.`);
        }
    }

    // 6. Siapkan Object Data Final
    const finalData = {
        success: true,
        lastUpdate: lastUpdateStr,
        current: currentVal,
        history: historyData,
        timestamp: Date.now()
    };
    
    // Tentukan path folder tujuan
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    
    // Buat folder jika belum ada
    if (!fs.existsSync(publicDataDir)){
        fs.mkdirSync(publicDataDir, { recursive: true });
    }

    const filePath = path.join(publicDataDir, 'pm25-cache.json');
    
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));
    

    return NextResponse.json({ 
        message: 'Data PM2.5 updated successfully', 
        path: filePath,
        data: finalData 
    });

  } catch (error: any) { 
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal update data',
      message: error.message
    }, { status: 500 });
    
  } finally {
    client.close(); // tutup koneksi FTP
  }
}