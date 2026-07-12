import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-sharebari",
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
