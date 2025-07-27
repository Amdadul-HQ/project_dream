import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable eslint during build for Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build for Docker
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
