import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
