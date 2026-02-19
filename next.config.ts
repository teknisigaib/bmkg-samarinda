import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          }, 
        ],
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 75, 80, 90, 100],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
        protocol: "https",
        hostname: "web-aviation.bmkg.go.id"
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'wlovndiszsxmgicealsr.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
};

export default nextConfig;
