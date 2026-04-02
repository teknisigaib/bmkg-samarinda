import { NextResponse } from 'next/server';
import { getLinkPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getCAPAlertDetail } from "@/lib/bmkg/cap";

export async function GET() {
  try {
    const xmlLink = await getLinkPeringatanDiniKaltim();
    const alertData = xmlLink ? await getCAPAlertDetail(xmlLink) : null;
    
    // Jika tidak ada data, kirim status normal
    if (!alertData) {
      return NextResponse.json({ active: false });
    }

    return NextResponse.json({ 
      active: true,
      ...alertData 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal fetch CAP' }, { status: 500 });
  }
}