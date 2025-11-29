import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "data.bmkg.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "aviation.bmkg.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "inderaja.bmkg.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dataweb.bmkg.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "radar.bmkg.go.id",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'wlovndiszsxmgicealsr.supabase.co',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/bmkg/:path*",
        destination: "https://radar.bmkg.go.id/sidarma-nowcast/:path*",
      },
    ];
  },
};

export default nextConfig;
