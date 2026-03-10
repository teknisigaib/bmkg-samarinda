"use server"; // Wajib ada untuk menjalankan kode di server

import { combineForecasts, createSlug } from "@/lib/bmkg/maritim";

/**
 * Fungsi ini dipanggil dari Client, tapi berjalan sepenuhnya di Server.
 * Browser tidak akan pernah melihat URL maritim.bmkg.go.id.
 */
export async function getMaritimeDetail(name: string, type: 'area' | 'port' = 'area') {
  const slug = createSlug(name);
  const endpoint = type === 'port' ? 'pelabuhan' : 'perairan';
  const url = `https://maritim.bmkg.go.id/api/${endpoint}?slug=${slug}`;

  try {
    const res = await fetch(url, { 
      cache: 'no-store', // Memastikan data selalu segar (dinamis)
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!res.ok) throw new Error("Gagal mengambil data dari BMKG");

    const json = await res.json();
    return { 
      ...json, 
      name, 
      combined: combineForecasts(json), 
      type 
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return null;
  }
}