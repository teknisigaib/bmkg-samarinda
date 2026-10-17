// LoginForm.tsx
"use client";

import { useState } from "react";
import { login } from "./actions";
import { SubmitButton } from "./SubmitButton"; 

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bungkus action untuk nangkep balikan error dari Server Action
  async function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    const result = await login(formData);
    
    if (result?.error) {
      setErrorMessage(result.error);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
        <p className="text-sm text-gray-500 mt-1">Stasiun Meteorologi APT Pranoto</p>
      </div>
      
      {/* Tampilkan Error Alert jika ada */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mb-6 text-center animate-in fade-in slide-in-from-top-2">
           {errorMessage}
        </div>
      )}

      {/* Gunakan fungsi handleSubmit */}
      <form action={handleSubmit} className="space-y-5">
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Resmi</label>
           <input 
             name="email" 
             type="email" 
             placeholder="admin@bmkg.go.id"
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
             required 
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
           <input 
             name="password" 
             type="password" 
             placeholder="••••••••"
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
             required 
           />
        </div>

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Hanya personel berwenang yang diizinkan.
      </p>
    </div>
  );
}