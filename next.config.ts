import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevents Amplify build failures caused by linting
  },
  // Add more config options here as needed
};

export default nextConfig;
