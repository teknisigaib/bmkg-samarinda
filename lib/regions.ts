// lib/regions.ts
import { DATA_KALTIM } from '@/data/kaltim-manual'; // Import data Anda

// Tipe data untuk opsi pencarian (Format yang dibutuhkan Search Component)
export interface RegionOption {
  id: string;
  name: string;
  level: 'province' | 'city' | 'district' | 'village';
  parentName?: string;
}

// FUNGSI UNTUK MERATAKAN (FLATTEN) DATA HIERARKI
const generateRegionList = (): RegionOption[] => {
  const options: RegionOption[] = [];

  // 1. Masukkan Provinsi (Manual)
  options.push({
    id: '64',
    name: 'KALIMANTAN TIMUR',
    level: 'province'
  });

  // 2. Loop Kabupaten/Kota
  DATA_KALTIM.forEach((city) => {
    // Masukkan Kota
    options.push({
      id: city.id,
      name: city.name,
      level: 'city',
      parentName: 'Kalimantan Timur'
    });

    // 3. Loop Kecamatan
    city.districts.forEach((district) => {
      // Masukkan Kecamatan
      options.push({
        id: district.id,
        name: district.name,
        level: 'district',
        parentName: city.name // Parentnya adalah Kota
      });

      // 4. Loop Desa/Kelurahan
      district.villages.forEach((village) => {
        // Masukkan Desa
        options.push({
          id: village.id,
          name: village.name,
          level: 'village',
          parentName: district.name // Parentnya adalah Kecamatan
        });
      });
    });
  });

  return options;
};

// Export variable regionList yang sudah berisi ribuan data flat
export const regionList = generateRegionList();