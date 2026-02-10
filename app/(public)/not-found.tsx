import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-orange-100 p-4 rounded-full mb-4">
        <AlertTriangle className="w-10 h-10 text-orange-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 max-w-md mb-6">
        Maaf, halaman yang Anda cari mungkin sudah dihapus, dipindahkan, atau alamat URL salah ketik.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}