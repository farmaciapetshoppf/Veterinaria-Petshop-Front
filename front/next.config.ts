import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
        domains: ['example.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
