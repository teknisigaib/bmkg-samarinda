import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'pm25-cache.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        success: false, 
        current: 0,
        history: [],
        lastUpdate: "Menunggu Update..."
      });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({ success: true, ...data });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}