// Kamus penerjemah URL ke Tipe Database
export const CLIMATE_TYPES: Record<string, { dbType: string; title: string }> = {
  // --- HTH ---
  "hth": { 
    dbType: "HTH", 
    title: "Hari Tanpa Hujan" 
  },
  
  // --- PRAKIRAAN ---
  "prakiraan-hujan-dasarian": { 
    dbType: "PrakiraanHujanDasarian", 
    title: "Prakiraan Hujan Dasarian" 
  },
  "prakiraan-hujan-bulanan": { 
    dbType: "PrakiraanHujanBulanan", 
    title: "Prakiraan Hujan Bulanan" 
  },
  "prakiraan-sifat-dasarian": { 
    dbType: "PrakiraanSifatDasarian", 
    title: "Prakiraan Sifat Hujan Dasarian" 
  },
  "prakiraan-probabilitas": { 
    dbType: "PrakiraanProbabilitas", 
    title: "Prakiraan Probabilitas Hujan" 
  },

  // --- ANALISIS HUJAN ---
  "analisis-hujan-dasarian": { 
    dbType: "AnalisisHujanDasarian", 
    title: "Analisis Hujan Dasarian" 
  },
  "analisis-hujan-bulanan": { 
    dbType: "AnalisisHujanBulanan", 
    title: "Analisis Hujan Bulanan" 
  },
  "analisis-sifat-bulanan": { 
    dbType: "AnalisisSifatBulanan", 
    title: "Analisis Sifat Hujan Bulanan" 
  },
  "analisis-hari-hujan": { 
    dbType: "AnalisisHariHujan", 
    title: "Analisis Hari Hujan Bulanan" 
  },
};