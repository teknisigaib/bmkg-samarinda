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
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.06",
                name: "MELAK",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.07",
                name: "BARONG TONGKOK",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.08",
                name: "DAMAI",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.09",
                name: "MUARA LAWA",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.10",
                name: "MUARA PAHU",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.11",
                name: "JEMPANG",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.12",
                name: "BONGAN",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.13",
                name: "PENYINGGAHAN",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.14",
                name: "BENTIAN BESAR",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.15",
                name: "LINGGANG BIGUNG",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.16",
                name: "NYUATAN",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.17",
                name: "SILUQ NGURAI",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.18",
                name: "MOOK MANAAR BULATN",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.19",
                name: "TERING",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.07.20",
                name: "SEKOLAQ DARAT",
                villages: [
                    { id: "64.", name: "" },
                ]
            }
        ]
    },
    // KABUPATEN KUTAI TIMUR
    {
        id: "64.02",
        name: "KABUPATEN ",
        districts: [
            {
                id: "64.02.01",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
        ]
    },
    // KABUPATEN PENAJAM PASER UTARA
    {
        id: "64.02",
        name: "KABUPATEN ",
        districts: [
            {
                id: "64.02.01",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
        ]
    },
    // KABUPATEN MAHAKAM ULU
    {
        id: "64.02",
        name: "KABUPATEN ",
        districts: [
            {
                id: "64.02.01",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
        ]
    },
    // KOTA BALIKPAPAN
    {
        id: "64.02",
        name: "KABUPATEN ",
        districts: [
            {
                id: "64.02.01",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
        ]
    },
    // KOTA SAMARINDA
    {
        id: "64.02",
        name: "KABUPATEN ",
        districts: [
            {
                id: "64.02.01",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
        ]
    },
    // KOTA BONTANG
    {
        id: "64.02",
        name: "KABUPATEN ",
        districts: [
            {
                id: "64.02.01",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
            {
                id: "64.",
                name: "",
                villages: [
                    { id: "64.", name: "" },
                ]
            },
        ]
    },





  {
    id: "64.71",
    name: "KOTA BALIKPAPAN",
    districts: [
      {
        id: "64.71.01",
        name: "BALIKPAPAN TIMUR",
        villages: [
          { id: "64.71.01.1001", name: "MANGGAR" },
          { id: "64.71.01.1002", name: "MANGGAR BARU" },
          { id: "64.71.01.1003", name: "LAMARU" },
          { id: "64.71.01.1004", name: "TERITIP" }
        ]
      },
      {
        id: "64.71.02",
        name: "BALIKPAPAN BARAT",
        villages: [
          { id: "64.71.02.1001", name: "BARU ULU" },
          { id: "64.71.02.1002", name: "BARU TENGAH" },
          { id: "64.71.02.1003", name: "BARU ILIR" },
          { id: "64.71.02.1004", name: "KARIANGAU" },
          { id: "64.71.02.1005", name: "MARGASARI" },
          { id: "64.71.02.1006", name: "MARGA MULYO" }
        ]
      },
      // Tambahkan kecamatan lain di Balikpapan...
    ]
  },
  {
    id: "64.72",
    name: "KOTA SAMARINDA",
    districts: [
      {
        id: "64.72.01",
        name: "SAMARINDA ULU",
        villages: [
          { id: "64.72.01.1001", name: "AIR PUTIH" },
          { id: "64.72.01.1002", name: "AIR HITAM" },
          { id: "64.72.01.1003", name: "JAWA" },
          { id: "64.72.01.1004", name: "SIDODADI" }
        ]
      },
      // Tambahkan kecamatan lain di Samarinda...
    ]
  },
  {
    id: "64.02",
    name: "KAB. KUTAI KARTANEGARA",
    districts: [
      {
        id: "64.02.06",
        name: "TENGGARONG",
        villages: [
          { id: "64.02.06.1001", name: "MELAYU" },
          { id: "64.02.06.1002", name: "PANJI" },
          // ...
        ]
      }
    ]
  }
];


























// data/kaltim-manual.ts

export interface Wilayah {
  id: string; // Kode Administrasi (tanpa titik untuk ID internal, atau sesuai BMKG)
  name: string;
  parentId?: string; // Link ke induknya
  bmkgCode?: string; // Kode spesifik untuk hit ke API BMKG (ADM4)
}

// 1. PROVINSI (Hanya Kaltim)
export const PROVINSI: Wilayah[] = [
  { id: "64", name: "KALIMANTAN TIMUR" }
];

// 2. KABUPATEN / KOTA (Parent: 64)
export const KABUPATEN: Wilayah[] = [
    { id: "64.01", parentId: "64", name: "KAB. PASER" },
    { id: "64.02", parentId: "64", name: "KAB. KUTAI KARTANEGARA" },
    { id: "64.03", parentId: "64", name: "KAB. BERAU" },
    { id: "64.07", parentId: "64", name: "KAB. KUTAI BARAT" },
    { id: "64.08", parentId: "64", name: "KAB. KUTAI TIMUR" },
    { id: "64.09", parentId: "64", name: "KAB. PENAJAM PASER UTARA" },
    { id: "64.11", parentId: "64", name: "KAB. MAHAKAM ULU" },
    { id: "64.71", parentId: "64", name: "KOTA BALIKPAPAN" },
    { id: "64.72", parentId: "64", name: "KOTA SAMARINDA" },
    { id: "64.74", parentId: "64", name: "KOTA BONTANG" },
];

// 3. KECAMATAN 
export const KECAMATAN: Wilayah[] = [
    // --- KABUPATEN PASER (64.01) ---
    { id: "64.01.01", parentId: "64.01", name: "BATU SOPANG" },
    { id: "64.01.02", parentId: "64.01", name: "TANJUNG HARAPAN" },
    { id: "64.01.03", parentId: "64.01", name: "PASER BELENGKONG" },
    { id: "64.01.04", parentId: "64.01", name: "TANAH GROGOT" },
    { id: "64.01.05", parentId: "64.01", name: "KUARO" },
    { id: "64.01.06", parentId: "64.01", name: "LONG IKIS" },
    { id: "64.01.07", parentId: "64.01", name: "MUARA KOMAM" },
    { id: "64.01.08", parentId: "64.01", name: "LONG KALI" },
    { id: "64.01.09", parentId: "64.01", name: "BATU ENGAU" },
    { id: "64.01.10", parentId: "64.01", name: "MUARA SAMU" },

    // --- KABUPATEN KUTAI KARTANEGARA (64.02) ---
    { id: "64.02.01", parentId: "64.02", name: "MUARA MUNTAI" },
    { id: "64.02.02", parentId: "64.02", name: "LOA KULU" },
    { id: "64.02.03", parentId: "64.02", name: "LOA JANAN" },
    { id: "64.02.04", parentId: "64.02", name: "ANGGANA" },
    { id: "64.02.05", parentId: "64.02", name: "MUARA BADAK" },
    { id: "64.02.06", parentId: "64.02", name: "TENGGARONG" },
    { id: "64.02.07", parentId: "64.02", name: "SEBULU" },
    { id: "64.02.08", parentId: "64.02", name: "KOTA BANGUN" },
    { id: "64.02.09", parentId: "64.02", name: "KENOHAN" },
    { id: "64.02.10", parentId: "64.02", name: "KEMBANG JANGGUT" },
    { id: "64.02.11", parentId: "64.02", name: "MUARA KAMAN" },
    { id: "64.02.12", parentId: "64.02", name: "TABANG" },
    { id: "64.02.13", parentId: "64.02", name: "SAMBOJA" },
    { id: "64.02.14", parentId: "64.02", name: "MUARA JAWA" },
    { id: "64.02.15", parentId: "64.02", name: "SANGA SANGA" },
    { id: "64.02.16", parentId: "64.02", name: "TENGGARONG SEBERANG" },
    { id: "64.02.17", parentId: "64.02", name: "MARANG KAYU" },
    { id: "64.02.18", parentId: "64.02", name: "MUARA WIS" },

    // --- KABUPATEN BERAU (64.03) ---
    { id: "64.03.01", parentId: "64.03", name: "KELAY" },
    { id: "64.03.02", parentId: "64.03", name: "TALISAYAN" },
    { id: "64.03.03", parentId: "64.03", name: "SAMBALIUNG" },
    { id: "64.03.04", parentId: "64.03", name: "SEGAH" },
    { id: "64.03.05", parentId: "64.03", name: "TANJUNG REDEB" },
    { id: "64.03.06", parentId: "64.03", name: "GUNUNG TABUR" },
    { id: "64.03.07", parentId: "64.03", name: "PULAU DERAWAN" },
    { id: "64.03.08", parentId: "64.03", name: "BIDUK-BIDUK" },
    { id: "64.03.09", parentId: "64.03", name: "TELUK BAYUR" },
    { id: "64.03.10", parentId: "64.03", name: "TABALAR" },
    { id: "64.03.11", parentId: "64.03", name: "MARATUA" },
    { id: "64.03.12", parentId: "64.03", name: "BATU PUTIH" },
    { id: "64.03.13", parentId: "64.03", name: "BIATAN" },

    // --- KABUPATEN KUTAI BARAT (64.07) ---
    { id: "64.07.05", parentId: "64.07", name: "LONG IRAM" },
    { id: "64.07.06", parentId: "64.07", name: "MELAK" },
    { id: "64.07.07", parentId: "64.07", name: "BARONG TONGKOK" },
    { id: "64.07.08", parentId: "64.07", name: "DAMAI" },
    { id: "64.07.09", parentId: "64.07", name: "MUARA LAWA" },
    { id: "64.07.10", parentId: "64.07", name: "MUARA PAHU" },
    { id: "64.07.11", parentId: "64.07", name: "JEMPANG" },
    { id: "64.07.12", parentId: "64.07", name: "BONGAN" },
    { id: "64.07.13", parentId: "64.07", name: "PENYINGGAHAN" },
    { id: "64.07.14", parentId: "64.07", name: "BENTIAN BESAR" },
    { id: "64.07.15", parentId: "64.07", name: "LINGGANG BIGUNG" },
    { id: "64.07.16", parentId: "64.07", name: "NYUATAN" },
    { id: "64.07.17", parentId: "64.07", name: "SILUQ NGURAI" },
    { id: "64.07.18", parentId: "64.07", name: "MOOK MANAR BULATN" },
    { id: "64.07.19", parentId: "64.07", name: "TERING" },
    { id: "64.07.20", parentId: "64.07", name: "SEKOLAQ DARAT" },

    // --- KABUPATEN KUTAI TIMUR (64.08) ---
    { id: "64.08.01", parentId: "64.08", name: "MUARA ANCALONG" },
    { id: "64.08.02", parentId: "64.08", name: "MUARA WAHAU" },
    { id: "64.08.03", parentId: "64.08", name: "MUARA BENGKAL" },
    { id: "64.08.04", parentId: "64.08", name: "SANGATTA UTARA" },
    { id: "64.08.05", parentId: "64.08", name: "SANGKULIRANG" },
    { id: "64.08.06", parentId: "64.08", name: "BUSANG" },
    { id: "64.08.07", parentId: "64.08", name: "TELEN" },
    { id: "64.08.08", parentId: "64.08", name: "KOMBENG" },
    { id: "64.08.09", parentId: "64.08", name: "BENGALON" },
    { id: "64.08.10", parentId: "64.08", name: "KALIORANG" },
    { id: "64.08.11", parentId: "64.08", name: "SANDARAN" },
    { id: "64.08.12", parentId: "64.08", name: "SANGATTA SELATAN" },
    { id: "64.08.13", parentId: "64.08", name: "TELUK PANDAN" },
    { id: "64.08.14", parentId: "64.08", name: "RANTAU PULUNG" },
    { id: "64.08.15", parentId: "64.08", name: "KAUBUN" },
    { id: "64.08.16", parentId: "64.08", name: "KARANGAN" },
    { id: "64.08.17", parentId: "64.08", name: "BATU AMPAR" },
    { id: "64.08.18", parentId: "64.08", name: "LONG MESANGAT" },
    
    // --- KABUPATEN PENAJAM PASER UTARA (64.09) ---
    { id: "64.09.01", parentId: "64.09", name: "PENAJAM" },
    { id: "64.09.02", parentId: "64.09", name: "WARU" },
    { id: "64.09.03", parentId: "64.09", name: "BABULU" },
    { id: "64.09.04", parentId: "64.09", name: "SEPAKU" },

    // --- KABUPATEN MAHAKAM ULU (64.11) ---
    { id: "64.11.01", parentId: "64.11", name: "LONG BAGUN" },
    { id: "64.11.02", parentId: "64.11", name: "LONG HUBUNG" },
    { id: "64.11.03", parentId: "64.11", name: "LAHAM" },
    { id: "64.11.04", parentId: "64.11", name: "LONG APARI" },
    { id: "64.11.05", parentId: "64.11", name: "LONG PAHANGAI" },

    // --- KOTA BALIKPAPAN (64.71) ---
    { id: "64.71.01", parentId: "64.71", name: "BALIKPAPAN TIMUR" },
    { id: "64.71.02", parentId: "64.71", name: "BALIKPAPAN BARAT" },
    { id: "64.71.03", parentId: "64.71", name: "BALIKPAPAN UTARA" },
    { id: "64.71.04", parentId: "64.71", name: "BALIKPAPAN TENGAH" },
    { id: "64.71.05", parentId: "64.71", name: "BALIKPAPAN SELATAN" },
    { id: "64.71.06", parentId: "64.71", name: "BALIKPAPAN KOTA" },

    // --- KOTA SAMARINDA (64.72) ---
    { id: "64.72.01", parentId: "64.72", name: "PALARAN" },
    { id: "64.72.02", parentId: "64.72", name: "SAMARINDA SEBERANG" },
    { id: "64.72.03", parentId: "64.72", name: "SAMARINDA ULU" },
    { id: "64.72.04", parentId: "64.72", name: "SAMARINDA ILIR" },
    { id: "64.72.05", parentId: "64.72", name: "SAMARINDA UTARA" },
    { id: "64.72.06", parentId: "64.72", name: "SUNGAI KUNJANG" },
    { id: "64.72.07", parentId: "64.72", name: "SAMBUTAN" },
    { id: "64.72.08", parentId: "64.72", name: "SUNGAI PINANG" },
    { id: "64.72.09", parentId: "64.72", name: "SAMARINDA KOTA" },
    { id: "64.72.10", parentId: "64.72", name: "LOA JANAN ILIR" },

    // --- KOTA BONTANG (64.74) ---
    { id: "64.74.01", parentId: "64.74", name: "BONTANG UTARA" },
    { id: "64.74.02", parentId: "64.74", name: "BONTNAG SELATAN" },
    { id: "64.74.03", parentId: "64.74", name: "BONTANG BARAT" },
];

// 4. KELURAHAN (TARGET AKHIR)

export const KELURAHAN: Wilayah[] = [
  // --- KEC. SAMARINDA ULU (64.72.01) ---
  { id: "64.72.01.1001", parentId: "64.72.01", name: "AIR PUTIH", bmkgCode: "64.72.01.1001" },
  { id: "64.72.01.1002", parentId: "64.72.01", name: "AIR HITAM", bmkgCode: "64.72.01.1002" },
  { id: "64.72.01.1003", parentId: "64.72.01", name: "JAWA", bmkgCode: "64.72.01.1003" },
  { id: "64.72.01.1004", parentId: "64.72.01", name: "SIDODADI", bmkgCode: "64.72.01.1004" },

  // --- KEC. BALIKPAPAN TIMUR (64.71.01) ---
  { id: "64.71.01.1001", parentId: "64.71.01", name: "MANGGAR", bmkgCode: "64.71.01.1001" },
  { id: "64.71.01.1002", parentId: "64.71.01", name: "MANGGAR BARU", bmkgCode: "64.71.01.1002" },
];