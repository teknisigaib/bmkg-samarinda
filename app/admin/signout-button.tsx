"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className="flex w-full items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg">
      <LogOut className="w-5 h-5" /> Logout
    </button>
  );
}