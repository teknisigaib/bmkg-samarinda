import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center">
        <div className="bg-orange-100 p-4 rounded-full mb-6 animate-bounce">
          <AlertTriangle className="w-12 h-12 text-orange-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
        
        <p className="text-gray-500 max-w-md mb-8">
          Maaf, halaman yang Anda tuju mungkin sudah dihapus, namanya diganti, atau sedang tidak tersedia sementara waktu.
        </p>

        <div className="flex gap-4">
            <Link 
              href="/" 
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Kembali ke Beranda
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}