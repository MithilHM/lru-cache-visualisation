import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/lru-cache-visualisation',
  assetPrefix: '/lru-cache-visualisation',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
};

export default nextConfig;
