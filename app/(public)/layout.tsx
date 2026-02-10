import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
       {/* Navbar */}
       <Navbar />
       
       {/* Konten Utama */}
       <main className="flex-1 pt-16 mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
         {children}
       </main>

       {/* Footer */}
       <Footer />
    </div>
  );
}