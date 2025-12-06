import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
        domains: ['example.com', 'xyz.supabase.co' ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
