import type { NextConfig } from "next";
import path from "path";

const nextConfig = {
  experimental: {
    turbopack: {
      root: path.resolve(__dirname),
    },
  },
} as any;

export default nextConfig;
