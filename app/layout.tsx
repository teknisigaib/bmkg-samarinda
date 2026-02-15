import "./globals.css";
import "leaflet/dist/leaflet.css"; 

import { Poppins } from "next/font/google";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// METADATA UTAMA 
export const metadata: Metadata = {
  metadataBase: new URL('http://stamet-samarinda.devbmkg.my.id'), 

  title: {
    template: '%s | BMKG APT Pranoto Samarinda',
    default: 'BMKG APT Pranoto Samarinda - Info Cuaca & Iklim Kaltim',
  },
  description: "Website Resmi Stasiun Meteorologi Kelas III Aji Pangeran Tumenggung Pranoto. Menyediakan informasi cuaca, iklim, dan penerbangan untuk wilayah Samarinda dan Kalimantan Timur.",
  
  applicationName: 'BMKG APT Pranoto',
  authors: [{ name: 'BMKG Stasiun Meteorologi APT Pranoto', url: 'https://bmkg.go.id' }],
  keywords: ['Cuaca Samarinda', 'BMKG', 'APT Pranoto', 'Prakiraan Cuaca', 'Iklim', 'Penerbangan', 'Kalimantan Timur'],
  
  openGraph: {
    title: 'BMKG APT Pranoto Samarinda',
    description: 'Pantau kondisi cuaca, suhu, visibilitas penerbangan, dan peringatan dini di wilayah Samarinda secara real-time.',
    url: '/', 
    siteName: 'BMKG APT Pranoto',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1000,
        height: 1000,
        alt: 'BMKG APT Pranoto Samarinda',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'BMKG APT Pranoto Samarinda',
    description: 'Informasi cuaca dan penerbangan resmi Stasiun Meteorologi APT Pranoto Samarinda.',
    images: ['/og-image.png'],
    creator: '@infoBMKG',
  },

  icons: {
    icon: '/logo-bmkg.png',
    shortcut: "/logo-bmkg.png",
    apple: '/logo-bmkg.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}