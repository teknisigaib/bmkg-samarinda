import { DATA_KALTIM } from "@/data/kaltim-manual";

export interface Wilayah {
  id: string;
  name: string;
  bmkgCode: string;
}

// 1. Ambil Provinsi
export const getProvinces = async (): Promise<Wilayah[]> => {
  return [{ id: "64", name: "KALIMANTAN TIMUR", bmkgCode: "64" }];
};

// 2. Ambil Kota/Kab 
export const getRegencies = async (provId: string): Promise<Wilayah[]> => {
  if (provId !== "64") return [];
  
  return DATA_KALTIM.map(city => ({
    id: city.id,
    name: city.name,
    bmkgCode: city.id
  }));
};

// 3. Ambil Kecamatan 
export const getDistricts = async (cityId: string): Promise<Wilayah[]> => {
  const city = DATA_KALTIM.find(c => c.id === cityId);
  if (!city) return [];

  return city.districts.map(dist => ({
    id: dist.id,
    name: dist.name,
    bmkgCode: dist.id
  }));
};

// 4. Ambil Kelurahan 
export const getVillages = async (distId: string): Promise<Wilayah[]> => {
  const cityId = distId.substring(0, 5);
  
  const city = DATA_KALTIM.find(c => c.id === cityId);
  if (!city) return [];

  const district = city.districts.find(d => d.id === distId);
  if (!district) return [];

  return district.villages.map(vill => ({
    id: vill.id,
    name: vill.name,
    bmkgCode: vill.code ? vill.code : vill.id 
  }));
};

export const formatBmkgCode = (code: string) => code;