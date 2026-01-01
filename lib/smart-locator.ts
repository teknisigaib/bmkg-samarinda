// lib/smart-locator.ts
import { getProvinces, getRegencies, getDistricts, getVillages, Region } from "./wilayah-utils";

// Fungsi normalisasi untuk membandingkan nama (hapus "Kabupaten", "Kota", spasi, dll)
const normalize = (str: string) => {
    return str.toLowerCase()
        .replace(/kota |kabupaten |provinsi |kepulauan |daerah istimewa /g, "")
        .replace(/\./g, "")
        .trim();
};

// Fungsi pencari ID berdasarkan nama di dalam list
const findIdByName = (list: Region[], nameFromMap: string) => {
    const target = normalize(nameFromMap);
    // Cari yang persis atau mengandung kata
    return list.find(item => {
        const source = normalize(item.name);
        return source === target || source.includes(target) || target.includes(source);
    });
};

export async function findRegionCodeByGeo(lat: number, lng: number) {
    try {
        // 1. Tanya Nominatim (Reverse Geocoding)
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const res = await fetch(url, { headers: { 'User-Agent': 'WeatherApp/1.0' } });
        const data = await res.json();
        
        if (!data.address) throw new Error("Alamat tidak ditemukan");

        const addr = data.address;
        
        // Ambil nama-nama dari Nominatim
        // Prioritas nama desa: village > suburb > town > city_district
        const villageName = addr.village || addr.suburb || addr.town || addr.city_district;
        const districtName = addr.county || addr.district; // Kecamatan
        const cityName = addr.city || addr.town || addr.regency;
        const provName = addr.state;

        if (!villageName || !provName) throw new Error("Data wilayah peta kurang lengkap (Desa/Provinsi hilang).");

        console.log("Mencari match untuk:", { provName, cityName, districtName, villageName });

        // 2. MULAI PENELUSURAN BERTINGKAT (Hunting Code)
        
        // A. Cari Provinsi
        const allProvs = await getProvinces();
        const foundProv = findIdByName(allProvs, provName);
        if (!foundProv) throw new Error(`Provinsi ${provName} tidak cocok dengan database.`);

        // B. Cari Kota/Kab
        const allCities = await getRegencies(foundProv.id);
        // Fallback: Jika kota tidak ketemu (kadang null di nominatim), coba cari kecamatan langsung (jarang terjadi)
        const foundCity = cityName ? findIdByName(allCities, cityName) : null;
        if (!foundCity) throw new Error(`Kota di ${cityName} tidak ditemukan.`);

        // C. Cari Kecamatan
        const allDists = await getDistricts(foundCity.id);
        const foundDist = districtName ? findIdByName(allDists, districtName) : null;
        if (!foundDist) throw new Error(`Kecamatan ${districtName} tidak ditemukan.`);

        // D. Cari Kelurahan (Target Akhir)
        const allVillages = await getVillages(foundDist.id);
        const foundVill = findIdByName(allVillages, villageName);
        if (!foundVill) throw new Error(`Kelurahan ${villageName} tidak ditemukan.`);

        // SUKSES! Kembalikan semua ID agar Dropdown bisa update otomatis
        return {
            prov: foundProv,
            city: foundCity,
            dist: foundDist,
            vill: foundVill, // Ini mengandung ID ADM4
            fullAddress: `${foundVill.name}, ${foundDist.name}, ${foundCity.name}`
        };

    } catch (error) {
        console.error("Smart Locator Error:", error);
        return null;
    }
}