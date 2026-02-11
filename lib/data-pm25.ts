import { Client } from "basic-ftp";

export interface PM25Data {
  time: string;
  pm25: number | null; 
  fullDate?: string; 
}

// Konfigurasi FTP
const FTP_CONFIG = {
  host: "103.169.3.176",
  user: "databam",
  password: "databam@#98765",
  secure: false,
  port: 21,
};

const FOLDER_PATH = "/SAMARINDA2/WASUploaded";

const pad = (num: number) => num.toString().padStart(2, "0");

const generateFilename = (date: Date) => {
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const yyyy = date.getFullYear();
  const hh = pad(date.getHours());
  return `BAM ${mm}-${dd}-${yyyy} ${hh}00 Samarinda2.csv`; 
};

export async function getPM25History(): Promise<{ history: PM25Data[], current: number, lastUpdate: string }> {
  const client = new Client();
  client.ftp.verbose = true; 

  const historyData: PM25Data[] = [];
  let currentVal = 0;
  let lastUpdateStr = "-";

  try {
    await client.access(FTP_CONFIG);
    
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000); 
      const filename = generateFilename(d);
      const filePath = `${FOLDER_PATH}/${filename}`;
      const hourLabel = pad(d.getHours()); 

      try {
        const chunks: Buffer[] = [];
        const writable = {
          write: (chunk: Buffer) => chunks.push(chunk),
          end: () => {},
          on: () => {},
          once: () => {},
          emit: () => {},
        } as any;

        await client.downloadTo(writable, filePath);
        
        const fileContent = Buffer.concat(chunks).toString("utf-8");
        
        //  PARSING CSV MANUAL
        
        const lines = fileContent.trim().split("\n");
        if (lines.length >= 3) {
          const dataRow = lines[2].split(",");
          if (dataRow.length > 2) {
            let conc = parseFloat(dataRow[2]);
            if (conc < 0) conc = 0;

            historyData.push({ time: hourLabel, pm25: conc });
            if (i === 0) {
              currentVal = conc;
              lastUpdateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${hourLabel}:00`;
            }
          } else {
             historyData.push({ time: hourLabel, pm25: null });
          }
        } else {
            historyData.push({ time: hourLabel, pm25: null });
        }

      } catch (err) {
        historyData.push({ time: hourLabel, pm25: null });
      }
    }

  } catch (error) {
    console.error("FTP Connection Error:", error);
  } finally {
    client.close();
  }

  return {
    history: historyData,
    current: currentVal,
    lastUpdate: lastUpdateStr !== "-" ? lastUpdateStr : "Belum ada data"
  };
}