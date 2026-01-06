// lib/wilayah-utils.ts
import { DATA_KALTIM } from "@/data/kaltim-manual";

// Tipe data yang dibutuhkan oleh komponen UI (tetap sama agar tidak merusak komponen lain)
export interface Wilayah {
  id: string;
  name: string;
  bmkgCode: string;
}

// 1. Ambil Provinsi (Statis satu saja)
export const getProvinces = async (): Promise<Wilayah[]> => {
  return [{ id: "64", name: "KALIMANTAN TIMUR", bmkgCode: "64" }];
};

// 2. Ambil Kota/Kab (Level 1 dari Data)
export const getRegencies = async (provId: string): Promise<Wilayah[]> => {
  // Karena kita cuma punya data Kaltim (64), langsung return root data
  if (provId !== "64") return [];
  
  return DATA_KALTIM.map(city => ({
    id: city.id,
    name: city.name,
    bmkgCode: city.id
  }));
};

// 3. Ambil Kecamatan (Level 2: Cari Kota dulu, baru ambil districts-nya)
export const getDistricts = async (cityId: string): Promise<Wilayah[]> => {
  // Cari kota yang cocok
  const city = DATA_KALTIM.find(c => c.id === cityId);
  if (!city) return [];

  return city.districts.map(dist => ({
    id: dist.id,
    name: dist.name,
    bmkgCode: dist.id
  }));
};

// 4. Ambil Kelurahan (Level 3: Cari Kota -> Cari Kec -> Ambil villages)
// Note: Algoritma ini mencari dengan loop. Karena data statis, ini sangat cepat (<1ms).
export const getVillages = async (distId: string): Promise<Wilayah[]> => {
  // 1. Kita butuh ID Kota untuk mempersempit pencarian (Kecamatan 64.71.01 pasti ada di Kota 64.71)
  // Cara cepat: Ambil 5 karakter pertama dari distId (contoh: "64.71.01" -> "64.71")
  const cityId = distId.substring(0, 5);
  
  const city = DATA_KALTIM.find(c => c.id === cityId);
  if (!city) return [];

  const district = city.districts.find(d => d.id === distId);
  if (!district) return [];

  return district.villages.map(vill => ({
    id: vill.id,
    name: vill.name,
    // LOGIKA PINTAR: Jika 'code' diisi manual, pakai itu. Jika tidak, pakai 'id'.
    bmkgCode: vill.code ? vill.code : vill.id 
  }));
};

// Helper format tidak berubah, tetap bisa dipakai jika perlu
export const formatBmkgCode = (code: string) => code;