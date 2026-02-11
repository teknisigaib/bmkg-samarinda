import { DATA_KALTIM } from '@/data/kaltim-manual';

export interface RegionOption {
  id: string;
  name: string;
  level: 'province' | 'city' | 'district' | 'village';
  parentName?: string;
}

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
    options.push({
      id: city.id,
      name: city.name,
      level: 'city',
      parentName: 'Kalimantan Timur'
    });

    // 3. Loop Kecamatan
    city.districts.forEach((district) => {
      options.push({
        id: district.id,
        name: district.name,
        level: 'district',
        parentName: city.name
      });

      // 4. Loop Desa/Kelurahan
      district.villages.forEach((village) => {
        options.push({
          id: village.id,
          name: village.name,
          level: 'village',
          parentName: district.name
        });
      });
    });
  });

  return options;
};

export const regionList = generateRegionList();