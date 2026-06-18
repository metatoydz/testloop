import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**': ['./content/**/*.json'],
    '/test/**': ['./content/**/*.json'],
  },
};

export default nextConfig;
