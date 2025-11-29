"use client";

import { login } from "./actions"; // Import server action yang baru dibuat
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        action={(formData) => {
            setLoading(true);
            login(formData); // Panggil Server Action
        }} 
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Admin Login</h1>
        
        {/* Tampilkan Error jika ada */}
        {errorMessage && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm text-center">
                {errorMessage}
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" // name ini penting untuk formData
              type="email" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required 
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" // name ini penting untuk formData
              type="password" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required 
            />
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}