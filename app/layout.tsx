import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BMKG APT Pranoto Samarinda",
  description: "Website Resmi Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto - Samarinda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* ✅ Full light theme */}
      <body
        className={`${poppins.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className=" mx-auto p-4 flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
