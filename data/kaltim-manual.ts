// data/kaltim-manual.ts

// --- DEFINISI TIPE DATA (Interface) ---
export interface VillageNode {
  id: string;   // Kode Desa (misal: 64.71.01.1001)
  name: string; // Nama Desa
  code?: string; // Optional: Isi HANYA jika kode BMKG beda dengan ID. Jika sama, kosongkan biar hemat.
}

export interface DistrictNode {
  id: string;        // Kode Kec (misal: 64.71.01)
  name: string;
  villages: VillageNode[]; // Anak-anaknya (Kelurahan)
}

export interface CityNode {
  id: string;        // Kode Kota (misal: 64.71)
  name: string;
  districts: DistrictNode[]; // Anak-anaknya (Kecamatan)
}

// --- DATA UTAMA (KALIMANTAN TIMUR) ---
// Perhatikan: Tidak ada 'parentId' yang berulang-ulang!
export const DATA_KALTIM: CityNode[] = [
    // KABUPATEN PASER
    {
        id: "64.01",
        name: "KABUPATEN PASER",
        districts: [
            {
                id: "64.01.01",
                name: "BATU SOPANG",
                villages: [
                    { id: "64.01.01.2009", name: "SAMURANGGAU" },
                    { id: "64.01.01.2010", name: "BUSUI" },
                    { id: "64.01.01.2011", name: "BATU KAJANG" },
                    { id: "64.01.01.2012", name: "LEGAI" },
                    { id: "64.01.01.2013", name: "SUNGAI TERIK" },
                    { id: "64.01.01.2014", name: "KASUNGAI" },
                    { id: "64.01.01.2015", name: "RANTAU BUTA" },
                    { id: "64.01.01.2016", name: "RANTAU LAYUNG" },
                    { id: "64.01.01.2017", name: "SONGKA" },
                ]
            },
            {
                id: "64.01.02",
                name: "TANJUNG HARAPAN",
                villages: [
                    { id: "64.71.02.2004", name: "KELADEN" },
                    { id: "64.71.02.2006", name: "TANJUNG ARU" },
                    { id: "64.71.02.2007", name: "LABUANGKALLO" },
                    { id: "64.71.02.2012", name: "LORI" },
                    { id: "64.71.02.2013", name: "SELENGOT" },
                    { id: "64.71.02.2014", name: "RANDOM" },
                    { id: "64.71.02.2015", name: "SENIPAH" },
                ]
            },
            {
                id: "64.01.03",
                name: "PASER BELENGKONG",
                villages: [
                    { id: "64.01.03.2001", name: "LEMPESU" },
                    { id: "64.01.03.2002", name: "BEKOSO" },
                    { id: "64.01.03.2003", name: "DAMIT" },
                    { id: "64.01.03.2004", name: "SUATANG" },
                    { id: "64.01.03.2005", name: "SULILIRAN" },
                    { id: "64.01.03.2006", name: "PASIR BELENGKONG" },
                    { id: "64.01.03.2007", name: "SANGKURIMAN" },
                    { id: "64.01.03.2008", name: "LABURAN" },
                    { id: "64.01.03.2009", name: "SULILIRAN BARU" },
                    { id: "64.01.03.2010", name: "KERESIK BURA" },
                    { id: "64.01.03.2011", name: "LABURAN BARU" },
                    { id: "64.01.03.2012", name: "SENIUNG JAYA" },
                    { id: "64.01.03.2013", name: "SUNGE BATU" },
                    { id: "64.01.03.2014", name: "OLONG PINANG" },
                    { id: "64.01.03.2015", name: "SUATANG KETEBAN" },
                ]
            },
            {
                id: "64.01.04",
                name: "TANAH GROGOT",
                villages: [
                    { id: "64.01.04.1001", name: "TANAH GROGOT" },
                    { id: "64.01.04.2002", name: "JANJU" },
                    { id: "64.01.04.2003", name: "TEPIAN BATANG" },
                    { id: "64.01.04.2004", name: "TANAH PERIUK" },
                    { id: "64.01.04.2005", name: "PEPARA" },
                    { id: "64.01.04.2006", name: "SUNGAI TUAK" },
                    { id: "64.01.04.2007", name: "SEMPULANG" },
                    { id: "64.01.04.2008", name: "JONE" },
                    { id: "64.01.04.2009", name: "RANTAU PANJANG" },
                    { id: "64.01.04.2010", name: "MUARA PASIR" },
                    { id: "64.01.04.2011", name: "PADANG PENGRAPAT" },
                    { id: "64.01.04.2012", name: "PEREPAT" },
                    { id: "64.01.04.2013", name: "PULAU RANTAU" },
                    { id: "64.01.04.2014", name: "SUNGAI LANGIR" },
                    { id: "64.01.04.2015", name: "TAPIS" },
                    { id: "64.01.04.2016", name: "SENAKEN" },
                ]
            },
            {
                id: "64.01.05",
                name: "KUARO",
                villages: [
                    { id: "64.01.05.1001", name: "KUARO" },
                    { id: "64.01.05.2002", name: "LOLO" },
                    { id: "64.01.05.2003", name: "SANDELEY" },
                    { id: "64.01.05.2004", name: "HARAPAN BARU" },
                    { id: "64.01.05.2005", name: "RANGAN" },
                    { id: "64.01.05.2006", name: "MODANG" },
                    { id: "64.01.05.2007", name: "PASIR MAYANG" },
                    { id: "64.01.05.2008", name: "KERTA BUMI" },
                    { id: "64.01.05.2009", name: "PONDANG BARU" },
                    { id: "64.01.05.2010", name: "PADANG JAYA" },
                    { id: "64.01.05.2011", name: "KENDAROM" },
                    { id: "64.01.05.2012", name: "KLEMPANG SARI" },
                    { id: "64.01.05.2013", name: "KELUANG PASER JAYA" },
                ]
            },
            {
                id: "64.01.06",
                name: "LONG IKIS",
                villages: [
                    { id: "64.01.06.1001", name: "LONG IKIS" },
                    { id: "64.01.06.2002", name: "MUARA ADANG" },
                    { id: "64.01.06.2003", name: "TELUK WARUT" },
                    { id: "64.01.06.2004", name: "TAJUR" },
                    { id: "64.01.06.2005", name: "SAMUNTAI" },
                    { id: "64.01.06.2006", name: "LOMBOK" },
                    { id: "64.01.06.2007", name: "PAIT" },
                    { id: "64.01.06.2008", name: "OLUNG" },
                    { id: "64.01.06.2009", name: "KAYUNGO" },
                    { id: "64.01.06.2010", name: "JEMPARING" },
                    { id: "64.01.06.2011", name: "TIWEI" },
                    { id: "64.01.06.2012", name: "BELIMBING" },
                    { id: "64.01.06.2013", name: "LONG GELANG" },
                    { id: "64.01.06.2014", name: "KRAYAN JAYA" },
                    { id: "64.01.06.2015", name: "BUKIT SALOKA" },
                    { id: "64.01.06.2016", name: "KRAYAN SENTOSA" },
                    { id: "64.01.06.2017", name: "KRAYAN MAKMUR" },
                    { id: "64.01.06.2018", name: "KAYUNGO SARI" },
                    { id: "64.01.06.2019", name: "KRAYAN BAHAGIA" },
                    { id: "64.01.06.2020", name: "SAWIT JAYA" },
                    { id: "64.01.06.2021", name: "SEKUROU JAYA" },
                    { id: "64.01.06.2022", name: "KERTA BHAKTI" },
                    { id: "64.01.06.2023", name: "ADANG JAYA" },
                    { id: "64.01.06.2024", name: "TAJER MULYA" },
                    { id: "64.01.06.2025", name: "BREWE" },
                    { id: "64.01.06.2026", name: "ATANG PAIT" },
                ]
            },
            {
                id: "64.01.07",
                name: "MUARA KOMAM",
                villages: [
                    { id: "64.01.07.1001", name: "MUARA KOMAM" },
                    { id: "64.01.07.2002", name: "BATU BUTOK" },
                    { id: "64.01.07.2003", name: "UKO" },
                    { id: "64.01.07.2004", name: "MUARA LANGON" },
                    { id: "64.01.07.2005", name: "BINANGON" },
                    { id: "64.01.07.2006", name: "MUARA KUARO" },
                    { id: "64.01.07.2007", name: "PRAYON" },
                    { id: "64.01.07.2008", name: "LONG SAYO" },
                    { id: "64.01.07.2009", name: "MUARA PAYANG" },
                    { id: "64.01.07.2010", name: "LUSAN" },
                    { id: "64.01.07.2011", name: "SWAN SLUTUNG" },
                    { id: "64.01.07.2012", name: "SEKUAN MAKMUR" },
                    { id: "64.01.07.2013", name: "SELERONG" },
                ]
            },
            {
                id: "64.01.08",
                name: "LONG KALI",
                villages: [
                    { id: "64.01.08.1001", name: "LONG KALI" },
                    { id: "64.01.08.2002", name: "MUARA TELAKE" },
                    { id: "64.01.08.2003", name: "SEBAKUNG" },
                    { id: "64.01.08.2004", name: "BENTE TUALAN" },
                    { id: "64.01.08.2005", name: "MENDIK" },
                    { id: "64.01.08.2006", name: "MUNGGU" },
                    { id: "64.01.08.2007", name: "MUARA PIAS" },
                    { id: "64.01.08.2008", name: "MUARA TOYU" },
                    { id: "64.01.08.2009", name: "PERKUWEN" },
                    { id: "64.01.08.2010", name: "PINANG JATUS" },
                    { id: "64.01.08.2011", name: "MUARA LAMBAKAN" },
                    { id: "64.01.08.2012", name: "KEPALA TELAKE" },
                    { id: "64.01.08.2013", name: "MENDIK MAKMUR" },
                    { id: "64.01.08.2014", name: "MENDIK KARYA" },
                    { id: "64.01.08.2015", name: "MENDIK BHAKTI" },
                    { id: "64.01.08.2016", name: "SEBAKUNG TAKA" },
                    { id: "64.01.08.2017", name: "MARUAT" },
                    { id: "64.01.08.2018", name: "SEBAKUNG MAKMUR" },
                    { id: "64.01.08.2019", name: "PETIKU" },
                    { id: "64.01.08.2020", name: "MUARA ADANG II" },
                    { id: "64.01.08.2021", name: "MAKMUR JAYA" },
                    { id: "64.01.08.2022", name: "GUNUNG PUTAR" },
                    { id: "64.01.08.2023", name: "PUTANG" },
                ]
            },
            {
                id: "64.01.09",
                name: "BATU ENGAU",
                villages: [
                    { id: "64.01.09.2001", name: "KERANG" },
                    { id: "64.01.09.2002", name: "LOMU" },
                    { id: "64.01.09.2003", name: "SEGENDANG" },
                    { id: "64.01.09.2004", name: "MENGKUDU" },
                    { id: "64.01.09.2005", name: "RIWANG" },
                    { id: "64.01.09.2006", name: "LANGGAI" },
                    { id: "64.01.09.2007", name: "PETANGIS" },
                    { id: "64.01.09.2008", name: "TAMPAKAN" },
                    { id: "64.01.09.2009", name: "KERANG DAYO" },
                    { id: "64.01.09.2010", name: "SAING PRUPUK" },
                    { id: "64.01.09.2011", name: "BAI JAYA" },
                    { id: "64.01.09.2012", name: "PENGGUREN JAYA" },
                    { id: "64.01.09.2013", name: "TEBRU PSER DAMAI" },
                ]
            },
            {
                id: "64.01.10",
                name: "MUARA SAMU",
                villages: [
                    { id: "64.01.10.2001", name: "TANJUNG PINANG" },
                    { id: "64.01.10.2002", name: "RANTAU ATAS" },
                    { id: "64.01.10.2003", name: "LIBUR DINDING" },
                    { id: "64.01.10.2004", name: "LUAN" },
                    { id: "64.01.10.2005", name: "SUWETO" },
                    { id: "64.01.10.2006", name: "MUSER" },
                    { id: "64.01.10.2007", name: "BIU" },
                    { id: "64.01.10.2008", name: "RANTAU BINTUNGAN" },
                    { id: "64.01.10.2009", name: "MUARA ANDEH" },
                ]
            },
        ]
    },
    // KABUPATEN KUTAI KARTANEGARA
    {
        id: "64.02",
        name: "KABUPATEN KUTAI KARTANEGARA",
        districts: [
            {
                id: "64.02.01",
                name: "MUARA MUNTAI",
                villages: [
                    { id: "64.02.01.2001", name: "PERIAN" },
                    { id: "64.02.01.2002", name: "MUARA LEKA" },
                    { id: "64.02.01.2003", name: "MUAR ALOH" },
                    { id: "64.02.01.2004", name: "JANTUR" },
                    { id: "64.02.01.2005", name: "BATUQ" },
                    { id: "64.02.01.2006", name: "REBAQ RINDING" },
                    { id: "64.02.01.2007", name: "MUARA MUNTAI ULU" },
                    { id: "64.02.01.2008", name: "MUARA MUNTAI ILIR" },
                    { id: "64.02.01.2009", name: "KAYU BATU" },
                    { id: "64.02.01.2010", name: "JANTUR SELATAN" },
                    { id: "64.02.01.2011", name: "TANJUNG BATUQ HARAPAN" },
                    { id: "64.02.01.2012", name: "PULAU HARAPAN" },
                    { id: "64.02.01.2013", name: "JANTUR BARU" }
                ]
            },
            {
                id: "64.02.02",
                name: "LOA KULU",
                villages: [
                    { id: "64.02.02.2001", name: "JONGGON DESA" },
                    { id: "64.02.02.2002", name: "SUNGAI PAYANG" },
                    { id: "64.02.02.2003", name: "JEMBAYAN" },
                    { id: "64.02.02.2004", name: "LOA KULU KOTA" },
                    { id: "64.02.02.2005", name: "LOH SUMBER" },
                    { id: "64.02.02.2006", name: "PONORAGAN" },
                    { id: "64.02.02.2007", name: "REMPANGA" },
                    { id: "64.02.02.2008", name: "MARGAHAYU" },
                    { id: "64.02.02.2009", name: "KARYA UTAMA" },
                    { id: "64.02.02.2010", name: "LUNG ANAI" },
                    { id: "64.02.02.2011", name: "JEMBAYAN TENGAH" },
                    { id: "64.02.02.2012", name: "JEMBAYAN DALAM" },
                    { id: "64.02.02.2013", name: "SEPAKAT" },
                    { id: "64.02.02.2014", name: "SUMBER SARI" },
                    { id: "64.02.02.2015", name: "JONGKANG" }
                ]
            },
            {
                id: "64.02.03",
                name: "LOA JANAN",
                villages: [
                    { id: "64.02.03.2001", name: "BAKUNGAN" },
                    { id: "64.02.03.2002", name: "LOA DURI ULU" },
                    { id: "64.02.03.2003", name: "LOA JANAN ULU" },
                    { id: "64.02.03.2004", name: "PURWAJAYA" },
                    { id: "64.02.03.2005", name: "TANI BHAKTI" },
                    { id: "64.02.03.2006", name: "BATUAH" },
                    { id: "64.02.03.2007", name: "LOA DURI ILIR" },
                    { id: "64.02.03.2008", name: "TANI HARAPAN" }
                ]
            },
            {
                id: "64.02.04",
                name: "ANGGANA",
                villages: [
                    { id: "64.02.04.2001", name: "SEPATIN" },
                    { id: "64.02.04.2002", name: "MUARA PANTUAN" },
                    { id: "64.02.04.2003", name: "TANI BARU" },
                    { id: "64.02.04.2004", name: "KUTAI LAMA" },
                    { id: "64.02.04.2005", name: "ANGGANA" },
                    { id: "64.02.04.2006", name: "SUNGAI MERIAM" },
                    { id: "64.02.04.2007", name: "SIDOMULYO" },
                    { id: "64.02.04.2008", name: "HANDIL TERUSAN" }
                ]
            },
            {
                id: "64.02.05",
                name: "MUARA BADAK",
                villages: [
                    { id: "64.02.05.2001", name: "SALIKI" },
                    { id: "64.02.05.2002", name: "SALO PALAI" },
                    { id: "64.02.05.2003", name: "MUARA BADAK ULU" },
                    { id: "64.02.05.2004", name: "MUARA BADAK ILIR" },
                    { id: "64.02.05.2005", name: "TANJUNG LIMAU" },
                    { id: "64.02.05.2006", name: "TANAH DATAR" },
                    { id: "64.02.05.2007", name: "BADAK BARU" },
                    { id: "64.02.05.2008", name: "SUKA DAMAI" },
                    { id: "64.02.05.2009", name: "BADAK MEKAR" },
                    { id: "64.02.05.2010", name: "GAS ALAM BADAK I" },
                    { id: "64.02.05.2011", name: "BATU-BATU" },
                    { id: "64.02.05.2012", name: "SALO CELLA" },
                    { id: "64.02.05.2013", name: "SUNGAI BAWANG" },
                ]
            },
            {
                id: "64.02.06",
                name: "TENGGARONG",
                villages: [
                    { id: "64.02.06.1001", name: "JAHAB" },
                    { id: "64.02.06.1002", name: "LOA IPUH" },
                    { id: "64.02.06.1003", name: "BUKIT BIRU" },
                    { id: "64.02.06.1004", name: "TIMBAU" },
                    { id: "64.02.06.1005", name: "MELAYU" },
                    { id: "64.02.06.1006", name: "PANJI" },
                    { id: "64.02.06.1007", name: "SUKARAME" },
                    { id: "64.02.06.1008", name: "KAMPUNG BARU" },
                    { id: "64.02.06.1009", name: "LOA TEBU" },
                    { id: "64.02.06.1010", name: "MANGKURAWANG" },
                    { id: "64.02.06.1011", name: "MALUHU" },
                    { id: "64.02.06.2012", name: "RAMPAK LABUR" },
                    { id: "64.02.06.1013", name: "LOA IPUTH DARAT" },
                    { id: "64.02.06.2014", name: "BENDANG RAYA" },
                ]
            },
            {
                id: "64.02.07",
                name: "SEBULU",
                villages: [
                    { id: "64.02.07.2001", name: "SELERONG" },
                    { id: "64.02.07.2002", name: "TANJUNG HARAPAN" },
                    { id: "64.02.07.2003", name: "BELORO" },
                    { id: "64.02.07.2004", name: "SEBULU ULU" },
                    { id: "64.02.07.2005", name: "SEBULU ILIR" },
                    { id: "64.02.07.2006", name: "SEGIHAN" },
                    { id: "64.02.07.2007", name: "SUMBER SARI" },
                    { id: "64.02.07.2008", name: "MANUNGGAL DAYA" },
                    { id: "64.02.07.2009", name: "GIRI AGUNG" },
                    { id: "64.02.07.2010", name: "SENONI" },
                    { id: "64.02.07.2011", name: "SEBULU MODEREN" },
                    { id: "64.02.07.2012", name: "SANGGULAN" },
                    { id: "64.02.07.2013", name: "LEKAQ KIDAU" },
                    { id: "64.02.07.2014", name: "MEKAR JAYA" }
                ]
            },
            {
                id: "64.02.08",
                name: "KOTA BANGUN",
                villages: [
                    { id: "64.02.08.2001", name: "KEDANG IPIL" },
                    { id: "64.02.08.2002", name: "BENUA BARU" },
                    { id: "64.02.08.2003", name: "SEDULANG" },
                    { id: "64.02.08.2004", name: "LOLENG" },
                    { id: "64.02.08.2005", name: "KOTA BANGUN ULU" },
                    { id: "64.02.08.2006", name: "KOTA BANGUN ILIR" },
                    { id: "64.02.08.2007", name: "LIANG" },
                    { id: "64.02.08.2008", name: "MUHURAN" },
                    { id: "64.02.08.2009", name: "PELA" },
                    { id: "64.02.08.2010", name: "KOTA BANGUN I" },
                    { id: "64.02.08.2011", name: "KOTA BANGUN II" },
                    { id: "64.02.08.2012", name: "KOTA BANGU III" },
                    { id: "64.02.08.2013", name: "SUMBER SARI" },
                    { id: "64.02.08.2014", name: "SARI NADI" },
                    { id: "64.02.08.2015", name: "SUKA BUMI" },
                    { id: "64.02.08.2016", name: "WONOSARI" },
                    { id: "64.02.08.2017", name: "KEDANG MURUNG" },
                    { id: "64.02.08.2018", name: "KOTA BANGUN SEBERANG" },
                    { id: "64.02.08.2019", name: "LIANG ULU" },
                    { id: "64.02.08.2020", name: "SEBELIMBINGAN" },
                    { id: "64.02.08.2021", name: "SANGKULIMAN" },
                ]
            },
            {
                id: "64.02.09",
                name: "KENOHAN",
                villages: [
                    { id: "64.02.09.2001", name: "LAMIN TELIHAN" },
                    { id: "64.02.09.2002", name: "LAMIN PULUT" },
                    { id: "64.02.09.2003", name: "TELUK BINGKAI" },
                    { id: "64.02.09.2004", name: "KAHALA" },
                    { id: "64.02.09.2005", name: "TUBUHAN" },
                    { id: "64.02.09.2006", name: "SEMAYANG" },
                    { id: "64.02.09.2007", name: "TELUK MUDA" },
                    { id: "64.02.09.2008", name: "TUANA TUHA" },
                    { id: "64.02.09.2009", name: "KAHALA ILIR" }
                ]
            },
            {
                id: "64.02.10",
                name: "KEMBANG JANGGUT",
                villages: [
                    { id: "64.01.10.2001", name: "GENTING TANAH" },
                    { id: "64.01.10.2002", name: "LOA SAKOH" },
                    { id: "64.01.10.2003", name: "HAMBAU" },
                    { id: "64.01.10.2004", name: "KEMBANG JANGGUT" },
                    { id: "64.01.10.2005", name: "KELEKAT" },
                    { id: "64.01.10.2006", name: "PULAU PINANG" },
                    { id: "64.01.10.2007", name: "LONG BELEH HALOQ" },
                    { id: "64.01.10.2008", name: "LONG BELEH MODANG" },
                    { id: "64.01.10.2009", name: "MUAI" },
                    { id: "64.01.10.2010", name: "PERDANA" },
                    { id: "64.01.10.2011", name: "BUKIT LAYANG" }
                ]
            },
            {
                id: "64.02.11",
                name: "MUARA KAMAN",
                villages: [
                    { id: "64.02.11.2001", name: "MUARA KAMAN ILIR" },
                    { id: "64.02.11.2002", name: "RANTAU HEMPANG" },
                    { id: "64.02.11.2003", name: "TERATAK" },
                    { id: "64.02.11.2004", name: "BENUA PUHUN" },
                    { id: "64.02.11.2005", name: "MUARA KAMAN ULU" },
                    { id: "64.02.11.2006", name: "SABINTULUNG" },
                    { id: "64.02.11.2007", name: "MUARA SIRAN" },
                    { id: "64.02.11.2008", name: "TUNJUNGAN" },
                    { id: "64.02.11.2009", name: "SEDULANG" },
                    { id: "64.02.11.2010", name: "MENAMANG KIRI" },
                    { id: "64.02.11.2011", name: "MENAMANG KANAN" },
                    { id: "64.02.11.2012", name: "SIDOMUKTI" },
                    { id: "64.02.11.2013", name: "PANCA JAYA" },
                    { id: "64.02.11.2014", name: "BUNGA JADI" },
                    { id: "64.02.11.2015", name: "KUPANG BARU" },
                    { id: "64.02.11.2016", name: "LEBAHO ULAQ" },
                    { id: "64.02.11.2017", name: "BUKIT JERING" },
                    { id: "64.02.11.2018", name: "LIANG BUAYA" },
                    { id: "64.02.11.2019", name: "PUANK CEPAK" },
                    { id: "64.02.11.2020", name: "CIPARI MAKMUR" }
                ]
            },
            {
                id: "64.02.12",
                name: "TABANG",
                villages: [
                    { id: "64.02.12.2001", name: "GUNUNG SARI" },
                    { id: "64.02.12.2002", name: "LONG LALANG" },
                    { id: "64.02.12.2003", name: "MUARA RITAN" },
                    { id: "64.02.12.2004", name: "BUKUK SEN" },
                    { id: "64.02.12.2005", name: "UMAQ DIAN" },
                    { id: "64.02.12.2006", name: "MUARA PEDOHON" },
                    { id: "64.02.12.2007", name: "BILA TALANG" },
                    { id: "64.02.12.2008", name: "KAMPUNG BARU" },
                    { id: "64.02.12.2009", name: "UMAQ TUKUNG" },
                    { id: "64.02.12.2010", name: "SIDOMULYO" },
                    { id: "64.02.12.2011", name: "UMAQ BEKUAY" },
                    { id: "64.02.12.2012", name: "TABANG LAMA" },
                    { id: "64.02.12.2013", name: "MUARA TIQ" },
                    { id: "64.02.12.2014", name: "MUARA SALUNG" },
                    { id: "64.02.12.2015", name: "MUARA KEBAQ" },
                    { id: "64.02.12.2016", name: "MUARA BELINAU" },
                    { id: "64.02.12.2017", name: "MUARA TUBOQ" },
                    { id: "64.02.12.2018", name: "RITAN BARU" },
                    { id: "64.02.12.2019", name: "TUKUNG RITAN" }
                ]
            },
            {
                id: "64.02.13",
                name: "SAMBOJA",
                villages: [
                    { id: "64.02.13.1001", name: "SALOK API BARAT" },
                    { id: "64.02.13.1002", name: "SALOK API LAUT" },
                    { id: "64.02.13.1003", name: "AMBARAWANG LAUT" },
                    { id: "64.02.13.1004", name: "AMBARAWANG DARAT" },
                    { id: "64.02.13.1005", name: "MARGOMULYO" },
                    { id: "64.02.13.1006", name: "SUNGAI MERDEKA" },
                    { id: "64.02.13.1007", name: "SUNGAI SELUANG" },
                    { id: "64.02.13.1008", name: "WONOTIRTO" },
                    { id: "64.02.13.1009", name: "TANJUNG HARAPAN" },
                    { id: "64.02.13.1010", name: "SAMBOJA KUALA" },
                    { id: "64.02.13.1011", name: "SANIPAH" },
                    { id: "64.02.13.1012", name: "HANDIL BARU" },
                    { id: "64.02.13.1013", name: "MUARA SEMBILANG" },
                    { id: "64.02.13.2014", name: "KARYA JAYA" },
                    { id: "64.02.13.1015", name: "BUKIT MERDEKA" },
                    { id: "64.02.13.2016", name: "BUKIT RAYA" },
                    { id: "64.02.13.1017", name: "ARGO SARI" },
                    { id: "64.02.13.2018", name: "TANI BHAKTI" },
                    { id: "64.02.13.2019", name: "BERINGIN AGUNG" },
                    { id: "64.02.13.1020", name: "KARYA MERDEKA" },
                    { id: "64.02.13.1021", name: "TELUK PEMEDAS" },
                    { id: "64.02.13.1022", name: "KAMPUNG LAMA" },
                    { id: "64.02.13.1023", name: "HANDIL BARU DARAT" },
                ]
            },
            {
                id: "64.02.14",
                name: "MUARA JAWA",
                villages: [
                    { id: "64.02.14.1001", name: "MUARA JAWA ILIR" },
                    { id: "64.02.14.1002", name: "MUARA JAWA TENGAH" },
                    { id: "64.02.14.1003", name: "MUARA JAWA ULU" },
                    { id: "64.02.14.1004", name: "TELUK DALAM" },
                    { id: "64.02.14.1005", name: "DONDANG" },
                    { id: "64.02.14.1006", name: "TAMA POLE" },
                    { id: "64.02.14.1007", name: "MUARA KEMBANG" },
                    { id: "64.02.14.1008", name: "MUARA JAWA" }
                ]
            },
            {
                id: "64.02.15",
                name: "SANGA SANGA",
                villages: [
                    { id: "64.02.15.1001", name: "JAWA" },
                    { id: "64.02.15.1002", name: "PENDINGIN" },
                    { id: "64.02.15.1003", name: "SANGA-SANGA DALAM" },
                    { id: "64.02.15.1004", name: "SARI JAYA" },
                    { id: "64.02.15.1005", name: "SANGA-SANGA MUARA" }
                ]
            },
            {
                id: "64.02.16",
                name: "TENGGARONG SEBERANG",
                villages: [
                    { id: "64.02.16.2001", name: "MANUNGGAL JAYA" },
                    { id: "64.02.16.2002", name: "BUKIT RAYA" },
                    { id: "64.02.16.2003", name: "EMBALUT" },
                    { id: "64.02.16.2004", name: "BANGUN REJO" },
                    { id: "64.02.16.2005", name: "KERTA BUANA" },
                    { id: "64.02.16.2006", name: "SEPARI" },
                    { id: "64.02.16.2007", name: "BUKIT PARIAMAN" },
                    { id: "64.02.16.2008", name: "BUANA JAYA" },
                    { id: "64.02.16.2009", name: "MULAWARMAN" },
                    { id: "64.02.16.2010", name: "LOA ULUNG" },
                    { id: "64.02.16.2011", name: "LOA RAYA" },
                    { id: "64.02.16.2012", name: "PERJIWA" },
                    { id: "64.02.16.2013", name: "TELUK DALAM" },
                    { id: "64.02.16.2014", name: "LOA LEPU" },
                    { id: "64.02.16.2015", name: "SUKA MAJU" },
                    { id: "64.02.16.2016", name: "LOA PARI" },
                    { id: "64.02.16.2017", name: "KARANG TUNGGAL" },
                    { id: "64.02.16.2018", name: "TANJUNG BATU" }
                ]
            },
            {
                id: "64.02.17",
                name: "MARANG KAYU",
                villages: [
                    { id: "64.02.17.2001", name: "SEBUNTAL" },
                    { id: "64.02.17.2002", name: "SANTAN ULU" },
                    { id: "64.02.17.2003", name: "SANTAN TENGAH" },
                    { id: "64.02.17.2004", name: "SANTAN ILIR" },
                    { id: "64.02.17.2005", name: "KERSIK" },
                    { id: "64.02.17.2006", name: "BUNGA PUTIH" },
                    { id: "64.02.17.2007", name: "MAKARTI" },
                    { id: "64.02.17.2008", name: "PRANGAT SELATAN" },
                    { id: "64.02.17.2009", name: "PRANGAT BARU" },
                    { id: "64.02.17.2010", name: "SEMANGKO" },
                    { id: "64.02.17.2011", name: "SAMBERA BARU" }
                ]
            },
            {
                id: "64.02.18",
                name: "MUARA WIS",
                villages: [
                    { id: "64.02.18.2001", name: "MUARA WIS" },
                    { id: "64.02.18.2002", name: "SEBEMBAN" },
                    { id: "64.02.18.2003", name: "MELINTANG" },
                    { id: "64.02.18.2004", name: "ENGGELAM" },
                    { id: "64.02.18.2005", name: "LEBAK MANTAN" },
                    { id: "64.02.18.2006", name: "LEBAK CILONG" },
                    { id: "64.02.18.2007", name: "MUARA ENGGELAM" },
                ]
            }
        ]
    },
    // KABUPATEN BERAU
    {
        id: "64.03",
        name: "KABUPATEN BERAU",
        districts: [
            {
                id: "64.03.01",
                name: "KELAY",
                villages: [
                    { id: "64.03.01.2001", name: "MERABU" },
                    { id: "64.03.01.2002", name: "PANAAN" },
                    { id: "64.03.01.2003", name: "MERAPUN" },
                    { id: "64.03.01.2004", name: "MUARA LESAN" },
                    { id: "64.03.01.2005", name: "MERASA" },
                    { id: "64.03.01.2006", name: "LESAN DAYAK" },
                    { id: "64.03.01.2007", name: "LONG BELIU" },
                    { id: "64.03.01.2008", name: "LONG DUHUNG" },
                    { id: "64.03.01.2009", name: "LONG LAMCIN" },
                    { id: "64.03.01.2010", name: "LONG KELUH" },
                    { id: "64.03.01.2011", name: "LONG PELAY" },
                    { id: "64.03.01.2012", name: "MAPULU" },
                    { id: "64.03.01.2013", name: "LONG SULUI" },
                    { id: "64.03.01.2014", name: "SIDO BANGEN" }
                    
                ]
            },
            {
                id: "64.03.02",
                name: "TALISAYAN",
                villages: [
                    { id: "64.03.02.2002", name: "DUMARING" },
                    { id: "64.03.02.2003", name: "TALISAYAN" },
                    { id: "64.03.02.2014", name: "CAMPUR SARI" },
                    { id: "64.03.02.2015", name: "BUMI JAYA" },
                    { id: "64.03.02.2016", name: "TUNGGAL BUMI" },
                    { id: "64.03.02.2017", name: "SUMBER MULYA" },
                    { id: "64.03.02.2018", name: "SUKA MURYA" },
                    { id: "64.03.02.2019", name: "PURNA SARI JAYA" },
                    { id: "64.03.02.2021", name: "EKA SAPTA" },
                    { id: "64.03.02.2023", name: "CAPUAK" }
                ]
            },
            {
                id: "64.03.03",
                name: "SAMBALIUNG",
                villages: [
                    { id: "64.03.03.2001", name: "LONG LANUK" },
                    { id: "64.03.03.2002", name: "TUMBIT DAYAK" },
                    { id: "64.03.03.2004", name: "INARAN" },
                    { id: "64.03.03.2005", name: "PEGAT BUKUR" },
                    { id: "64.03.03.2006", name: "RANTAU PANJANG" },
                    { id: "64.03.03.2007", name: "SUARAN" },
                    { id: "64.03.03.2008", name: "PILANJAU" },
                    { id: "64.03.03.2009", name: "PESAYAN" },
                    { id: "64.03.03.2010", name: "SEI BEBANIR BANGUN" },
                    { id: "64.03.03.2011", name: "GURIMBANG" },
                    { id: "64.03.03.2012", name: "SUKAN TENGAH" },
                    { id: "64.03.03.2013", name: "SAMBALIUNG" },
                    { id: "64.03.03.2014", name: "TANJUNG PERANGAT" },
                    { id: "64.03.03.2015", name: "BENA BARU" },
                ]
            },
            {
                id: "64.03.04",
                name: "SEGAH",
                villages: [
                    { id: "64.03.04.2001", name: "LONG LA'AI" },
                    { id: "64.03.04.2002", name: "PUNAN SEGAH" },
                    { id: "64.03.04.2003", name: "LONG AYAP" },
                    { id: "64.03.04.2004", name: "LONG AYAN" },
                    { id: "64.03.04.2005", name: "PUNAN MALINAU" },
                    { id: "64.03.04.2006", name: "PUNAN MAHKAM" },
                    { id: "64.03.04.2007", name: "GUNUNG SARI" },
                    { id: "64.03.04.2008", name: "PANDAN SARI" },
                    { id: "64.03.04.2009", name: "BUKIT MAKMUR" },
                    { id: "64.03.04.2010", name: "HARAPAN JAYA" },
                    { id: "64.03.04.2011", name: "TEPIAN BUAH" },
                    { id: "64.03.04.2012", name: "BATU RAJANG" },
                    { id: "64.03.04.2013", name: "SIDUUNG INDAH" }
                ]
            },
            {
                id: "64.03.05",
                name: "TANJUNG REDEB",
                villages: [
                    { id: "64.03.05.1003", name: "SUNGAI BEDUNGUN" },
                    { id: "64.03.05.1004", name: "TANJUNG REDEB" },
                    { id: "64.03.05.1005", name: "BUGIS" },
                    { id: "64.03.05.1006", name: "GAYAM" },
                    { id: "64.03.05.1007", name: "KARANG AMBUN" },
                    { id: "64.03.05.1008", name: "GUNUNG PANJANG" }
                ]
            },
            {
                id: "64.03.06",
                name: "GUNUNG TABUR",
                villages: [
                    { id: "64.03.06.2001", name: "TASUK" },
                    { id: "64.03.06.2002", name: "BIRANG" },
                    { id: "64.03.06.1003", name: "GUNUNG TABUR" },
                    { id: "64.03.06.2004", name: "MALUANG" },
                    { id: "64.03.06.2005", name: "SAMBURAKAT" },
                    { id: "64.03.06.2006", name: "SAMBAKUNGAN" },
                    { id: "64.03.06.2007", name: "MERANCANG ULU" },
                    { id: "64.03.06.2008", name: "MERANCANG ILIR" },
                    { id: "64.03.06.2009", name: "PULAU BESING" },
                    { id: "64.03.06.2010", name: "MELATI JAYA" },
                    { id: "64.03.06.2011", name: "BATU-BATU" }
                ]
            },
            {
                id: "64.03.07",
                name: "PULAU DERAWAN",
                villages: [
                    { id: "64.03.07.2001", name: "PEGAT BATUMBUK" },
                    { id: "64.03.07.2002", name: "TELUK SEMANTING" },
                    { id: "64.03.07.2003", name: "TANJUNG BATU" },
                    { id: "64.03.07.2004", name: "PULAU DERAWAN" },
                    { id: "64.03.07.2009", name: "KASAI" }
                ]
            },
            {
                id: "64.03.08",
                name: "BIDUK-BIDUK",
                villages: [
                    { id: "64.03.08.2001", name: "BIDUK-BIDUK" },
                    { id: "64.03.08.2002", name: "PANTAI HARAPAN" },
                    { id: "64.03.08.2003", name: "TANJUNG PREPAT" },
                    { id: "64.03.08.2004", name: "TELUK SUMBANG" },
                    { id: "64.03.08.2008", name: "TELUK SULAIMAN" },
                    { id: "64.03.08.2009", name: "GIRING-GIRING" }
                ]
            },
            {
                id: "64.03.09",
                name: "TELUK BAYUR",
                villages: [
                    { id: "64.03.09.2001", name: "TUMBIT MELAYU" },
                    { id: "64.03.09.1002", name: "TELUK BAYUR" },
                    { id: "64.03.09.1003", name: "RINDING" },
                    { id: "64.03.09.2004", name: "LABANAN JAYA" },
                    { id: "64.03.09.2005", name: "LABANAN MAKMUR" },
                    { id: "64.03.09.2006", name: "LABANAN MAKARTI" }
                ]
            },
            {
                id: "64.03.10",
                name: "TABALAR",
                villages: [
                    { id: "64.03.10.2002", name: "TABALAR MUARA" },
                    { id: "64.03.10.2003", name: "TUBAAN" },
                    { id: "64.03.10.2004", name: "TABALAR ULU" },
                    { id: "64.03.10.2005", name: "SEMURUT" },
                    { id: "64.03.10.2006", name: "BUYUNG-BUYUNG" },
                    { id: "64.03.10.2007", name: "HARAPAN MAJU" }
                ]
            },
            {
                id: "64.03.11",
                name: "MARATUA",
                villages: [
                    { id: "64.03.11.2001", name: "BOHE SILIAN" },
                    { id: "64.03.11.2002", name: "PAYUNG-PAYUNG" },
                    { id: "64.03.11.2003", name: "TELUK ALULU" },
                    { id: "64.03.11.2004", name: "TELUK HARAPAN" },
                ]
            },
            {
                id: "64.03.12",
                name: "BATU PUTIH",
                villages: [
                    { id: "64.03.12.2001", name: "TEMBUDAN" },
                    { id: "64.03.12.2002", name: "KAYU INDAH" },
                    { id: "64.03.12.2003", name: "BATU PUTIH" },
                    { id: "64.03.12.2004", name: "LOBANG KELATAK" },
                    { id: "64.03.12.2005", name: "AMPEN MEDANG" },
                    { id: "64.03.12.2006", name: "BALIKUKUP" },
                    { id: "64.03.12.2007", name: "SUMBER AGUNG" }
                ]
            },
            {
                id: "64.03.13",
                name: "BIATAN",
                villages: [
                    { id: "64.03.13.2001", name: "BIATAN ULU" },
                    { id: "64.03.13.2002", name: "BIATAN ILIR" },
                    { id: "64.03.13.2003", name: "KARANGAN" },
                    { id: "64.03.13.2004", name: "BIATAN LEMPAKE" },
                    { id: "64.03.13.2005", name: "MANUNGGAL JAYA" },
                    { id: "64.03.13.2006", name: "BIATAN BAPINANG" },
                    { id: "64.03.13.2007", name: "BIATAN BARU" },
                    { id: "64.03.13.2008", name: "BUKIT MAKMUR JAYA" }
                ]
            }
        ]
    },
    // KABUPATEN KUTAI BARAT
    {
        id: "64.07",
        name: "KABUPATEN KUTAI BARAT",
        districts: [
            {
                id: "64.07.05",
                name: "LONG IRAM",
                villages: [
                    { id: "64.07.05.2008", name: "LINGGANG MUARA LEBAN" },
                    { id: "64.07.05.2009", name: "LONG IRAM SEBERANG" },
                    { id: "64.07.05.2010", name: "LONG IRAM ILIR" },
                    { id: "64.07.05.2011", name: "ANAH" },
                    { id: "64.07.05.2015", name: "LONG DALIQ" },
                    { id: "64.07.05.2016", name: "LONG IRAM KOTA" },
                    { id: "64.07.05.2017", name: "LONG IRAM BAYAN" },
                    { id: "64.07.05.2018", name: "KELIWAI" },
                    { id: "64.07.05.2019", name: "UJOH HALANG" },
                    { id: "64.07.05.2021", name: "KELIAN LUAR" },
                    { id: "64.07.05.2022", name: "SUKOMULYO" }
                ]
            },
            {
                id: "64.07.06",
                name: "MELAK",
                villages: [
                    { id: "64.07.06.2001", name: "EMPAS" },
                    { id: "64.07.06.2002", name: "EMPAKUQ" },
                    { id: "64.07.06.2003", name: "MUAR ABUNYUT" },
                    { id: "64.07.06.1006", name: "MELAK ILIR" },
                    { id: "64.07.06.1011", name: "MELAK ULU" },
                    { id: "64.07.06.2012", name: "MUARA BENANGAQ" }
                ]
            },
            {
                id: "64.07.07",
                name: "BARONG TONGKOK",
                villages: [
                    { id: "64.07.07.1001", name: "BARONG TONGKOK" },
                    { id: "64.07.07.2002", name: "MENCIMAI" },
                    { id: "64.07.07.2003", name: "ENGKUNI PASEK" },
                    { id: "64.07.07.2004", name: "PEPAS EHENG" },
                    { id: "64.07.07.2006", name: "JUHAN ASA" },
                    { id: "64.07.07.2007", name: "ASA" },
                    { id: "64.07.07.2008", name: "PEPES ASA" },
                    { id: "64.07.07.2009", name: "MUARA ASA" },
                    { id: "64.07.07.2010", name: "ONGKO ASA" },
                    { id: "64.07.07.2011", name: "JUAQ ASA" },
                    { id: "64.07.07.2012", name: "OMBAU ASA" },
                    { id: "64.07.07.2013", name: "NGENYAN ASA" },
                    { id: "64.07.07.2014", name: "GEMUHAN ASA" },
                    { id: "64.07.07.2015", name: "GELEO BARU" },
                    { id: "64.07.07.2016", name: "GELEO ASA" },
                    { id: "64.07.07.2017", name: "REJO BASUKI" },
                    { id: "64.07.07.2018", name: "SUMBER SARI" },
                    { id: "64.07.07.2019", name: "SENDAWAR" },
                    { id: "64.07.07.2020", name: "BALOK ASA" },
                    { id: "64.07.07.1021", name: "SIMPANG RAYA" },
                    { id: "64.07.07.2022", name: "BELEMPUNG ULAQ" }
                ]
            },
            {
                id: "64.07.08",
                name: "DAMAI",
                villages: [
                    { id: "64.07.08.2001", name: "BESIQ" },
                    { id: "64.07.08.2002", name: "BERMAI" },
                    { id: "64.07.08.2003", name: "MUARA NILIQ" },
                    { id: "64.07.08.2004", name: "MANTAR" },
                    { id: "64.07.08.2005", name: "MUARA BOMBOY" },
                    { id: "64.07.08.2006", name: "DAMAI SEBERANG" },
                    { id: "64.07.08.2007", name: "MENDIKA" },
                    { id: "64.07.08.2008", name: "DAMAI KOTA" },
                    { id: "64.07.08.2009", name: "LUMPAT DAHUQ" },
                    { id: "64.07.08.2010", name: "MUARA TOKONG" },
                    { id: "64.07.08.2011", name: "JENGAN DANUM" },
                    { id: "64.07.08.2012", name: "KEAY" },
                    { id: "64.07.08.2013", name: "TAPULANG" },
                    { id: "64.07.08.2014", name: "BENUNG" },
                    { id: "64.07.08.2020", name: "MUARA NYAHING" },
                    { id: "64.07.08.2021", name: "SEMPATAN" },
                    { id: "64.07.08.2022", name: "KELIAN" }
                ]
            },
            {
                id: "64.07.09",
                name: "MUARA LAWA",
                villages: [
                    { id: "64.07.09.2001", name: "MUARA BEGAI" },
                    { id: "64.07.09.2002", name: "LOTAQ" },
                    { id: "64.07.09.2003", name: "PAYANG" },
                    { id: "64.07.09.2004", name: "DINGIN" },
                    { id: "64.07.09.2005", name: "MUARA LAWA" },
                    { id: "64.07.09.2006", name: "LAMBING" },
                    { id: "64.07.09.2007", name: "BENGGERIS" },
                    { id: "64.07.09.2008", name: "CEMPEDES" }
                ]
            },
            {
                id: "64.07.10",
                name: "MUARA PAHU",
                villages: [
                    { id: "64.07.10.2015", name: "JERANG DAYAK" },
                    { id: "64.07.10.2016", name: "MENDUNG" },
                    { id: "64.07.10.2017", name: "JERANG MELAYU" },
                    { id: "64.07.10.2018", name: "DASAQ" },
                    { id: "64.07.10.2020", name: "TEPIAN ULAQ" },
                    { id: "64.07.10.2021", name: "SEBELANG" },
                    { id: "64.07.10.2022", name: "MUARA BAROH" },
                    { id: "64.07.10.2023", name: "TELUK TEMPUDAU" },
                    { id: "64.07.10.2024", name: "TANJUNG LAONG" },
                    { id: "64.07.10.2025", name: "TANJUNG PAGAR" },
                    { id: "64.07.10.2029", name: "GUNUNG BAYAN" },
                    { id: "64.07.10.2030", name: "MUARA BELOAN" }
                ]
            },
            {
                id: "64.07.11",
                name: "JEMPANG",
                villages: [
                    { id: "64.07.11.2001", name: "PENTAT" },
                    { id: "64.07.11.2002", name: "LEMBONAH" },
                    { id: "64.07.11.2003", name: "MUARA NAYAN" },
                    { id: "64.07.11.2004", name: "MANCONG" },
                    { id: "64.07.11.2005", name: "PERIGIQ" },
                    { id: "64.07.11.2006", name: "MUARA OHONG" },
                    { id: "64.07.11.2007", name: "TANJUNG JONE" },
                    { id: "64.07.11.2008", name: "TANJUNG ISUY" },
                    { id: "64.07.11.2009", name: "TANJUNG JAN" },
                    { id: "64.07.11.2010", name: "PULAU LANTING" },
                    { id: "64.07.11.2011", name: "MUARA TAE" },
                    { id: "64.07.11.2012", name: "BEKOKONG MAKMUR" }
                ]
            },
            {
                id: "64.07.12",
                name: "BONGAN",
                villages: [
                    { id: "64.07.12.2001", name: "GERUNGUNG" },
                    { id: "64.07.12.2002", name: "PERENG TALIQ" },
                    { id: "64.07.12.2003", name: "TANJUNG SOKE" },
                    { id: "64.07.12.2004", name: "DERAYA" },
                    { id: "64.07.12.2005", name: "LEMPER" },
                    { id: "64.07.12.2006", name: "MUARA SIRAM" },
                    { id: "64.07.12.2007", name: "RESAK" },
                    { id: "64.07.12.2008", name: "JAMBUK" },
                    { id: "64.07.12.2009", name: "MUARA GUSIK" },
                    { id: "64.07.12.2010", name: "PENAWAI" },
                    { id: "64.07.12.2011", name: "MUARA KEDANG" },
                    { id: "64.07.12.2012", name: "JAMBUK MAKMUR" },
                    { id: "64.07.12.2014", name: "SIRAM MAKMUR" },
                    { id: "64.07.12.2015", name: "SIRAM JAYA" },
                    { id: "64.07.12.2016", name: "BUKIT HARAPAN" },
                    { id: "64.07.12.2019", name: "TANJUNG SARI" },
                ]
            },
            {
                id: "64.07.13",
                name: "PENYINGGAHAN",
                villages: [
                    { "id": "64.07.13.2001", "name": "LOA DERAS" },
                    { "id": "64.07.13.2002", "name": "MINTA" },
                    { "id": "64.07.13.2003", "name": "TANJUNG HAUR" },
                    { "id": "64.07.13.2004", "name": "PENYINGGAHAN ILIR" },
                    { "id": "64.07.13.2005", "name": "PENYINGGAHAN ULU" },
                    { "id": "64.07.13.2006", "name": "BAKUNG" }
                ]
            },
            {
                id: "64.07.14",
                name: "BENTIAN BESAR",
                villages: [
                    { id: "64.07.14.2001", name: "RANDA EMPAS" },
                    { id: "64.07.14.2002", name: "TUKUQ" },
                    { id: "64.07.14.2003", name: "TENDE" },
                    { id: "64.07.14.2004", name: "SAMBUNG" },
                    { id: "64.07.14.2005", name: "ANAN JAYA" },
                    { id: "64.07.14.2006", name: "JELMU SIBAK" },
                    { id: "64.07.14.2007", name: "SUAKONG" },
                    { id: "64.07.14.2008", name: "PENARUNG" },
                    { id: "64.07.14.2009", name: "DILANG PUTI" }
                ]
            },
            {
                id: "64.07.15",
                name: "LINGGANG BIGUNG",
                villages: [
                    { id: "64.07.15.2001", name: "LINGGANG MELAPEH BARU" },
                    { id: "64.07.15.2002", name: "LINGGANG BIGUNG BARU" },
                    { id: "64.07.15.2003", name: "LINGGANG TUTUNG" },
                    { id: "64.07.15.2004", name: "LINGGANG MELAPEH" },
                    { id: "64.07.15.2005", name: "LINGGANG MAPAN" },
                    { id: "64.07.15.2006", name: "LINGGANG BIGUNG" },
                    { id: "64.07.15.2007", name: "LINGGANG AMER" },
                    { id: "64.07.15.2008", name: "LINGGANG BANGUNSARI" },
                    { id: "64.07.15.2009", name: "LINGGANG PURWODADI" },
                    { id: "64.07.15.2010", name: "LINGGANG MENCELEW" },
                    { id: "64.07.15.2011", name: "LINGGANG KEBUT" }
                ]
            },
            {
                id: "64.07.16",
                name: "NYUATAN",
                villages: [
                    { id: "64.07.16.2001", name: "DEMPAR" },
                    { id: "64.07.16.2002", name: "TEMULA" },
                    { id: "64.07.16.2003", name: "JONTAI" },
                    { id: "64.07.16.2004", name: "SEMBUAN" },
                    { id: "64.07.16.2005", name: "INTU LINGAU" },
                    { id: "64.07.16.2006", name: "MU'UT" },
                    { id: "64.07.16.2007", name: "TERAJUK" },
                    { id: "64.07.16.2008", name: "LAKAN BILEM" },
                    { id: "64.07.16.2009", name: "SENTALAR" },
                    { id: "64.07.16.2010", name: "AWAI" }
                ]
            },
            {
                id: "64.07.17",
                name: "SILUQ NGURAI",
                villages: [
                    { id: "64.07.17.2001", name: "TEBISAQ" },
                    { id: "64.07.17.2002", name: "KALIQ" },
                    { id: "64.07.17.2003", name: "TANAH MEA" },
                    { id: "64.07.17.2004", name: "SANG-SANG" },
                    { id: "64.07.17.2005", name: "MUHUR" },
                    { id: "64.07.17.2006", name: "MUARA KELAWIT" },
                    { id: "64.07.17.2007", name: "BENTAS" },
                    { id: "64.07.17.2008", name: "BETUNG" },
                    { id: "64.07.17.2009", name: "KIAQ" },
                    { id: "64.07.17.2010", name: "TENDIQ" },
                    { id: "64.07.17.2011", name: "PENAWANG" },
                    { id: "64.07.17.2012", name: "LENDIAN LIANG NAYUQ" },
                    { id: "64.07.17.2013", name: "KENYANYAN" },
                    { id: "64.07.17.2014", name: "RIKONG" },
                    { id: "64.07.17.2015", name: "KENDISIQ" },
                    { id: "64.07.17.2016", name: "MUARA PONAQ" }
                ]
            },
            {
                id: "64.07.18",
                name: "MOOK MANAAR BULATN",
                villages: [
                    { id: "64.07.18.2001", name: "SAKAQ LOTOQ" },
                    { id: "64.07.18.2002", name: "SAKAQ TADA" },
                    { id: "64.07.18.2003", name: "GEMURUH" },
                    { id: "64.07.18.2004", name: "KARANGAN" },
                    { id: "64.07.18.2005", name: "MERAYAQ" },
                    { id: "64.07.18.2006", name: "LINGGANG MARIMUN" },
                    { id: "64.07.18.2007", name: "KELUMPANG" },
                    { id: "64.07.18.2008", name: "GADUR" },
                    { id: "64.07.18.2009", name: "LINGGANG MUARA BATUQ" },
                    { id: "64.07.18.2010", name: "MUARA JAWAQ" },
                    { id: "64.07.18.2011", name: "ABIT" },
                    { id: "64.07.18.2012", name: "REMBAYAN" },
                    { id: "64.07.18.2014", name: "GUNUNG RAMPAH" },
                    { id: "64.07.18.2015", name: "JENGAN" },
                    { id: "64.07.18.2016", name: "MUARA KALAQ" },
                    { id: "64.07.18.2017", name: "TONDOH" }
                ]
            },
            {
                id: "64.07.19",
                name: "TERING",
                villages: [
                    { id: "64.07.19.2001", name: "TERING BARU" },
                    { id: "64.07.19.2002", name: "TERING LAMA" },
                    { id: "64.07.19.2003", name: "LINGGANG TERING SEBERANG" },
                    { id: "64.07.19.2004", name: "TUKUL" },
                    { id: "64.07.19.2005", name: "LINGGANG KELUBAQ" },
                    { id: "64.07.19.2006", name: "LINGGANG PURWOREJO" },
                    { id: "64.07.19.2007", name: "LINGGANG JELEMUQ" },
                    { id: "64.07.19.2008", name: "KELIAN DALAM" },
                    { id: "64.07.19.2009", name: "LINGGANG MUARA MUJAN" },
                    { id: "64.07.19.2010", name: "MUYUB ULU" },
                    { id: "64.07.19.2011", name: "MUYUB AKET" },
                    { id: "64.07.19.2013", name: "LINGGANG MUYUB ILIR" },
                    { id: "64.07.19.2014", name: "GABUNG BARU" },
                    { id: "64.07.19.2015", name: "LINGGANG BANJAREJO" },
                    { id: "64.07.19.2016", name: "TERING LAMA ULU" }
                ]
            },
            {
                id: "64.07.20",
                name: "SEKOLAQ DARAT",
                villages: [
                    { id: "64.07.20.2001", name: "SEKOLAQ JOLEQ" },
                    { id: "64.07.20.2002", name: "SEKOLAQ MULIAQ" },
                    { id: "64.07.20.2003", name: "SEKOLAQ ODAY" },
                    { id: "64.07.20.2004", name: "SRIMULYO" },
                    { id: "64.07.20.2005", name: "SEMBER BANGUN" },
                    { id: "64.07.20.2006", name: "SUMBER REJO" },
                    { id: "64.07.20.2007", name: "SEKOLAQ DARAT" },
                    { id: "64.07.20.2008", name: "LELENG" }
                ]
            },
        ]
    },
    // KABUPATEN KUTAI TIMUR
    {
        id: "64.08",
        name: "KABUPATEN KUTAI TIMUR",
        districts: [
            {
                id: "64.08.01",
                name: "MUARA ANCALONG",
                villages: [
                    { id: "64.08.01.2001", name: "SENYIUR" },
                    { id: "64.08.01.2002", name: "KELINJAU ILIR" },
                    { id: "64.08.01.2003", name: "KELINJAU ULU" },
                    { id: "64.08.01.2004", name: "LONG NAH" },
                    { id: "64.08.01.2006", name: "LONG TESAK" },
                    { id: "64.08.01.2009", name: "GEMAR BARU" },
                    { id: "64.08.01.2012", name: "LONG POQ BARU" },
                    { id: "64.08.01.2013", name: "MUARA DUN" },
                    { id: "64.08.01.2014", name: "TELUK BARU" }
                ]
            },
            {
                id: "64.08.02",
                name: "MUARA WAHAU",
                villages: [
                    { id: "64.08.02.2001", name: "JAK LUAY" },
                    { id: "64.08.02.2002", name: "NEHES LIAH BING" },
                    { id: "64.08.02.2003", name: "MUARA WAHAU" },
                    { id: "64.08.02.2004", name: "DABEQ" },
                    { id: "64.08.02.2005", name: "DIAQ LAY" },
                    { id: "64.08.02.2006", name: "BENHES" },
                    { id: "64.08.02.2007", name: "WANASARI" },
                    { id: "64.08.02.2008", name: "WAHAU BARU" },
                    { id: "64.08.02.2009", name: "KARYA BHAKTI" },
                    { id: "64.08.02.2010", name: "LONG WEHEA" }
                ]
            },
            {
                id: "64.08.03",
                name: "MUARA BENGKAL",
                villages: [
                    { id: "64.08.03.2001", name: "SENAMBAH" },
                    { id: "64.08.03.2002", name: "NGAYAU" },
                    { id: "64.08.03.2003", name: "MUARA BENGKAL ILIR" },
                    { id: "64.08.03.2004", name: "MUARA BENGKAL ULU" },
                    { id: "64.08.03.2005", name: "BENUA BARU" },
                    { id: "64.08.03.2013", name: "MULUPAN" },
                    { id: "64.08.03.2014", name: "BATU BALAI" }
                ]
            },
            {
                id: "64.08.04",
                name: "SANGATTA UTARA",
                villages: [
                    { id: "64.08.04.2001", name: "SANGATTA UTARA" },
                    { id: "64.08.04.1010", name: "TELUK LINGGA" },
                    { id: "64.08.04.2011", name: "SINGA GEMBARA" },
                    { id: "64.08.04.2012", name: "SWARGA BARA" }
                ]
            },
            {
                id: "64.08.05",
                name: "SANGKULIRANG",
                villages: [
                    { id: "64.08.05.2001", name: "KERAYAAN" },
                    { id: "64.08.05.2002", name: "TANJUNG MANIS" },
                    { id: "64.08.05.2003", name: "PERIDAN" },
                    { id: "64.08.05.2004", name: "SAKA" },
                    { id: "64.08.05.2005", name: "MANDU DALAM" },
                    { id: "64.08.05.2006", name: "BENUA BARU" },
                    { id: "64.08.05.2011", name: "SEMPAYAU" },
                    { id: "64.08.05.2012", name: "PELAWAN" },
                    { id: "64.08.05.2013", name: "TEPIAN TERAP" },
                    { id: "64.08.05.2015", name: "MALOY" },
                    { id: "64.08.05.2016", name: "BENUA BARU ULU" },
                    { id: "64.08.05.2017", name: "KOLEK" },
                    { id: "64.08.05.2018", name: "PULAU MIANG" },
                    { id: "64.08.05.2019", name: "PERUPUK" },
                    { id: "64.08.05.2020", name: "MANDU PANTAI SEJAHTERA" }
                ]
            },
            {
                id: "64.08.06",
                name: "BUSANG",
                villages: [
                    { id: "64.08.06.2001", name: "LONG BENTUQ" },
                    { id: "64.08.06.2002", name: "LONG PEJENG" },
                    { id: "64.08.06.2003", name: "LONG LEES" },
                    { id: "64.08.06.2004", name: "MEKAR BARU" },
                    { id: "64.08.06.2005", name: "RANTAU SENTOSA" },
                    { id: "64.08.06.2006", name: "LONG NYELONG" }
                ]
            },
            {
                id: "64.08.07",
                name: "TELEN",
                villages: [
                    { id: "64.08.07.2001", name: "MARAH HALOQ" },
                    { id: "64.08.07.2002", name: "LUNG MELAH" },
                    { id: "64.08.07.2003", name: "JUK AYAQ" },
                    { id: "64.08.07.2004", name: "LONG SEGAR" },
                    { id: "64.08.07.2005", name: "LONG NORAN" },
                    { id: "64.08.07.2006", name: "MUARA PANTUN" },
                    { id: "64.08.07.2007", name: "RANTAU PANJANG" },
                    { id: "64.08.07.2008", name: "KERNYANYAN" }
                ]
            },
            {
                id: "64.08.08",
                name: "KOMBENG",
                villages: [
                    { id: "64.08.08.2001", name: "MAKMUR JAYA" },
                    { id: "64.08.08.2002", name: "MARGA MULYA" },
                    { id: "64.08.08.2003", name: "SUKAMAJU" },
                    { id: "64.08.08.2004", name: "SIDOMULYO" },
                    { id: "64.08.08.2005", name: "SRI PANTUN" },
                    { id: "64.08.08.2006", name: "KOMBENG INDAH" },
                    { id: "64.08.08.2007", name: "MIAU BARU" }
                ]
            },
            {
                id: "64.08.09",
                name: "BENGALON",
                villages: [
                    { id: "64.08.09.2001", name: "SEPASO" },
                    { id: "64.08.09.2002", name: "SEKERAT" },
                    { id: "64.08.09.2003", name: "KERAITAN" },
                    { id: "64.08.09.2004", name: "TEPIAN LANGSAT" },
                    { id: "64.08.09.2005", name: "TEBANGAN LEMBAK" },
                    { id: "64.08.09.2006", name: "SEPASO TIMUR" },
                    { id: "64.08.09.2007", name: "SEPASO SELATAN" },
                    { id: "64.08.09.2008", name: "MUARA BENGALON" },
                    { id: "64.08.09.2009", name: "TEPIAN BARU" },
                    { id: "64.08.09.2010", name: "TEPIAN INDAH" },
                    { id: "64.08.09.2011", name: "SEPASO BARAT" }
                ]
            },
            {
                id: "64.08.10",
                name: "KALIORANG",
                villages: [
                    { id: "64.08.10.2001", name: "KALIORANG" },
                    { id: "64.08.10.2006", name: "BUKIT MAKMUR" },
                    { id: "64.08.10.2007", name: "BUKIT HARAPAN" },
                    { id: "64.08.10.2008", name: "CITRA MANUNGGAL JAYA" },
                    { id: "64.08.10.2009", name: "BANGUN JAYA" },
                    { id: "64.08.10.2010", name: "BUMI SEJAHTERA" },
                    { id: "64.08.10.2013", name: "SELANGKAU" }
                ]
            },
            {
                id: "64.08.11",
                name: "SANDARAN",
                villages: [
                    { id: "64.08.11.2001", name: "SANDARAN" },
                    { id: "64.08.11.2002", name: "MANUBAR" },
                    { id: "64.08.11.2003", name: "TADOAN" },
                    { id: "64.08.11.2004", name: "MARUKANGAN" },
                    { id: "64.08.11.2005", name: "SUSUK LUAR" },
                    { id: "64.08.11.2006", name: "SUSUK DALAM" },
                    { id: "64.08.11.2007", name: "TANJUNG MANGKALIAT" },
                    { id: "64.08.11.2008", name: "MANUBAR DALAM" },
                    { id: "64.08.11.2009", name: "SUSUK TENGAH" }
                ]
            },
            {
                id: "64.08.12",
                name: "SANGATTA SELATAN",
                villages: [
                    { id: "64.08.12.2001", name: "SANGATTA SELATAN" },
                    { id: "64.08.12.1002", name: "SINGA GEWEH" },
                    { id: "64.08.12.2003", name: "SANGKIMA" },
                    { id: "64.08.12.2004", name: "TELUK SINGKAMA" }
                ]
            },
            {
                id: "64.08.13",
                name: "TELUK PANDAN",
                villages: [
                    { id: "64.08.13.2001", name: "TELUK PANDAN" },
                    { id: "64.08.13.2002", name: "SUKA RAHMAT" },
                    { id: "64.08.13.2003", name: "SUKA DAMAI" },
                    { id: "64.08.13.2004", name: "KANDOLO" },
                    { id: "64.08.13.2005", name: "DANAU REDAN" },
                    { id: "64.08.13.2006", name: "MARTADINATA" }
                ]
            },
            {
                id: "64.08.14",
                name: "RANTAU PULUNG",
                villages: [
                    { id: "64.08.14.2001", name: "MUKTI JAYA" },
                    { id: "64.08.14.2002", name: "PULUNG SARI" },
                    { id: "64.08.14.2003", name: "MARGO MULYO" },
                    { id: "64.08.14.2004", name: "RANTAU MAKMUR" },
                    { id: "64.08.14.2005", name: "MANUNGGAL JAYA" },
                    { id: "64.08.14.2006", name: "TANJUNG LABU" },
                    { id: "64.08.14.2007", name: "KEBON AGUNG" },
                    { id: "64.08.14.2008", name: "TEPIAN MAKMUR" },
                    { id: "64.08.14.2009", name: "MASALAP RAYA" }
                ]
            },
            {
                id: "64.08.15",
                name: "KAUBUN",
                villages: [
                    { id: "64.08.15.2001", name: "BUMI ETAM" },
                    { id: "64.08.15.2002", name: "BUMI RAPAK" },
                    { id: "64.08.15.2003", name: "BUMI JAYA" },
                    { id: "64.08.15.2004", name: "CIPTA GRAHA" },
                    { id: "64.08.15.2005", name: "KADUNGAN JAYA" },
                    { id: "64.08.15.2006", name: "PENGADAN BARU" },
                    { id: "64.08.15.2007", name: "MATA AIR" },
                    { id: "64.08.15.2008", name: "BUKIT PERMATA" }
                ]
            },
            {
                id: "64.08.16",
                name: "KARANGAN",
                villages: [
                    { id: "64.08.16.2001", name: "KARANGAN DALAM" },
                    { id: "64.08.16.2002", name: "BATU LEPOQ" },
                    { id: "64.08.16.2003", name: "PENGADAN" },
                    { id: "64.08.16.2004", name: "BAAY" },
                    { id: "64.08.16.2005", name: "MUKTI LESTARI" },
                    { id: "64.08.16.2006", name: "KARANGAN SEBERANG" },
                    { id: "64.08.16.2007", name: "KARANGAN HILIR" }
                ]
            },
            {
                id: "64.08.17",
                name: "BATU AMPAR",
                villages: [
                    { id: "64.08.17.2001", name: "BATU TIMBAU" },
                    { id: "64.08.17.2002", name: "BENO HARAPAN" },
                    { id: "64.08.17.2003", name: "MUGI RAHAYU" },
                    { id: "64.08.17.2004", name: "MAWAI INDAH" },
                    { id: "64.08.17.2005", name: "HIMBA LESTARI" },
                    { id: "64.08.17.2006", name: "TELAGA" },
                    { id: "64.08.17.2007", name: "BATU TIMBAU ULU" }
                ]
            },
            {
                id: "64.08.18",
                name: "LONG MESANGAT",
                villages: [
                    { id: "64.08.18.2001", name: "SIKA MAKMUR" },
                    { id: "64.08.18.2002", name: "SEGOY MAKMUR" },
                    { id: "64.08.18.2003", name: "MUKTI UTAMA" },
                    { id: "64.08.18.2004", name: "SUMBER SARI" },
                    { id: "64.08.18.2005", name: "MELAN" },
                    { id: "64.08.18.2006", name: "TANAH ABANG" },
                    { id: "64.08.18.2007", name: "SUMBER AGUNG" }
                ]
            },
        ]
    },
    // KABUPATEN PENAJAM PASER UTARA
    {
        id: "64.09",
        name: "KABUPATEN PENAJAM PASER UTARA",
        districts: [
            {
                id: "64.09.01",
                name: "PENAJAM",
                villages: [
                    { id: "64.09.01.1001", name: "TANJUNG TENGAH" },
                    { id: "64.09.01.1002", name: "SALO LOANG" },
                    { id: "64.09.01.1003", name: "PETUNG" },
                    { id: "64.09.01.1004", name: "LAWE-LAWE" },
                    { id: "64.09.01.1005", name: "PEJALA" },
                    { id: "64.09.01.1006", name: "KAMPUNG BARU" },
                    { id: "64.09.01.1007", name: "SESUMPU" },
                    { id: "64.09.01.1008", name: "SUNGAI PARIT" },
                    { id: "64.09.01.1009", name: "NIPAH-NIPAH" },
                    { id: "64.09.01.1010", name: "NENANG" },
                    { id: "64.09.01.1011", name: "PENAJAM" },
                    { id: "64.09.01.1012", name: "GUNUNG SETELENG" },
                    { id: "64.09.01.1013", name: "BULUMINUNG" },
                    { id: "64.09.01.1014", name: "SOTEK" },
                    { id: "64.09.01.1015", name: "SEPAN" },
                    { id: "64.09.01.1016", name: "RIKO" },
                    { id: "64.09.01.1017", name: "GERSIK" },
                    { id: "64.09.01.1018", name: "JENEBORA" },
                    { id: "64.09.01.1019", name: "PANTAI LANGO" },
                    { id: "64.09.01.2020", name: "GIRI MUKTI" },
                    { id: "64.09.01.2021", name: "BUKIT SUBUR" },
                    { id: "64.09.01.2022", name: "SIDOREJO" },
                    { id: "64.09.01.2023", name: "GIRI PURWA" }
                ]
            },
            {
                id: "64.09.02",
                name: "WARU",
                villages: [
                    { id: "64.09.02.2001", name: "API-API" },
                    { id: "64.09.02.2002", name: "SESULU" },
                    { id: "64.09.02.1003", name: "WARU" },
                    { id: "64.09.02.2004", name: "BANGUN MULYA" }
                ]
            },
            {
                id: "64.09.03",
                name: "BABULU",
                villages: [
                    { id: "64.09.03.2001", name: "BABULU DARAT" },
                    { id: "64.09.03.2002", name: "LABANGKA" },
                    { id: "64.09.03.2003", name: "BABULU LAUT" },
                    { id: "64.09.03.2004", name: "GUNUNG INTAN" },
                    { id: "64.09.03.2005", name: "GUNUNG MAKMUR" },
                    { id: "64.09.03.2006", name: "SEBAKUNG JAYA" },
                    { id: "64.09.03.2007", name: "RAWA MULIA" },
                    { id: "64.09.03.2008", name: "SRI RAHARJA" },
                    { id: "64.09.03.2009", name: "SUMBER SARI" },
                    { id: "64.09.03.2010", name: "RINTIK" },
                    { id: "64.09.03.2011", name: "GUNUNG MULIA" },
                    { id: "64.09.03.2012", name: "LABANGKA BARAT" }
                ]
            },
            {
                id: "64.09.04",
                name: "SEPAKU",
                villages: [
                    { id: "64.09.04.2001", name: "TENGIN BARU" },
                    { id: "64.09.04.2002", name: "BUKIT RAYA" },
                    { id: "64.09.04.2003", name: "SUKA RAJA" },
                    { id: "64.09.04.2004", name: "BUMI HARAPAN" },
                    { id: "64.09.04.1005", name: "SEPAKU" },
                    { id: "64.09.04.1006", name: "PEMALUAN" },
                    { id: "64.09.04.1007", name: "MARIDAN" },
                    { id: "64.09.04.1008", name: "MENTAWIR" },
                    { id: "64.09.04.2009", name: "ARGO MULYO" },
                    { id: "64.09.04.2010", name: "SEMOI DUA" },
                    { id: "64.09.04.2011", name: "SUKO MULYO" },
                    { id: "64.09.04.2012", name: "WONO SARI" },
                    { id: "64.09.04.2013", name: "KARANG JINAWI" },
                    { id: "64.09.04.2014", name: "BINUANG" },
                    { id: "64.09.04.2015", name: "TELEMOW" }
                ]
            }
        ]
    },
    // KABUPATEN MAHAKAM ULU
    {
        id: "64.11",
        name: "KABUPATEN MAHAKAM ULU",
        districts: [
            {
                id: "64.11.01",
                name: "LONG BAGUN",
                villages: [
                    { id: "64.11.01.2001", name: "LONG HURAI" },
                    { id: "64.11.01.2002", name: "LONG MELAHAM" },
                    { id: "64.11.01.2003", name: "MEMAHAK BESAR" },
                    { id: "64.11.01.2004", name: "MEMAHAK ULU" },
                    { id: "64.11.01.2005", name: "BATU MAJANG" },
                    { id: "64.11.01.2006", name: "UJOH BILANG" },
                    { id: "64.11.01.2007", name: "LONG BAGUN ILIR" },
                    { id: "64.11.01.2008", name: "LONG BAGUN ULU" },
                    { id: "64.11.01.2009", name: "BATOQ KELO" },
                    { id: "64.11.01.2010", name: "LONG MERAH" },
                    { id: "64.11.01.2011", name: "RUKUN DAMAI" }
                ]
            },
            {
                id: "64.11.02",
                name: "LONG HUBUNG",
                villages: [
                    { id: "64.11.02.2001", name: "LONG HUBUNG" },
                    { id: "64.11.02.2002", name: "MEMAHAK TEBOQ" },
                    { id: "64.11.02.2003", name: "LUTAN" },
                    { id: "64.11.02.2004", name: "MATALIBAQ" },
                    { id: "64.11.02.2005", name: "DATAH BILANG ILIR" },
                    { id: "64.11.02.2006", name: "DATAH BILANG ULU" },
                    { id: "64.11.02.2007", name: "TRI PARIQ MAKMUR" },
                    { id: "64.11.02.2008", name: "WANA PARIQ" },
                    { id: "64.11.02.2009", name: "DATAH BILANG BARU" },
                    { id: "64.11.02.2010", name: "SIRAU" },
                    { id: "64.11.02.2011", name: "LONG HUBUNG ULU" }
                ]
            },
            {
                id: "64.11.03",
                name: "LAHAM",
                villages: [
                    { id: "64.11.03.2001", name: "LAHAM" },
                    { id: "64.11.03.2002", name: "LONG GELAWANG" },
                    { id: "64.11.03.2003", name: "MUARA RATAH" },
                    { id: "64.11.03.2004", name: "DANUM PAROY" },
                    { id: "64.11.03.2005", name: "NYARIBUNGAN" }
                ]
            },
            {
                id: "64.11.04",
                name: "LONG APARI",
                villages: [
                    { id: "64.11.04.2001", name: "LONG PENANEH I" },
                    { id: "64.11.04.2002", name: "LONG KERIOQ" },
                    { id: "64.11.04.2003", name: "LONG PENANEH II" },
                    { id: "64.11.04.2004", name: "TIONG OHANG" },
                    { id: "64.11.04.2005", name: "LONG PENANEH III" },
                    { id: "64.11.04.2006", name: "TIONG BU'U" },
                    { id: "64.11.04.2007", name: "NAHA BUAN" },
                    { id: "64.11.04.2008", name: "NAHA TIFAB" },
                    { id: "64.11.04.2009", name: "NAHA SILAT" },
                    { id: "64.11.04.2010", name: "LONG APARI" }
                ]
            },
            {
                id: "64.11.05",
                name: "LONG PAHANGAI",
                villages: [
                    { id: "64.11.05.2001", name: "DELANG KEROHONG" },
                    { id: "64.11.05.2002", name: "LONG PAKAQ" },
                    { id: "64.11.05.2003", name: "LONG LUNUK" },
                    { id: "64.11.05.2004", name: "LONG ISUN" },
                    { id: "64.11.05.2005", name: "NAHA ARU" },
                    { id: "64.11.05.2006", name: "DATAH NAHA" },
                    { id: "64.11.05.2007", name: "LIRUNG UBING" },
                    { id: "64.11.05.2008", name: "LONG PAHANGAI I" },
                    { id: "64.11.05.2009", name: "LONG PAHANGAI II" },
                    { id: "64.11.05.2010", name: "LONG TUYOQ" },
                    { id: "64.11.05.2011", name: "LIU MULANG" },
                    { id: "64.11.05.2012", name: "LONG PAKAQ BARU" },
                    { id: "64.11.05.2013", name: "LONG LUNUK BARU" }
                ]
            }
        ]
    },
    // KOTA BALIKPAPAN
    {
        id: "64.71",
        name: "KOTA BALIKPAPAN",
        districts: [
            {
                id: "64.71.01",
                name: "BALIKPAPAN TIMUR",
                villages: [
                    { id: "64.71.01.1001", name: "MANGGAR" },
                    { id: "64.71.01.1002", name: "LAMARU" },
                    { id: "64.71.01.1003", name: "TERITIP" },
                    { id: "64.71.01.1004", name: "MANGGAR BARU" }
                ]
            },
            {
                id: "64.71.02",
                name: "BALIKPAPAN BARAT",
                villages: [
                    { id: "64.71.02.1001", name: "BARU ILIR" },
                    { id: "64.71.02.1002", name: "BARU TENGAH" },
                    { id: "64.71.02.1003", name: "BARU ULU" },
                    { id: "64.71.02.1004", name: "KARIANGAU" },
                    { id: "64.71.02.1005", name: "MARGO MULYO" },
                    { id: "64.71.02.1006", name: "MARGA SARI" }
                ]
            },
            {
                id: "64.71.03",
                name: "BALIKPAPAN UTARA",
                villages: [
                    { id: "64.71.03.1001", name: "BATU AMPAR" },
                    { id: "64.71.03.1002", name: "GUNUNGSAMARINDA" },
                    { id: "64.71.03.1003", name: "KARANG JOANG" },
                    { id: "64.71.03.1004", name: "MUARARAPAK" },
                    { id: "64.71.03.1005", name: "GUNUNGSAMARINDA BARU" },
                    { id: "64.71.03.1006", name: "GRAHA INDAH" }
                ]
            },
            {
                id: "64.71.04",
                name: "BALIKPAPAN TENGAH",
                villages: [
                    { id: "64.71.04.1001", name: "GUNUNGSARI ULU" },
                    { id: "64.71.04.1002", name: "GUNUNGSARI ILIR" },
                    { id: "64.71.04.1003", name: "KARANG REJO" },
                    { id: "64.71.04.1004", name: "KARANG JATI" },
                    { id: "64.71.04.1005", name: "MEKAR SARI" },
                    { id: "64.71.04.1006", name: "SUMBER REJO" }
                ]
            },
            {
                id: "64.71.05",
                name: "BALIKPAPAN SELATAN",
                villages: [
                    { id: "64.71.05.1002", name: "SEPINGGAN" },
                    { id: "64.71.05.1006", name: "GUNUNGBAHAGIA" },
                    { id: "64.71.05.1008", name: "SEPINGGAN BARU" },
                    { id: "64.71.05.1009", name: "SEPINGGAN RAYA" },
                    { id: "64.71.05.1010", name: "SUNGAINANGKA" },
                    { id: "64.71.05.1011", name: "DAMAI BARU" },
                    { id: "64.71.05.1012", name: "DAMAI BAHAGIA" }
                ]
            },
            {
                id: "64.71.06",
                name: "BALIKPAPAN KOTA",
                villages: [
                    { id: "64.71.06.1001", name: "PRAPATAN" },
                    { id: "64.71.06.1002", name: "TELAGA SARI" },
                    { id: "64.71.06.1003", name: "KLANDASAN ULU" },
                    { id: "64.71.06.1004", name: "KLANDASAN ILIR" },
                    { id: "64.71.06.1005", name: "DAMAI" }
                ]
            }
        ]
    },
    // KOTA SAMARINDA
    {
        id: "64.72",
        name: "KOTA SAMARINDA",
        districts: [
            {
                id: "64.72.01",
                name: "PALARAN",
                villages: [
                    { id: "64.72.01.1001", name: "RAWA MAKMUR" },
                    { id: "64.72.01.1002", name: "HANDIL BAKTI" },
                    { id: "64.72.01.1003", name: "BUKUAN" },
                    { id: "64.72.01.1004", name: "SIMPANG PASIR" },
                    { id: "64.72.01.1005", name: "BANTUAS" }
                ]
            },
            {
                id: "64.72.02",
                name: "SAMARINDA SEBERANG",
                villages: [
                    { id: "64.72.02.1001", name: "SUNGAI KELEDANG" },
                    { id: "64.72.02.1002", name: "BAQA" },
                    { id: "64.72.02.1003", name: "MESJID" },
                    { id: "64.72.02.1009", name: "MANGKUPALAS" },
                    { id: "64.72.02.1010", name: "TENUN SAMARINDA" },
                    { id: "64.72.02.1011", name: "GUNUNG PANJANG" }
                ]
            },
            {
                id: "64.72.03",
                name: "SAMARINDA ULU",
                villages: [
                    { id: "64.72.03.1001", name: "TELUK LERONG ILIR" },
                    { id: "64.72.03.1002", name: "JAWA" },
                    { id: "64.72.03.1004", name: "AIR PUTIH" },
                    { id: "64.72.03.1005", name: "SIDODADI" },
                    { id: "64.72.03.1006", name: "AIR HITAM" },
                    { id: "64.72.03.1007", name: "DADI MULYA" },
                    { id: "64.72.03.1008", name: "GUNUNG KELUA" },
                    { id: "64.72.03.1009", name: "BUKIT PINANG" }
                ]
            },
            {
                id: "64.72.04",
                name: "SAMARINDA ILIR",
                villages: [
                    { id: "64.72.04.1001", name: "SELILI" },
                    { id: "64.72.04.1002", name: "SUNGAI DAMA" },
                    { id: "64.72.04.1003", name: "SIDOMULYO" },
                    { id: "64.72.04.1013", name: "SIDODAMAI" },
                    { id: "64.72.04.1014", name: "PELITA" }
                ]
            },
            {
                id: "64.72.05",
                name: "SAMARINDA UTARA",
                villages: [
                    { id: "64.72.05.1002", name: "SEMPAJA SELATAN" },
                    { id: "64.72.05.1003", name: "LEMPAKE" },
                    { id: "64.72.05.1004", name: "SUNGAI SIRING" },
                    { id: "64.72.05.1010", name: "SEMPAJA UTARA" },
                    { id: "64.72.05.1011", name: "TANAH MERAH" },
                    { id: "64.72.05.1012", name: "SEMPAJA BARAT" },
                    { id: "64.72.05.1013", name: "SEMPAJA TIMUR" },
                    { id: "64.72.05.1014", name: "BUDAYA PAMPANG" }
                ]
            },
            {
                id: "64.72.06",
                name: "SUNGAI KUNJANG",
                villages: [
                    { id: "64.72.06.1001", name: "LOA BAKUNG" },
                    { id: "64.72.06.1002", name: "LOA BUAH" },
                    { id: "64.72.06.1003", name: "KARANG ASAM ULU" },
                    { id: "64.72.06.1004", name: "LOK BAHU" },
                    { id: "64.72.06.1005", name: "TELUK LERONG ULU" },
                    { id: "64.72.06.1006", name: "KARANG ASAM ILIR" },
                    { id: "64.72.06.1007", name: "KARANG ANYAR" }
                ]
            },
            {
                id: "64.72.07",
                name: "SAMBUTAN",
                villages: [
                    { id: "64.72.07.1001", name: "SUNGAI KAPIH" },
                    { id: "64.72.07.1002", name: "SAMBUTAN" },
                    { id: "64.72.07.1003", name: "MAKROMAN" },
                    { id: "64.72.07.1004", name: "SINDANG SARI" },
                    { id: "64.72.07.1005", name: "PULAU ATAS" }
                ]
            },
            {
                id: "64.72.08",
                name: "SUNGAI PINANG",
                villages: [
                    { id: "64.72.08.1001", name: "TEMINDUNG PERMAI" },
                    { id: "64.72.08.1002", name: "SUNGAI PINANG DALAM" },
                    { id: "64.72.08.1003", name: "GUNUNG LINGAI" },
                    { id: "64.72.08.1004", name: "MUGIREJO" },
                    { id: "64.72.08.1005", name: "BANDARA" }
                ]
            },
            {
                id: "64.72.09",
                name: "SAMARINDA KOTA",
                villages: [
                    { id: "64.72.09.1001", name: "KARANG MUMUS" },
                    { id: "64.72.09.1002", name: "PELABUHAN" },
                    { id: "64.72.09.1003", name: "PASAR PAGI" },
                    { id: "64.72.09.1004", name: "BUGIS" },
                    { id: "64.72.09.1005", name: "SUNGAI PINANG LUAR" }
                ]
            },
            {
                id: "64.72.10",
                name: "LOA JANAN ILIR",
                villages: [
                    { id: "64.72.10.1001", name: "SIMPANG TIGA" },
                    { id: "64.72.10.1002", name: "TANI AMAN" },
                    { id: "64.72.10.1003", name: "SENGKOTEK" },
                    { id: "64.72.10.1004", name: "HARAPAN BARU" },
                    { id: "64.72.10.1005", name: "RAPAK DALAM" }
                ]
            }
        ]
    },
    // KOTA BONTANG
    {
        id: "64.74",
        name: "KOTA BONTANG",
        districts: [
            {
                id: "64.74.01",
                name: "BONTANG UTARA",
                villages: [
                    { id: "64.74.01.1001", name: "BONTANG KUALA" },
                    { id: "64.74.01.1002", name: "BONTANG BARU" },
                    { id: "64.74.01.1003", name: "LOK TUAN" },
                    { id: "64.74.01.1004", name: "GUNTUNG" },
                    { id: "64.74.01.1005", name: "GUNUNG ELAI" },
                    { id: "64.74.01.1006", name: "API-API" }
                ]
            },
            {
                id: "64.74.02",
                name: "BONTANG SELATAN",
                villages: [
                    { id: "64.74.02.1001", name: "TANJUNG LAUT" },
                    { id: "64.74.02.1002", name: "BERBAS TENGAH" },
                    { id: "64.74.02.1003", name: "BERBAS PANTAI" },
                    { id: "64.74.02.1004", name: "SATIMPO" },
                    { id: "64.74.02.1005", name: "BONTANG LESTARI" },
                    { id: "64.74.02.1006", name: "TANJUNG LAUT INDAH" }
                ]
            },
            {
                id: "64.74.03",
                name: "BONTANG BARAT",
                villages: [
                    { id: "64.74.03.1001", name: "BELIMBING" },
                    { id: "64.74.03.1002", name: "GUNUNG TELIHAN" },
                    { id: "64.74.03.1003", name: "KANAAN" }
                ]
            }
        ]
    }
];











