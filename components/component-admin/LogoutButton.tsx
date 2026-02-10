"use client";

import { signout } from "@/app/(auth)/login/actions";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={signout} className="w-full">
      <button 
        type="submit"
        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-xl font-medium"
      >
        <LogOut className="w-5 h-5" />
        <span>Keluar Aplikasi</span>
      </button>
    </form>
  );
}