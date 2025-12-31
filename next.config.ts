import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/lru-cache-visualisation',
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
