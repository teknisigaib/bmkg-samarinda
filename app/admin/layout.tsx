import Link from "next/link";
import { LayoutDashboard, Newspaper, FileText, LogOut } from "lucide-react";
import SignOutButton from "@/app/admin/signout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600">BMKG Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/berita" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <Newspaper className="w-5 h-5" /> Kelola Berita
          </Link>
          <Link href="/admin/publikasi" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <FileText className="w-5 h-5" /> Kelola Publikasi
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-100">
             <SignOutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 w-full">
        {children}
      </main>
    </div>
  );
}