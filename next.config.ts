import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'kelasku-backend.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'kelasku-backend-production.up.railway.app',
      },
    ],
  },
};

export default nextConfig;
