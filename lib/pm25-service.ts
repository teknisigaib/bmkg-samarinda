import fs from 'fs/promises';
import path from 'path';
import * as ftp from 'basic-ftp';
import { Writable } from 'stream';

const CACHE_FILE = path.join(process.cwd(), 'public', 'data-pm25-cache.json');

interface PM25Data {
  lastUpdate: string;
  current: number;
  history: any[];
  timestamp: number;
}

// Helper: Download file ke String
async function downloadFileToString(client: ftp.Client, fileName: string): Promise<string> {
  const chunks: any[] = [];
  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });
  await client.downloadTo(writableStream, fileName);
  return Buffer.concat(chunks).toString('utf-8');
}

export async function updateDataFromFTP(): Promise<PM25Data | null> {
  const client = new ftp.Client();

  try {
    console.log("🔄 [FTP] Memulai koneksi...");
    
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false 
    });

    // 1. Masuk ke Folder
    await client.cd("/SAMARINDA2/WASUploaded");

    // 2. Ambil List Semua File
    const fileList = await client.list();
    
    // Filter hanya file CSV
    let csvFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.csv'));

    if (csvFiles.length === 0) throw new Error("Tidak ada file CSV.");

    // 3. Urutkan File (Terlama -> Terbaru)
    csvFiles.sort((a, b) => {
        const timeA = a.modifiedAt ? new Date(a.modifiedAt).getTime() : 0;
        const timeB = b.modifiedAt ? new Date(b.modifiedAt).getTime() : 0;
        return timeA - timeB;
    });

    // 4. Ambil 24 File Terakhir (24 Jam Terakhir)
    const targetFiles = csvFiles.slice(-24);
    console.log(`info: Akan memproses ${targetFiles.length} file untuk grafik.`);

    const historyData = [];

    // 5. LOOP DOWNLOAD
    for (const file of targetFiles) {
        try {
            // Download isi file
            const content = await downloadFileToString(client, file.name);
            
            // Parse CSV (Ambil baris ke-3, karena baris 1 & 2 adalah header)
            const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            if (lines.length >= 3) {
                const dataRow = lines[2];
                const cols = dataRow.split(',');

                if (cols.length >= 3) {
                    const rawDate = cols[0];
                    const rawTime = cols[1];
                    const val = parseFloat(cols[2]);
                    
                    // Ambil jam 
                    const hour = rawTime.split(':')[0];

                    historyData.push({
                        time: hour,
                        fullDate: `${rawDate} ${rawTime}`,
                        pm25: isNaN(val) ? 0 : val
                    });
                }
            }
        } catch (fileErr) {
            console.warn(`⚠️ Gagal baca file ${file.name}, skip.`);
        }
    }

    // Ambil data paling terakhir
    const latestData = historyData[historyData.length - 1];

    const processedData: PM25Data = {
        lastUpdate: latestData ? `${latestData.fullDate} WITA` : "-",
        current: latestData ? latestData.pm25 : 0,
        history: historyData,
        timestamp: Date.now()
    };

    // 6. Simpan Cache
    await fs.writeFile(CACHE_FILE, JSON.stringify(processedData, null, 2));

    return processedData;

  } catch (err: any) {
    try {
        const oldData = await fs.readFile(CACHE_FILE, 'utf-8');
        return JSON.parse(oldData);
    } catch {
        return null;
    }
  } finally {
    client.close();
  }
}

export async function getCachedData() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null; 
  }
}