"use client";
export const dynamic = 'force-dynamic';
import { useState, useTransition } from "react";
import { createUser } from "./actions";
import { Save, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TambahUserPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createUser(formData);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.message);
        (e.target as HTMLFormElement).reset(); // Reset form otomatis
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Tombol Kembali */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold text-slate-800">Tambah Akun Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Buat kredensial baru untuk staf pengelola website.</p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Notifikasi Sukses */}
        {success && (
          <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-start gap-3 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Misal: Budi Santoso"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Resmi</label>
            <input 
              type="email" 
              name="email" 
              placeholder="staf@bmkg.go.id"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Minimal 6 karakter"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Konfirmasi Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Ulangi password"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Simpan Pengguna Baru
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}